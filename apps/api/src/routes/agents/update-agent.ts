import { Agent } from '@pkg/types';
import { Request, Response } from 'express';
import { sql } from '../../db';

export default async (req: Request, res: Response) => {
  const agent: Agent = req.body;

  // Update base agent
  await sql('UPDATE agents SET name = :name, description = :description WHERE id = :id', {
    name: agent.name,
    description: agent.description,
    id: agent.id,
  });

  res.status(201).json({ message: 'Agent updated successfully' });
};
