import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import authRoutes from './routes/auth';
import importRoutes from './routes/import';
import casesRoutes from './routes/cases';
import errorHandler from './middleware/errorHandler';
import { logger } from './utils/logger';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(pino({ logger }));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/import', importRoutes);
app.use('/api/cases', casesRoutes);

app.use(errorHandler);

export default app;
