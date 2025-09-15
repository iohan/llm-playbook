import { sql } from '../../db';
import url from 'url';
import path from 'path';
import { Tool, AnthropicTool } from '../../tools/Tool';

const TOOLS_DIR = 'src/tools/';

const extendsTool = (className: Function): boolean => {
  return typeof className === 'function' && className.prototype instanceof Tool;
};

const getToolSchemas = async (toolIds: number[]): Promise<AnthropicTool[]> => {
  const files = await sql('SELECT filename FROM tools WHERE id IN (:ids)', {
    ids: toolIds.join(','),
  });

  const schema: AnthropicTool[] = [];

  for (const file of files) {
    console.log('Tool file:', file.filename);
    const root = process.cwd();
    const toolsDir = path.isAbsolute(TOOLS_DIR) ? TOOLS_DIR : path.join(root, TOOLS_DIR);
    const fullPath = path.join(toolsDir, file.filename);
    const mod = await import(url.pathToFileURL(fullPath).href);
    const ToolClass =
      mod.default ?? Object.values(mod).find((v) => typeof v === 'function' && extendsTool(v));

    if (!ToolClass || !extendsTool(ToolClass)) continue;

    const instance: Tool = new ToolClass();

    schema.push(instance.anthropicTool);
  }

  return schema;
};

export default getToolSchemas;
