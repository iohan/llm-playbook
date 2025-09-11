import { Agent, AgentPreview } from '@pkg/types';
import { Router } from 'express';
import { insert, sql } from '../db';

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
router.get('/', async (_req, res) => {
  const sqlQuery = `SELECT
      a.id,
      a.name,
      a.description,
      lp.provider_name AS provider,
      lm.model_name AS model,
      av.version AS latestVersion,
      live.version AS liveVersion,
      COUNT(agt.id) AS numTools
    FROM
      agents a
      INNER JOIN (
        SELECT
          agent_id,
          MAX(created_at) AS latest_created
        FROM
          agent_versions
        GROUP BY
          agent_id) latest ON latest.agent_id = a.id
      LEFT JOIN (
        SELECT
          agent_id,
          version
        FROM
          agent_versions
        WHERE
          live = 1) live ON live.agent_id = a.id
      INNER JOIN agent_versions av ON av.agent_id = a.id
        AND av.created_at = latest.latest_created
      INNER JOIN llm_models lm ON lm.id = av.llm_model_id
      INNER JOIN llm_providers lp ON lp.id = av.llm_provider_id
      LEFT JOIN agent_tools agt ON agt.agent_version_id = av.id
    GROUP BY
      a.id,
      av.id;`;

  const response = await sql<AgentPreview>(sqlQuery);
  res.json(response);
});
router.get('/name', (_req, res) => {
  res.json(agents.map((agent) => ({ id: agent.id, name: agent.name })));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json(agents.find((agent) => agent.id === Number(id)));
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
