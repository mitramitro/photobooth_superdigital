import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';

export default function Modal({
    open = false,
    onClose = () => {},
    title,
    description,
    icon: Icon,
    maxWidth = 'lg',
    children,
    footer,
    closeable = true,
}) {
    const widths = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-4xl',
    };

    return (
        <Transition show={open} leave="duration-200">
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-6"
                onClose={() => closeable && onClose()}
            >
                <TransitionChild
                    enter="ease-out duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-ink/40 backdrop-blur-[2px]" />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-200"
                    enterFrom="opacity-0 translate-y-4 scale-95"
                    enterTo="opacity-100 translate-y-0 scale-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0 scale-100"
                    leaveTo="opacity-0 translate-y-4 scale-95"
                >
                    <DialogPanel
                        className={`my-6 w-full overflow-hidden rounded-modal bg-white shadow-pop sm:mx-auto ${widths[maxWidth]}`}
                    >
                        {(title || icon) && (
                            <div className="flex items-start justify-between gap-4 border-b border-edge px-5 py-4">
                                <div className="flex items-start gap-3 min-w-0">
                                    {Icon && (
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-brand-subtle">
                                            <Icon className="h-4 w-4 text-brand" />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <DialogTitle
                                            as="h3"
                                            className="text-base font-semibold text-ink leading-tight"
                                        >
                                            {title}
                                        </DialogTitle>
                                        {description && (
                                            <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
                                        )}
                                    </div>
                                </div>
                                {closeable && (
                                    <button
                                        onClick={onClose}
                                        className="shrink-0 rounded p-1 text-ink-faint hover:bg-slate-100 hover:text-ink cursor-pointer"
                                        aria-label="Tutup"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="px-5 py-5">{children}</div>

                        {footer && (
                            <div className="flex items-center justify-end gap-2 border-t border-edge bg-slate-50/60 px-5 py-4">
                                {footer}
                            </div>
                        )}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
