import uuid
from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=False, index=True)
    sku = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    cost_price = Column(Float, nullable=False, default=0.0)
    selling_price = Column(Float, nullable=False, default=0.0)
    current_stock = Column(Integer, nullable=False, default=0)
    min_stock_threshold = Column(Integer, nullable=False, default=10)
    reorder_quantity = Column(Integer, nullable=False, default=30)
    lead_time_days = Column(Integer, nullable=False, default=3)
    unit = Column(String, default="unit")

    merchant = relationship("Merchant", back_populates="products")
