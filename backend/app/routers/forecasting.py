from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.merchant import Merchant
from app.schemas.forecasting import ForecastResponse
from app.services.forecasting_engine import generate_sales_forecast
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/forecasting", tags=["Forecasting"])

@router.get("", response_model=ForecastResponse)
def get_sales_forecast(
    horizon: int = Query(7, description="Forecast window (7 or 30 days)"),
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    if horizon not in [7, 30]:
        horizon = 7
    forecast_data = generate_sales_forecast(db, current_merchant.id, horizon_days=horizon)
    return forecast_data
