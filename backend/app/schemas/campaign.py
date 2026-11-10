from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class CampaignGenerateRequest(BaseModel):
    target_segment: str
    product_id: Optional[str] = None
    objective: str
    budget: float = 1500.0
    discount_pct: float = 15.0

class CampaignGenerateResponse(BaseModel):
    campaign_name: str
    description: str
    whatsapp_message: str
    sms_message: str
    target_audience_count: int
    estimated_budget: float
    projected_revenue_range: str
    projected_roi_range: str
    assumptions: List[str]
    success_metrics: List[str]

class CampaignCreate(BaseModel):
    name: str
    target_segment: str
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    objective: str
    discount_pct: float
    budget: float
    message_template: str
    audience_size: int
    projected_roi_low: float
    projected_roi_high: float
    status: str = "ACTIVE"

class CampaignResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    merchant_id: str
    name: str
    target_segment: str
    product_id: Optional[str]
    product_name: Optional[str]
    objective: str
    discount_pct: float
    budget: float
    message_template: str
    audience_size: int
    projected_roi_low: float
    projected_roi_high: float
    status: str
    created_at: datetime
