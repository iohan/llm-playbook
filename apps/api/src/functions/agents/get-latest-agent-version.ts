import { AgentVersion } from '@pkg/types';
import { queryOne } from '../../db';
import getAgentTools from './get-agent-tools';

const getLatestAgentVersion = async (agentId: number): Promise<AgentVersion> => {
  const sqlQuery = `
    SELECT
      a.id,
      a.version,
      a.live,
      a.locked,
      a.prompt,
      a.llm_provider_id AS provider_id,
      lp.provider_name,
      a.llm_model_id AS model_id,
      lm.model_name
    FROM
      agent_versions a
      INNER JOIN (
        SELECT
          agent_id,
          MAX(created_at) AS latest_date
        FROM
          agent_versions
        GROUP BY
          agent_id) latest ON latest.agent_id = :agentId
      AND latest.latest_date = a.created_at
      INNER JOIN llm_providers lp ON lp.id = a.llm_provider_id
      INNER JOIN llm_models lm ON lm.id = a.llm_model_id;`;

  const version = await queryOne(sqlQuery, { agentId });

  const tools = await getAgentTools(version.id);

  return {
    version_id: version.id,
    version: version.version,
    live: version.live,
    locked: version.locked,
    prompt: version.prompt,
    provider_id: version.provider_id,
    provider: version.provider_name,
    model_id: version.model_id,
    model: version.model_name,
    tools,
  };
};

export default getLatestAgentVersion;
