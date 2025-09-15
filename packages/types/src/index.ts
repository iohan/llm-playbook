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

export type Agent = {
  id: number;
  name: string;
  prompt?: string;
  providerId: number | undefined;
  providerName: string | undefined;
  modelId: number | undefined;
  modelName: string | undefined;
  description?: string;
  tools?: AgentTool[];
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

export type AgentTool = Omit<ToolInfo, 'active' | 'filename'>;

export type ToolInfo = {
  id: number;
  name: string;
  filename: string;
  description: string;
  active: boolean;
};
