def predict_churn_risk(data):
    """
    Simulates a churn prediction model.
    Input: data (dict) - e.g., {"days_inactive": 40, "support_tickets": 5}
    Output: float (0.0 to 1.0)
    """
    risk_score = 0.1 # Base risk
    
    # Simple logic to make the demo "smart"
    if data.get('days_inactive', 0) > 30:
        risk_score += 0.4
    if data.get('support_tickets', 0) > 3:
        risk_score += 0.3
    if data.get('monthly_bill', 0) > 1000:
        risk_score += 0.1
        
    # Cap at 0.99
    return min(risk_score, 0.99)