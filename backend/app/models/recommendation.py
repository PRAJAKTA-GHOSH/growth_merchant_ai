import datetime
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=False, index=True)
    problem = Column(String, nullable=False)
    evidence = Column(Text, nullable=False)
    suggested_action = Column(Text, nullable=False)
    # "HIGH", "MEDIUM", "LOW"
    priority = Column(String, default="MEDIUM")
    impact_estimate = Column(String, nullable=False)
    assumptions = Column(Text, nullable=False)
    metric = Column(String, nullable=False)
    # "NEW", "APPLIED", "DISMISSED"
    status = Column(String, default="NEW")
    category = Column(String, default="Revenue") # "Revenue", "Inventory", "Retention", "Operations"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    merchant = relationship("Merchant", back_populates="recommendations")
