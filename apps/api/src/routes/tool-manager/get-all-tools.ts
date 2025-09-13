import { Request, Response } from 'express';
import getAllTools from '../../functions/tools/get-all-tools';

export default async (_req: Request, res: Response) => {
  const tools = await getAllTools();

  res.status(201).json(tools);
};
