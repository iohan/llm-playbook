export type HealthStatus = {
  status: 'ok';
  service: 'api' | 'web';
  buildSha?: string;
  timestamp: string;
};

export type Agent = {
  id: number;
  name: string;
  prompt: string;
  description: string;
  provider: string;
  model: string;
  versions: { version: number; live: boolean }[];
  tools: Pick<ToolInfo, 'id' | 'name'>[];
  files: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type Provider = {
  title: string;
  id: number;
  models: { title: string; id: number }[];
};

export type ChatRole = 'user' | 'assistant' | 'system';
export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ToolInfo = {
  id: string;
  name: string;
  description: string;
};
