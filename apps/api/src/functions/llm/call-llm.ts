import { Agent, Message } from '@pkg/types';

interface LLMParams {
  agent: Agent;
  messages: Message[];
}

const callLLM = async (params: LLMParams): Promise<string> => {
  return `LLM response to prompt`;
};

export default callLLM;
