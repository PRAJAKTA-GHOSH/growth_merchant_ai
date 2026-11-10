from pydantic import BaseModel, ConfigDict
from datetime import datetime

class RecommendationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    merchant_id: str
    problem: str
    evidence: str
    suggested_action: str
    priority: str
    impact_estimate: str
    assumptions: str
    metric: str
    status: str
    category: str
    created_at: datetime

class RecommendationUpdate(BaseModel):
    status: str
