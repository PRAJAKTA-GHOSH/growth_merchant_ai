from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class TransactionItem(BaseModel):
    product_id: Optional[str] = None
    name: str
    quantity: int = 1
    price: float
    cost: float = 0.0

class TransactionCreate(BaseModel):
    customer_id: Optional[str] = None
    amount: float
    cost: Optional[float] = 0.0
    payment_method: str = "Paytm Soundbox QR"
    status: str = "SUCCESS"
    items: List[TransactionItem] = []
    discount_amount: float = 0.0
    tax_amount: float = 0.0
    transaction_time: Optional[datetime] = None

class TransactionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    merchant_id: str
    customer_id: Optional[str] = None
    transaction_time: datetime
    amount: float
    cost: float
    payment_method: str
    status: str
    items_json: str
    discount_amount: float
    tax_amount: float

class TransactionListResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: List[TransactionResponse]
