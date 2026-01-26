import { model } from '../config/gemini';
import axios from 'axios';

export class GeminiService {

    /**
     * Universal Helper to call Python Service (Port 5001)
     */
    private async callPythonTool(endpoint: string, data: any) {
        try {
            console.log(`🔍 Calling Python Tool: ${endpoint}...`);
            const response = await axios.post(`http://localhost:5001/${endpoint}`, data);
            console.log("✅ Tool Response:", response.data);
            return response.data;
        } catch (error) {
            console.error(`⚠️ Failed to connect to ${endpoint}:`, error);
            return null;
        }
    }

    async generateBusinessResponse(userQuery: string, contextData: any) {
        try {
            let toolInsight = null;
            let contextLabel = "General Context";

            // INTELLIGENT ROUTING LOGIC
            // The Agent decides which "Tool" to pick based on the data provided
            
            // 1. CHURN MODE
            if (contextData.days_inactive !== undefined) {
                contextLabel = "Customer Retention Analysis";
                toolInsight = await this.callPythonTool('predict', contextData);
            }
            // 2. INVENTORY MODE
            else if (contextData.current_stock !== undefined) {
                contextLabel = "Inventory Health Check";
                toolInsight = await this.callPythonTool('predict-inventory', contextData);
            }
            // 3. SALES LEAD MODE
            else if (contextData.budget !== undefined) {
                contextLabel = "Lead Qualification Score";
                toolInsight = await this.callPythonTool('score-lead', contextData);
            }
            // 4. EXPENSE AUDIT MODE
            else if (contextData.amount !== undefined) {
                contextLabel = "Expense Fraud Detection";
                toolInsight = await this.callPythonTool('audit-expense', contextData);
            }

            // Construct Prompt
            const prompt = `
            ROLE: You are Vyapar AI, an autonomous business OS for MSMEs.
            
            CURRENT TASK: ${contextLabel}
            
            TOOL INSIGHTS (From Python Model):
            ${toolInsight ? JSON.stringify(toolInsight, null, 2) : 'No automated insight available.'}
            
            USER INPUT DATA: 
            ${JSON.stringify(contextData)}
            
            USER INSTRUCTION: 
            "${userQuery}"
            
            INSTRUCTIONS:
            - Interpret the 'Tool Insights' for the user.
            - If Status is 'Critical' or 'High Risk', be urgent and suggest a solution.
            - If Status is 'Safe', be confirming.
            - Format the response beautifully for a business dashboard.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();

        } catch (error) {
            console.error("Gemini Error:", error);
            throw new Error("Vyapar AI Brain Failure");
        }
    }
}