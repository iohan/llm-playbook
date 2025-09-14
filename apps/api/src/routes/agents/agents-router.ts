import { AgentPreview } from '@pkg/types';
import { Router } from 'express';
import { insert, sql } from '../../db';
import getAgent from './get-agent';
import updateAgent from './update-agent';
import getAllAgents from './get-all-agents';

const router = Router();
router.post('/get-agent', getAgent);
router.post('/update-agent', updateAgent);
router.post('/list-agents', getAllAgents);

router.get('/name', async (_req, res) => {
  const agents = await sql<AgentPreview>('SELECT id, name FROM agents');
  res.json(agents);
});

router.post('/', async (req, res) => {
  const { name, provider, model, description } = req.body;

  const response = await insert(
    'INSERT INTO agents (user_id, name, description) VALUES (:userId, :name, :description)',
    { userId: 1, name, description },
  );

  if (!response.insertId) {
    return res.status(500).json({ message: 'Failed to create agent' });
  }

  await insert(
    'INSERT INTO agent_versions (user_id, agent_id, version, prompt, llm_provider_id, llm_model_id) VALUES (:userId, :agentId, :version, :prompt, :llm_provider_id, :llm_model_id)',
    {
      userId: 1,
      agentId: response.insertId,
      version: 1,
      prompt: '',
      llm_provider_id: provider,
      llm_model_id: model,
    },
  );

  res.status(201).json({});
});

export default router;
