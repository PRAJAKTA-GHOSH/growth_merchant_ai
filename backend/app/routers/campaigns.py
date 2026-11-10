import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.merchant import Merchant
from app.models.campaign import Campaign
from app.models.customer import Customer
from app.models.product import Product
from app.schemas.campaign import (
    CampaignGenerateRequest,
    CampaignGenerateResponse,
    CampaignCreate,
    CampaignResponse
)
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])

@router.post("/generate", response_model=CampaignGenerateResponse)
def generate_campaign_content(
    req: CampaignGenerateRequest,
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    # Count target audience size
    cust_query = db.query(Customer).filter(Customer.merchant_id == current_merchant.id)
    if req.target_segment != "All":
        cust_query = cust_query.filter(Customer.rfm_segment == req.target_segment)
    audience_count = cust_query.count()
    if audience_count == 0:
        audience_count = 15 # fallback sensible estimate

    # Product details if provided
    product_name = None
    if req.product_id:
        p = db.query(Product).filter(Product.id == req.product_id, Product.merchant_id == current_merchant.id).first()
        if p:
            product_name = p.name

    biz_name = current_merchant.business_name
    prod_mention = f" on {product_name}" if product_name else ""
    
    # Generate templates and metrics based on objective
    if "Win-back" in req.objective or req.target_segment == "At-Risk":
        camp_name = f"Win-Back Flash Treat ({req.discount_pct:.0f}% Off)"
        desc = f"Targeted reactivation offer designed to recapture lapsed patrons before permanent churn."
        whatsapp_msg = (
            f"Namaste {{name}}! 🙏 We've missed you at *{biz_name}*! "
            f"To welcome you back, here is an exclusive *{req.discount_pct:.0f}% discount*{prod_mention} on your next bill! "
            f"✨ Pay securely via Paytm Soundbox QR to earn 2X loyalty points. "
            f"Show this message at counter. Valid for the next 5 days only! 🏷️"
        )
        sms_msg = f"Missed you at {biz_name}! Enjoy {req.discount_pct:.0f}% off{prod_mention} this week. Pay with Paytm QR. T&C apply."
        roi_low, roi_high = 2.4, 4.2
        est_rev = f"₹{int(audience_count * 0.28 * 1400):,} - ₹{int(audience_count * 0.40 * 1800):,}"
        assumptions = [
            f"Historical win-back conversion rates typically range from 24% to 38% for SMS/WhatsApp pushes.",
            f"Assumes an average ticket size of ₹1,400 to ₹1,800 among previously active patrons.",
            "Estimates are projections based on historical customer spend patterns and do not guarantee actual receipts."
        ]
        metrics = ["Win-back conversion count", "Repeat order rate within 14 days", "Soundbox transaction lift"]

    elif "Upsell" in req.objective or req.target_segment == "High-Value":
        camp_name = f"VIP Connoisseur Special ({req.discount_pct:.0f}% Privilege)"
        desc = f"Exclusive appreciation incentive for top-tier high-spending patrons."
        whatsapp_msg = (
            f"Dear {{name}}, thank you for being one of *{biz_name}*'s most esteemed patrons! 🌟 "
            f"Unlock an exclusive *{req.discount_pct:.0f}% privilege bonus*{prod_mention} reserved only for our top-tier members this weekend. "
            f"Instant cashback credited when you tap or scan Paytm QR! 💳✨"
        )
        sms_msg = f"VIP Privilege for {{name}} at {biz_name}: Enjoy {req.discount_pct:.0f}% off this weekend with Paytm payments."
        roi_low, roi_high = 3.2, 5.8
        est_rev = f"₹{int(audience_count * 0.45 * 2200):,} - ₹{int(audience_count * 0.65 * 2900):,}"
        assumptions = [
            f"High-Value cohort exhibits ~50% response propensity when recognized personally.",
            f"Higher average basket sizes (₹2,200 - ₹2,900) typical for VIP patrons.",
            "Estimates assume promotional message delivered prior to Friday evening."
        ]
        metrics = ["Average order value expansion", "Net gross margin per basket", "High-value retention score"]

    else:
        camp_name = f"Seasonal Festival Reward ({req.discount_pct:.0f}% Off)"
        desc = f"Broad-appeal promotional push across {req.target_segment} cohort."
        whatsapp_msg = (
            f"Special Treat from *{biz_name}*! 🎉 "
            f"Enjoy *{req.discount_pct:.0f}% flat discount*{prod_mention} on your purchase today. "
            f"Speed through checkout with instant voice confirmation on Paytm Soundbox! 🔊🛍️"
        )
        sms_msg = f"Special deal at {biz_name}: Get {req.discount_pct:.0f}% off{prod_mention} today with instant Paytm payment."
        roi_low, roi_high = 1.8, 3.5
        est_rev = f"₹{int(audience_count * 0.20 * 1100):,} - ₹{int(audience_count * 0.35 * 1500):,}"
        assumptions = [
            "Assumes 20-35% engagement across open marketing messages.",
            "Average basket value of ₹1,100 to ₹1,500.",
            "Projections are heuristic model estimates, not guaranteed outcomes."
        ]
        metrics = ["Redemption rate", "Total gross promotional revenue", "Customer acquisition cost"]

    return {
        "campaign_name": camp_name,
        "description": desc,
        "whatsapp_message": whatsapp_msg,
        "sms_message": sms_msg,
        "target_audience_count": audience_count,
        "estimated_budget": req.budget,
        "projected_revenue_range": est_rev,
        "projected_roi_range": f"{roi_low}x - {roi_high}x",
        "assumptions": assumptions,
        "success_metrics": metrics
    }

@router.post("", response_model=CampaignResponse)
def save_campaign(
    campaign_in: CampaignCreate,
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    camp = Campaign(
        id=str(uuid.uuid4()),
        merchant_id=current_merchant.id,
        name=campaign_in.name,
        target_segment=campaign_in.target_segment,
        product_id=campaign_in.product_id,
        product_name=campaign_in.product_name,
        objective=campaign_in.objective,
        discount_pct=campaign_in.discount_pct,
        budget=campaign_in.budget,
        message_template=campaign_in.message_template,
        audience_size=campaign_in.audience_size,
        projected_roi_low=campaign_in.projected_roi_low,
        projected_roi_high=campaign_in.projected_roi_high,
        status=campaign_in.status,
        created_at=datetime.datetime.utcnow()
    )
    db.add(camp)
    db.commit()
    db.refresh(camp)
    return camp

@router.get("", response_model=List[CampaignResponse])
def list_saved_campaigns(
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    campaigns = db.query(Campaign).filter(
        Campaign.merchant_id == current_merchant.id
    ).order_by(Campaign.created_at.desc()).all()
    return campaigns
