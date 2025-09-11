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

  // Update agent version
  await sql(
    'UPDATE agent_versions SET prompt = :prompt, llm_provider_id = :provider_id, llm_model_id = :model_id WHERE id = :version_id',
    {
      prompt: agent.prompt,
      provider_id: agent.provider_id,
      model_id: agent.model_id,
      version_id: agent.version_id,
    },
  );

  // For simplicity, we'll delete all existing tools and re-insert them
  await sql('DELETE FROM agent_tools WHERE agent_version_id = :version_id', {
    version_id: agent.version_id,
  });

  if (agent.tools && agent.tools.length > 0) {
    agent.tools.forEach(async (tool) => {
      await sql(
        'INSERT INTO agent_tools (agent_version_id, tool_id) VALUES (:agent_version_id, :tool_id)',
        {
          agent_version_id: agent.version_id,
          tool_id: tool.id,
        },
      );
    });
  }

  res.status(201).json({ message: 'Agent updated successfully' });
};
