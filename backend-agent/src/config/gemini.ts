import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBqAphZOjTsTIdPFQFnLvA-rS8Vc7cIZK8');

// USE THE EXACT MODEL NAME FOUND IN YOUR LIST
export const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash' 
});