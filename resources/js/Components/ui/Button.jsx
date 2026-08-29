import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark shadow-card focus-visible:ring-brand',
    secondary: 'bg-white text-ink border border-edge hover:bg-slate-50 hover:border-slate-300',
    ghost: 'bg-transparent text-ink-muted hover:bg-slate-100 hover:text-ink',
    destructive: 'bg-danger text-white hover:bg-red-700',
    'outline-destructive': 'bg-white text-danger border border-danger/40 hover:bg-danger-subtle',
};

const sizes = {
    xs: 'h-7 px-2.5 text-xs gap-1.5',
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
    lg: 'h-10 px-5 text-sm gap-2',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    className = '',
    children,
    disabled,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center rounded-input font-semibold whitespace-nowrap transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                Icon && <Icon className="w-4 h-4" />
            )}
            {children}
        </button>
    );
}
