import Anthropic from '@anthropic-ai/sdk';
import { ContentBlock } from '@anthropic-ai/sdk/resources/messages.mjs';
import { Agent, Message } from '@pkg/types';
import { queryOne } from '../../db';
import ToolManager from '../../tools/ToolManager';
import getToolSchemas from '../tools/get-tool-schemas';
import { AnthropicTool } from '../../tools/Tool';

interface LLMParams {
  agent: Agent;
  messages: Message[];
}
interface LLMResponse {
  content: ContentBlock[];
  stop_reason: string | null;
  usage: any;
}

const callLLM = async (params: LLMParams): Promise<LLMResponse | undefined> => {
  console.log('Calling LLM with params:', params);
  // All run on Anthropic for now
  const provider = new Anthropic();
  const model_response = await queryOne<{ model_api_name: string }>(
    'SELECT modelApiName FROM llm_models WHERE id = :id',
    {
      id: params.agent.modelId,
    },
  );

  let tools: AnthropicTool[] = [];
  if (params.agent.tools && params.agent.tools.length > 0) {
    tools = (await getToolSchemas(params.agent.tools?.map((t) => t.id))) ?? [];
  }

  if (!model_response) throw new Error('LLM model not found');

  console.log('Using model:', model_response.model_api_name);

  const response = await provider.messages.create({
    model: model_response?.model_api_name,
    max_tokens: 2500,
    temperature: 0.2,
    system: params.agent.prompt,
    messages: params.messages,
    ...(tools.length > 0 ? { tools } : {}),
  });

  console.log('LLM response:', response);

  return { content: response.content, stop_reason: response.stop_reason, usage: response.usage };
};

export default callLLM;
