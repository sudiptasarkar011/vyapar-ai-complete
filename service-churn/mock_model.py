import random

# --- PHASE 1: CHURN PREDICTION ---
def predict_churn_risk(data):
    """
    Calculates risk based on inactivity and support history.
    """
    risk_score = 0.1 # Base risk
    
    if data.get('days_inactive', 0) > 30:
        risk_score += 0.4
    if data.get('support_tickets', 0) > 3:
        risk_score += 0.3
    if data.get('monthly_bill', 0) > 1000:
        risk_score += 0.1
        
    return min(risk_score, 0.99)

# --- PHASE 2: INVENTORY INTELLIGENCE ---
def predict_inventory_health(data):
    """
    Calculates when stock will run out.
    Input: current_stock (int), daily_sales_avg (int)
    """
    stock = float(data.get('current_stock', 0))
    velocity = float(data.get('daily_sales_avg', 1)) # Avoid div by zero
    
    if velocity <= 0: velocity = 1
    
    days_left = stock / velocity
    restock_needed = days_left < 7  # Alert if less than 1 week stock
    
    return {
        "days_until_stockout": round(days_left, 1),
        "restock_urgent": restock_needed,
        "status": "CRITICAL LOW STOCK" if restock_needed else "Healthy"
    }

# --- PHASE 3: SALES LEAD SCORING ---
def score_sales_lead(data):
    """
    Scores a lead from 0-100 based on budget and urgency.
    """
    score = 20 # Base score
    
    # Budget Check
    budget = float(data.get('budget', 0))
    if budget > 50000: score += 40
    elif budget > 10000: score += 20
    
    # Urgency Check (1-10 scale)
    urgency = int(data.get('urgency', 0))
    if urgency > 7: score += 30
    
    return {
        "lead_score": min(score, 99),
        "status": "Hot Lead 🔥" if score > 70 else "Cold Lead ❄️"
    }

# --- PHASE 4: EXPENSE AUDIT ---
def audit_expense_risk(data):
    """
    Detects anomalies in expenses.
    """
    amount = float(data.get('amount', 0))
    category = data.get('category', 'General')
    
    # Simple rule: If amount > 5000, flag it as anomaly
    is_anomaly = amount > 5000
    
    return {
        "risk_score": 0.9 if is_anomaly else 0.1,
        "is_fraud_risk": is_anomaly,
        "status": "Audit Required ⚠️" if is_anomaly else "Auto-Approved ✅"
    }