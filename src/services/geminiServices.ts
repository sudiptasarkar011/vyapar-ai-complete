// CHANGE THE IMPORT to your new config file
import { model } from '../config/gemini'; 

export class GeminiService {
    
    async generateBusinessResponse(userQuery: string, contextData?: any) {
        try {
            const prompt = `
            ROLE: You are 'Vyapar AI', an intelligent business assistant for MSMEs in India.
            CONTEXT DATA: ${contextData ? JSON.stringify(contextData) : 'No specific data provided.'}
            USER QUERY: ${userQuery}
            TASK: Provide a professional, actionable response.
            `;

            // The method name here is exactly the same as before, but good to double-check
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text(); // Simpler way to get text in this SDK

            return text;
        } catch (error) {
            console.error("Gemini Interaction Error:", error);
            throw new Error("Failed to process request with Vyapar AI.");
        }
    }
}