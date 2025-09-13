import { ToolInfo } from '@pkg/types';
import { sql } from '../../db';

const getAvailableTools = async (): Promise<ToolInfo[]> => {
  const tools = await sql<ToolInfo>(
    'SELECT id, tool_name as name, description, tool_slug as slug FROM tools WHERE active = 1;',
    {},
  );

  return tools ?? [];
};

export default getAvailableTools;
