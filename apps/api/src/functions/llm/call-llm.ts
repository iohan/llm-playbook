import Anthropic from '@anthropic-ai/sdk';
import { ContentBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import { Agent, Message } from '@pkg/types';
import dotenv from 'dotenv';

dotenv.config();

interface LLMParams {
  agent: Agent;
  messages: Message[];
}
interface LLMResponse {
  content: ContentBlock[];
  stop_reason: string | null;
  usage: any;
}

const callLLM = async (params: LLMParams): Promise<LLMResponse> => {
  console.log('Calling LLM with params:', params);
  // All run on Anthropic for now
  const provider = new Anthropic();

  const response = await provider.messages.create({
    model: params.agent.model || 'claude-3-5-haiku-20241022',
    max_tokens: 1000,
    temperature: 0.2,
    system: params.agent.prompt,
    messages: params.messages,
  });

  console.log('LLM response:', response);

  return { content: response.content, stop_reason: response.stop_reason, usage: response.usage };
};

export default callLLM;
