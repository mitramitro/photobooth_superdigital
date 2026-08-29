export default function Card({ className = '', children, ...props }) {
    return (
        <div {...props} className={`surface ${className}`}>
            {children}
        </div>
    );
}

export function CardHeader({ title, description, icon: Icon, actions, className = '' }) {
    return (
        <div className={`flex items-start justify-between gap-4 border-b border-edge px-5 py-4 ${className}`}>
            <div className="flex items-start gap-3 min-w-0">
                {Icon && (
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-input bg-brand-subtle">
                        <Icon className="h-4 w-4 text-brand" />
                    </div>
                )}
                <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-ink leading-tight">{title}</h3>
                    {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
                </div>
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    );
}

export function CardBody({ className = '', children }) {
    return <div className={`p-5 ${className}`}>{children}</div>;
}
