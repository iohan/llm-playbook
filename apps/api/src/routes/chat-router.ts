import { Router, Request, Response } from 'express';
import resolveUserMessage from '../functions/llm/resolve-user-question';

const router = Router();
router.post('/', async (req: Request, res: Response) => {
  const history = req.body.history;
  const agentId = req.body.agentId;
  const userMessage = req.body.userMessage;

  const llmResponse = await resolveUserMessage({ agentId, messages: history, userMessage });

  console.log('Agent response:', llmResponse);

  const answer = { reply: `Hello! - ${userMessage}` };
  res.json(answer);
});

export default router;
