import { ToolInfo } from '@pkg/types';
import { sql } from '../../db';

const getAllTools = async (): Promise<(ToolInfo & { used: number })[]> => {
  const tools = await sql<ToolInfo & { used: number }>(
    `
    SELECT
      t.id,
      t.toolName AS name,
      t.description,
      t.toolClass AS className,
      t.active,
      COUNT(agt.id) AS used
    FROM
      tools t
    LEFT JOIN agent_tools agt ON agt.toolId = t.id
    GROUP BY t.id;
    `,
    {},
  );

  return tools ?? [];
};

export default getAllTools;
