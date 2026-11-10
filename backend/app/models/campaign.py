import datetime
import uuid
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    target_segment = Column(String, nullable=False) # "High-Value", "Loyal", "New", "At-Risk", "Inactive", "All"
    product_id = Column(String, nullable=True)
    product_name = Column(String, nullable=True)
    objective = Column(String, nullable=False) # "Win-back Inactive", "Upsell High-Value", "Clearance", "Festival Flash Sale"
    discount_pct = Column(Float, default=10.0)
    budget = Column(Float, default=1000.0)
    message_template = Column(Text, nullable=False)
    audience_size = Column(Integer, default=0)
    projected_roi_low = Column(Float, default=1.5)
    projected_roi_high = Column(Float, default=3.2)
    # "DRAFT", "ACTIVE", "COMPLETED"
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    merchant = relationship("Merchant", back_populates="campaigns")
