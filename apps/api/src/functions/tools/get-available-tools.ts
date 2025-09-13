import { ToolInfo } from '@pkg/types';
import { sql } from '../../db';

const getAvailableTools = async (): Promise<ToolInfo[]> => {
  const tools = await sql<ToolInfo>(
    'SELECT id, tool_name as name, description, tool_slug as slug, input_schema as inputSchema, updated_at as updatedAt FROM tools WHERE active = 1;',
    {},
  );

  return tools ?? [];
};

export default getAvailableTools;
