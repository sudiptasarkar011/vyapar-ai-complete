import { model } from '../config/gemini';
import axios from 'axios';

// --- CONFIGURATION ---
// 1. FOR LOCAL TESTING: Use 'http://127.0.0.1:5001'
// 2. FOR CLOUD DEPLOYMENT: Replace with your Cloud Run URL (e.g., 'https://vyapar-ai-models-xyz.run.app')
const PYTHON_SERVICE_URL = 'http://127.0.0.1:5001'; 

export class GeminiService {

    /**
     * Helper to call the Python Microservice
     */
    private async callPythonTool(endpoint: string, data: any) {
        try {
            // MAP generic intents to specific Python Routes
            let cleanEndpoint = endpoint;
            if (endpoint === 'predict') cleanEndpoint = 'predict-churn'; 

            console.log(`🔍 Calling Python Tool at ${PYTHON_SERVICE_URL}/${cleanEndpoint}...`);
            
            const response = await axios.post(`${PYTHON_SERVICE_URL}/${cleanEndpoint}`, data);
            
            console.log("✅ Tool Response:", response.data);
            return response.data;
        } catch (error) {
            console.error(`⚠️ Failed to connect to Python Service at ${endpoint}:`, error);
            return null;
        }
    }

    async generateBusinessResponse(userQuery: string, contextData: any) {
        try {
            let toolInsight = null;
            let contextLabel = "General Context";

            // --- INTELLIGENT ROUTING LOGIC ---
            // 1. CHURN (Customer Retention)
            if (contextData.days_inactive !== undefined) {
                contextLabel = "Customer Retention Analysis";
                toolInsight = await this.callPythonTool('predict-churn', contextData);
            }
            // 2. INVENTORY
            else if (contextData.current_stock !== undefined) {
                contextLabel = "Inventory Health Check";
                toolInsight = await this.callPythonTool('predict-inventory', contextData);
            }
            // 3. LEADS
            else if (contextData.budget !== undefined) {
                contextLabel = "Lead Qualification Score";
                toolInsight = await this.callPythonTool('score-lead', contextData);
            }
            // 4. EXPENSES
            else if (contextData.amount !== undefined) {
                contextLabel = "Expense Fraud Detection";
                toolInsight = await this.callPythonTool('audit-expense', contextData);
            }

            // --- PROMPT ENGINEERING FOR JSON OUTPUT ---
            const prompt = `
            ROLE: You are Vyapar AI, an autonomous business operating system for MSMEs.
            
            TASK: Analyze the provided data and tool insights, then generate a strategic response in strict JSON format.
            
            CONTEXT: ${contextLabel}
            USER QUERY: "${userQuery}"
            
            RAW DATA: 
            ${JSON.stringify(contextData)}
            
            TOOL INSIGHTS (From Predictive Model):
            ${toolInsight ? JSON.stringify(toolInsight) : 'No automated insight available.'}
            
            --------------------------------------------------
            OUTPUT INSTRUCTIONS:
            Return ONLY a valid JSON object. Do not add Markdown (\`\`\`).
            
            JSON STRUCTURE:
            {
                "analysis": "A short, sharp strategic summary of the situation (max 2 sentences).",
                "risk_level": "Safe" | "Medium" | "High" | "Critical",
                "action_type": "Email" | "Purchase Order" | "Report" | "Audit",
                "action_title": "Button Label (e.g. 'Draft Retention Email', 'Generate PO')",
                "content": {
                    "subject": "Subject line for the email/report",
                    "body": "The full professional text content. Be empathetic for retention, urgent for stockouts, and formal for audits.",
                    "recipient": "Name of the person or entity (if available)",
                    "priority": "High" | "Normal" | "Low"
                }
            }
            `;

            // --- GENERATION ---
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // --- CLEANUP ---
            // Gemini sometimes wraps JSON in markdown blocks (```json ... ```). We strip them.
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            return JSON.parse(cleanJson);

        } catch (error) {
            console.error("Gemini Brain Error:", error);
            // Fail-safe JSON to prevent UI crash
            return {
                analysis: "System is experiencing heavy traffic. Please try again.",
                risk_level: "Unknown",
                action_type: "Error",
                action_title: "Retry",
                content: { subject: "Error", body: "Could not process request." }
            };
        }
    }
}