import { ChevronLeft, ChevronRight } from 'lucide-react';
import Select from './Select';

export default function Pagination({
    page = 1,
    total = 0,
    perPage = 10,
    onPageChange,
    onPerPageChange,
}) {
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const from = total === 0 ? 0 : (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    const pages = [];
    const range = (lo, hi) => {
        for (let i = lo; i <= hi; i++) pages.push(i);
    };
    range(1, 1);
    if (page > 4) pages.push('...');
    range(Math.max(2, page - 1), Math.min(totalPages - 1, page + 1));
    if (page < totalPages - 3) pages.push('...');
    if (totalPages > 1) range(totalPages, totalPages);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-edge px-4 py-3">
            <p className="text-xs text-ink-muted">
                Menampilkan <span className="font-medium text-ink">{from}</span>–
                <span className="font-medium text-ink">{to}</span> dari{' '}
                <span className="font-medium text-ink">{total}</span>
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange?.(page - 1)}
                    disabled={page <= 1}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-input border border-edge bg-white text-ink-muted hover:bg-slate-50 hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1">
                    {pages.map((p, i) =>
                        p === '...' ? (
                            <span key={`e${i}`} className="px-1 text-xs text-ink-faint">
                                …
                            </span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange?.(p)}
                                className={`h-8 min-w-8 px-2 rounded-input text-xs font-medium cursor-pointer ${
                                    p === page
                                        ? 'bg-brand text-white'
                                        : 'border border-edge bg-white text-ink-muted hover:bg-slate-50 hover:text-ink'
                                }`}
                            >
                                {p}
                            </button>
                        ),
                    )}
                </div>

                <button
                    onClick={() => onPageChange?.(page + 1)}
                    disabled={page >= totalPages}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-input border border-edge bg-white text-ink-muted hover:bg-slate-50 hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

                {onPerPageChange && (
                    <div className="ml-2 flex items-center gap-2">
                        <Select
                            value={perPage}
                            onChange={(e) => onPerPageChange(Number(e.target.value))}
                            className="w-20 text-xs h-8"
                        >
                            {[10, 25, 50, 100].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </Select>
                    </div>
                )}
            </div>
        </div>
    );
}
