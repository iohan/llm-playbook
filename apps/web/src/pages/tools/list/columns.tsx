import { ToolInfo } from '@pkg/types';
import { ColumnDef } from '@tanstack/react-table';
import Switch from '../../../components/reusables/Switch';
import { ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Actions } from './ToolsList';

const useColumns = <A extends Actions>(actions: A) => {
  const columns: ColumnDef<ToolInfo>[] = [
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
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'));
        return date.toLocaleString('sv-SE', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
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
            onToggle={() => actions.toggleActive?.({ id: tool.id, row: tool })}
          />
        );
      },
    },
  ];
  return columns;
};

export default useColumns;
