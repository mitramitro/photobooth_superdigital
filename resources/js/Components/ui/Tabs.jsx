import { useId } from 'react';

export default function Tabs({ tabs = [], active, onChange, className = '' }) {
    const uid = useId();
    const baseId = `tab-${uid.replace(/:/g, '')}`;

    return (
        <div className={`border-b border-edge ${className}`}>
            <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => {
                    const activeTab = active === tab.value;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.value}
                            id={`${baseId}-${tab.value}`}
                            onClick={() => onChange(tab.value)}
                            aria-selected={activeTab}
                            role="tab"
                            className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                                activeTab
                                    ? 'border-brand text-brand'
                                    : 'border-transparent text-ink-muted hover:border-slate-200 hover:text-ink'
                            }`}
                        >
                            {Icon && <Icon className="h-4 w-4" />}
                            {tab.label}
                            {'count' in tab && tab.count != null && (
                                <span
                                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                        activeTab ? 'bg-brand-subtle text-brand' : 'bg-slate-100 text-ink-muted'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
