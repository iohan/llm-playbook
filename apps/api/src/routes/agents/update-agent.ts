import { Agent } from '@pkg/types';
import { Request, Response } from 'express';
import { sql } from '../../db';

export default async (req: Request, res: Response) => {
  const agent: Agent = req.body;

  // Update agent
  await sql(
    `
      UPDATE
        agents
      SET
        name = :name,
        description = :description,
        prompt = :prompt,
        providerId = :providerId,
        modelId = :modelId
      WHERE
        id = :id
      `,
    {
      name: agent.name,
      description: agent.description,
      prompt: agent.prompt,
      providerId: agent.providerId,
      modelId: agent.modelId,
      id: agent.id,
    },
  );

  // For simplicity, we'll delete all existing tools and re-insert them
  await sql('DELETE FROM agent_tools WHERE agentId = :agentId', {
    agentId: agent.id,
  });

  if (agent.tools && agent.tools.length > 0) {
    agent.tools.forEach(async (tool) => {
      await sql(
        'INSERT INTO agent_tools (userId, agentId, toolId) VALUES (:userId, :agentId, :toolId)',
        {
          userId: 1,
          agentId: agent.id,
          toolId: tool.id,
        },
      );
    });
  }

  res.status(201).json({ message: 'Agent updated successfully' });
};
