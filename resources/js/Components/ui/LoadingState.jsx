export default function LoadingState({ label = 'Memuat data…' }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand/60" />
                <span
                    className="h-2 w-2 animate-bounce rounded-full bg-brand/60"
                    style={{ animationDelay: '0.1s' }}
                />
                <span
                    className="h-2 w-2 animate-bounce rounded-full bg-brand/60"
                    style={{ animationDelay: '0.2s' }}
                />
            </div>
            <p className="text-sm text-ink-muted">{label}</p>
        </div>
    );
}
