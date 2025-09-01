import { Router, Request, Response } from 'express';

const router = Router();
router.post('/', (req: Request, res: Response) => {
  const userMessage = req.body.message;
  const answer = { reply: `Hello! - ${userMessage}` };
  res.json(answer);
});

export default router;
