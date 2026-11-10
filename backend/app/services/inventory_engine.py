import datetime
import json
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.transaction import Transaction

def compute_inventory_health(
    db: Session,
    merchant_id: str
) -> Dict[str, Any]:
    """
    Analyzes historical sales velocity against on-hand inventory levels,
    computes estimated stockout dates, lead times, safety stocks, and reorder urgency.
    """
    products = db.query(Product).filter(Product.merchant_id == merchant_id).all()
    if not products:
        return {
            "total_skus": 0,
            "total_inventory_value": 0.0,
            "low_stock_count": 0,
            "out_of_stock_count": 0,
            "overstock_count": 0,
            "fast_moving_products": [],
            "slow_moving_products": [],
            "reorder_recommendations": [],
            "inventory_turnover_rate": 0.0
        }

    now = datetime.datetime.utcnow()
    past_30d = now - datetime.timedelta(days=30)

    # 1. Calculate 30-day velocity from actual transactions
    txs = db.query(Transaction).filter(
        Transaction.merchant_id == merchant_id,
        Transaction.status == "SUCCESS",
        Transaction.transaction_time >= past_30d
    ).all()

    units_sold_30d: Dict[str, int] = {}
    for t in txs:
        try:
            items = json.loads(t.items_json) if t.items_json else []
        except Exception:
            items = []
        for itm in items:
            pid = itm.get("product_id")
            if pid:
                units_sold_30d[pid] = units_sold_30d.get(pid, 0) + itm.get("quantity", 1)

    total_inventory_val = 0.0
    low_stock_cnt = 0
    out_of_stock_cnt = 0
    overstock_cnt = 0
    processed_items = []

    for p in products:
        sold_qty = units_sold_30d.get(p.id, 0)
        daily_velocity = round(sold_qty / 30.0, 2)
        total_inventory_val += p.cost_price * p.current_stock

        # Days until stockout
        if daily_velocity > 0:
            days_until_out = int(p.current_stock / daily_velocity)
        else:
            days_until_out = 999 if p.current_stock > 0 else 0

        # Status determination
        if p.current_stock == 0:
            status = "OUT_OF_STOCK"
            out_of_stock_cnt += 1
            urgency = 10
            reason = f"Item is completely stocked out! Reorder {p.reorder_quantity} {p.unit} immediately to stop lost sales."
        elif days_until_out <= p.lead_time_days:
            status = "CRITICAL_LOW"
            low_stock_cnt += 1
            urgency = 9
            reason = f"At {daily_velocity} {p.unit}/day run rate, stock will exhaust in {days_until_out} days. Supplier lead time is {p.lead_time_days} days."
        elif p.current_stock <= p.min_stock_threshold:
            status = "CRITICAL_LOW"
            low_stock_cnt += 1
            urgency = 7
            reason = f"Stock level ({p.current_stock}) has breached minimum safety threshold ({p.min_stock_threshold}). Reorder soon."
        elif days_until_out > 90 and p.current_stock > 30:
            status = "OVERSTOCK"
            overstock_cnt += 1
            urgency = 2
            reason = f"Current inventory ({p.current_stock} {p.unit}) covers over {days_until_out} days of demand. Consider promotional bundling."
        else:
            status = "ADEQUATE"
            urgency = 3
            reason = f"Inventory level is healthy. Expected to last ~{days_until_out} days at current sales cadence."

        item_dict = {
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "category": p.category,
            "cost_price": round(p.cost_price, 2),
            "selling_price": round(p.selling_price, 2),
            "current_stock": p.current_stock,
            "min_stock_threshold": p.min_stock_threshold,
            "reorder_quantity": p.reorder_quantity,
            "lead_time_days": p.lead_time_days,
            "unit": p.unit,
            "daily_run_rate": daily_velocity,
            "days_until_stockout": days_until_out if days_until_out < 900 else None,
            "status": status,
            "urgency_score": urgency,
            "reorder_reason": reason
        }
        processed_items.append(item_dict)

    # Sort fast moving vs slow moving
    fast_moving = sorted(processed_items, key=lambda x: x["daily_run_rate"], reverse=True)[:5]
    slow_moving = sorted(processed_items, key=lambda x: x["daily_run_rate"])[:5]
    
    # Reorder recommendations: urgency >= 7
    reorders = [item for item in processed_items if item["urgency_score"] >= 7]
    reorders = sorted(reorders, key=lambda x: x["urgency_score"], reverse=True)

    # Inventory turnover rate = (Cost of goods sold / Average inventory)
    cogs_30d = sum(p.cost_price * units_sold_30d.get(p.id, 0) for p in products)
    turnover = round((cogs_30d / max(1.0, total_inventory_val)) * 12, 1) # annualized turnover

    return {
        "total_skus": len(products),
        "total_inventory_value": round(total_inventory_val, 2),
        "low_stock_count": low_stock_cnt,
        "out_of_stock_count": out_of_stock_cnt,
        "overstock_count": overstock_cnt,
        "fast_moving_products": fast_moving,
        "slow_moving_products": slow_moving,
        "reorder_recommendations": reorders,
        "inventory_turnover_rate": turnover
    }
