// File: backend-agent/src/services/geminiService.ts

import { model } from '../config/gemini';
import axios from 'axios';

export class GeminiService {

    private async callPythonTool(endpoint: string, data: any) {
        try {
            console.log(`🔍 Calling Python Tool: ${endpoint}...`);
            const response = await axios.post(`http://localhost:5001/${endpoint}`, data);
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

            // INTELLIGENT ROUTING
            if (contextData.days_inactive !== undefined) {
                contextLabel = "Customer Retention Analysis";
                toolInsight = await this.callPythonTool('predict', contextData);
            } else if (contextData.current_stock !== undefined) {
                contextLabel = "Inventory Health Check";
                toolInsight = await this.callPythonTool('predict-inventory', contextData);
            } else if (contextData.budget !== undefined) {
                contextLabel = "Lead Qualification Score";
                toolInsight = await this.callPythonTool('score-lead', contextData);
            } else if (contextData.amount !== undefined) {
                contextLabel = "Expense Fraud Detection";
                toolInsight = await this.callPythonTool('audit-expense', contextData);
            }

            // REFINED PROMPT FOR JSON OUTPUT
            const prompt = `
            ROLE: You are Vyapar AI, an autonomous business OS.
            
            TASK: Analyze the data and provide a structured JSON response.
            
            CONTEXT: ${contextLabel}
            DATA: ${JSON.stringify(contextData)}
            INSIGHTS: ${toolInsight ? JSON.stringify(toolInsight) : 'None'}
            USER QUERY: "${userQuery}"
            
            OUTPUT FORMAT (Strict JSON):
            {
                "analysis": "Short strategic summary (max 2 sentences).",
                "risk_level": "Safe" | "Medium" | "High" | "Critical",
                "action_type": "Email" | "Purchase Order" | "Report" | "Audit",
                "action_title": "Button Label (e.g., 'Draft Retention Email')",
                "content": {
                    "subject": "Email/Report Subject",
                    "body": "Full Email/Report Body",
                    "recipient": "Name of person/vendor",
                    "priority": "High/Low"
                }
            }
            Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Clean up if Gemini wraps in code blocks
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            
            return JSON.parse(cleanJson);

        } catch (error) {
            console.error("Gemini Brain Error:", error);
            // Fallback JSON in case of error
            return {
                analysis: "System is experiencing heavy load. Please retry.",
                risk_level: "Unknown",
                action_type: "Error",
                action_title: "Retry",
                content: { subject: "Error", body: "Could not generate content." }
            };
        }
    }
}