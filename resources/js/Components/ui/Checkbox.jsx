import { forwardRef } from 'react';

const Checkbox = forwardRef(function Checkbox(
    { label, description, className = '', ...props },
    ref,
) {
    return (
        <label className={`flex items-start gap-2.5 cursor-pointer ${className}`}>
            <input
                {...props}
                ref={ref}
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-edge text-brand focus:ring-brand/40 cursor-pointer"
            />
            <span className="flex flex-col">
                {label && <span className="text-sm font-medium text-ink">{label}</span>}
                {description && (
                    <span className="text-xs text-ink-muted">{description}</span>
                )}
            </span>
        </label>
    );
});

export default Checkbox;
