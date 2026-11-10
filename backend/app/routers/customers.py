from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.merchant import Merchant
from app.schemas.customer import CustomerIntelligenceResponse
from app.services.customer_engine import compute_customer_intelligence
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/intelligence", response_model=CustomerIntelligenceResponse)
def get_customer_intelligence(
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    intel = compute_customer_intelligence(db, current_merchant.id)
    return intel
