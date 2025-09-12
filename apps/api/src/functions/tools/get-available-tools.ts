import { ToolInfo } from '@pkg/types';
import { sql } from '../../db';

const getAvailableTools = async () => {
  const tools = await sql<ToolInfo>(
    'SELECT id, tool_name as name, description, tool_slug as slug, input_schema as inputSchema FROM tools',
    {},
  );

  return tools ?? [];
};

export default getAvailableTools;
