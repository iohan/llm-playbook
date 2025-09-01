import { Agent, ToolInfo } from '@pkg/types';
import Button from '../../../components/reusables/Button';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const ToolsModal = ({
  selectedTools,
  setSelectedTools,
}: {
  selectedTools: Agent['tools'];
  setSelectedTools: (tools: Agent['tools']) => void;
}) => {
  const [toolPreview, setToolPreview] = useState<ToolInfo | null>(null);
  const [availableTools, setAvailableTools] = useState<ToolInfo[]>([]);

  useEffect(() => {
    fetch(`/api/tools`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setAvailableTools(data));
  }, []);

  const Pill = ({ name, onRemove }: { name: string; onRemove: () => void }) => (
    <div className="text-sm bg-gray-100 border border-gray-400 py-1 px-3 rounded-full hover:bg-gray-200 flex items-center gap-2">
      <div>{name}</div>
      <button onClick={onRemove}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  const toggleTool = (tool: ToolInfo | null) => {
    if (!tool) return;
    if (selectedTools.some((st) => st.id === tool.id)) {
      setSelectedTools(selectedTools.filter((t) => t.id !== tool.id));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  return (
    <div>
      <div className="mb-5 text-sm text-gray-500">
        Tools are used by the agent to retrieve information and interact with external systems.
      </div>
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-4">
        {selectedTools?.map((tool) => {
          const t = availableTools.find((t) => t.id === tool.id);
          if (!t) return null;
          return <Pill key={t.id} name={t.name} onRemove={() => toggleTool(t)} />;
        })}
        {selectedTools.length === 0 && (
          <div className="text-sm text-gray-500">No tools selected</div>
        )}
      </div>
      <div className="flex flex-row gap-3">
        <select
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          onChange={(e) =>
            setToolPreview(availableTools.find((t) => t.id === e.target.value) || null)
          }
          defaultValue=""
        >
          <option value="" disabled>
            Select tool
          </option>
          {availableTools.map((tool) => (
            <option key={tool.id} value={tool.id}>
              {tool.name}
            </option>
          ))}
        </select>
        <Button onClick={() => toggleTool(toolPreview)} disabled={!toolPreview}>
          {selectedTools.some((t) => t.id === toolPreview?.id) ? 'Remove' : 'Add'}
        </Button>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <div>{toolPreview?.description}</div>
      </div>
    </div>
  );
};

export default ToolsModal;
