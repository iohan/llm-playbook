import { Agent, ChatMessage, ChatRole } from '@pkg/types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Page from './components/reusables/Page';

async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch(`/api/agents`);
  if (!res.ok) throw new Error(`Failed to fetch agents (${res.status})`);
  return res.json();
}

async function sendChat(
  agentId: string,
  messages: Pick<ChatMessage, 'role' | 'content'>[],
): Promise<{ reply: { role: ChatRole; content: string } }> {
  const res = await fetch(`/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId, messages }),
  });
  if (!res.ok) throw new Error(`Chat failed (${res.status})`);
  return res.json();
}

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

export default function AgentChatPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const selectedAgent = useMemo(
    () => agents.find((a) => a.id === selectedAgentId) ?? null,
    [agents, selectedAgentId],
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isSending]);

  useEffect(() => {
    let mounted = true;
    setLoadingAgents(true);
    fetchAgents()
      .then((rows: Agent[]) => {
        if (!mounted) return;
        setAgents(rows);
        if (rows.length && !selectedAgentId) setSelectedAgentId(rows[0]!.id);
      })
      .catch((err) => {
        if (!mounted) return;
        setAgentError(err.message ?? String(err));
      })
      .finally(() => mounted && setLoadingAgents(false));
    return () => {
      mounted = false;
    };
  }, []);

  function handleSelectAgent(id: string) {
    if (id === selectedAgentId) return;
    if (messages.length > 0) {
      const ok = confirm('Change agent? Existing conversation will reset.');
      if (!ok) return;
    }
    setSelectedAgentId(id);
    setMessages([]);
    setChatError(null);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || !selectedAgentId || isSending) return;

    setChatError(null);

    const userMsg: ChatMessage = {
      id: uuid(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((xs) => [...xs, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const payload = messages.concat(userMsg).map(({ role, content }) => ({ role, content }));

      const { reply } = await sendChat(selectedAgentId, payload);

      const botMsg: ChatMessage = {
        id: uuid(),
        role: reply.role,
        content: reply.content,
        createdAt: new Date().toISOString(),
      };
      setMessages((xs) => [...xs, botMsg]);
    } catch (err: any) {
      setChatError(err?.message ?? 'Något gick fel');
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <Page title="Agent Chat">
      <div className="h-[calc(100vh-4rem)] w-full grid grid-cols-12 gap-4 p-4">
        <aside className="col-span-12 md:col-span-3 lg:col-span-3 xl:col-span-2">
          <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur rounded-2xl shadow p-3 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Agenter</h2>
              {loadingAgents && <span className="text-xs text-zinc-500">Laddar…</span>}
            </div>

            {agentError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 mb-2">
                {agentError}
              </div>
            )}

            <div className="overflow-auto space-y-1">
              {agents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => handleSelectAgent(a.id)}
                  className={classNames(
                    'w-full text-left px-3 py-2 rounded-xl border transition',
                    selectedAgentId === a.id
                      ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 border-transparent',
                  )}
                  title={a.description ?? undefined}
                >
                  <div className="font-medium truncate">{a.name}</div>
                  {a.description && (
                    <div className="text-xs text-zinc-500 line-clamp-2">{a.description}</div>
                  )}
                </button>
              ))}

              {!loadingAgents && agents.length === 0 && (
                <div className="text-sm text-zinc-500 p-2">
                  No active agents. Create one in the Playbooks list.
                </div>
              )}
            </div>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-9 xl:col-span-10">
          <div className="h-full bg-white/70 dark:bg-zinc-900/50 backdrop-blur rounded-2xl shadow flex flex-col">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <div className="flex-1">
                <div className="text-sm text-zinc-500">Chattar med</div>
                <div className="text-lg font-semibold">
                  {selectedAgent ? selectedAgent.name : '— Choose agent in the list —'}
                </div>
              </div>
              {selectedAgent && (
                <button
                  onClick={() => {
                    if (messages.length === 0 || confirm('Clear conversation?')) {
                      setMessages([]);
                      setChatError(null);
                    }
                  }}
                  className="text-sm px-3 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {isSending && (
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-zinc-400 animate-pulse" />
                  Agent writes…
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {chatError && <div className="px-4 pb-2 text-sm text-red-600">{chatError}</div>}

            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-end gap-2">
                <textarea
                  className="flex-1 resize-none rounded-xl border border-zinc-300 dark:border-zinc-700 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-900"
                  placeholder={
                    selectedAgent
                      ? 'Type a message… (Shift+Enter = ny rad)'
                      : 'Choose an agent to begin'
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={3}
                  disabled={!selectedAgent || isSending}
                />
                <button
                  onClick={handleSend}
                  disabled={!selectedAgent || !input.trim() || isSending}
                  className={classNames(
                    'px-4 py-2 rounded-xl font-medium border transition',
                    !selectedAgent || !input.trim() || isSending
                      ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white border-indigo-600 hover:brightness-110',
                  )}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Page>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={classNames('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={classNames(
          'max-w-[80%] rounded-2xl px-4 py-3 shadow',
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm',
        )}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
        <div
          className={classNames(
            'mt-1 text-[10px] uppercase tracking-wide',
            isUser ? 'text-white/70' : 'text-zinc-500',
          )}
        >
          {isUser ? 'You' : 'Agent'} • {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
