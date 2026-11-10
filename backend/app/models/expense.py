import datetime
import uuid
from sqlalchemy import Column, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=False, index=True)
    date = Column(Date, default=datetime.date.today, index=True)
    category = Column(String, nullable=False) # "Rent", "Staff Salaries", "Inventory Purchase", "Utilities", "Marketing", "Maintenance"
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)

    merchant = relationship("Merchant", back_populates="expenses")
