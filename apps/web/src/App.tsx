import { useEffect, useState } from 'react';
import type { HealthStatus, Agent } from '@pkg/types';

export default function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => {});
    fetch('http://localhost:4000/api/agents')
      .then((r) => r.json())
      .then(setAgents)
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>LLM Agent Playbook (MVP)</h1>
      <section>
        <h2>Health</h2>
        <pre>{JSON.stringify(health, null, 2)}</pre>
      </section>
      <section>
        <h2>Agents</h2>
        <ul>
          {agents.map((a) => (
            <li key={a.id}>
              {a.name} — provider: {a.provider}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
