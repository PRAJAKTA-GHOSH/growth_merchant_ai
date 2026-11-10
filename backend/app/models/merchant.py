import datetime
import uuid
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Merchant(Base):
    __tablename__ = "merchants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    business_name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, default="Retail store")
    # Categories: Retail store, Grocery store, Restaurant, Pharmacy, Clothing store, Electronics store, Salon, Other
    location = Column(String, default="Bengaluru, Karnataka")
    size = Column(String, default="Small")
    monthly_revenue_range = Column(String, default="₹1L - ₹5L")
    employee_count = Column(Integer, default=3)
    operating_hours = Column(String, default="09:00 - 21:00")
    
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    transactions = relationship("Transaction", back_populates="merchant", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="merchant", cascade="all, delete-orphan")
    customers = relationship("Customer", back_populates="merchant", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="merchant", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="merchant", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="merchant", cascade="all, delete-orphan")
