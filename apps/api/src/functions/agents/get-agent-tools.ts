import { AgentTool } from '@pkg/types';
import { sql } from '../../db';

const getAgentTools = async (agentId: number): Promise<AgentTool[]> => {
  const sqlQuery = `
    SELECT
      t.id as id,
      t.toolName as name,
      t.toolClass as className,
      t.description as description
    FROM
      agent_tools agt
      INNER JOIN tools t ON t.id = agt.toolId and t.active = 1
    WHERE
      agt.agentId = :agentId;
`;
  const tools = await sql(sqlQuery, { agentId });

  return tools ?? [];
};

export default getAgentTools;
