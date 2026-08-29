export default function Field({
    label,
    htmlFor,
    required = false,
    hint,
    error,
    className = '',
    children,
}) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    className="block text-sm font-medium text-ink"
                >
                    {label}
                    {required && <span className="text-danger ml-0.5">*</span>}
                </label>
            )}
            {children}
            {hint && !error && (
                <p className="text-xs text-ink-muted">{hint}</p>
            )}
            {error && <p className="text-xs text-danger">{error}</p>}
        </div>
    );
}
