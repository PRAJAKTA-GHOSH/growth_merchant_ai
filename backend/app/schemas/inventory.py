from pydantic import BaseModel
from typing import List, Optional

class ProductStockItem(BaseModel):
    id: str
    sku: str
    name: str
    category: str
    cost_price: float
    selling_price: float
    current_stock: int
    min_stock_threshold: int
    reorder_quantity: int
    lead_time_days: int
    unit: str
    daily_run_rate: float
    days_until_stockout: Optional[int]
    status: str # "OUT_OF_STOCK", "CRITICAL_LOW", "ADEQUATE", "OVERSTOCK"
    urgency_score: int # 1 to 10
    reorder_reason: str

class InventoryHealthSummary(BaseModel):
    total_skus: int
    total_inventory_value: float
    low_stock_count: int
    out_of_stock_count: int
    overstock_count: int
    fast_moving_products: List[ProductStockItem]
    slow_moving_products: List[ProductStockItem]
    reorder_recommendations: List[ProductStockItem]
    inventory_turnover_rate: float
