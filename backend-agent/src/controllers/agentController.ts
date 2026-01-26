import { Request, Response } from 'express';
import { GeminiService } from '../services/geminiServices';

const geminiService = new GeminiService();

export const handleUserQuery = async (req: Request, res: Response) => {
    try {
        const { query, data } = req.body;

        if (!query) {
             res.status(400).json({ error: "Query is required" });
             return;
        }

        // Call the service
        const result = await geminiService.generateBusinessResponse(query, data);

        res.json({ 
            success: true, 
            response: result 
        });

    } catch (error) {
        console.error("Error in handleUserQuery:", error);
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : String(error)
        });
    }
};