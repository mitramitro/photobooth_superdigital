import React from 'react';
import { Link } from '@inertiajs/react';
import { Camera, ArrowRight } from 'lucide-react';

export default function LandingLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-canvas">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b border-edge bg-surface/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-input bg-brand">
                            <Camera className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-none text-ink">Photobooth</p>
                            <p className="mt-0.5 text-[10px] font-medium text-ink-faint">Studio Platform</p>
                        </div>
                    </Link>

                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-1.5 rounded-input bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
                    >
                        Masuk
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </header>

            {/* Body */}
            <main className="flex flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t border-edge bg-surface py-4">
                <div className="mx-auto max-w-7xl px-6 text-center text-xs text-ink-faint">
                    © {new Date().getFullYear()} Photobooth Studio. Powered by Laravel & Inertia.
                </div>
            </footer>
        </div>
    );
}
