import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Select the Gemini Pro model
export const model = genAI.getGenerativeModel({ model: 'gemini-pro' });