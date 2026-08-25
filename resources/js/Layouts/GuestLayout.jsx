import React from 'react';
import { Link } from '@inertiajs/react';
import { Camera, Sparkles, ShieldCheck } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
            {/* Ambient Animated RGB Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-red/15 blur-[120px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-blue/15 blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[35%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-brand-green/10 blur-[130px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

            {/* Header */}
            <header className="relative z-10 px-6 py-6 border-b border-slate-800/60 glass-panel">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-red via-brand-blue to-brand-green p-[2px] shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
                                <Camera className="w-6 h-6 text-brand-blue" />
                            </div>
                        </div>
                        <div>
                            <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                                PHOTOBOOTH<span className="text-brand-red">.</span>STUDIO
                            </span>
                            <span className="text-xs text-slate-400 block -mt-1 font-medium">
                                Next-Gen Event Platform
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-surface border border-slate-700/60 text-xs">
                            <span className="w-2 h-2 rounded-full bg-brand-green animate-ping"></span>
                            <span className="text-slate-300 font-medium">Sanctum API Engine v1.0 Ready</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Body */}
            <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-800/40">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p>© {new Date().getFullYear()} Photobooth Studio Core. Powered by Laravel 12 & Inertia React.</p>
                    <div className="flex items-center gap-4 text-slate-400">
                        <span className="hover:text-brand-blue cursor-pointer">Mobile Sanctum API</span>
                        <span>•</span>
                        <span className="hover:text-brand-green cursor-pointer">Scalar OpenAPI Docs</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

