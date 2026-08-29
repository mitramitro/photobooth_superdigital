export default function FilterBar({ children, className = '' }) {
    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>{children}</div>
    );
}

export function FilterPill({ label, options = [], value, onChange, className }) {
    return (
        <div className={`flex flex-wrap items-center gap-1 ${className}`}>
            {label && <span className="sr-only">{label}</span>}
            {options.map((opt) => {
                const active = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`inline-flex h-8 items-center rounded-input border px-3 text-xs font-medium cursor-pointer transition-colors ${
                            active
                                ? 'border-brand bg-brand text-white'
                                : 'border-edge bg-white text-ink-muted hover:border-slate-300 hover:text-ink'
                        }`}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
