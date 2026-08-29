import React from 'react';
import { Link } from '@inertiajs/react';
import { Camera } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-canvas">
            {/* Top bar */}
            <header className="border-b border-edge bg-surface">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-input bg-brand">
                            <Camera className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-none text-ink">Photobooth</p>
                            <p className="mt-0.5 text-[10px] font-medium text-ink-faint">Studio Platform</p>
                        </div>
                    </Link>
                </div>
            </header>

            {/* Body */}
            <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
                <div className="w-full max-w-md">{children}</div>
            </main>

            {/* Footer */}
            <footer className="border-t border-edge bg-surface py-4">
                <div className="mx-auto max-w-7xl px-6 text-center text-xs text-ink-faint">
                    © {new Date().getFullYear()} Photobooth Studio. Powered by Laravel & Inertia.
                </div>
            </footer>
        </div>
    );
}
