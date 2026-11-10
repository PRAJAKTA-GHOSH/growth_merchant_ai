from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.merchant import Merchant
from app.utils.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_current_merchant(
    token: Optional[str] = Depends(oauth2_scheme),
    x_merchant_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Merchant:
    # 1. Try JWT Bearer token
    if token:
        payload = decode_access_token(token)
        if payload and "sub" in payload:
            merchant_id = payload["sub"]
            merchant = db.query(Merchant).filter(Merchant.id == merchant_id).first()
            if merchant:
                return merchant
                
    # 2. Try explicit header for demo/switch context
    if x_merchant_id:
        merchant = db.query(Merchant).filter(Merchant.id == x_merchant_id).first()
        if merchant:
            return merchant
            
    # 3. Fallback: return the first demo merchant or raise 401
    demo_merchant = db.query(Merchant).filter(Merchant.is_demo == True).first()
    if demo_merchant:
        return demo_merchant
        
    any_merchant = db.query(Merchant).first()
    if any_merchant:
        return any_merchant

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication credentials not provided or merchant not found",
        headers={"WWW-Authenticate": "Bearer"},
    )
