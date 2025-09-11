import { Agent } from '@pkg/types';

const Prompt = ({
  prompt,
  updateAgent,
}: {
  prompt: string | undefined;
  updateAgent: (param: Partial<Agent>) => void;
}) => (
  <div>
    <label className="mb-2 block text-sm">Prompt</label>
    <textarea
      className="min-h-[260px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      value={prompt}
      onChange={(e) => updateAgent({ prompt: e.target.value })}
    />
  </div>
);

export default Prompt;
