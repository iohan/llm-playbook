import { Agent, ToolInfo } from '@pkg/types';
import Button from '../../../components/reusables/Button';
import Modal from '../../../components/reusables/Modal';
import { useState } from 'react';
import ToolsModal from './ToolsModal';

const ToolsSelector = ({
  selectedTools,
  updateAgent,
}: {
  selectedTools: ToolInfo[] | undefined;
  updateAgent: (params: Partial<Agent>) => void;
}) => {
  const [toolsModalOpen, setToolsModalOpen] = useState(false);

  return (
    <div>
      <div className="mb-2 text-sm flex items-center gap-4">
        <div>Tools</div>
        <Button size="small" onClick={() => setToolsModalOpen(true)}>
          Edit
        </Button>
        {toolsModalOpen && (
          <Modal open={toolsModalOpen} onClose={() => setToolsModalOpen(false)} title="Tools">
            <ToolsModal
              selectedTools={selectedTools || []}
              setSelectedTools={(a) => updateAgent({ tools: a })}
            />
          </Modal>
        )}
      </div>
      <div className="flex">
        {selectedTools?.map((tool) => (
          <div
            key={`tool-${tool.name}`}
            className="text-sm bg-gray-100 border border-gray-400 py-1 px-3 rounded-full hover:bg-gray-200 mr-2"
            onClick={() => setToolsModalOpen(true)}
          >
            {tool.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsSelector;
