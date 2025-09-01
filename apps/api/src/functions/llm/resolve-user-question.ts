import { Message } from '@pkg/types';
import getAgentById from '../agents/get-agent-by-id';
import callLLM from './call-llm';

const resolveUserMessage = async ({
  agentId,
  messages,
  userMessage,
}: {
  agentId: number;
  messages: Message[];
  userMessage: string;
}) => {
  const agent = await getAgentById(agentId);

  const llmReponse = await callLLM({ agent, messages });

  console.log('Fetched agent:', llmReponse);

  return 'Svar 2';
};

export default resolveUserMessage;
