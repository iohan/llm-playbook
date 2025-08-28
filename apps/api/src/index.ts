import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { healthHandler } from './routes/health.js';
import agentsRouter from './routes/agents-router.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true }));
app.use(express.json());

// Healthcheck
app.get('/health', healthHandler);

app.use('/api/agents', agentsRouter);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
