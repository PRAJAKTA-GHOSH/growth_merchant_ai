import io
import csv
import uuid
import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.transaction import Transaction

REQUIRED_TRANSACTION_COLUMNS = ["amount", "payment_method", "status"]

def import_transactions_from_file(
    db: Session,
    merchant_id: str,
    file_bytes: bytes,
    filename: str
) -> Dict[str, Any]:
    """
    Parses, validates, and imports transactions from CSV (or Excel text) using Python standard csv library.
    Provides detailed error reporting and ensures data isolation.
    """
    errors: List[str] = []

    try:
        content_str = file_bytes.decode('utf-8-sig', errors='replace')
        f = io.StringIO(content_str)
        reader = csv.reader(f)
        header = next(reader, None)
        if not header:
            return {
                "success": False,
                "inserted_count": 0,
                "errors": ["Uploaded file is empty."]
            }
    except Exception as e:
        return {
            "success": False,
            "inserted_count": 0,
            "errors": [f"Failed to read file: {str(e)}"]
        }

    # Normalize header names
    header_map = {col.strip().lower().replace(" ", "_"): idx for idx, col in enumerate(header)}

    # Validate essential columns
    for req in REQUIRED_TRANSACTION_COLUMNS:
        if req not in header_map:
            errors.append(f"Missing required column: '{req}' (found columns: {list(header_map.keys())})")

    if errors:
        return {
            "success": False,
            "inserted_count": 0,
            "errors": errors
        }

    valid_transactions = []
    skipped_rows = 0
    row_num = 1

    amt_idx = header_map.get("amount")
    status_idx = header_map.get("status")
    method_idx = header_map.get("payment_method")
    time_idx = header_map.get("transaction_time") or header_map.get("date")
    item_idx = header_map.get("product_name") or header_map.get("item_name")
    qty_idx = header_map.get("quantity")

    for row in reader:
        row_num += 1
        if not row or not any(row):
            continue

        # Parse amount
        try:
            amt_raw = row[amt_idx] if amt_idx < len(row) else ""
            amt = float(amt_raw.replace(",", "").replace("₹", "").strip())
            if amt <= 0:
                errors.append(f"Row {row_num}: Amount must be positive ({amt}).")
                skipped_rows += 1
                continue
        except (ValueError, TypeError, IndexError):
            errors.append(f"Row {row_num}: Invalid amount format.")
            skipped_rows += 1
            continue

        # Status
        status_val = "SUCCESS"
        if status_idx is not None and status_idx < len(row):
            s_raw = row[status_idx].strip().upper()
            if s_raw in ["SUCCESS", "FAILED", "REFUNDED"]:
                status_val = s_raw

        # Payment Method
        pay_method = "Paytm Soundbox QR"
        if method_idx is not None and method_idx < len(row):
            m_raw = row[method_idx].strip()
            if m_raw:
                pay_method = m_raw

        # Date
        tx_time = datetime.datetime.utcnow()
        if time_idx is not None and time_idx < len(row):
            t_raw = row[time_idx].strip()
            for fmt in ["%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y"]:
                try:
                    tx_time = datetime.datetime.strptime(t_raw, fmt)
                    break
                except ValueError:
                    pass

        # Items
        items_json = "[]"
        if item_idx is not None and item_idx < len(row):
            p_name = row[item_idx].strip() or "General Item"
            qty = 1
            if qty_idx is not None and qty_idx < len(row):
                try:
                    qty = max(1, int(row[qty_idx].strip()))
                except ValueError:
                    qty = 1
            items_json = f'[{{"name": "{p_name}", "quantity": {qty}, "price": {amt}, "cost": {round(amt * 0.6, 2)}}}]'

        tx = Transaction(
            id=str(uuid.uuid4()),
            merchant_id=merchant_id,
            customer_id=None,
            transaction_time=tx_time,
            amount=amt,
            cost=round(amt * 0.6, 2),
            payment_method=pay_method,
            status=status_val,
            items_json=items_json,
            discount_amount=0.0,
            tax_amount=round(amt * 0.05, 2)
        )
        valid_transactions.append(tx)

    if valid_transactions:
        db.bulk_save_objects(valid_transactions)
        db.commit()

    return {
        "success": len(valid_transactions) > 0,
        "inserted_count": len(valid_transactions),
        "skipped_rows": skipped_rows,
        "errors": errors[:10],
        "total_errors": len(errors)
    }
