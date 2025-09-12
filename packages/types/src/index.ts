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

export type Agent = BaseAgent & AgentVersion;

export type BaseAgent = {
  id: number;
  name: string;
  description: string;
};

export type AgentVersion = {
  version_id: number;
  version: number;
  live: boolean;
  locked: boolean;
  prompt: string;
  provider_id: number | undefined;
  provider: string | undefined;
  model_id: number | undefined;
  model: string | undefined;
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
  updatedAt: string;
};
