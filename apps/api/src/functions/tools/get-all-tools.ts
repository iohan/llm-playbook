import { ToolInfo } from '@pkg/types';
import { sql } from '../../db';

const getAllTools = async (): Promise<ToolInfo[]> => {
  const tools = await sql<ToolInfo>(
    'SELECT id, tool_name as name, description, tool_slug as slug, active FROM tools',
    {},
  );

  return tools ?? [];
};

export default getAllTools;
