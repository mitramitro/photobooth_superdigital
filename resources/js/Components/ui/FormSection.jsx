export default function FormSection({ title, description, children, className = '' }) {
    return (
        <div className={`space-y-5 ${className}`}>
            <div>
                <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
                {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
            </div>
            <div className="space-y-5">{children}</div>
        </div>
    );
}
