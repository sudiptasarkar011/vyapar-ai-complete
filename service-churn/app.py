from flask import Flask, request, jsonify
from flask_cors import CORS
from mock_model import predict_churn_risk
import os

# Global variables
model = None 
USE_MOCK = True

# Try importing TensorFlow only if needed
try:
    import tensorflow as tf
    import numpy as np
    
    REAL_MODEL_PATH = 'model/churn_model.h5'
    
    if os.path.exists(REAL_MODEL_PATH):
        # We access keras directly from tf to avoid import errors
        model = tf.keras.models.load_model(REAL_MODEL_PATH) # type: ignore
        print("✅ Loaded REAL TensorFlow model.")
        USE_MOCK = False
    else:
        print("⚠️ Model file not found. Using MOCK mode.")
        USE_MOCK = True
except ImportError:
    print("⚠️ TensorFlow not installed. Using MOCK mode.")
    USE_MOCK = True
except Exception as e:
    print(f"⚠️ Error loading model: {e}")
    USE_MOCK = True

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        # We explicitly check if model exists to satisfy the red line on line 50
        if USE_MOCK or model is None:
            # MOCK MODE
            risk_score = predict_churn_risk(data)
            status = "High Risk" if risk_score > 0.7 else "Medium Risk" if risk_score > 0.4 else "Safe"
        else:
            # REAL MODE
            # The 'model' here is guaranteed to be valid now
            features = np.array([[
                float(data.get('days_inactive', 0)),
                float(data.get('support_tickets', 0)),
                float(data.get('monthly_bill', 0)),
            ]])
            
            # We use the model
            prediction = model.predict(features)
            risk_score = float(prediction[0][0])
            status = "High Risk" if risk_score > 0.7 else "Medium Risk" if risk_score > 0.4 else "Safe"

        return jsonify({
            "success": True,
            "risk_score": round(risk_score, 2),
            "status": status
        })

    except Exception as e:
        print(f"Error: {e}") 
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)