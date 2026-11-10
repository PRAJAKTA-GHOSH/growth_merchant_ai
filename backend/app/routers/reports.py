import io
import csv
import datetime
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.merchant import Merchant
from app.models.transaction import Transaction
from app.services.analytics_engine import compute_dashboard_analytics
from app.services.customer_engine import compute_customer_intelligence
from app.services.inventory_engine import compute_inventory_health
from app.services.health_engine import compute_merchant_health_score
from app.services.recommendation_engine import generate_dynamic_recommendations
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/summary")
def get_executive_summary_report(
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    analytics = compute_dashboard_analytics(db, current_merchant.id, days=30)
    customers = compute_customer_intelligence(db, current_merchant.id)
    inventory = compute_inventory_health(db, current_merchant.id)
    health = compute_merchant_health_score(db, current_merchant.id)
    recommendations = generate_dynamic_recommendations(db, current_merchant.id)

    return {
        "generated_at": datetime.datetime.utcnow().isoformat(),
        "merchant": {
            "name": current_merchant.business_name,
            "category": current_merchant.category,
            "location": current_merchant.location,
            "operating_hours": current_merchant.operating_hours
        },
        "health_score": health,
        "kpis": analytics["kpis"],
        "top_products": analytics["top_selling_products"],
        "category_distribution": analytics["category_distribution"],
        "customer_segments": customers["segments"],
        "repeat_purchase_rate": customers["repeat_purchase_rate"],
        "inventory_critical_items": inventory["reorder_recommendations"],
        "strategic_recommendations": recommendations[:5]
    }

@router.get("/export/csv")
def export_transactions_csv(
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    """Generates a downloadable CSV containing actual merchant transaction history."""
    txs = db.query(Transaction).filter(
        Transaction.merchant_id == current_merchant.id
    ).order_by(Transaction.transaction_time.desc()).limit(1000).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Transaction ID", "Date Time", "Amount (INR)", "Payment Method", "Status", "Tax (INR)"
    ])

    for t in txs:
        writer.writerow([
            t.id,
            t.transaction_time.strftime("%Y-%m-%d %H:%M:%S"),
            f"{t.amount:.2f}",
            t.payment_method,
            t.status,
            f"{t.tax_amount:.2f}"
        ])

    csv_data = output.getvalue()
    filename = f"GrowZen_{current_merchant.business_name.replace(' ', '_')}_Transactions.csv"
    
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
