import 'dotenv/config';
import path from 'path';
import { promises as fs } from 'fs';
import url from 'url';
import crypto from 'crypto';
import { insert, sql } from '../db';

import { Tool } from '../tools/Tool';

const TOOLS_DIR = 'src/tools/';

const findTsFiles = async (dir: string): Promise<string[]> => {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await findTsFiles(full)));
    } else if (e.isFile()) {
      if (
        e.name.endsWith('.ts') &&
        !e.name.endsWith('.d.ts') &&
        e.name !== 'Tool.ts' &&
        e.name !== 'ToolManager.ts'
      ) {
        out.push(full);
      }
    }
  }
  return out;
};

const extendsTool = (className: Function): boolean => {
  return typeof className === 'function' && className.prototype instanceof Tool;
};

const stableStringify = (value: any): string => {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  const keys = Object.keys(value).sort();
  const props = keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`);

  return `{${props.join(',')}}`;
};

const checksumHex = (material: string): string => {
  return crypto.createHash('sha256').update(material).digest('hex');
};

const main = async () => {
  const root = process.cwd();
  const toolsDir = path.isAbsolute(TOOLS_DIR) ? TOOLS_DIR : path.join(root, TOOLS_DIR);

  const files = await findTsFiles(toolsDir);

  if (files.length === 0) {
    console.log(`No tools could be found under ${toolsDir}`);
    return;
  }

  const tools: Array<{ name: string; slug: string; description: string; checksum: string }> = [];
  try {
    for (const file of files) {
      const mod = await import(url.pathToFileURL(file).href);
      const ToolClass =
        mod.default ?? Object.values(mod).find((v) => typeof v === 'function' && extendsTool(v));

      if (!ToolClass || !extendsTool(ToolClass)) continue;

      const instance: Tool = new ToolClass();

      const name = instance.name;
      const filename = path.relative(root, file);
      const slug = instance.constructor.name;
      const description = instance.description;

      if (!name || !description) {
        console.warn(`⚠️  ${path.relative(root, file)} missing name/description – skip tool.`);
        continue;
      }

      const checksum = checksumHex(stableStringify({ slug, filename }));

      tools.push({ name, slug, description, checksum });
    }
  } catch (err) {
    console.error('Error when importin tool class:', err);
  }

  const alreadyStoredTools = await sql('SELECT checksum FROM tools', {});

  const existingChecksums = new Set(
    alreadyStoredTools.map((t: { checksum: string }) => t.checksum),
  );
  const newTools = tools.filter((t) => !existingChecksums.has(t.checksum));

  console.log(`Discovered ${tools.length} tools, ${newTools.length} are new.`);

  if (newTools.length === 0) {
    process.exit(0);
  }

  for (const t of newTools) {
    await insert(
      'INSERT INTO tools (tool_name, tool_slug, description, active, checksum) VALUES (:name, :slug, :description, 0, :checksum)',
      t,
    );
  }

  process.exit(0);
};

main().catch((err) => {
  console.error('generate-tools failed:', err);
  process.exit(1);
});
