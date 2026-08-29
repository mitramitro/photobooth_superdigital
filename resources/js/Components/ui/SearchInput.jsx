import { Search } from 'lucide-react';

export default function SearchInput({ className = '', ...props }) {
    return (
        <div className={`relative ${className}`}>
            <Search className="w-4 h-4 text-ink-faint pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
            <input
                {...props}
                type="text"
                className="w-full h-9 pl-9 pr-3 rounded-input border border-edge bg-white text-sm text-ink placeholder:text-ink-faint shadow-sm transition-colors duration-150 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
            />
        </div>
    );
}
