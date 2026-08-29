import { Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

export default function PhotoThumbnail({
    src,
    alt,
    aspect = 'video',
    overlay,
    badge,
    selected = false,
    onSelect,
    className = '',
}) {
    const [error, setError] = useState(false);
    const aspectClass = {
        square: 'aspect-square',
        video: 'aspect-[4/3]',
        portrait: 'aspect-[3/4]',
    }[aspect];

    return (
        <div
            className={`group relative overflow-hidden rounded-card border bg-slate-100 ${aspectClass} ${selected ? 'border-brand ring-2 ring-brand/40' : 'border-edge'} ${onSelect ? 'cursor-pointer' : ''} ${className}`}
            onClick={onSelect}
        >
            {!error ? (
                <img
                    src={src}
                    alt={alt || ''}
                    loading="lazy"
                    onError={() => setError(true)}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-ink-faint">
                    <ImageIcon className="h-6 w-6" />
                </div>
            )}

            {overlay && (
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {overlay}
                </div>
            )}

            {badge && (
                <div className="absolute left-2 top-2">
                    <span className="rounded-input bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink shadow-sm">
                        {badge}
                    </span>
                </div>
            )}

            {onSelect && (
                <div
                    className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded border-2 bg-white ${
                        selected ? 'border-brand bg-brand' : 'border-slate-300'
                    }`}
                >
                    {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                </div>
            )}
        </div>
    );
}
