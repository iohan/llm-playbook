import { useEffect, useState } from 'react';
import ContentHeader from '../../../components/reusables/ContentHeader';
import { ToolInfo } from '@pkg/types';
import DataTable from '../../../components/reusables/DataTable';
import { columns } from './columns';

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
      <div className="overflow-hidden rounded-md border border-gray-300">
        <DataTable columns={columns} data={tools} />
      </div>
    </>
  );
};

export default AgentsList;
