import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import authRoutes from './routes/auth';
import importRoutes from './routes/import';
import casesRoutes from './routes/cases';
import errorHandler from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Pino HTTP logger
app.use(
  pinoHttp({
    level: 'info', // log level
    transport: {
      target: 'pino-pretty', // optional, for pretty logs in dev
      options: { colorize: true },
    },
  })
);

app.get('/', (_req, res) => {
  res.send('CaseFlow Backend is Running');
});

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));


// API routes

app.use('/api/auth', authRoutes);
app.use('/api/import', importRoutes);
app.use('/api/cases', casesRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
