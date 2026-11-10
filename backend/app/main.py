import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import settings
from app.database import Base, engine, SessionLocal
import app.models # ensure all models registered
from app.routers import (
    auth_router,
    merchants_router,
    dashboard_router,
    transactions_router,
    forecasting_router,
    customers_router,
    inventory_router,
    campaigns_router,
    copilot_router,
    health_router,
    anomalies_router,
    recommendations_router,
    reports_router
)
from app.services.data_generator import generate_merchant_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("growzen-ai")

# Create tables immediately upon module load so tests and clients have schema ready
Base.metadata.create_all(bind=engine)

def seed_demo_merchants_if_needed():
    db = SessionLocal()
    try:
        from app.models.merchant import Merchant
        existing = db.query(Merchant).count()
        if existing == 0:
            logger.info("Seeding realistic fintech demo merchant datasets (Retail, Grocery, Restaurant)...")
            generate_merchant_data(db, category_key="retail", seed=42)
            generate_merchant_data(db, category_key="grocery", seed=101)
            generate_merchant_data(db, category_key="restaurant", seed=202)
            logger.info("Demo datasets successfully loaded.")
        else:
            logger.info(f"Database already contains {existing} merchants.")
    except Exception as e:
        logger.error(f"Error seeding demo datasets: {e}")
    finally:
        db.close()

seed_demo_merchants_if_needed()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up GrowZen AI platform...")
    Base.metadata.create_all(bind=engine)
    seed_demo_merchants_if_needed()
    yield
    logger.info("Shutting down GrowZen AI backend...")

app = FastAPI(
    title="GrowZen AI — Paytm Merchant Growth Intelligence Platform",
    description="Intelligent AI business partner for Paytm merchants: forecasting, customer retention, anomaly detection & actionable recommendations.",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all API V1 routers
api_prefix = settings.API_V1_STR
app.include_router(auth_router, prefix=api_prefix)
app.include_router(merchants_router, prefix=api_prefix)
app.include_router(dashboard_router, prefix=api_prefix)
app.include_router(transactions_router, prefix=api_prefix)
app.include_router(forecasting_router, prefix=api_prefix)
app.include_router(customers_router, prefix=api_prefix)
app.include_router(inventory_router, prefix=api_prefix)
app.include_router(campaigns_router, prefix=api_prefix)
app.include_router(copilot_router, prefix=api_prefix)
app.include_router(health_router, prefix=api_prefix)
app.include_router(anomalies_router, prefix=api_prefix)
app.include_router(recommendations_router, prefix=api_prefix)
app.include_router(reports_router, prefix=api_prefix)

@app.get("/healthz")
def health_check():
    return {"status": "healthy"}

# Serve frontend build if dist folder exists
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend_spa(full_path: str):
        # Don't intercept API or docs routes
        if full_path.startswith("api/") or full_path in ["docs", "redoc", "openapi.json", "healthz"]:
            return None
        file_path = os.path.join(dist_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "platform": "GrowZen AI",
            "tagline": "Don't just track your business. Understand it, predict it and grow it.",
            "status": "online",
            "version": settings.VERSION,
            "docs_url": "/docs"
        }
