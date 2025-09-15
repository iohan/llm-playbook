import { Message } from '@pkg/types';
import getAgentById from '../agents/get-agent-by-id';
import callLLM from './call-llm';

const resolveUserMessage = async ({
  agentId,
  messages,
}: {
  agentId: number;
  messages: Message[];
}) => {
  const agent = await getAgentById(agentId);
  console.log('Agent:', JSON.stringify(agent, null, 2));

  if (!agent) throw new Error('Agent not found');
  const { content, stop_reason, usage } = await callLLM({ agent, messages });
  // Usage can be logged or processed further if needed

  if ((stop_reason === 'end_turn' || stop_reason === 'max_tokens') && content[0]?.type === 'text') {
    return content[0]?.text;
  }

  return null;
};

export default resolveUserMessage;
