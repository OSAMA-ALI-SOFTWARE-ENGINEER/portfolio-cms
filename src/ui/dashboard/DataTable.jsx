import React from "react";

const DataTable = ({ columns, data, isLoading, emptyMessage = "No data found" }) => {
    if (isLoading) {
        return (
            <div className="w-full animate-pulse space-y-4">
                <div className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-12 w-full rounded-xl bg-gray-200 dark:bg-gray-700"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="glass flex h-64 w-full flex-col items-center justify-center rounded-xl p-8 text-center text-gray-500">
                <p className="text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="glass flex min-h-[75vh] w-full flex-col overflow-hidden rounded-xl border border-white/10 shadow-lg backdrop-blur-md">
            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50/50 text-xs uppercase text-gray-700 dark:bg-gray-700/50 dark:text-gray-400">
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index} scope="col" className="px-6 py-4 font-bold tracking-wider">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className="transition-colors duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
