from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.merchant import Merchant
from app.schemas.merchant import MerchantResponse, MerchantBase
from app.services.data_generator import generate_merchant_data, CATEGORIES_CONFIG
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/merchants", tags=["Merchants"])

@router.get("/profile", response_model=MerchantResponse)
def get_profile(current_merchant: Merchant = Depends(get_current_merchant)):
    return current_merchant

@router.put("/profile", response_model=MerchantResponse)
def update_profile(
    profile_in: MerchantBase,
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    current_merchant.business_name = profile_in.business_name
    current_merchant.category = profile_in.category
    current_merchant.location = profile_in.location
    current_merchant.size = profile_in.size
    current_merchant.monthly_revenue_range = profile_in.monthly_revenue_range
    current_merchant.employee_count = profile_in.employee_count
    current_merchant.operating_hours = profile_in.operating_hours
    db.commit()
    db.refresh(current_merchant)
    return current_merchant

@router.post("/generate-demo")
def regenerate_demo_data(
    category_type: str = Query("retail", description="retail, grocery, or restaurant"),
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    """Regenerates a fresh 180-day deterministic dataset for this merchant."""
    generate_merchant_data(
        db=db,
        category_key=category_type,
        seed=42,
        custom_merchant_id=current_merchant.id
    )
    return {"message": f"Successfully regenerated 180-day dataset for {category_type} category."}
