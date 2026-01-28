import os
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- LOAD TRAINED MODELS ---
print("Loading models...")
try:
    churn_model = joblib.load('churn_model.pkl')
    inventory_model = joblib.load('inventory_model.pkl')
    lead_model = joblib.load('lead_model.pkl')
    expense_model = joblib.load('expense_model.pkl')
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    print("Ensure .pkl files are in the same directory.")

# --- ROUTES ---

@app.route('/predict-churn', methods=['POST'])
def predict_churn():
    try:
        data = request.json
        # Input: [Days Inactive, Support Tickets, Monthly Bill]
        features = np.array([[
            data.get('days_inactive', 0),
            data.get('support_tickets', 0),
            data.get('monthly_bill', 0)
        ]])
        
        prediction = churn_model.predict(features)[0] # 0 or 1
        prob = churn_model.predict_proba(features)[0][1] # Probability of churn
        
        return jsonify({
            "risk_score": round(prob, 2),
            "status": "High Risk" if prediction == 1 else "Safe",
            "model_used": "LogisticRegression"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict-inventory', methods=['POST'])
def predict_inventory():
    try:
        data = request.json
        # Input: [Current Stock, Daily Sales Avg]
        features = np.array([[
            data.get('current_stock', 0),
            data.get('daily_sales_avg', 0)
        ]])
        
        restock_qty = inventory_model.predict(features)[0]
        restock_needed = restock_qty > 0
        
        return jsonify({
            "recommended_restock_qty": round(max(0, restock_qty), 0),
            "restock_urgent": bool(restock_needed),
            "status": "CRITICAL LOW STOCK" if restock_needed else "Healthy",
            "model_used": "LinearRegression"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/score-lead', methods=['POST'])
def score_lead():
    try:
        data = request.json
        # Input: [Budget, Urgency]
        features = np.array([[
            data.get('budget', 0),
            data.get('urgency', 0)
        ]])
        
        is_hot = lead_model.predict(features)[0]
        # Simulate a score based on prediction + raw values (since RF is classification)
        score = 90 if is_hot == 1 else 30
        
        return jsonify({
            "lead_score": score,
            "status": "Hot Lead 🔥" if is_hot == 1 else "Cold Lead ❄️",
            "model_used": "RandomForest"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/audit-expense', methods=['POST'])
def audit_expense():
    try:
        data = request.json
        # Input: [Amount]
        features = np.array([[
            data.get('amount', 0)
        ]])
        
        # Isolation Forest: -1 is Anomaly, 1 is Normal
        prediction = expense_model.predict(features)[0]
        is_fraud = prediction == -1
        
        return jsonify({
            "is_fraud_risk": bool(is_fraud),
            "risk_score": 0.95 if is_fraud else 0.1,
            "status": "Audit Required ⚠️" if is_fraud else "Auto-Approved ✅",
            "model_used": "IsolationForest"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Cloud Run will define the PORT environment variable
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)