from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.merchant import Merchant
from app.schemas.anomaly import AnomalyReportResponse
from app.services.anomaly_engine import detect_business_anomalies
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/anomalies", tags=["Anomalies"])

@router.get("/detect", response_model=AnomalyReportResponse)
def get_anomalies(
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    report = detect_business_anomalies(db, current_merchant.id)
    return report
