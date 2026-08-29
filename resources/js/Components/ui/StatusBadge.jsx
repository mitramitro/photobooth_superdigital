const tones = {
    success: { bg: 'bg-success-subtle', text: 'text-success', dot: 'bg-success' },
    warning: { bg: 'bg-warning-subtle', text: 'text-warning', dot: 'bg-warning' },
    danger: { bg: 'bg-danger-subtle', text: 'text-danger', dot: 'bg-danger' },
    info: { bg: 'bg-brand-subtle', text: 'text-brand', dot: 'bg-brand' },
    neutral: { bg: 'bg-slate-100', text: 'text-ink-muted', dot: 'bg-slate-400' },
};

export default function StatusBadge({
    tone = 'neutral',
    dot = false,
    pulse = false,
    children,
    className = '',
}) {
    const t = tones[tone];
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-input px-2.5 py-0.5 text-xs font-medium ${t.bg} ${t.text} ${className}`}
        >
            {dot && (
                <span className={`h-1.5 w-1.5 rounded-full ${t.dot} ${pulse ? 'animate-pulse' : ''}`} />
            )}
            {children}
        </span>
    );
}
