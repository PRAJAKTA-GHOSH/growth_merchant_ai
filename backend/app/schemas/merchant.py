from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class MerchantBase(BaseModel):
    business_name: str
    category: str
    location: Optional[str] = "Bengaluru, Karnataka"
    size: Optional[str] = "Small"
    monthly_revenue_range: Optional[str] = "₹1L - ₹5L"
    employee_count: Optional[int] = 3
    operating_hours: Optional[str] = "09:00 - 21:00"

class MerchantCreate(MerchantBase):
    email: str
    password: str
    generate_demo_data: bool = True
    demo_category_type: Optional[str] = "retail"

class MerchantLogin(BaseModel):
    email: str
    password: str

class MerchantResponse(MerchantBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    is_demo: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    merchant: MerchantResponse

class TokenPayload(BaseModel):
    sub: Optional[str] = None
