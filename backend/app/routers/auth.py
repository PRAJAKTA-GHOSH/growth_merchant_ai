import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.merchant import Merchant
from app.schemas.merchant import MerchantCreate, MerchantLogin, MerchantResponse, Token
from app.utils.security import hash_password, verify_password, create_access_token
from app.services.data_generator import generate_merchant_data, CATEGORIES_CONFIG
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(merchant_in: MerchantCreate, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(Merchant).filter(Merchant.email == merchant_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A merchant with this email address already exists."
        )

    merchant = Merchant(
        id=str(uuid.uuid4()),
        business_name=merchant_in.business_name,
        category=merchant_in.category,
        location=merchant_in.location,
        size=merchant_in.size,
        monthly_revenue_range=merchant_in.monthly_revenue_range,
        employee_count=merchant_in.employee_count,
        operating_hours=merchant_in.operating_hours,
        email=merchant_in.email,
        hashed_password=hash_password(merchant_in.password),
        is_demo=merchant_in.generate_demo_data
    )
    db.add(merchant)
    db.commit()
    db.refresh(merchant)

    # Optionally seed with realistic initial demo transactions
    if merchant_in.generate_demo_data:
        cat_key = merchant_in.demo_category_type or "retail"
        generate_merchant_data(db, category_key=cat_key, seed=42, custom_merchant_id=merchant.id)

    token = create_access_token(data={"sub": merchant.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "merchant": merchant
    }

@router.post("/login", response_model=Token)
def login(login_in: MerchantLogin, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).filter(Merchant.email == login_in.email).first()
    if not merchant or not verify_password(login_in.password, merchant.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token(data={"sub": merchant.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "merchant": merchant
    }

@router.get("/me", response_model=MerchantResponse)
def get_current_user_profile(current_merchant: Merchant = Depends(get_current_merchant)):
    return current_merchant

@router.post("/demo-login/{category_type}", response_model=Token)
def demo_login(category_type: str, db: Session = Depends(get_db)):
    """1-Click instant demo login for hackathon judges & demonstrations."""
    if category_type not in ["retail", "grocery", "restaurant"]:
        category_type = "retail"
        
    cfg = CATEGORIES_CONFIG[category_type]
    merchant = db.query(Merchant).filter(Merchant.email == cfg["email"]).first()
    
    # If not generated yet, generate now
    if not merchant:
        merchant = generate_merchant_data(db, category_key=category_type, seed=42)

    token = create_access_token(data={"sub": merchant.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "merchant": merchant
    }
