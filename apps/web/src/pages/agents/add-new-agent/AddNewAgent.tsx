import { Plus } from 'lucide-react';
import Modal from '../../../components/reusables/Modal';
import { useEffect, useState } from 'react';
import Button from '../../../components/reusables/Button';
import { Provider } from '@pkg/types';

const AddNewAgent = () => {
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState<Provider[] | null>(null);
  const [inputData, setInputData] = useState({
    name: '',
    provider: '',
    model: '',
    description: '',
  });

  useEffect(() => {
    fetch('/api/providers', {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setProviders(data));
  }, []);

  const saveAgent = async () => {
    const res = await fetch('/api/agents/', {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(inputData),
    });

    if (res.ok) {
      setOpen(false);
    }
    console.log(res.json());
  };

  useEffect(() => {
    console.log(providers?.map((p) => p.id));
  }, [providers]);

  return (
    <>
      <Button onClick={() => setOpen(true)} icon={Plus}>
        New Agent
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} onConfirm={saveAgent} title="Add new agent">
        <p className="mb-3">
          Create a new agent by giving it a name, selecting a provider and model, and a short
          description. You can always change these settings later.
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-2 block text-sm">Name</label>
            <input
              type="text"
              onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
              value={inputData.name}
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 dark:border-neutral-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm">LLM Provider</label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={inputData.provider}
              onChange={(e) => setInputData({ ...inputData, provider: e.target.value, model: '' })}
            >
              <option value="" disabled>
                Select provider
              </option>
              {providers?.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm">Model</label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={inputData.model}
              onChange={(e) => setInputData({ ...inputData, model: e.target.value })}
            >
              <option value="" disabled>
                {inputData.provider ? 'Select model' : 'Select provider first'}
              </option>
              {providers
                ?.find((p) => p.id === inputData.provider)
                ?.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm">Description</label>
            <textarea
              className="min-h-[160px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder={'Description of the agent…'}
              value={inputData.description}
              onChange={(e) => setInputData({ ...inputData, description: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddNewAgent;
