import { Agent } from '@pkg/types';
import { queryOne, sql } from '../../db';
import getLatestAgentVersion from './get-latest-agent-version';

const getAgentById = async (agentId: number): Promise<Agent> => {
  const baseAgent = await queryOne('SELECT id, name, description FROM agents WHERE id = :id', {
    id: agentId,
  });

  const latestAgentVersion = await getLatestAgentVersion(baseAgent.id);

  return {
    id: baseAgent.id,
    name: baseAgent.name,
    description: baseAgent.description,
    latestVersion: latestAgentVersion,
  };
};

export default getAgentById;
