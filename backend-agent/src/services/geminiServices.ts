import { model } from '../config/gemini';
import axios from 'axios';

export class GeminiService {

    /**
     * Helper: Calls the Python Microservice to predict churn risk.
     * NOW UPDATED TO PORT 5001 to avoid macOS AirPlay conflicts.
     */
    private async checkChurnRisk(customerData: any) {
        try {
            console.log("🔍 Connecting to Python Churn Service on Port 5001...");
            
            // calling the Python service on the new port
            const response = await axios.post('http://localhost:5001/predict', customerData);
            
            console.log("✅ Risk Analysis Received:", response.data);
            return response.data;
        } catch (error) {
            console.error("⚠️ Failed to connect to Python Churn Service:", error);
            // Return a neutral fallback so the agent doesn't crash
            return { status: "Unknown (Service Unavailable)", risk_score: 0 };
        }
    }

    /**
     * Main function: Orchestrates the AI response.
     * 1. Checks risk (if data exists)
     * 2. Prompts Gemini with the risk context
     */
    async generateBusinessResponse(userQuery: string, contextData?: any) {
        try {
            let riskInfo = null;

            // INTELLIGENT ROUTING: 
            // If the user provided customer data (like monthly_bill), auto-check risk.
            if (contextData && (contextData.monthly_bill || contextData.days_inactive)) {
                riskInfo = await this.checkChurnRisk(contextData);
            }

            // Construct the sophisticated prompt
            const prompt = `
            ROLE: You are 'Vyapar AI', an intelligent business assistant for MSMEs in India.
            
            ${riskInfo ? `REAL-TIME RISK ANALYSIS (From Churn Model): 
            - Risk Score: ${riskInfo.risk_score} (0-1 scale)
            - Customer Status: ${riskInfo.status}
            - ACTION REQUIRED: ${riskInfo.status === 'High Risk' ? 'Draft a retention offer immediately.' : 'Maintain standard engagement.'}` : ''}
            
            CONTEXT DATA: ${contextData ? JSON.stringify(contextData) : 'No specific customer data provided.'}
            
            USER QUERY: ${userQuery}
            
            TASK: Provide a professional, actionable response. 
            If the customer is 'High Risk', be empathetic and offer specific value (discounts/support) to keep them.
            If drafting an email, keep it formatted cleanly.
            `;

            // Call Gemini
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("Gemini Interaction Error:", error);
            throw new Error("Failed to process request with Vyapar AI.");
        }
    }
}