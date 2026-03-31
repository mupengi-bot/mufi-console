export type AgentStatus = 'online' | 'offline' | 'degraded';

export interface AgentEvent {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
  message: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  status: AgentStatus;
  model: string;
  tokensUsed: number;
  tokensLimit: number;
  lastActive: string;
  client: string;
  uptime: string;
  messagesProcessed: number;
  events: AgentEvent[];
}
