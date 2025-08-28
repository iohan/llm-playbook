import { Agent } from '@pkg/types';
import { Router } from 'express';

const agents: Agent[] = [
  {
    id: '1',
    name: 'Demo 2',
    provider: 'anthropic',
    description: 'En demo agent som pratar svenska',
    prompt: 'Hej hej hej',
  },
  {
    id: '2',
    name: 'Demo 1',
    provider: 'openai',
    description: 'A demo agent that speaks English',
    prompt: 'Hello hello hello',
  },
];

const router = Router();
router.get('/', (_req, res) => {
  res.json(agents);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json(agents.find((agent) => agent.id === id));
});

router.post('/', (req, res) => {
  const { name, prompt, provider } = req.body;
  const newAgent: Agent = {
    id: (agents.length + 1).toString(),
    name,
    description: '',
    prompt,
    provider,
  };
  agents.push(newAgent);
  res.status(201).json(newAgent);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, prompt, description, provider } = req.body;
  const agentIndex = agents.findIndex((agent) => agent.id === id);
  if (agentIndex !== -1) {
    agents[agentIndex] = { id, name, description, prompt, provider };
    res.json(agents[agentIndex]);
  } else {
    res.status(404).json({ message: 'Agent not found' });
  }
});

export default router;
