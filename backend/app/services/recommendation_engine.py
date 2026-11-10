import datetime
import uuid
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.recommendation import Recommendation
from app.services.analytics_engine import compute_dashboard_analytics
from app.services.customer_engine import compute_customer_intelligence
from app.services.inventory_engine import compute_inventory_health

def generate_dynamic_recommendations(
    db: Session,
    merchant_id: str
) -> List[Dict[str, Any]]:
    """
    Evaluates cross-domain business health and produces prioritized,
    explainable Next Best Actions with quantified economic impact.
    """
    # Fetch existing recommendations
    existing = db.query(Recommendation).filter(
        Recommendation.merchant_id == merchant_id,
        Recommendation.status != "DISMISSED"
    ).order_by(Recommendation.created_at.desc()).all()

    if existing:
        return [
            {
                "id": r.id,
                "merchant_id": r.merchant_id,
                "problem": r.problem,
                "evidence": r.evidence,
                "suggested_action": r.suggested_action,
                "priority": r.priority,
                "impact_estimate": r.impact_estimate,
                "assumptions": r.assumptions,
                "metric": r.metric,
                "status": r.status,
                "category": r.category,
                "created_at": r.created_at
            }
            for r in existing
        ]

    # If none present, dynamically compute from analytics & inventory
    analytics = compute_dashboard_analytics(db, merchant_id, days=30)
    inventory = compute_inventory_health(db, merchant_id)
    cust_intel = compute_customer_intelligence(db, merchant_id)

    generated = []
    now = datetime.datetime.utcnow()

    # Rule 1: Inventory Stockout Alert
    if inventory["reorder_recommendations"]:
        urgent = inventory["reorder_recommendations"][0]
        rec = Recommendation(
            id=str(uuid.uuid4()),
            merchant_id=merchant_id,
            problem=f"Imminent Stockout for Fast-Moving '{urgent['name']}'",
            evidence=f"Inventory is {urgent['current_stock']} units with a daily run rate of {urgent['daily_run_rate']} units. Stock will exhaust in {urgent['days_until_stockout']} days, but lead time is {urgent['lead_time_days']} days.",
            suggested_action=f"Place a replenishment purchase order for {urgent['reorder_quantity']} {urgent['unit']} today with primary distributor.",
            priority="HIGH",
            impact_estimate=f"Protects ~₹{int(urgent['selling_price'] * urgent['daily_run_rate'] * 7):,} in revenue over the next week",
            assumptions=f"Demand velocity holds at {urgent['daily_run_rate']} units/day.",
            metric="Stockout Days (target 0)",
            status="NEW",
            category="Inventory",
            created_at=now
        )
        db.add(rec)
        generated.append(rec)

    # Rule 2: At-Risk Customer Churn
    if cust_intel["at_risk_count"] > 5:
        rec = Recommendation(
            id=str(uuid.uuid4()),
            merchant_id=merchant_id,
            problem=f"{cust_intel['at_risk_count']} Formerly Active Customers At Risk of Churn",
            evidence=f"Repeat purchase rate dropped to {cust_intel['repeat_purchase_rate']}%. Average lapsed interval is 42 days.",
            suggested_action="Deploy an automated WhatsApp re-engagement promo offering 12% discount on orders above ₹600 for the At-Risk cohort.",
            priority="HIGH",
            impact_estimate=f"+₹{int(cust_intel['at_risk_count'] * 0.28 * 1200):,} incremental recovery revenue in 14 days",
            assumptions="Assumes 28% win-back conversion rate with average ticket of ₹1,200.",
            metric="Customer Retention Rate & Repeat Orders",
            status="NEW",
            category="Retention",
            created_at=now
        )
        db.add(rec)
        generated.append(rec)

    # Rule 3: Payment Success / Soundbox Glitch
    success_rate = analytics["kpis"]["payment_success_rate"]["value"]
    if success_rate < 95.0:
        rec = Recommendation(
            id=str(uuid.uuid4()),
            merchant_id=merchant_id,
            problem="Paytm Soundbox & Gateway Success Rate Below 95% Benchmark",
            evidence=f"Payment success rate is {success_rate}%, resulting in dropped checkout transactions during peak hours.",
            suggested_action="Verify Soundbox SIM 4G signal and dual-band Wi-Fi connection. Keep secondary static QR standee readily visible at checkout.",
            priority="MEDIUM",
            impact_estimate="Recovers ~₹8,400 in abandoned checkout transactions per month",
            assumptions="Assumes 50% of failed payment customers abandon cart instead of retrying.",
            metric="Payment Success Rate (target > 98%)",
            status="NEW",
            category="Operations",
            created_at=now
        )
        db.add(rec)
        generated.append(rec)

    db.commit()

    return [
        {
            "id": r.id,
            "merchant_id": r.merchant_id,
            "problem": r.problem,
            "evidence": r.evidence,
            "suggested_action": r.suggested_action,
            "priority": r.priority,
            "impact_estimate": r.impact_estimate,
            "assumptions": r.assumptions,
            "metric": r.metric,
            "status": r.status,
            "category": r.category,
            "created_at": r.created_at
        }
        for r in generated
    ]
