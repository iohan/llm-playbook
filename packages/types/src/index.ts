export type HealthStatus = {
  status: 'ok';
  service: 'api' | 'web';
  buildSha?: string;
  timestamp: string;
};

export type AgentPreview = {
  id: number;
  name: string;
  description: string;
  provider: string;
  model: string;
  numTools: number;
  latestVersion: number;
  liveVersion: number | null;
};

export type Agent = BaseAgent & {
  latestVersion: AgentVersion;
};

export type BaseAgent = {
  id: number;
  name: string;
  description: string;
};

export type AgentVersion = {
  id: number;
  version: number;
  live: boolean;
  locked: boolean;
  prompt: string;
  provider_id: number;
  provider: string;
  model_id: number;
  model: string;
  tools?: ToolInfo[];
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
  id: number;
  name: string;
  slug: string;
  description: string;
  inputSchema: object;
};
