from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.merchant import Merchant
from app.models.recommendation import Recommendation
from app.schemas.recommendation import RecommendationResponse, RecommendationUpdate
from app.services.recommendation_engine import generate_dynamic_recommendations
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("", response_model=List[RecommendationResponse])
def get_recommendations(
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    recs = generate_dynamic_recommendations(db, current_merchant.id)
    return recs

@router.patch("/{rec_id}", response_model=RecommendationResponse)
def update_recommendation_status(
    rec_id: str,
    update_in: RecommendationUpdate,
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    rec = db.query(Recommendation).filter(
        Recommendation.id == rec_id,
        Recommendation.merchant_id == current_merchant.id
    ).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    rec.status = update_in.status
    db.commit()
    db.refresh(rec)
    return rec
