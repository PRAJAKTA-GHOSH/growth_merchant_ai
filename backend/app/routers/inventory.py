from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.merchant import Merchant
from app.models.product import Product
from app.schemas.inventory import InventoryHealthSummary
from app.services.inventory_engine import compute_inventory_health
from app.routers.deps import get_current_merchant

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.get("/health", response_model=InventoryHealthSummary)
def get_inventory_health_data(
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    summary = compute_inventory_health(db, current_merchant.id)
    return summary

@router.put("/products/{product_id}/stock")
def update_product_stock(
    product_id: str,
    new_stock: int = Body(..., embed=True),
    current_merchant: Merchant = Depends(get_current_merchant),
    db: Session = Depends(get_db)
):
    prod = db.query(Product).filter(
        Product.id == product_id,
        Product.merchant_id == current_merchant.id
    ).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    prod.current_stock = max(0, new_stock)
    db.commit()
    return {"message": "Stock updated successfully", "product_id": prod.id, "new_stock": prod.current_stock}
