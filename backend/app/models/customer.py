import datetime
import uuid
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False, index=True)
    email = Column(String, nullable=True)
    first_visit = Column(DateTime, default=datetime.datetime.utcnow)
    last_visit = Column(DateTime, default=datetime.datetime.utcnow)
    total_orders = Column(Integer, default=1)
    total_spend = Column(Float, default=0.0)
    
    # RFM Segment: "High-Value", "Loyal", "New", "At-Risk", "Inactive"
    rfm_segment = Column(String, default="New")
    # Churn Risk: 0.0 - 1.0 and Level: "Low", "Medium", "High"
    churn_risk_score = Column(Float, default=0.1)
    churn_risk_level = Column(String, default="Low")
    
    merchant = relationship("Merchant", back_populates="customers")
    transactions = relationship("Transaction", back_populates="customer")
