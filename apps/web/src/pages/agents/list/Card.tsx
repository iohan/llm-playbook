import { Agent } from '@pkg/types';
import { Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

const Card = ({ agent }: { agent: Agent }) => {
  return (
    <Link
      to={`/agents/${agent.id}`}
      className="border flex flex-col border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition"
    >
      <div className="flex items-center gap-2 p-4 bg-gray-100">
        <Bot />
        <div>{agent.name}</div>
      </div>
      <div className="flex flex-wrap gap-2 px-3 py-2">
        <div className="border border-gray-200 rounded-md text-sm px-2 py-1">
          {agent.providerName}
        </div>
        <div className="border border-gray-200 rounded-md text-sm px-2 py-1">{agent.modelName}</div>
      </div>
      <div className="px-4 text-sm line-clamp-8">{agent.description}</div>
      <div className="mt-auto flex flex-wrap gap-2 px-3 py-2">
        <div className="border border-gray-200 rounded-md text-sm px-2 py-1">
          {agent.tools?.length} tools
        </div>
      </div>
    </Link>
  );
};

export default Card;
