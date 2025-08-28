import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { healthHandler } from './routes/health.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true }));
app.use(express.json());

// Healthcheck
app.get('/health', healthHandler);

// Exempel på enkel agents-route (stub)
app.get('/api/agents', (_req, res) => {
  res.json([
    {
      id: '1',
      name: 'Demo 2',
      prompt: 'Hej hej hej',
      policy: '',
      provider: 'local',
      tools: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
