import React from 'react';

type RowData = Record<string, any>;

type Column<T extends RowData> = {
    key: keyof T | string;
    header: React.ReactNode;
    render?: (value: any, row: T, rowIndex: number) => React.ReactNode;
};

type TableProps<T extends RowData> = {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    emptyMessage?: string;
    striped?: boolean;
    skeletonRows?: number;
};

export default function Table<T extends RowData>({
    columns,
    data,
    loading = false,
    emptyMessage = 'No data found',
    striped = true,
    skeletonRows = 5
}: TableProps<T>) {
    return (
        <div className="m-10 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-200 bg-slate-100">
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        loading ? (
                            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-slate-100">
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className="px-5 py-4">
                                            <div className="h-4 w-full animate-pulse rounded bg-slate-200"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) :
                            data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-5 py-10 text-center text-slate-400">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, rowIndex) => (
                                    <tr
                                        key={(row as any).id ?? rowIndex}
                                        className={`border-b border-slate-100 transition-colors hover:bg-slate-100 cursor-pointer ${striped && rowIndex % 2 === 1 ? 'bg-slate-50/40' : ''}`}
                                    >
                                        {columns.map((col) => {
                                            const value = (row as any)[col.key as string];
                                            return (
                                                <td key={String(col.key)} className="px-5 py-4 text-slate-700">
                                                    {col.render ? col.render(value, row, rowIndex) : value}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                </tbody>
            </table>
        </div>
    );
}

// Example Usage:
// type User = { id: number; name: string; email: string; status: string };
// const columns: Column<User>[] = [
//   { key: 'name', header: 'Name' },
//   { key: 'email', header: 'Email' },
//   {
//     key: 'status',
//     header: 'Status',
//     render: (value) => (
//       <span className={`px-2 py-1 rounded-full text-xs ${value === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//         {value}
//       </span>
//     ),
//   },
// ];
// <ReusableTable<User> columns={columns} data={rows} />
