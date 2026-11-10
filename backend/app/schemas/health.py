from pydantic import BaseModel
from typing import List, Optional

class HealthPillar(BaseModel):
    name: str # "Revenue Performance", "Customer Retention", "Payment Health", "Inventory Health", "Profitability"
    score: float # 0 - 100
    weight: float # e.g. 0.25
    status: str # "EXCELLENT", "GOOD", "NEEDS_ATTENTION", "CRITICAL", "UNAVAILABLE"
    key_metric: str
    impact: str

class MerchantHealthScoreResponse(BaseModel):
    overall_score: int # 0 to 100
    grade: str # "A+", "A", "B", "C", "D"
    headline: str
    pillars: List[HealthPillar]
    positive_factors: List[str]
    negative_drags: List[str]
    top_actions_to_improve: List[str]
    benchmark_comparison: str # e.g. "Top 18% among Bangalore Retail Merchants"
