import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
    title = 'Terjadi kesalahan',
    message = 'Gagal memuat data. Silakan coba lagi.',
    onRetry,
}) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-subtle">
                <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
            <p className="mt-1 max-w-sm text-sm text-ink-muted">{message}</p>
            {onRetry && (
                <Button variant="secondary" className="mt-5" onClick={onRetry}>
                    Coba lagi
                </Button>
            )}
        </div>
    );
}
