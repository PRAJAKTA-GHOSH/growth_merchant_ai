from pydantic import BaseModel
from typing import List

class AnomalyItem(BaseModel):
    id: str
    anomaly_type: str # "REVENUE_DROP", "TRANSACTION_SPIKE", "PAYMENT_FAILURE_SURGE", "ABNORMAL_TICKET_SIZE", "REFUND_ANOMALY"
    severity: str # "CRITICAL", "WARNING", "INFO"
    date_or_time: str
    metric_name: str
    observed_value: str
    expected_value: str
    deviation_pct: float
    explanation: str
    recommended_action: str

class AnomalyReportResponse(BaseModel):
    total_anomalies_detected: int
    critical_count: int
    warning_count: int
    detection_method: str # "Scikit-Learn Isolation Forest & Rolling Z-Score"
    anomalies: List[AnomalyItem]
