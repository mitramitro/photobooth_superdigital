import { ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function PageHeader({
    title,
    description,
    icon: Icon,
    breadcrumbs = [],
    actions,
    className = '',
}) {
    return (
        <div className={`mb-6 ${className}`}>
            {breadcrumbs.length > 0 && (
                <nav className="mb-2 flex items-center gap-1.5 text-xs text-ink-muted">
                    {breadcrumbs.map((crumb, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                            {i > 0 && <ChevronRight className="h-3 w-3 text-ink-faint" />}
                            {crumb.href ? (
                                <Link
                                    href={crumb.href}
                                    className="hover:text-ink hover:underline cursor-pointer"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className={i === breadcrumbs.length - 1 ? 'font-medium text-ink' : ''}>
                                    {crumb.label}
                                </span>
                            )}
                        </span>
                    ))}
                </nav>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                    {Icon && (
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-brand-subtle">
                            <Icon className="h-5 w-5 text-brand" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold text-ink tracking-tight">{title}</h1>
                        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
                    </div>
                </div>
                {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
            </div>
        </div>
    );
}
