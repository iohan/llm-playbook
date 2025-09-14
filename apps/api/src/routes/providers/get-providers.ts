import { Request, Response } from 'express';
import { sql } from '../../db';

export default async (_req: Request, res: Response) => {
  const providers = await sql('SELECT id, providerName from llm_providers WHERE hidden = 0');
  const models = await sql('SELECT id, modelName, providerId from llm_models WHERE hidden = 0');

  const data = providers.map((provider) => ({
    title: provider.providerName,
    id: provider.id,
    models: models
      .filter((model) => model.providerId === provider.id)
      .map((model) => ({ id: model.id, title: model.modelName })),
  }));

  res.json(data || []);
};
