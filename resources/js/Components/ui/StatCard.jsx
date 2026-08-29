import { TrendingUp, TrendingDown } from 'lucide-react';

const tones = {
    blue: 'bg-brand-subtle text-brand',
    green: 'bg-success-subtle text-success',
    red: 'bg-danger-subtle text-danger',
    amber: 'bg-warning-subtle text-warning',
    slate: 'bg-slate-100 text-ink-muted',
};

export default function StatCard({
    label,
    value,
    icon: Icon,
    tone = 'slate',
    hint,
    delta,
    deltaUp = true,
}) {
    return (
        <div className="surface p-5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-muted">{label}</span>
                {Icon && (
                    <div className={`flex h-8 w-8 items-center justify-center rounded-input ${tones[tone]}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                )}
            </div>
            <div className="mt-2 flex items-end justify-between gap-2">
                <span className="text-2xl font-bold text-ink tracking-tight">{value}</span>
                {delta && (
                    <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                            deltaUp ? 'text-success' : 'text-danger'
                        }`}
                    >
                        {deltaUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {delta}
                    </span>
                )}
            </div>
            {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
        </div>
    );
}
