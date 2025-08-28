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
  //policy: string;
  provider: 'openai' | 'anthropic';
  //tools: string[];
  //createdAt: string;
  //updatedAt: string;
};
