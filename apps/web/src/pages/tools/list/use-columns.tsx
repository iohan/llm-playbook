import { ToolInfo } from '@pkg/types';
import { ColumnDef } from '@tanstack/react-table';
import Switch from '../../../components/reusables/Switch';
import { ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Actions, Tool } from './ToolsList';

const useColumns = <A extends Actions>(actions: A) => {
  const columns: ColumnDef<Tool>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <div
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-2 hover:cursor-pointer"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        );
      },
      cell: ({ row }) => {
        const tool = row.original;
        return (
          <Link to={`/tools/${tool.id}`} className="font-medium hover:cursor-pointer">
            {row.getValue('name')}
          </Link>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'used',
      header: () => {
        return <div className="flex justify-center">Used by Agents</div>;
      },
      cell: ({ row }) => {
        return <div className="flex justify-center">{row.getValue('used')}</div>;
      },
    },
    {
      accessorKey: 'active',
      header: 'Active',
      cell: ({ row }) => {
        const tool = row.original;

        return (
          <Switch
            checked={tool.active}
            disabled={tool.used > 0}
            onToggle={() => actions.toggleActive?.({ id: tool.id, row: tool })}
          />
        );
      },
    },
  ];
  return columns;
};

export default useColumns;
