export type HealthStatus = {
  status: 'ok';
  service: 'api' | 'web';
  buildSha?: string;
  timestamp: string;
};

export type Agent = {
  id: string;
  name: string;
  prompt: string;
  description: string;
  //policy: string;
  provider: 'openai' | 'anthropic';
  //tools: string[];
  //createdAt: string;
  //updatedAt: string;
};

export type ChatRole = 'user' | 'assistant' | 'system';
export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};
