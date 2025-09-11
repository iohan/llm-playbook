import { AgentPreview } from '@pkg/types';
import { Bot, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

const Card = ({ agent }: { agent: AgentPreview }) => {
  return (
    <Link
      to={`/agents/${agent.id}`}
      className="border flex flex-col border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition"
    >
      <div className="flex items-center gap-2 p-4 bg-gray-100">
        <Bot />
        <div>{agent.name}</div>
        {agent.liveVersion && (
          <div className="ml-auto text-sm text-gray-500 flex items-center gap-1">
            <div>v{agent.liveVersion}</div>
            <Radio className="text-yellow-600 w-5" />
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 px-3 py-2">
        <div className="border border-gray-200 rounded-md text-sm px-2 py-1">{agent.provider}</div>
        <div className="border border-gray-200 rounded-md text-sm px-2 py-1">{agent.model}</div>
      </div>
      <div className="px-4 text-sm line-clamp-8">{agent.description}</div>
      <div className="mt-auto flex flex-wrap gap-2 px-3 py-2">
        <div className="border border-gray-200 rounded-md text-sm px-2 py-1">
          {agent.numTools} tools
        </div>
        <div className="border border-gray-200 rounded-md text-sm px-2 py-1">0 files</div>
        <div className="border border-gray-200 rounded-md text-sm px-2 py-1">
          v{agent.latestVersion}
        </div>
      </div>
    </Link>
  );
};

export default Card;
