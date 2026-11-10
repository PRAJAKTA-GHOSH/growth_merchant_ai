import json
import uuid
import datetime
from fastapi import APIRouter, Depends, Query, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models.merchant import Merchant
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionResponse, TransactionListResponse, TransactionCreate
from app.services.data_importer import import_transactions_from_file
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("", response_model=TransactionListResponse)
def list_transactions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    payment_method: Optional[str] = Query(None),
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    query = db.query(Transaction).filter(Transaction.merchant_id == current_merchant.id)
    if status:
        query = query.filter(Transaction.status == status)
    if payment_method:
        query = query.filter(Transaction.payment_method == payment_method)

    total = query.count()
    items = query.order_by(Transaction.transaction_time.desc()).offset((page - 1) * limit).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": items
    }

@router.post("", response_model=TransactionResponse)
def create_manual_transaction(
    tx_in: TransactionCreate,
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    items_json = json.dumps([i.model_dump() for i in tx_in.items]) if tx_in.items else "[]"
    tx = Transaction(
        id=str(uuid.uuid4()),
        merchant_id=current_merchant.id,
        customer_id=tx_in.customer_id,
        transaction_time=tx_in.transaction_time or datetime.datetime.utcnow(),
        amount=tx_in.amount,
        cost=tx_in.cost or round(tx_in.amount * 0.6, 2),
        payment_method=tx_in.payment_method,
        status=tx_in.status,
        items_json=items_json,
        discount_amount=tx_in.discount_amount,
        tax_amount=tx_in.tax_amount
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx

@router.post("/upload")
async def upload_transactions_file(
    file: UploadFile = File(...),
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    result = import_transactions_from_file(
        db=db,
        merchant_id=current_merchant.id,
        file_bytes=contents,
        filename=file.filename
    )
    return result
