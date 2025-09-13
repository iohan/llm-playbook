import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
  getSortedRowModel,
} from '@tanstack/react-table';
import { cn } from '../stateless/cn';
import { useState } from 'react';

interface ToolsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const DataTable = <TData, TValue>({ columns, data }: ToolsTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn('w-full caption-bottom text-sm')}>
        <thead data-slot="table-header" className={cn('[&_tr]:border-b')}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              data-slot="table-row"
              className={cn(
                'bg-gray-100 data-[state=selected]:bg-gray-100 border-b border-gray-300 transition-colors',
              )}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    data-slot="table-head"
                    className={cn(
                      'text-gray-950 h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0')}>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                data-slot="table-row"
                data-state={row.getIsSelected() && 'selected'}
                className={cn(
                  'hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 border-b border-gray-300 transition-colors',
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    data-slot="table-cell"
                    className={cn(
                      'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr
              data-slot="table-row"
              className={cn(
                'hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 border-b border-gray-300 transition-colors',
              )}
            >
              <td
                data-slot="table-cell"
                className={cn(
                  'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
                  'h-24 text-center',
                )}
                colSpan={columns.length}
              >
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
