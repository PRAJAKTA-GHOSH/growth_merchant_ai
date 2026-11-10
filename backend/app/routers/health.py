from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.merchant import Merchant
from app.schemas.health import MerchantHealthScoreResponse
from app.services.health_engine import compute_merchant_health_score
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/health", tags=["Merchant Health"])

@router.get("/score", response_model=MerchantHealthScoreResponse)
def get_health_score(
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    score_report = compute_merchant_health_score(db, current_merchant.id)
    return score_report
