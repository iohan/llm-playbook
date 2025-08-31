import { Router } from 'express';

const router = Router();

const providers = [
  { title: 'OpenAI', id: 'openai', models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'] },
  { title: 'Anthropic', id: 'anthropic', models: ['claude-2', 'claude-instant-100k'] },
];

router.get('/', (_req, res) => {
  res.json(providers);
});

export default router;
