import Card from './Card';
import { useEffect, useState } from 'react';
import { Agent } from '@pkg/types';
import ContentHeader from '../../../components/reusables/ContentHeader';
import AddNewAgent from '../add/AddNewAgent';

const AgentsList = () => {
  const [agents, setAgents] = useState<Agent[] | null>(null);

  useEffect(() => {
    fetch('/api/agents', {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setAgents(data));
  }, []);

  return (
    <>
      <ContentHeader
        breadcrumbs={[{ name: 'Dashboard', url: '/' }, { name: 'Agents' }]}
        actions={<AddNewAgent />}
      />
      <div className="grid gap-4 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1">
        {agents?.map((agent) => <Card key={agent.id} agent={agent} />)}
      </div>
    </>
  );
};

export default AgentsList;
