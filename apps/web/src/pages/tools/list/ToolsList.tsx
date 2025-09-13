import { useEffect, useState } from 'react';
import ContentHeader from '../../../components/reusables/ContentHeader';
import { ToolInfo } from '@pkg/types';
import DataTable from '../../../components/reusables/DataTable';
import useColumns from './columns';

export type Actions = {
  toggleActive?: (p: { id: number; row: ToolInfo }) => void;
};

const AgentsList = () => {
  const [tools, setTools] = useState<ToolInfo[]>([]);

  const actions: Actions = {
    toggleActive: (p: { id: number; row: ToolInfo }) => {
      setTools((prev) =>
        prev.map((tool) => (tool.id === p.id ? { ...tool, active: !tool.active } : tool)),
      );
      fetch('/api/tool-manager/toggle-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ toolId: p.id, state: !p.row.active }),
      });
    },
  };

  const columns = useColumns(actions);

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
