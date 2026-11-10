import random
import datetime
import json
import uuid
from sqlalchemy.orm import Session
from app.models.merchant import Merchant
from app.models.product import Product
from app.models.customer import Customer
from app.models.transaction import Transaction
from app.models.expense import Expense
from app.models.campaign import Campaign
from app.models.recommendation import Recommendation
from app.utils.security import hash_password

CATEGORIES_CONFIG = {
    "retail": {
        "name": "Zenith Retail & Lifestyle",
        "category": "Retail store",
        "location": "Indiranagar, Bengaluru",
        "size": "Medium",
        "revenue_range": "₹3L - ₹8L",
        "employees": 5,
        "operating_hours": "10:00 - 21:30",
        "email": "demo.retail@growzen.ai",
        "products": [
            {"sku": "RET-001", "name": "Premium Cotton Shirt", "category": "Apparel", "cost": 650.0, "price": 1499.0, "stock": 42, "min_stock": 15, "reorder": 50, "lead_days": 4, "velocity": 3.2},
            {"sku": "RET-002", "name": "Slim Fit Denim Jeans", "category": "Apparel", "cost": 900.0, "price": 2199.0, "stock": 6, "min_stock": 20, "reorder": 40, "lead_days": 5, "velocity": 4.1}, # Fast seller, low stock!
            {"sku": "RET-003", "name": "Leather Bifold Wallet", "category": "Accessories", "cost": 300.0, "price": 899.0, "stock": 58, "min_stock": 10, "reorder": 25, "lead_days": 3, "velocity": 1.1}, # Slow mover
            {"sku": "RET-004", "name": "Wireless Noise-Canceling Earbuds", "category": "Electronics", "cost": 1200.0, "price": 2499.0, "stock": 18, "min_stock": 12, "reorder": 30, "lead_days": 6, "velocity": 2.5},
            {"sku": "RET-005", "name": "Stainless Steel Smart Thermos", "category": "Lifestyle", "cost": 450.0, "price": 1099.0, "stock": 85, "min_stock": 15, "reorder": 30, "lead_days": 3, "velocity": 0.4}, # Overstock alert
            {"sku": "RET-006", "name": "Organic Canvas Backpack", "category": "Accessories", "cost": 800.0, "price": 1899.0, "stock": 24, "min_stock": 10, "reorder": 20, "lead_days": 4, "velocity": 1.8},
            {"sku": "RET-007", "name": "UV-Protection Polarized Sunglasses", "category": "Accessories", "cost": 550.0, "price": 1299.0, "stock": 31, "min_stock": 10, "reorder": 25, "lead_days": 3, "velocity": 1.5},
            {"sku": "RET-008", "name": "Fast Charger 65W GaN", "category": "Electronics", "cost": 600.0, "price": 1399.0, "stock": 8, "min_stock": 15, "reorder": 35, "lead_days": 3, "velocity": 3.8}  # Fast seller, critical low
        ],
        "ticket_mean": 1750.0,
        "daily_tx_mean": 32
    },
    "grocery": {
        "name": "GreenLeaf Kirana & Superstore",
        "category": "Grocery store",
        "location": "Koramangala, Bengaluru",
        "size": "Small",
        "revenue_range": "₹2L - ₹5L",
        "employees": 4,
        "operating_hours": "07:30 - 22:00",
        "email": "demo.grocery@growzen.ai",
        "products": [
            {"sku": "GRO-001", "name": "Organic Basmati Rice 5kg", "category": "Staples", "cost": 380.0, "price": 490.0, "stock": 12, "min_stock": 25, "reorder": 60, "lead_days": 2, "velocity": 7.5}, # Fast mover, reorder!
            {"sku": "GRO-002", "name": "Cold-Pressed Mustard Oil 1L", "category": "Oils & Ghee", "cost": 160.0, "price": 215.0, "stock": 45, "min_stock": 20, "reorder": 40, "lead_days": 2, "velocity": 4.2},
            {"sku": "GRO-003", "name": "Pure Desi Cow Ghee 500ml", "category": "Oils & Ghee", "cost": 340.0, "price": 450.0, "stock": 18, "min_stock": 15, "reorder": 30, "lead_days": 3, "velocity": 2.8},
            {"sku": "GRO-004", "name": "Roasted California Almonds 500g", "category": "Dry Fruits", "cost": 380.0, "price": 520.0, "stock": 8, "min_stock": 15, "reorder": 25, "lead_days": 3, "velocity": 3.1},
            {"sku": "GRO-005", "name": "Organic Green Tea Tin 250g", "category": "Beverages", "cost": 220.0, "price": 310.0, "stock": 64, "min_stock": 12, "reorder": 20, "lead_days": 2, "velocity": 0.5}, # Slow mover
            {"sku": "GRO-006", "name": "Multigrain Atta 5kg", "category": "Staples", "cost": 230.0, "price": 299.0, "stock": 4, "min_stock": 20, "reorder": 50, "lead_days": 2, "velocity": 8.0}, # Stockout imminent
            {"sku": "GRO-007", "name": "Toor Dal Premium 1kg", "category": "Staples", "cost": 140.0, "price": 175.0, "stock": 55, "min_stock": 25, "reorder": 60, "lead_days": 2, "velocity": 6.0},
            {"sku": "GRO-008", "name": "Himalayan Pink Salt 1kg", "category": "Spices", "cost": 65.0, "price": 99.0, "stock": 70, "min_stock": 15, "reorder": 30, "lead_days": 2, "velocity": 1.2}
        ],
        "ticket_mean": 620.0,
        "daily_tx_mean": 65
    },
    "restaurant": {
        "name": "Chai & Byte Cafe Bistro",
        "category": "Restaurant",
        "location": "HSR Layout, Bengaluru",
        "size": "Small",
        "revenue_range": "₹4L - ₹10L",
        "employees": 6,
        "operating_hours": "08:00 - 23:00",
        "email": "demo.cafe@growzen.ai",
        "products": [
            {"sku": "CAF-001", "name": "Artisanal Hazelnut Cappuccino", "category": "Coffee", "cost": 45.0, "price": 189.0, "stock": 120, "min_stock": 30, "reorder": 100, "lead_days": 1, "velocity": 18.0},
            {"sku": "CAF-002", "name": "Gourmet Paneer Tikka Panini", "category": "Food", "cost": 75.0, "price": 249.0, "stock": 15, "min_stock": 25, "reorder": 50, "lead_days": 1, "velocity": 14.5}, # High velocity, low prep-stock
            {"sku": "CAF-003", "name": "Loaded Nachos Grande", "category": "Snacks", "cost": 70.0, "price": 219.0, "stock": 40, "min_stock": 20, "reorder": 40, "lead_days": 2, "velocity": 9.2},
            {"sku": "CAF-004", "name": "Belgium Dark Chocolate Waffle", "category": "Desserts", "cost": 65.0, "price": 229.0, "stock": 10, "min_stock": 20, "reorder": 35, "lead_days": 2, "velocity": 8.0},
            {"sku": "CAF-005", "name": "Classic Adrak Elaichi Chai (Pot)", "category": "Beverages", "cost": 25.0, "price": 119.0, "stock": 150, "min_stock": 30, "reorder": 80, "lead_days": 1, "velocity": 24.0}, # Star item
            {"sku": "CAF-006", "name": "Matcha Latte Iced", "category": "Beverages", "cost": 85.0, "price": 239.0, "stock": 80, "min_stock": 15, "reorder": 30, "lead_days": 3, "velocity": 1.2}, # Low mover
            {"sku": "CAF-007", "name": "Wood-fired Margherita Slice", "category": "Food", "cost": 60.0, "price": 199.0, "stock": 22, "min_stock": 20, "reorder": 45, "lead_days": 1, "velocity": 11.0},
            {"sku": "CAF-008", "name": "Blueberry Cheesecake Cup", "category": "Desserts", "cost": 70.0, "price": 209.0, "stock": 6, "min_stock": 15, "reorder": 25, "lead_days": 1, "velocity": 6.5}
        ],
        "ticket_mean": 480.0,
        "daily_tx_mean": 75
    }
}

