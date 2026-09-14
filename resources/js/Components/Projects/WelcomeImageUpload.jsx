import React, { useEffect, useState } from 'react';
import { ImageUp } from 'lucide-react';

export default function WelcomeImageUpload({
    value = null,
    existingUrl = null,
    onChange,
    error = false,
    hint,
    inputId = 'welcome_image',
    className = '',
}) {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (value instanceof File) {
            const url = URL.createObjectURL(value);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreview(null);
    }, [value]);

    const currentUrl = preview ?? (!value ? existingUrl : null);

    return (
        <div className={className}>
            <label
                htmlFor={inputId}
                className={`group relative block aspect-video cursor-pointer overflow-hidden rounded-card border-2 border-dashed transition-colors duration-150 focus-within:ring-2 focus-within:ring-brand/40 ${
                    error
                        ? 'border-danger bg-danger-subtle/40'
                        : 'border-slate-300 bg-slate-50 hover:border-brand hover:bg-brand-subtle/40'
                }`}
            >
                <input
                    id={inputId}
                    name={inputId}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => onChange?.(e.target.files?.[0] ?? null)}
                    aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                />

                {currentUrl ? (
                    <>
                        <img
                            src={currentUrl}
                            alt="Pratinjau gambar sambutan proyek"
                            className="h-full w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ink/70 to-transparent pb-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                            <span className="inline-flex items-center gap-1.5 rounded-input bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink">
                                <ImageUp className="h-3.5 w-3.5 text-brand" />
                                Ganti gambar
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white ring-1 ring-edge">
                            <ImageUp className="h-5 w-5 text-brand" />
                        </div>
                        <p className="text-sm font-medium text-ink">Unggah gambar sambutan</p>
                        <p className="text-xs text-ink-faint">JPG, PNG, atau WEBP · maksimal 5 MB</p>
                    </div>
                )}
            </label>

            {error && (
                <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs text-danger">
                    {typeof error === 'string' ? error : 'File gambar tidak valid.'}
                </p>
            )}
            {!error && hint && (
                <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-ink-muted">
                    {hint}
                </p>
            )}
        </div>
    );
}