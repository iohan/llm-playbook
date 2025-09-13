import { ToolInfo } from '@pkg/types';
import { sql } from '../../db';

const getAllTools = async (): Promise<(ToolInfo & { used: number })[]> => {
  const tools = await sql<ToolInfo & { used: number }>(
    `
    SELECT
      t.id,
      t.tool_name AS name,
      t.description,
      t.tool_slug AS slug,
      t.active,
      COUNT(agt.id) AS used
    FROM
      tools t
    LEFT JOIN agent_tools agt ON agt.tool_id = t.id
    GROUP BY agt.tool_id;
    `,
    {},
  );

  return tools ?? [];
};

export default getAllTools;
