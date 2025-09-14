import { Agent } from '@pkg/types';
import { queryOne } from '../../db';
import getAgentTools from './get-agent-tools';

const getAgentById = async (agentId: number): Promise<Agent | null> => {
  const agent = await queryOne<Omit<Agent, 'tools'>>(
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
    WHERE
      a.id = :agentId;
    `,
    {
      agentId,
    },
  );

  if (!agent) {
    return null;
  }

  const tools = await getAgentTools(agent.id);

  return {
    ...agent,
    tools,
  };
};

export default getAgentById;
