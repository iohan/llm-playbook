import { Router } from 'express';

const router = Router();

const providers = [
  { title: 'OpenAI', id: 'openai', models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'] },
  {
    title: 'Anthropic',
    id: 'anthropic',
    models: ['claude-3-5-haiku-20241022', 'claude-3-7-sonnet-20250219', 'claude-sonnet-4-20250514'],
  },
];

router.get('/', (_req, res) => {
  res.json(providers);
});

export default router;
