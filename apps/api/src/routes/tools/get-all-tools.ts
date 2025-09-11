import { Request, Response } from 'express';
import { sql } from '../../db';

export default async (_req: Request, res: Response) => {
  const tools = await sql(
    'SELECT id, tool_name, description, tool_slug, input_schema FROM tools',
    {},
  );

  res.status(201).json(tools.map((t) => ({ ...t, name: t.tool_name, slug: t.tool_slug })) || []);
};
