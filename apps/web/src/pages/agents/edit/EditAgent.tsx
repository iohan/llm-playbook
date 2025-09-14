import ContentHeader from '../../../components/reusables/ContentHeader';
import Button from '../../../components/reusables/Button';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Agent, Provider } from '@pkg/types';
import { isEqual } from 'lodash';
import Prompt from './Prompt';
import ToolsSelector from './ToolsSelector';

const EditAgent = () => {
  const [originalAgent, setOriginalAgent] = useState<Agent | null>(null);
  const [agent, setAgent] = useState<Agent>();
  const [changesMade, setChangesMade] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/agents/get-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id: Number(id) }),
    })
      .then((res) => res.json())
      .then((data) => setOriginalAgent(data));

    fetch(`/api/providers/get-providers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setProviders(data));
  }, [id]);

  useEffect(() => {
    if (!originalAgent) return;

    setAgent(JSON.parse(JSON.stringify(originalAgent)));
  }, [originalAgent]);

  useEffect(() => {
    if (changesMade) return;
    if (!originalAgent || !agent) return;
    setChangesMade(!isEqual(originalAgent, agent));
  }, [originalAgent, agent]);

  const saveAgent = async () => {
    if (!agent) return;

    await fetch(`/api/agents/update-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(agent),
    })
      .then((res) => res.json())
      .then(() => navigate('/agents'));
  };

  const updateAgentState = (param: Partial<Agent>) => {
    setAgent((prev) => (prev ? { ...prev, ...param } : prev));
  };

  return (
    <>
      <ContentHeader
        breadcrumbs={[
          { name: 'Dashboard', url: '/' },
          { name: 'Agents', url: '/agents' },
          { name: 'Edit Agent' },
        ]}
        actions={
          <>
            <Button variant="transparent" to="/agents">
              Cancel
            </Button>
            <Button disabled={!changesMade} onClick={() => saveAgent()}>
              Save
            </Button>
          </>
        }
      />
      <div className="flex">
        <div className="w-3/4">
          <div className="flex flex-col gap-3 pr-5">
            <Prompt prompt={agent?.prompt} updateAgent={updateAgentState} />
            <ToolsSelector selectedTools={agent?.tools} updateAgent={updateAgentState} />
          </div>
        </div>
        <div className="w-1/4 border-l border-gray-200 pl-5">
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-2 block text-sm">Name</label>
              <input
                type="text"
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:border-neutral-700"
                defaultValue={agent?.name}
                onChange={(e) => updateAgentState({ name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">LLM Provider</label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={agent?.providerId}
                onChange={(e) => {
                  updateAgentState({
                    providerName: undefined,
                    providerId: Number(e.target.value),
                    modelId: undefined,
                    modelName: undefined,
                  });
                }}
              >
                <option value="" disabled>
                  Select provider
                </option>
                {providers.map((provider) => (
                  <option key={`provider-${provider.id}`} value={provider.id}>
                    {provider.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm">Model</label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={agent?.modelId}
                onChange={(e) =>
                  updateAgentState({ modelName: undefined, modelId: Number(e.target.value) })
                }
              >
                <option value="" disabled>
                  Select model
                </option>
                {providers
                  .find((p) => p.id === agent?.providerId)
                  ?.models.map((model) => (
                    <option key={`model-${model.id}`} value={model.id}>
                      {model.title}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm">Description</label>
              <textarea
                className="min-h-[160px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder={'Description of the agent…'}
                value={agent?.description}
                onChange={(e) => updateAgentState({ description: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditAgent;
