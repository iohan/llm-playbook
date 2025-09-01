import ContentHeader from '../../../components/reusables/ContentHeader';
import Button from '../../../components/reusables/Button';
import Modal from '../../../components/reusables/Modal';
import { useEffect, useState } from 'react';
import ToolsModal from './ToolsModal';
import { useNavigate, useParams } from 'react-router-dom';
import { Agent } from '@pkg/types';
import { isEqual, transform, isObject } from 'lodash';

const EditAgent = () => {
  const [toolsModalOpen, setToolsModalOpen] = useState(false);
  const [originalAgent, setOriginalAgent] = useState<Agent | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [changesMade, setChangesMade] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/agents/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setOriginalAgent(data));
  }, []);

  useEffect(() => {
    if (!originalAgent) return;

    setAgent(JSON.parse(JSON.stringify(originalAgent)));
  }, [originalAgent]);

  useEffect(() => {
    if (changesMade) return;
    if (!originalAgent || !agent) return;
    setChangesMade(!isEqual(originalAgent, agent));
  }, [originalAgent, agent]);

  const updateAgent = async () => {
    if (!agent) return;
    await fetch(`/api/agents/${agent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(agent),
    })
      .then((res) => res.json())
      .then(() => navigate('/agents'));
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
            <Button disabled={!changesMade} onClick={() => updateAgent()}>
              Save
            </Button>
          </>
        }
      />
      <div className="flex">
        <div className="w-3/4">
          <div className="flex flex-col gap-3 pr-5">
            <div>
              <label className="mb-2 block text-sm">Prompt</label>
              <textarea
                className="min-h-[260px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                value={agent?.prompt}
                onChange={(e) =>
                  setAgent((prev) => (prev ? { ...prev, prompt: e.target.value } : prev))
                }
              />
            </div>
            <div>
              <div className="mb-2 text-sm flex items-center gap-4">
                <div>Tools</div>
                <Button size="small" onClick={() => setToolsModalOpen(true)}>
                  Edit
                </Button>
                {toolsModalOpen && (
                  <Modal
                    open={toolsModalOpen}
                    onClose={() => setToolsModalOpen(false)}
                    title="Tools"
                  >
                    <ToolsModal />
                  </Modal>
                )}
              </div>
              <div className="flex">
                <div className="text-sm bg-gray-100 border border-gray-400 py-1 px-3 rounded-full hover:bg-gray-200">
                  All Manager Companies
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/4 border-l border-gray-200 pl-5">
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-2 block text-sm">Name</label>
              <input
                type="text"
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:border-neutral-700"
                value={agent?.name}
                onChange={(e) =>
                  setAgent((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                }
              />
            </div>
            <div>
              <label className="mb-2 block text-sm">LLM Provider</label>
              <select className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400">
                <option value="" disabled>
                  Select provider
                </option>
                {agent?.provider && (
                  <option value={agent.provider} selected>
                    {agent.provider}
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm">Model</label>
              <select className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400">
                <option value="" disabled>
                  Select model
                </option>
                {agent?.model && (
                  <option value={agent.model} selected>
                    {agent.model}
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm">Description</label>
              <textarea
                className="min-h-[160px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                placeholder={'Description of the agent…'}
                value={agent?.description}
                onChange={(e) =>
                  setAgent((prev) => (prev ? { ...prev, description: e.target.value } : prev))
                }
              />
            </div>
            <div>
              <div className="mb-2 text-sm">Versions</div>
              <ul>
                <li className="mb-2 flex items-center justify-between rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm">
                  <span>v1.0.0</span>
                  <button className="rounded-xl bg-black px-3 py-1 text-xs text-white hover:opacity-80 transition">
                    Show
                  </button>
                </li>
                <li className="mb-2 flex items-center justify-between rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm">
                  <span>v0.9.0</span>
                  <button className="rounded-xl bg-black px-3 py-1 text-xs text-white hover:opacity-80 transition">
                    Show
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditAgent;
