import { Agent, AgentPreview } from '@pkg/types';
import { Router } from 'express';
import { insert, queryOne, sql } from '../../db';
import getAgent from './get-agent';

const router = Router();
router.post('/get-agent', getAgent);
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
router.get('/name', async (_req, res) => {
  const agents = await sql<AgentPreview>('SELECT id, name FROM agents');
  res.json(agents);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const sqlQuery = `SELECT
      a.id,
      a.name,
      a.description,
      av.prompt,
      av.llm_provider_id as provider,
      av.llm_model_id as model
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
      INNER JOIN agent_versions av ON av.agent_id = a.id
        AND av.created_at = latest.latest_created
    WHERE a.id = :id;`;

  const agent = await queryOne<Agent>(sqlQuery, { id: Number(id) });

  res.json({ ...agent, versions: [{ version: 1.0, live: true }], tools: [], files: [] });
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
