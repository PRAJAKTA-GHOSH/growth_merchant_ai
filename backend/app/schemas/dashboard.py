from pydantic import BaseModel
from typing import List, Optional

class KPICard(BaseModel):
    value: float
    formatted_value: str
    change_pct: float
    is_positive: bool
    label: str
    previous_value: float

class DashboardKPIs(BaseModel):
    total_revenue: KPICard
    net_profit: KPICard
    total_transactions: KPICard
    average_order_value: KPICard
    new_customers: KPICard
    returning_customers: KPICard
    revenue_growth_rate: KPICard
    payment_success_rate: KPICard

class TrendPoint(BaseModel):
    date: str
    current_period: float
    previous_period: Optional[float] = 0.0

class DailyHourlyPoint(BaseModel):
    label: str
    revenue: float
    transactions: int

class PaymentMethodStat(BaseModel):
    method: str
    count: int
    amount: float
    percentage: float

class PaymentStatusStat(BaseModel):
    status: str # SUCCESS, FAILED, REFUNDED
    count: int
    amount: float
    percentage: float

class CategoryShare(BaseModel):
    category: str
    revenue: float
    percentage: float
    items_sold: int

class TopProductItem(BaseModel):
    product_id: str
    name: str
    category: str
    units_sold: int
    revenue: float
    profit: float
    current_stock: int

class ExpenseCategoryItem(BaseModel):
    category: str
    amount: float
    percentage: float

class DashboardResponse(BaseModel):
    kpis: DashboardKPIs
    revenue_trend: List[TrendPoint]
    daily_revenue: List[DailyHourlyPoint]
    payment_status_breakdown: List[PaymentStatusStat]
    payment_methods_breakdown: List[PaymentMethodStat]
    category_distribution: List[CategoryShare]
    top_selling_products: List[TopProductItem]
    expense_breakdown: List[ExpenseCategoryItem]
    date_range_label: str
    is_simulated: bool = False
