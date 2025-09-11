import { Request, Response } from 'express';
import getAgentById from '../../functions/agents/get-agent-by-id';

export default async (req: Request, res: Response) => {
  console.log(req.body);
  const id = req.body.id;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid or missing agent ID.' });
  }

  const agent = await getAgentById(Number(id));

  res.status(201).json(agent);
};
