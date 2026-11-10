import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "GrowZen AI" in response.text

def test_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_demo_login_retail():
    response = client.post("/api/v1/auth/demo-login/retail")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["merchant"]["category"] == "Retail store"

def test_dashboard_overview():
    login_res = client.post("/api/v1/auth/demo-login/retail")
    token = login_res.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/dashboard/overview?days=30", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert "total_revenue" in data["kpis"]
    assert "revenue_trend" in data
    assert len(data["revenue_trend"]) > 0

def test_forecasting():
    login_res = client.post("/api/v1/auth/demo-login/retail")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/v1/forecasting?horizon=7", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["timeframe"] == "7d"
    assert "predicted_total_revenue" in data
    assert "forecast_points" in data
    assert len(data["forecast_points"]) > 0

def test_customer_intelligence():
    login_res = client.post("/api/v1/auth/demo-login/retail")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/v1/customers/intelligence", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "segments" in data
    assert "repeat_purchase_rate" in data

def test_inventory_health():
    login_res = client.post("/api/v1/auth/demo-login/retail")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/v1/inventory/health", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_skus" in data
    assert len(data["fast_moving_products"]) > 0

def test_merchant_health_score():
    login_res = client.post("/api/v1/auth/demo-login/retail")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/v1/health/score", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "overall_score" in data
    assert len(data["pillars"]) == 5

def test_anomalies_detection():
    login_res = client.post("/api/v1/auth/demo-login/retail")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/v1/anomalies/detect", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "total_anomalies_detected" in data

def test_vyapar_copilot_query():
    login_res = client.post("/api/v1/auth/demo-login/retail")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post(
        "/api/v1/copilot/query",
        json={"query": "Why did my sales decrease?", "language_mode": "en"},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert len(data["evidence"]) > 0

def test_vyapar_copilot_hinglish():
    login_res = client.post("/api/v1/auth/demo-login/retail")
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post(
        "/api/v1/copilot/query",
        json={"query": "Meri dukaan ka sabse best product kaunsa hai?", "language_mode": "hinglish"},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert data["language"] == "hinglish"
