import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    merchant_id = Column(String, ForeignKey("merchants.id"), nullable=False, index=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=True, index=True)
    
    transaction_time = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    amount = Column(Float, nullable=False)
    cost = Column(Float, nullable=False, default=0.0) # total COGS for this transaction
    
    # "Paytm UPI", "Paytm Soundbox QR", "Paytm Card Machine", "NetBanking", "Cash"
    payment_method = Column(String, default="Paytm Soundbox QR")
    # "SUCCESS", "FAILED", "REFUNDED"
    status = Column(String, default="SUCCESS", index=True)
    
    items_json = Column(Text, default="[]") # JSON list of {product_id, name, qty, price, cost}
    discount_amount = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)

    merchant = relationship("Merchant", back_populates="transactions")
    customer = relationship("Customer", back_populates="transactions")
