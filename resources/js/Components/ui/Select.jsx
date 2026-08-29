import { ChevronDown } from 'lucide-react';

export default function Select({ className = '', children, ...props }) {
    return (
        <div className="relative w-full">
            <select
                {...props}
                className={`appearance-none w-full h-9 rounded-input border border-edge bg-white pl-3 pr-9 text-sm text-ink shadow-sm transition-colors duration-150 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            >
                {children}
            </select>
            <ChevronDown className="w-4 h-4 text-ink-faint pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>
    );
}
