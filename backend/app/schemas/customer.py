from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class CustomerItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    phone: str
    email: Optional[str]
    first_visit: datetime
    last_visit: datetime
    total_orders: int
    total_spend: float
    rfm_segment: str
    churn_risk_score: float
    churn_risk_level: str
    recommended_action: str

class SegmentStat(BaseModel):
    segment: str
    count: int
    percentage: float
    avg_spend: float
    avg_orders: float
    retention_strategy: str

class CustomerIntelligenceResponse(BaseModel):
    total_customers: int
    repeat_purchase_rate: float
    repeat_rate_change: float
    avg_customer_lifetime_value: float
    at_risk_count: int
    high_value_count: int
    segments: List[SegmentStat]
    customers: List[CustomerItem]
    churn_model_type: str
    insights: List[str]
