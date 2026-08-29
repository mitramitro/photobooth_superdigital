export default function Switch({
    checked = false,
    onChange,
    label,
    description,
    disabled = false,
    className = '',
}) {
    return (
        <label className={`flex items-start justify-between gap-3 cursor-pointer ${className}`}>
            <span className="flex flex-col">
                {label && <span className="text-sm font-medium text-ink">{label}</span>}
                {description && (
                    <span className="text-xs text-ink-muted mt-0.5">{description}</span>
                )}
            </span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150 cursor-pointer disabled:opacity-50 ${
                    checked ? 'bg-brand' : 'bg-slate-300'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-150 ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </label>
    );
}
