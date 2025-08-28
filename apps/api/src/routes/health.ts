import type { Request, Response } from 'express';
import { type HealthStatus } from '@pkg/types';

export const healthHandler = (_req: Request, res: Response) => {
  const body: HealthStatus = {
    status: 'ok',
    service: 'api',
    timestamp: new Date().toISOString(),
    buildSha: process.env.BUILD_SHA,
  };
  res.json(body);
};
