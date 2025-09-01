import { Agent } from '@pkg/types';
import { Router } from 'express';

const agents: Agent[] = [
  {
    id: 1,
    name: 'Billy bot',
    provider: 'anthropic',
    model: 'claude-2',
    description: 'En demo agent som pratar svenska',
    prompt: 'Hej hej hej',
    versions: [
      { version: 3.45, live: false },
      { version: 1.14, live: false },
      { version: 1.15, live: true },
    ],
    tools: [
      { id: 'fileTool', name: 'File tool' },
      { id: 'dataTool', name: 'Data Tool' },
    ],
    files: ['file1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Agent Smith',
    provider: 'openai',
    model: 'gpt-4',
    description: 'A sophisticated agent for complex tasks',
    prompt: 'You are Agent Smith, a highly intelligent AI.',
    versions: [{ version: 2.0, live: true }],
    tools: [],
    files: ['fileX', 'fileY'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    name: 'Helper Bot',
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    description: 'A friendly helper bot for everyday tasks',
    prompt: 'You are a helpful assistant.',
    versions: [{ version: 1.5, live: false }],
    tools: [],
    files: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    name: 'Data Analyzer',
    provider: 'anthropic',
    model: 'claude-instant-100k',
    description: 'An agent specialized in data analysis and insights',
    prompt: 'Analyze the following data and provide insights.',
    versions: [
      { version: 2.1, live: false },
      { version: 3.1, live: true },
      { version: 4.0, live: false },
    ],
    tools: [],
    files: ['dataFile1'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const router = Router();
router.get('/', (_req, res) => {
  res.json(agents);
});
router.get('/name', (_req, res) => {
  res.json(agents.map((agent) => ({ id: agent.id, name: agent.name })));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json(agents.find((agent) => agent.id === Number(id)));
});

router.post('/', (req, res) => {
  const { name, provider, model, description } = req.body;
  const newAgent: Agent = {
    id: agents.length + 1,
    name,
    description,
    model,
    versions: [{ version: 0.1, live: false }],
    tools: [],
    files: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    prompt: '',
    provider,
  };
  agents.push(newAgent);
  res.status(201).json(newAgent);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, tools, prompt, description, provider, model } = req.body;
  const agentIndex = agents.findIndex((agent) => agent.id === Number(id));
  if (agentIndex !== -1) {
    const createdAt = agents[agentIndex]?.createdAt ?? new Date();
    agents[agentIndex] = {
      id: Number(id),
      name,
      description,
      prompt,
      provider,
      model,
      versions: [{ version: 1.0, live: true }],
      tools,
      files: [],
      createdAt,
      updatedAt: new Date(),
    };
    res.json(agents[agentIndex]);
  } else {
    res.status(404).json({ message: 'Agent not found' });
  }
});

export default router;
