import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Agent } from '@pkg/types';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

const AgentsAPI = {
  list: () => api<Agent[]>(`/agents`),
  get: (id: string) => api<Agent>(`/agents/${id}`),
  create: (payload: Partial<Agent>) =>
    api<Agent>(`/agents`, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: Partial<Agent>) =>
    api<Agent>(`/agents/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  archive: (id: string) =>
    api<Agent>(`/agents/${id}`, { method: 'PATCH', body: JSON.stringify({ archived: true }) }),
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-slate-700 bg-white">
      {children}
    </span>
  );
}

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin h-5 w-5 ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export function AgentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === undefined; // route /agents/new has no :id param

  const [agent, setAgent] = useState<Agent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) {
      setAgent({ id: 'new', name: '', provider: 'openai', prompt: '' });
      return;
    }
    let active = true;
    AgentsAPI.get(id!)
      .then((a) => {
        if (active) setAgent(a);
      })
      .catch((e) => setError(e.message));
    return () => {
      active = false;
    };
  }, [id, isNew]);

  async function handleSubmit(values: Partial<Agent>) {
    try {
      setSaving(true);
      setError(null);
      if (isNew) {
        const created = await AgentsAPI.create(values);
        navigate(`/agents/${created.id}`);
      } else {
        await AgentsAPI.update(id!, values);
        navigate('/agents');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {!agent ? (
        <div className="flex items-center gap-2 text-slate-600">
          <Spinner /> Loading…
        </div>
      ) : (
        <AgentForm initial={agent} saving={saving} onSubmit={handleSubmit} />
      )}
    </>
  );
}

function AgentForm({
  initial,
  onSubmit,
  saving,
}: {
  initial: Agent;
  onSubmit: (values: Partial<Agent>) => void | Promise<void>;
  saving: boolean;
}) {
  const [name, setName] = useState(initial.name);
  const [provider, setProvider] = useState(initial.provider);
  const [prompt, setPrompt] = useState(initial.prompt);
  const isValid = name.trim().length > 0 && provider.trim().length > 0;

  useEffect(() => {
    setName(initial.name);
    setProvider(initial.provider);
    setPrompt(initial.prompt || '');
  }, [initial]);

  const providerOptions = useMemo(
    () => [
      { value: 'openai', label: 'OpenAI' },
      { value: 'anthropic', label: 'Anthropic' },
      { value: 'azure_openai', label: 'Azure OpenAI' },
      { value: 'ollama', label: 'Ollama (lokal)' },
    ],
    [],
  );

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isValid) return;
        onSubmit({ name: name.trim(), provider, prompt });
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700">Namn</label>
        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          placeholder="t.ex. Support-bot"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-xs text-slate-500">Display name for the agent</p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700">LLM-provider</label>
        <select
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          {providerOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500">Choose which LLM provider to use for this agent.</p>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700">Prompt</label>
        <textarea
          className="min-h-[160px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          placeholder={'Instructions to agent…'}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>Base-prompt for agent.</span>
          <span>{prompt.length} chars</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Link to="/agents" className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={!isValid || saving}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving && <Spinner className="h-4 w-4" />} Save agent
        </button>
      </div>
    </form>
  );
}
