import { ToolInfo } from '@pkg/types';
import { sql } from '../../db';

const getAvailableTools = async (): Promise<Omit<ToolInfo, 'filename'>[]> => {
  const tools = await sql<ToolInfo>(
    'SELECT id, toolName as name, description FROM tools WHERE active = 1;',
    {},
  );

  return tools ?? [];
};

export default getAvailableTools;
