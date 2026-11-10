from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class CopilotQueryRequest(BaseModel):
    query: str
    language_mode: Optional[str] = "auto" # "en", "hinglish", "auto"

class CopilotEvidenceItem(BaseModel):
    metric: str
    value: str
    source_table: str
    timeframe: str

class CopilotResponse(BaseModel):
    answer: str
    language: str # "en" or "hinglish"
    evidence: List[CopilotEvidenceItem]
    suggested_followups: List[str]
    intent_detected: str
    llm_powered: bool
