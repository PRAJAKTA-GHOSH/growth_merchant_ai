from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
import datetime
from app.database import get_db
from app.models.merchant import Merchant
from app.schemas.dashboard import DashboardResponse
from app.services.analytics_engine import compute_dashboard_analytics
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/overview", response_model=DashboardResponse)
def get_dashboard_overview(
    days: int = Query(30, description="Lookback window in days (7, 30, 90, 180)"),
    start_date: Optional[str] = Query(None, description="Custom start date YYYY-MM-DD"),
    end_date: Optional[str] = Query(None, description="Custom end date YYYY-MM-DD"),
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    s_date = None
    e_date = None
    if start_date:
        try:
            s_date = datetime.datetime.strptime(start_date, "%Y-%m-%d").date()
        except ValueError:
            pass
    if end_date:
        try:
            e_date = datetime.datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            pass

    analytics_data = compute_dashboard_analytics(
        db=db,
        merchant_id=current_merchant.id,
        days=days,
        start_date=s_date,
        end_date=e_date
    )
    return analytics_data
