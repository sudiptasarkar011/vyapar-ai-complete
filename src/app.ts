import express from 'express';
import cors from 'cors';
import agentRoutes from './routes/agentRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/agent', agentRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Vyapar AI Brain is Active 🧠');
});

export default app;