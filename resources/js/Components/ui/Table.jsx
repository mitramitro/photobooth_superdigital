import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';

export function Th({ children, sortable, sortKey, sort, onSort, align = 'left', className = '' }) {
    const alignClass = align === 'right' ? 'text-right' : 'text-left';
    const handleClick = () => {
        if (!sortable) return;
        let next = null;
        if (sort?.key !== sortKey) next = { key: sortKey, dir: 'asc' };
        else if (sort.dir === 'asc') next = { key: sortKey, dir: 'desc' };
        else next = null;
        onSort?.(next);
    };

    return (
        <th
            scope="col"
            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted ${alignClass} ${className}`}
        >
            <button
                type="button"
                onClick={handleClick}
                disabled={!sortable}
                className={`inline-flex items-center gap-1.5 ${align === 'right' ? 'justify-end' : 'justify-start'} ${
                    sortable ? 'cursor-pointer hover:text-ink' : 'cursor-default'
                }`}
            >
                {children}
                {sortable && (
                    <span className="text-ink-faint">
                        {sort?.key === sortKey ? (
                            sort.dir === 'asc' ? (
                                <ChevronUp className="h-3.5 w-3.5 text-brand" />
                            ) : (
                                <ChevronDown className="h-3.5 w-3.5 text-brand" />
                            )
                        ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5" />
                        )}
                    </span>
                )}
            </button>
        </th>
    );
}

export function Td({ children, align = 'left', className = '' }) {
    const alignClass = align === 'right' ? 'text-right' : 'text-left';
    return <td className={`px-4 py-3 text-sm text-ink ${alignClass} ${className}`}>{children}</td>;
}

export default function Table({
    columns = [],
    rows = [],
    rowKey = 'id',
    sort,
    onSort,
    onRowClick,
    loading = false,
    emptyState,
    footer,
    className = '',
}) {
    if (loading) {
        return (
            <div className="overflow-x-auto">
                <table className={`w-full border-collapse ${className}`}>
                    <thead>
                        <tr className="border-b border-edge">
                            {columns.map((c) => (
                                <th
                                    key={c.key}
                                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted text-left"
                                >
                                    {c.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[0, 1, 2, 3].map((i) => (
                            <tr key={i} className="border-b border-edge">
                                {columns.map((c) => (
                                    <td key={c.key} className="px-4 py-3">
                                        <div className="h-4 w-full max-w-[140px] animate-pulse rounded bg-slate-100" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className={`w-full border-collapse ${className}`}>
                <thead>
                    <tr className="border-b border-edge">
                        {columns.map((c) => (
                            <Th
                                key={c.key}
                                sortable={c.sortable}
                                sortKey={c.key}
                                sort={sort}
                                onSort={onSort}
                                align={c.align}
                            >
                                {c.label}
                            </Th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-edge">
                    {rows.map((row) => (
                        <tr
                            key={row[rowKey]}
                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                            className={`transition-colors ${
                                onRowClick ? 'cursor-pointer hover:bg-slate-50' : 'hover:bg-slate-50'
                            }`}
                        >
                            {columns.map((c) => (
                                <Td key={c.key} align={c.align}>
                                    {c.render ? c.render(row) : row[c.key]}
                                </Td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {footer}
        </div>
    );
}
