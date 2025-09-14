import { Request, Response } from 'express';
import getAllAgents from '../../functions/agents/get-all-agents';

export default async (_req: Request, res: Response) => {
  const agents = await getAllAgents();

  res.status(201).json(agents);
};
