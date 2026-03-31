import { useState, useCallback } from 'react';
import { Agent } from '../types/agent';

const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Atlas',
    avatar: '🤖',
    status: 'online',
    model: 'gpt-4o',
    tokensUsed: 847_200,
    tokensLimit: 1_000_000,
    lastActive: '2 min ago',
    client: 'Acme Corp',
    uptime: '14d 6h 32m',
    messagesProcessed: 28_491,
    events: [
      { id: 'e1', timestamp: '2026-03-31 22:30', type: 'info', message: 'Processed batch #4821' },
      { id: 'e2', timestamp: '2026-03-31 22:28', type: 'info', message: 'Model fallback check passed' },
      { id: 'e3', timestamp: '2026-03-31 22:15', type: 'warning', message: 'Token usage above 80%' },
      { id: 'e4', timestamp: '2026-03-31 21:50', type: 'info', message: 'Session renewed' },
      { id: 'e5', timestamp: '2026-03-31 21:30', type: 'info', message: 'Health check OK' },
    ],
  },
  {
    id: 'agent-002',
    name: 'Nova',
    avatar: '⚡',
    status: 'online',
    model: 'claude-sonnet-4-6',
    tokensUsed: 312_000,
    tokensLimit: 500_000,
    lastActive: '30 sec ago',
    client: 'TechFlow Inc',
    uptime: '7d 12h 8m',
    messagesProcessed: 15_320,
    events: [
      { id: 'e1', timestamp: '2026-03-31 22:31', type: 'info', message: 'Response generated in 1.2s' },
      { id: 'e2', timestamp: '2026-03-31 22:30', type: 'info', message: 'Context window optimized' },
      { id: 'e3', timestamp: '2026-03-31 22:20', type: 'info', message: 'New session started' },
    ],
  },
  {
    id: 'agent-003',
    name: 'Sentinel',
    avatar: '🛡️',
    status: 'degraded',
    model: 'gpt-4o-mini',
    tokensUsed: 490_000,
    tokensLimit: 500_000,
    lastActive: '5 min ago',
    client: 'SecureBank',
    uptime: '3d 1h 45m',
    messagesProcessed: 9_872,
    events: [
      { id: 'e1', timestamp: '2026-03-31 22:25', type: 'warning', message: 'Token limit approaching — auto-fallback triggered' },
      { id: 'e2', timestamp: '2026-03-31 22:20', type: 'warning', message: 'Response latency >3s' },
      { id: 'e3', timestamp: '2026-03-31 22:10', type: 'error', message: 'Primary model rate-limited, switched to fallback' },
      { id: 'e4', timestamp: '2026-03-31 22:00', type: 'info', message: 'Health check OK' },
    ],
  },
  {
    id: 'agent-004',
    name: 'Echo',
    avatar: '🔮',
    status: 'offline',
    model: 'claude-opus-4-6',
    tokensUsed: 0,
    tokensLimit: 2_000_000,
    lastActive: '3 hours ago',
    client: 'DataVault',
    uptime: '0d 0h 0m',
    messagesProcessed: 42_100,
    events: [
      { id: 'e1', timestamp: '2026-03-31 19:30', type: 'error', message: 'Connection lost — agent unreachable' },
      { id: 'e2', timestamp: '2026-03-31 19:28', type: 'warning', message: 'Heartbeat timeout (3 consecutive)' },
      { id: 'e3', timestamp: '2026-03-31 19:20', type: 'info', message: 'Processing batch #1120' },
    ],
  },
  {
    id: 'agent-005',
    name: 'Prism',
    avatar: '💎',
    status: 'online',
    model: 'gemini-2.5-pro',
    tokensUsed: 125_000,
    tokensLimit: 1_000_000,
    lastActive: '1 min ago',
    client: 'CreativeAI Ltd',
    uptime: '21d 3h 12m',
    messagesProcessed: 63_400,
    events: [
      { id: 'e1', timestamp: '2026-03-31 22:31', type: 'info', message: 'Image generation completed' },
      { id: 'e2', timestamp: '2026-03-31 22:29', type: 'info', message: 'Multi-modal pipeline active' },
    ],
  },
  {
    id: 'agent-006',
    name: 'Helix',
    avatar: '🧬',
    status: 'online',
    model: 'claude-haiku-4-5',
    tokensUsed: 58_000,
    tokensLimit: 200_000,
    lastActive: '45 sec ago',
    client: 'BioMed Research',
    uptime: '10d 18h 55m',
    messagesProcessed: 8_210,
    events: [
      { id: 'e1', timestamp: '2026-03-31 22:31', type: 'info', message: 'Query processed — low latency mode' },
      { id: 'e2', timestamp: '2026-03-31 22:30', type: 'info', message: 'Cache hit rate: 94%' },
      { id: 'e3', timestamp: '2026-03-31 22:15', type: 'info', message: 'Session auto-renewed' },
    ],
  },
];

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const selectAgent = useCallback((agent: Agent | null) => {
    setSelectedAgent(agent);
  }, []);

  const restartAgent = useCallback((id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: 'online' as const, lastActive: 'just now' } : a
      )
    );
  }, []);

  const resetSession = useCallback((id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, tokensUsed: 0, messagesProcessed: 0, lastActive: 'just now' }
          : a
      )
    );
  }, []);

  const switchModel = useCallback((id: string, model: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, model, lastActive: 'just now' } : a))
    );
  }, []);

  const stats = {
    total: agents.length,
    online: agents.filter((a) => a.status === 'online').length,
    degraded: agents.filter((a) => a.status === 'degraded').length,
    offline: agents.filter((a) => a.status === 'offline').length,
  };

  return {
    agents,
    selectedAgent,
    selectAgent,
    restartAgent,
    resetSession,
    switchModel,
    stats,
  };
}
