import { Router } from 'express';
import { askAgent } from '../controllers/agentController';

const router = Router();

// POST http://localhost:3000/api/agent/ask
router.post('/ask', askAgent);

export default router;