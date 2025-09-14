import { ToolInfo } from '@pkg/types';
import { sql } from '../../db';

const getAvailableTools = async (): Promise<ToolInfo[]> => {
  const tools = await sql<ToolInfo>(
    'SELECT id, toolName as name, description, toolClass as className FROM tools WHERE active = 1;',
    {},
  );

  return tools ?? [];
};

export default getAvailableTools;
