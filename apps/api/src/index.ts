import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import agentsRouter from './routes/agents/agents-router.js';
import chatRouter from './routes/chat-router.js';
import providersRouter from './routes/providers/providers-router.js';
import toolsRouter from './routes/tools/tools-router.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true }));
app.use(express.json());

app.use('/api/agents', agentsRouter);
app.use('/api/providers', providersRouter);
app.use('/api/chat', chatRouter);
app.use('/api/tools', toolsRouter);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
