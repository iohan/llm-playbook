import { Request, Response } from 'express';
import toggleTool from '../../functions/tools/toggle-tool';

export default async (req: Request, res: Response) => {
  const toolId = req.body.toolId;
  const state = req.body.state;

  await toggleTool(toolId, state);

  res.status(201);
};
