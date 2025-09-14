import { Request, Response } from 'express';
import getAvailableTools from '../../functions/tools/get-available-tools';

export default async (_req: Request, res: Response) => {
  const tools = await getAvailableTools();

  console.log('Available tools:', tools);

  res.status(201).json(tools);
};
