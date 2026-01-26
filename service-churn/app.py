from flask import Flask, request, jsonify
from flask_cors import CORS
from mock_model import predict_churn_risk, predict_inventory_health, score_sales_lead, audit_expense_risk
import os

# Initialize Flask
app = Flask(__name__)
CORS(app)

# -----------------
# ROUTE 1: CHURN (Existing)
# -----------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # Using Mock logic for stability
        risk_score = predict_churn_risk(data)
        status = "High Risk" if risk_score > 0.7 else "Safe"
        
        return jsonify({
            "success": True, 
            "risk_score": round(risk_score, 2), 
            "status": status
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------
# ROUTE 2: INVENTORY (New)
# -----------------
@app.route('/predict-inventory', methods=['POST'])
def inventory():
    try:
        data = request.json
        result = predict_inventory_health(data)
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------
# ROUTE 3: LEADS (New)
# -----------------
@app.route('/score-lead', methods=['POST'])
def leads():
    try:
        data = request.json
        result = score_sales_lead(data)
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# -----------------
# ROUTE 4: EXPENSES (New)
# -----------------
@app.route('/audit-expense', methods=['POST'])
def expense():
    try:
        data = request.json
        result = audit_expense_risk(data)
        return jsonify({"success": True, **result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    # Running on Port 5001 (macOS Safe)
    app.run(debug=True, port=5001)