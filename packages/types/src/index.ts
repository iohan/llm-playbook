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
  tools: string[];
  files: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Provider = {
  title: string;
  id: string;
  models: string[];
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
