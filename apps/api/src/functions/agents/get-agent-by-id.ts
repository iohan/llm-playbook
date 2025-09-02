import { Agent } from '@pkg/types';

const getAgentById = async (agentId: number): Promise<Agent> => {
  // Simulate fetching agent data from a database or external service
  return {
    id: agentId,
    name: 'Sample Agent',
    prompt: 'Du är en hjälpsam assistent som alltid svarar på svenska.',
    description: 'A sample agent for demonstration purposes.',
    provider: 'anthropic',
    model: 'claude-3-5-haiku-20241022',
    versions: [{ version: 1, live: true }],
    tools: [
      { id: 'dataTool', name: 'Tool A' },
      { id: 'chartTool', name: 'Tool B' },
    ],
    files: ['file1.txt', 'file2.txt'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export default getAgentById;
