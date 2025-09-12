import { useEffect, useState } from 'react';
import ContentHeader from '../../../components/reusables/ContentHeader';
import { ToolInfo } from '@pkg/types';

const AgentsList = () => {
  const [tools, setTools] = useState<ToolInfo[]>([]);

  useEffect(() => {
    fetch('/api/tool-manager/list-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setTools(data));
  }, []);

  return (
    <>
      <ContentHeader breadcrumbs={[{ name: 'Dashboard', url: '/' }, { name: 'Tools' }]} />
      <div className="grid gap-4 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1">
        {tools?.map((tool) => <>{tool.name}</>)}
      </div>
    </>
  );
};

export default AgentsList;
