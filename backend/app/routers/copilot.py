from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.merchant import Merchant
from app.schemas.copilot import CopilotQueryRequest, CopilotResponse
from app.services.ai_service import answer_merchant_copilot_query
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/copilot", tags=["Copilot"])

@router.post("/query", response_model=CopilotResponse)
def ask_copilot(
    req: CopilotQueryRequest,
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    response = answer_merchant_copilot_query(
        db=db,
        merchant_id=current_merchant.id,
        query=req.query,
        language_mode=req.language_mode or "auto"
    )
    return response
