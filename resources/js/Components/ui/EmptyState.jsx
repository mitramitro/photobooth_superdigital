export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className = '',
}) {
    return (
        <div className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}>
            {Icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Icon className="h-6 w-6 text-ink-faint" />
                </div>
            )}
            <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
            {description && (
                <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
            )}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}
