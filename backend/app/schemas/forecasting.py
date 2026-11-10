from pydantic import BaseModel
from typing import List, Optional

class ForecastPoint(BaseModel):
    date: str
    historical_sales: Optional[float] = None
    predicted_sales: Optional[float] = None
    confidence_lower: Optional[float] = None
    confidence_upper: Optional[float] = None
    is_forecast: bool = False

class PeakHourStat(BaseModel):
    hour: int
    hour_label: str
    avg_sales: float
    order_intensity: str # "Very High", "High", "Moderate", "Normal"

class PeakDayStat(BaseModel):
    day_name: str
    avg_revenue: float
    relative_index: float

class ForecastResponse(BaseModel):
    timeframe: str # "7d" or "30d"
    predicted_total_revenue: float
    growth_pct: float
    trend_direction: str # "Accelerating Growth", "Stable", "Declining"
    confidence_score: float # e.g. 88.5%
    forecast_points: List[ForecastPoint]
    peak_hours: List[PeakHourStat]
    peak_days: List[PeakDayStat]
    explanation: str
    model_type: str # "Seasonal Holt-Winters / Ridge Auto-Lag"
    sufficient_data: bool
    data_points_analyzed: int
