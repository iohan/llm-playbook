import { Router } from 'express';
import { sql } from '../db';

const router = Router();

router.get('/', async (_req, res) => {
  const providers = await sql('SELECT id, provider_name from llm_providers WHERE hidden = 0');
  const models = await sql('SELECT id, model_name, provider_id from llm_models WHERE hidden = 0');

  const data = providers.map((provider) => ({
    title: provider.provider_name,
    id: provider.id,
    models: models
      .filter((model) => model.provider_id === provider.id)
      .map((model) => ({ id: provider.id, title: model.model_name })),
  }));

  res.json(data || []);
});

export default router;
