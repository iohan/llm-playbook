import { Router, Request, Response } from 'express';
import resolveUserMessage from '../functions/llm/resolve-user-question';

const router = Router();
router.post('/', async (req: Request, res: Response) => {
  const history = req.body.history;
  const agentId = req.body.agentId;

  const llmResponse = await resolveUserMessage({ agentId, messages: history });

  const answer = { reply: llmResponse ?? 'Error: Unable to get a valid response from the LLM.' };
  res.json(answer);
});

export default router;
