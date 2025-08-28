import { Router } from 'express';

const router = Router();
router.post('/', (_req, res) => {
  const answer = { reply: { role: 'assistant', content: 'Hello!' } };
  res.json(answer);
});

export default router;
