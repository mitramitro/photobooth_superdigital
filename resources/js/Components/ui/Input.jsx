import { forwardRef } from 'react';

const base =
    'w-full rounded-input border bg-white px-3 text-sm text-ink placeholder:text-ink-faint shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand disabled:cursor-not-allowed disabled:opacity-50';

const errorClass = 'border-danger focus:ring-danger/30 focus:border-danger';
const okClass = 'border-edge hover:border-slate-300';

const Input = forwardRef(function Input(
    { type = 'text', error = false, errorMessage, className = '', ...props },
    ref,
) {
    if (type === 'textarea') {
        return (
            <textarea
                {...props}
                ref={ref}
                className={`${base} py-2 ${error ? errorClass : okClass} ${className}`}
            />
        );
    }

    return (
        <input
            {...props}
            type={type}
            ref={ref}
            className={`${base} h-9 ${error ? errorClass : okClass} ${className}`}
        />
    );
});

export default Input;
