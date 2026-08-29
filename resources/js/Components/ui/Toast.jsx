import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext({ toast: () => {} });

const tones = {
    success: { wrap: 'border-l-success bg-white', text: 'text-success', icon: CheckCircle2 },
    warning: { wrap: 'border-l-warning bg-white', text: 'text-warning', icon: AlertTriangle },
    error: { wrap: 'border-l-danger bg-white', text: 'text-danger', icon: XCircle },
    info: { wrap: 'border-l-brand bg-white', text: 'text-brand', icon: Info },
};

let idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback(
        ({ tone = 'info', title, message, duration = 4000 }) => {
            const id = ++idCounter;
            setToasts((prev) => [...prev, { id, tone, title, message }]);
            if (duration) {
                setTimeout(() => dismiss(id), duration);
            }
        },
        [dismiss],
    );

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
                {toasts.map((t) => {
                    const tone = tones[t.tone];
                    const Icon = tone.icon;
                    return (
                        <div
                            key={t.id}
                            className={`pointer-events-auto flex items-start gap-3 rounded-card border border-l-4 border-edge p-4 shadow-pop ${tone.wrap}`}
                        >
                            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone.text}`} />
                            <div className="min-w-0 flex-1">
                                {t.title && <p className="text-sm font-semibold text-ink">{t.title}</p>}
                                {t.message && <p className="text-sm text-ink-muted mt-0.5">{t.message}</p>}
                            </div>
                            <button
                                onClick={() => dismiss(t.id)}
                                className="shrink-0 rounded p-1 text-ink-faint hover:text-ink cursor-pointer"
                                aria-label="Tutup"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