PAYMENT_METHODS = ["Paytm Soundbox QR", "Paytm UPI", "Paytm Card Machine", "NetBanking", "Cash"]
PAYMENT_WEIGHTS = [0.55, 0.25, 0.12, 0.03, 0.05]

FIRST_NAMES = ["Aarav", "Pooja", "Vikram", "Sneha", "Rahul", "Ananya", "Rohan", "Priya", "Amit", "Neha", 
               "Karan", "Divya", "Suresh", "Meera", "Aditya", "Ritu", "Deepak", "Tanvi", "Arjun", "Kavita",
               "Manish", "Sunita", "Harish", "Shweta", "Nikhil", "Preeti", "Gaurav", "Nisha", "Rajesh", "Simran"]
LAST_NAMES = ["Sharma", "Verma", "Gupta", "Patel", "Reddy", "Iyer", "Nair", "Rao", "Kumar", "Singh",
              "Mehta", "Joshi", "Bansal", "Chopra", "Deshmukh", "Pillai", "Bhat", "Kulkarni", "Malhotra", "Saxena"]

def generate_merchant_data(db: Session, category_key: str = "retail", seed: int = 42, custom_merchant_id: str = None) -> Merchant:
    """Generates 180 days of realistic, deterministic fintech merchant data."""
    rng = random.Random(seed)
    
    config = CATEGORIES_CONFIG.get(category_key, CATEGORIES_CONFIG["retail"])
    
    # 1. Create or retrieve Merchant
    if custom_merchant_id:
        merchant = db.query(Merchant).filter(Merchant.id == custom_merchant_id).first()
        if not merchant:
            merchant = Merchant(
                id=custom_merchant_id,
                business_name=config["name"],
                category=config["category"],
                location=config["location"],
                size=config["size"],
                monthly_revenue_range=config["revenue_range"],
                employee_count=config["employees"],
                operating_hours=config["operating_hours"],
                email=f"{category_key}_{custom_merchant_id[:6]}@growzen.ai",
                hashed_password=hash_password("growzen123"),
                is_demo=True
            )
            db.add(merchant)
            db.commit()
            db.refresh(merchant)
    else:
        existing = db.query(Merchant).filter(Merchant.email == config["email"]).first()
        if existing:
            # Delete old data for clean deterministic regeneration
            db.delete(existing)
            db.commit()
            
        merchant = Merchant(
            id=str(uuid.uuid4()),
            business_name=config["name"],
            category=config["category"],
            location=config["location"],
            size=config["size"],
            monthly_revenue_range=config["revenue_range"],
            employee_count=config["employees"],
            operating_hours=config["operating_hours"],
            email=config["email"],
            hashed_password=hash_password("growzen123"),
            is_demo=True
        )
        db.add(merchant)
        db.commit()
        db.refresh(merchant)

    # 2. Add Products
    db_products = []
    for prod_info in config["products"]:
        p = Product(
            id=str(uuid.uuid4()),
            merchant_id=merchant.id,
            sku=prod_info["sku"],
            name=prod_info["name"],
            category=prod_info["category"],
            cost_price=prod_info["cost"],
            selling_price=prod_info["price"],
            current_stock=prod_info["stock"],
            min_stock_threshold=prod_info["min_stock"],
            reorder_quantity=prod_info["reorder"],
            lead_time_days=prod_info["lead_days"],
            unit="pcs" if category_key != "grocery" else "unit"
        )
        db.add(p)
        db_products.append((p, prod_info["velocity"]))
    db.commit()

    # 3. Add Customers (around 120 customers with different cohorts)
    db_customers = []
    # Segments: 15 High-Value, 30 Loyal, 40 New, 25 At-Risk, 10 Inactive
    cohort_specs = [
        {"segment": "High-Value", "count": 15, "order_range": (8, 25), "recency_days": (1, 14), "spend_mult": 2.5, "churn_risk": (0.05, 0.20), "risk_level": "Low"},
        {"segment": "Loyal", "count": 30, "order_range": (5, 14), "recency_days": (2, 20), "spend_mult": 1.4, "churn_risk": (0.10, 0.30), "risk_level": "Low"},
        {"segment": "New", "count": 40, "order_range": (1, 3), "recency_days": (1, 28), "spend_mult": 1.0, "churn_risk": (0.25, 0.45), "risk_level": "Medium"},
        {"segment": "At-Risk", "count": 25, "order_range": (4, 10), "recency_days": (35, 75), "spend_mult": 1.2, "churn_risk": (0.65, 0.88), "risk_level": "High"},
        {"segment": "Inactive", "count": 12, "order_range": (1, 4), "recency_days": (80, 160), "spend_mult": 0.9, "churn_risk": (0.85, 0.98), "risk_level": "High"}
    ]
    
    now = datetime.datetime.utcnow()
    used_phones = set()

    for spec in cohort_specs:
        for _ in range(spec["count"]):
            first_name = rng.choice(FIRST_NAMES)
            last_name = rng.choice(LAST_NAMES)
            name = f"{first_name} {last_name}"
            phone = f"98{rng.randint(10000000, 99999999)}"
            while phone in used_phones:
                phone = f"98{rng.randint(10000000, 99999999)}"
            used_phones.add(phone)
            
            recency = rng.randint(spec["recency_days"][0], spec["recency_days"][1])
            last_visit = now - datetime.timedelta(days=recency, hours=rng.randint(1, 10))
            first_visit = last_visit - datetime.timedelta(days=rng.randint(30, 170))
            
            orders = rng.randint(spec["order_range"][0], spec["order_range"][1])
            avg_ticket = config["ticket_mean"] * spec["spend_mult"] * rng.uniform(0.85, 1.2)
            total_spend = round(orders * avg_ticket, 2)
            churn_score = round(rng.uniform(spec["churn_risk"][0], spec["churn_risk"][1]), 3)

            cust = Customer(
                id=str(uuid.uuid4()),
                merchant_id=merchant.id,
                name=name,
                phone=phone,
                email=f"{first_name.lower()}.{last_name.lower()}@gmail.com",
                first_visit=first_visit,
                last_visit=last_visit,
                total_orders=orders,
                total_spend=total_spend,
                rfm_segment=spec["segment"],
                churn_risk_score=churn_score,
                churn_risk_level=spec["risk_level"]
            )
            db.add(cust)
            db_customers.append((cust, spec))
    db.commit()

    # 4. Generate 180 Days of Realistic Transactions
    # Characteristics:
    # - Weekly seasonality (Fri/Sat/Sun +25% to +40%)
    # - Growth trend across months 1-5 (+3% month-over-month)
    # - Recent 14-day dip (-18% drop) to trigger AI anomaly and recommendation engines!
    # - Spike in failed transactions in days 3-5 ago (soundbox network glitch anomaly scenario)
    
    tx_list = []
    base_tx_count = config["daily_tx_mean"]

    for day_offset in range(180, -1, -1):
        target_date = (now - datetime.timedelta(days=day_offset)).date()
        day_of_week = target_date.weekday() # 0 = Monday, 6 = Sunday

        # Day of week multiplier
        if day_of_week in [4, 5, 6]: # Fri, Sat, Sun
            dow_mult = 1.35
        elif day_of_week in [0, 1]: # Mon, Tue
            dow_mult = 0.85
        else:
            dow_mult = 1.05

        # Trend & Dip simulation
        # Baseline growth
        month_progress = (180 - day_offset) / 30.0
        trend_mult = 1.0 + (month_progress * 0.04) # steady upward trend
        
        # In the last 14 days, introduce a sales dip of 20%
        if day_offset <= 14:
            trend_mult *= 0.80

        daily_tx_num = max(8, int(base_tx_count * dow_mult * trend_mult * rng.uniform(0.88, 1.15)))

        # Check if this day is in the payment failure anomaly window (days 3 to 6 ago)
        is_failure_anomaly_day = (3 <= day_offset <= 6)
        
        for _ in range(daily_tx_num):
            # Select realistic hour
            # Business hours: lunch peak (12-14) or evening peak (18-21)
            hour_roll = rng.random()
            if hour_roll < 0.35: # Evening peak
                hour = rng.randint(18, 21)
            elif hour_roll < 0.65: # Lunch peak
                hour = rng.randint(12, 14)
            elif hour_roll < 0.85: # Afternoon
                hour = rng.randint(15, 17)
            else: # Morning
                hour = rng.randint(9, 11)

            minute = rng.randint(0, 59)
            second = rng.randint(0, 59)
            tx_time = datetime.datetime.combine(target_date, datetime.time(hour, minute, second))

            # Pick 1-3 items
            num_items = rng.choices([1, 2, 3], weights=[0.55, 0.35, 0.10])[0]
            chosen_products = rng.choices([p[0] for p in db_products], weights=[p[1] for p in db_products], k=num_items)
            
            items_data = []
            tx_amount = 0.0
            tx_cost = 0.0

            for prod in chosen_products:
                qty = 1 if category_key == "retail" else rng.randint(1, 3)
                price = prod.selling_price
                cost = prod.cost_price * qty
                total_p = price * qty
                items_data.append({
                    "product_id": prod.id,
                    "name": prod.name,
                    "quantity": qty,
                    "price": price,
                    "cost": prod.cost_price
                })
                tx_amount += total_p
                tx_cost += cost

            # Payment method
            pay_method = rng.choices(PAYMENT_METHODS, weights=PAYMENT_WEIGHTS)[0]

            # Status: Normal failure rate 3.5%, but during anomaly window 19.5%
            fail_rate = 0.22 if is_failure_anomaly_day else 0.035
            refund_rate = 0.015

            status_roll = rng.random()
            if status_roll < fail_rate:
                tx_status = "FAILED"
            elif status_roll < fail_rate + refund_rate:
                tx_status = "REFUNDED"
            else:
                tx_status = "SUCCESS"

            # Assign to customer (60% chance to be an existing customer)
            customer_id = None
            if rng.random() < 0.65 and db_customers:
                cust, spec = rng.choice(db_customers)
                customer_id = cust.id

            tx = Transaction(
                id=str(uuid.uuid4()),
                merchant_id=merchant.id,
                customer_id=customer_id,
                transaction_time=tx_time,
                amount=round(tx_amount, 2),
                cost=round(tx_cost, 2),
                payment_method=pay_method,
                status=tx_status,
                items_json=json.dumps(items_data),
                discount_amount=0.0,
                tax_amount=round(tx_amount * 0.05, 2)
            )
            tx_list.append(tx)

    # Bulk insert transactions in batches for performance
    db.bulk_save_objects(tx_list)
    db.commit()

    # 5. Add Monthly and Weekly Expenses (6 months)
    expenses = []
    base_rent = 25000 if category_key == "retail" else (20000 if category_key == "grocery" else 35000)
    base_salary = config["employees"] * 18000
    
    for month_back in range(6, -1, -1):
        exp_date = (now - datetime.timedelta(days=month_back * 30)).date()
        # Monthly Rent
        expenses.append(Expense(
            id=str(uuid.uuid4()),
            merchant_id=merchant.id,
            date=exp_date.replace(day=1),
            category="Rent",
            amount=float(base_rent),
            description="Commercial Space Rent"
        ))
        # Monthly Staff Salaries
        expenses.append(Expense(
            id=str(uuid.uuid4()),
            merchant_id=merchant.id,
            date=exp_date.replace(day=5),
            category="Staff Salaries",
            amount=float(base_salary),
            description=f"Payroll for {config['employees']} team members"
        ))
        # Utilities (Electricity, Wi-Fi, Water)
        expenses.append(Expense(
            id=str(uuid.uuid4()),
            merchant_id=merchant.id,
            date=exp_date.replace(day=10),
            category="Utilities",
            amount=float(rng.randint(4500, 7500)),
            description="Commercial electricity and high-speed broadband"
        ))
        # Inventory logistics & restocking
        expenses.append(Expense(
            id=str(uuid.uuid4()),
            merchant_id=merchant.id,
            date=exp_date.replace(day=18),
            category="Inventory Purchase",
            amount=float(rng.randint(22000, 38000)),
            description="Restock bulk shipping & supplier consignments"
        ))
        # Local Marketing
        expenses.append(Expense(
            id=str(uuid.uuid4()),
            merchant_id=merchant.id,
            date=exp_date.replace(day=22),
            category="Marketing",
            amount=float(rng.randint(1800, 4500)),
            description="Paytm QR flyers, local WhatsApp campaign"
        ))
    db.bulk_save_objects(expenses)
    db.commit()

    # 6. Add Baseline Strategic Recommendations (Next Best Action Engine)
    recommendations = [
        Recommendation(
            id=str(uuid.uuid4()),
            merchant_id=merchant.id,
            problem="Recent Repeat Customer Retention Dropped 19%",
            evidence="Customers who made their 2nd purchase within 30 days dropped from 38.4% to 27.2% during the last 3 weeks.",
            suggested_action="Launch an automated WhatsApp loyalty campaign offering 12% off on orders above ₹800 to the 25 identified At-Risk customers.",
            priority="HIGH",
            impact_estimate="+₹18,500 expected incremental revenue within 14 days",
            assumptions="Based on 28% historical conversion on win-back promotions with avg order value of ₹1,450.",
            metric="Repeat Purchase Rate (target > 35%)",
            status="NEW",
            category="Retention",
            created_at=now - datetime.timedelta(hours=4)
        ),
        Recommendation(
            id=str(uuid.uuid4()),
            merchant_id=merchant.id,
            problem=f"Stockout Risk on Fast-Moving '{config['products'][1]['name']}'",
            evidence=f"Current stock is down to {config['products'][1]['stock']} units with a daily run-rate of {config['products'][1]['velocity']} units/day. Expected stockout in ~1.5 days.",
            suggested_action=f"Trigger purchase order for {config['products'][1]['reorder']} units immediately. Lead time is {config['products'][1]['lead_days']} days.",
            priority="HIGH",
            impact_estimate="Prevents ~₹12,400 in lost revenue over the coming weekend",
            assumptions=f"Demand velocity holds at ~{config['products'][1]['velocity']} units daily and supplier delivers within {config['products'][1]['lead_days']} days.",
            metric="Stockout Days (target: 0)",
            status="NEW",
            category="Inventory",
            created_at=now - datetime.timedelta(hours=12)
        ),
        Recommendation(
            id=str(uuid.uuid4()),
            merchant_id=merchant.id,
            problem="Elevated Payment Failure Rate on Paytm Soundbox QR",
            evidence="Failed transactions peaked at 22.1% between 4 and 5 days ago (normal baseline is 3.4%).",
            suggested_action="Perform diagnostic test on Soundbox SIM connection and verify router 2.4GHz Wi-Fi signal near cash counter.",
            priority="MEDIUM",
            impact_estimate="Recovers ~₹6,200 in dropped checkout baskets per week",
            assumptions="Assumes 65% of failed customers abandon rather than retry with alternate payment.",
            metric="Payment Success Rate (target > 98%)",
            status="NEW",
            category="Operations",
            created_at=now - datetime.timedelta(hours=28)
        ),
        Recommendation(
            id=str(uuid.uuid4()),
            merchant_id=merchant.id,
            problem=f"Capital Tied in Slow-Moving '{config['products'][4]['name']}'",
            evidence=f"Current stock of {config['products'][4]['stock']} units exceeds 120 days of forward demand at current velocity of {config['products'][4]['velocity']} units/day.",
            suggested_action="Bundle with high-velocity items or run a weekend clearance flash discount of 20% to release working capital.",
            priority="LOW",
            impact_estimate="Frees ₹18,000+ in stagnant inventory working capital",
            assumptions="Discounted bundle converts at 2.5x current run rate.",
            metric="Inventory Days on Hand (target < 45 days)",
            status="NEW",
            category="Inventory",
            created_at=now - datetime.timedelta(days=2)
        )
    ]
    db.bulk_save_objects(recommendations)
    db.commit()

    # 7. Add Baseline Sample Campaign
    camp = Campaign(
        id=str(uuid.uuid4()),
        merchant_id=merchant.id,
        name="Weekend VIP Customer Appreciation",
        target_segment="High-Value",
        objective="Upsell High-Value",
        discount_pct=15.0,
        budget=1200.0,
        message_template=f"Namaste {{name}}! 🙏 As one of {config['name']}'s most valued patrons, enjoy an exclusive 15% discount on your next visit this weekend! Pay via Paytm Soundbox to unlock special loyalty reward points. Valid till Sunday! 🌟",
        audience_size=15,
        projected_roi_low=2.8,
        projected_roi_high=4.5,
        status="ACTIVE",
        created_at=now - datetime.timedelta(days=1)
    )
    db.add(camp)
    db.commit()

    return merchant
