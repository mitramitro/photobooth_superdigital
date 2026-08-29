import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';

export default function Drawer({
    open = false,
    onClose = () => {},
    title,
    description,
    icon: Icon,
    placement = 'right',
    size = 'md',
    children,
    footer,
}) {
    const sizes = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-lg', xl: 'sm:max-w-xl', '2xl': 'sm:max-w-2xl' };
    const isRight = placement === 'right';

    return (
        <Transition show={open} leave="duration-200">
            <Dialog
                as="div"
                className="fixed inset-0 z-50"
                onClose={onClose}
            >
                <TransitionChild
                    enter="ease-out duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-ink/40" />
                </TransitionChild>

                <TransitionChild
                    enter={isRight ? 'ease-out duration-200' : 'ease-out duration-200'}
                    enterFrom={isRight ? 'translate-x-full' : '-translate-x-full'}
                    enterTo="translate-x-0"
                    leave={isRight ? 'ease-in duration-150' : 'ease-in duration-150'}
                    leaveFrom="translate-x-0"
                    leaveTo={isRight ? 'translate-x-full' : '-translate-x-full'}
                >
                    <DialogPanel
                        className={`fixed inset-y-0 ${isRight ? 'right-0' : 'left-0'} flex w-full max-w-sm flex-col bg-white shadow-pop sm:max-w-md ${sizes[size]}`}
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
                                        <DialogTitle as="h3" className="text-base font-semibold text-ink leading-tight">
                                            {title}
                                        </DialogTitle>
                                        {description && (
                                            <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="shrink-0 rounded p-1 text-ink-faint hover:bg-slate-100 hover:text-ink cursor-pointer"
                                    aria-label="Tutup"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

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
