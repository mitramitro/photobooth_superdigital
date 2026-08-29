export default function DefaultAvatar({ name = '?', size = 'md' }) {
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const sizes = {
        sm: 'h-7 w-7 text-xs',
        md: 'h-9 w-9 text-sm',
        lg: 'h-11 w-11 text-base',
    };
    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-brand-subtle font-semibold text-brand ${sizes[size]}`}
        >
            {initial}
        </div>
    );
}
