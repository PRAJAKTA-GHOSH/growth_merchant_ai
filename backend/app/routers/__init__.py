from app.routers.auth import router as auth_router
from app.routers.merchants import router as merchants_router
from app.routers.dashboard import router as dashboard_router
from app.routers.transactions import router as transactions_router
from app.routers.forecasting import router as forecasting_router
from app.routers.customers import router as customers_router
from app.routers.inventory import router as inventory_router
from app.routers.campaigns import router as campaigns_router
from app.routers.copilot import router as copilot_router
from app.routers.health import router as health_router
from app.routers.anomalies import router as anomalies_router
from app.routers.recommendations import router as recommendations_router
from app.routers.reports import router as reports_router

__all__ = [
    "auth_router",
    "merchants_router",
    "dashboard_router",
    "transactions_router",
    "forecasting_router",
    "customers_router",
    "inventory_router",
    "campaigns_router",
    "copilot_router",
    "health_router",
    "anomalies_router",
    "recommendations_router",
    "reports_router"
]
