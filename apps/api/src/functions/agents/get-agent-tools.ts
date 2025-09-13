import { ToolInfo } from '@pkg/types';
import { sql } from '../../db';

const getAgentTools = async (agentVersionId: number): Promise<ToolInfo[]> => {
  const sqlQuery = `
    SELECT
      t.id as id,
      t.tool_name as name,
      t.tool_slug as slug,
      t.description as description
    FROM
      agent_tools agt
      INNER JOIN tools t ON t.id = agt.tool_id and t.active = 1
    WHERE
      agt.agent_version_id = :agentVersionId;
`;
  const tools = await sql(sqlQuery, { agentVersionId });

  return tools ?? [];
};

export default getAgentTools;
