export default function Section({ title, description, icon: Icon, children, actions, className = '' }) {
    return (
        <section className={`space-y-4 ${className}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2.5">
                    {Icon && (
                        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-input bg-brand-subtle">
                            <Icon className="h-3.5 w-3.5 text-brand" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-[15px] font-semibold text-ink leading-tight">{title}</h2>
                        {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
                    </div>
                </div>
                {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
            </div>
            {children}
        </section>
    );
}
