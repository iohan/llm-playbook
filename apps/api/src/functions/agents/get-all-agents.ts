import { Agent } from '@pkg/types';
import { sql } from '../../db';
import getAgentTools from './get-agent-tools';

const getAllAgents = async (): Promise<Agent[]> => {
  const agents = await sql<Omit<Agent, 'tools'>>(
    `
    SELECT
      a.id,
      a.name,
      a.prompt,
      a.providerId,
      lp.providerName,
      a.modelId,
      lm.modelName,
      a.description
    FROM
      agents a
      LEFT JOIN llm_providers lp ON lp.id = a.providerId
      LEFT JOIN llm_models lm ON lm.id = a.modelId
    `,
    {},
  );

  if (!agents || agents.length === 0) {
    return [];
  }

  const output: Agent[] = [];

  for (const agent of agents) {
    const tools = await getAgentTools(agent.id);

    output.push({ ...agent, tools });
  }

  return output || [];
};

export default getAllAgents;
