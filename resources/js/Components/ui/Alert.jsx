import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const tones = {
    success: { wrap: 'border-success/40 bg-success-subtle text-success', icon: CheckCircle2 },
    warning: { wrap: 'border-warning/40 bg-warning-subtle text-warning', icon: AlertTriangle },
    error: { wrap: 'border-danger/40 bg-danger-subtle text-danger', icon: XCircle },
    info: { wrap: 'border-brand/40 bg-brand-subtle text-brand', icon: Info },
};

export default function Alert({
    tone = 'info',
    title,
    children,
    onClose,
    className = '',
}) {
    const t = tones[tone];
    const Icon = t.icon;
    return (
        <div className={`flex items-start gap-3 rounded-card border p-4 ${t.wrap} ${className}`}>
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="min-w-0 flex-1">
                {title && <p className="text-sm font-semibold">{title}</p>}
                {children && <div className="text-sm mt-0.5 opacity-90">{children}</div>}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="shrink-0 rounded p-1 opacity-70 hover:opacity-100 cursor-pointer"
                    aria-label="Tutup"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
