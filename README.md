# 🧠 Vyapar AI - Complete Business Operating System

> **An intelligent, autonomous business management platform powered by Google Gemini AI and Machine Learning**

Vyapar AI is a complete AI-powered business operating system designed for MSMEs (Micro, Small & Medium Enterprises) that combines natural language processing with predictive analytics to automate critical business decisions.

---

## 🌟 Overview

This repository contains a full-stack AI business assistant that integrates:
- **Natural Language Understanding** (Google Gemini AI)
- **Predictive Analytics** (Scikit-learn ML models)
- **Real-time Decision Making** (Automated insights & actions)

The system intelligently routes business queries through ML models and generates actionable responses like emails, reports, purchase orders, and fraud alerts.

---

## 🏗️ Architecture

```
vyapar-ai-complete/
├── index.html              # Frontend UI (Business Dashboard)
├── backend-agent/          # Node.js + TypeScript Backend (Gemini AI Integration)
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/         # AI Configuration (Gemini, Vertex AI)
│       ├── controllers/    # Request Handlers
│       ├── routes/         # API Endpoints
│       └── services/       # Business Logic & AI Orchestration
└── service-churn/          # Python ML Microservice (Flask API)
    ├── app.py              # ML Model Serving
    ├── train_models.ipynb  # Model Training Notebook
    └── requirements.txt
```

### **System Flow**
```
User Query (Frontend)
    ↓
Backend Agent (Express + Gemini)
    ↓
Intelligent Routing
    ↓
Python ML Service (Flask)
    ↓
Predictive Models (Churn, Inventory, Lead, Expense)
    ↓
Gemini AI (Strategic Response Generation)
    ↓
Actionable JSON Response (Email Draft, Report, PO, etc.)
```

---

## 🔥 Features

### **1. Customer Retention AI**
- **Churn Prediction**: Identifies at-risk customers using Logistic Regression
- **Auto-generated retention emails** with personalized incentives
- Risk scoring (0-1 probability scale)

### **2. Inventory Intelligence**
- **Stock-out prediction** using Linear Regression
- Automated restock recommendations
- Critical low-stock alerts

### **3. Lead Scoring System**
- **Hot vs Cold Lead Classification** (Random Forest)
- Budget & urgency-based prioritization
- Sales team action recommendations

### **4. Expense Fraud Detection**
- **Anomaly detection** using Isolation Forest
- Automatic expense approval/flagging
- Audit trail generation

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js >= 18.x
- Python >= 3.9
- Google Cloud Account (for Gemini API)

---

## 📦 Installation

### **1. Backend Agent (TypeScript + Express)**

```bash
cd backend-agent

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
EOF

# Development mode
npm run dev

# Production build
npm run build
npm start
```

**Available Endpoints:**
- `GET /` - Health check
- `POST /api/agent/ask` - Main AI query endpoint

---

### **2. ML Microservice (Python + Flask)**

```bash
cd service-churn

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train models (if .pkl files don't exist)
jupyter notebook train_models.ipynb
# Run all cells to generate:
# - churn_model.pkl
# - inventory_model.pkl
# - lead_model.pkl
# - expense_model.pkl

# Start Flask server
python app.py
# Runs on http://127.0.0.1:5001
```

**Available Endpoints:**
- `POST /predict-churn` - Customer churn prediction
- `POST /predict-inventory` - Inventory restock recommendations
- `POST /score-lead` - Lead qualification scoring
- `POST /audit-expense` - Expense fraud detection

---

### **3. Frontend (HTML + Vanilla JS)**

Simply open `index.html` in a browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Navigate to http://localhost:8000
```

---

## 🧪 API Usage Examples

### **Customer Churn Analysis**
```bash
curl -X POST http://localhost:3000/api/agent/ask \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Should we reach out to this customer?",
    "data": {
      "days_inactive": 45,
      "support_tickets": 8,
      "monthly_bill": 250
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "response": {
    "analysis": "Customer shows high churn risk with 45 days of inactivity and elevated support issues.",
    "risk_level": "High",
    "action_type": "Email",
    "action_title": "Draft Retention Email",
    "content": {
      "subject": "We Miss You! Exclusive 20% Discount Inside",
      "body": "Hi [Customer Name],\n\nWe've noticed you haven't...",
      "recipient": "Customer Name",
      "priority": "High"
    }
  }
}
```

### **Inventory Restock**
```bash
curl -X POST http://localhost:5001/predict-inventory \
  -H "Content-Type: application/json" \
  -d '{
    "current_stock": 15,
    "daily_sales_avg": 22
  }'
```

**Response:**
```json
{
  "recommended_restock_qty": 450,
  "restock_urgent": true,
  "status": "CRITICAL LOW STOCK",
  "model_used": "LinearRegression"
}
```

### **Lead Scoring**
```bash
curl -X POST http://localhost:5001/score-lead \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 50000,
    "urgency": 9
  }'
