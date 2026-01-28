// File: backend-agent/src/controllers/agentController.ts

import { Request, Response } from 'express';
import { GeminiService } from '../services/geminiServices';

const geminiService = new GeminiService();

export const askAgent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { query, data } = req.body;
        
        // Ensure we wait for the JSON response
        const aiResponse = await geminiService.generateBusinessResponse(query, data);
        
        res.json({ success: true, response: aiResponse });
    } catch (error: any) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};