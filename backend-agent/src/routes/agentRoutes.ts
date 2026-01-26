import { Router } from 'express';
import { handleUserQuery } from '../controllers/agentController';

const router = Router();

// POST http://localhost:3000/api/agent/ask
router.post('/ask', handleUserQuery);

export default router;