```

**Response:**
```json
{
  "lead_score": 90,
  "status": "Hot Lead 🔥",
  "model_used": "RandomForest"
}
```

### **Expense Audit**
```bash
curl -X POST http://localhost:5001/audit-expense \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25000
  }'
```

**Response:**
```json
{
  "is_fraud_risk": true,
  "risk_score": 0.95,
  "status": "Audit Required ⚠️",
  "model_used": "IsolationForest"
}
```

---

## 🔧 Configuration

### **Backend Agent Configuration**

Edit `backend-agent/src/services/geminiServices.ts`:

```typescript
// Line 7: Set Python Service URL
const PYTHON_SERVICE_URL = 'http://127.0.0.1:5001'; // Local
// const PYTHON_SERVICE_URL = 'https://your-app.run.app'; // Production
```

### **Gemini API Setup**

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `backend-agent/.env`:
```env
GEMINI_API_KEY=your_key_here
```

---

## 🐳 Docker Deployment

### **Python ML Service**

```bash
cd service-churn

# Build image
docker build -t vyapar-ml-service .

# Run container
docker run -p 5001:5001 vyapar-ml-service
```

### **Backend Agent**

```dockerfile
# Create Dockerfile in backend-agent/
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
cd backend-agent
docker build -t vyapar-backend .
docker run -p 3000:3000 --env-file .env vyapar-backend
```

---

## 🌐 Cloud Deployment

### **Option 1: Google Cloud Run**

```bash
# Deploy Python Service
cd service-churn
gcloud run deploy vyapar-ml-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated

# Deploy Backend
cd backend-agent
gcloud run deploy vyapar-backend \
  --source . \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=your_key
```

### **Option 2: Heroku**

```bash
# Python Service
cd service-churn
heroku create vyapar-ml-service
git push heroku main

# Backend
cd backend-agent
heroku create vyapar-backend
heroku config:set GEMINI_API_KEY=your_key
git push heroku main
```

---

## 📊 ML Model Details

| Model | Algorithm | Purpose | Input Features | Output |
|-------|-----------|---------|---------------|---------|
| **Churn** | Logistic Regression | Customer retention | Days inactive, support tickets, monthly bill | Churn probability (0-1) |
| **Inventory** | Linear Regression | Stock prediction | Current stock, daily sales avg | Restock quantity |
| **Lead** | Random Forest | Sales prioritization | Budget, urgency score | Hot/Cold classification |
| **Expense** | Isolation Forest | Fraud detection | Transaction amount | Anomaly score |

**Model Training:** Run `service-churn/train_models.ipynb` to retrain with new data.

---

## 🛠️ Tech Stack

### **Backend**
- **Runtime:** Node.js 18+ with TypeScript
- **Framework:** Express.js
- **AI:** Google Gemini AI (Generative AI)
- **HTTP Client:** Axios

### **ML Microservice**
- **Runtime:** Python 3.9+
- **Framework:** Flask
- **ML Library:** Scikit-learn
- **Model Persistence:** Joblib

### **Frontend**
- **UI:** HTML5 + CSS3 + Vanilla JavaScript
- **Fonts:** Google Fonts (Plus Jakarta Sans)
- **Icons:** Material Symbols

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend-agent/src/services/geminiServices.ts` | AI orchestration & intelligent routing |
| `backend-agent/src/controllers/agentController.ts` | API request handling |
| `service-churn/app.py` | Flask ML model serving |
| `service-churn/train_models.ipynb` | Model training pipeline |
| `index.html` | Business dashboard UI |

---

## 🔍 Troubleshooting

### **Issue: "Cannot connect to Python Service"**
- Ensure Flask is running on `http://127.0.0.1:5001`
- Check firewall/port settings
- Verify `PYTHON_SERVICE_URL` in `geminiServices.ts`

### **Issue: "Models not loading"**
- Run `train_models.ipynb` to generate `.pkl` files
- Ensure files are in `service-churn/` directory:
  - `churn_model.pkl`
  - `inventory_model.pkl`
  - `lead_model.pkl`
  - `expense_model.pkl`

### **Issue: "Gemini API Error"**
- Verify API key in `.env`
- Check quota limits in Google AI Studio
- Ensure internet connectivity

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Sudipta Sarkar**
- GitHub: [@sudiptasarkar011](https://github.com/sudiptasarkar011)

---

## 🙏 Acknowledgments

- Google Gemini AI for natural language understanding
- Scikit-learn for ML models
- Flask & Express.js communities

---

## 📞 Support

For issues or questions:
1. Open an [issue](https://github.com/sudiptasarkar011/vyapar-ai-backend/issues)
2. Check existing documentation
3. Review API endpoint examples above

---

**Built with ❤️ for MSMEs to make smarter, faster business decisions.**
