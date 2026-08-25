import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    FolderKanban, 
    Monitor, 
    Image as ImageIcon, 
    Receipt, 
    User, 
    Crown, 
    Wallet, 
    LogOut, 
    Menu, 
    X, 
    Radio, 
    ChevronRight,
    Camera,
    Play
} from 'lucide-react';

export default function AdminLayout({ children, title, hasLiveBooth = true }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const currentUrl = window.location.pathname;

    // Sidebar items according to Whimsical Diagram Architecture
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, accent: 'blue' },
        { name: 'Proyek', href: '/admin/projects', icon: FolderKanban, accent: 'red' },
        { name: 'Perangkat', href: '/admin/devices', icon: Monitor, accent: 'green', showLiveBadge: hasLiveBooth },
        { name: 'Galery', href: '/admin/gallery', icon: ImageIcon, accent: 'blue' },
        { name: 'Transaksi', href: '/admin/transactions', icon: Receipt, accent: 'green' },
        { name: 'Profile', href: '/profile', icon: User, accent: 'blue' },
        { name: 'Langganan', href: '/admin/subscription', icon: Crown, accent: 'red' },
        { name: 'Dompet', href: '/admin/wallet', icon: Wallet, accent: 'green' },
    ];

    return (
        <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
            {/* Ambient RGB Lighting Orbs */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="fixed bottom-0 right-1/4 w-[30rem] h-[30rem] bg-brand-blue/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="fixed top-1/2 left-0 w-80 h-80 bg-brand-green/10 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="flex flex-1 z-10">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar Navigation */}
                <aside className={`
                    fixed lg:static inset-y-0 left-0 z-50 w-72 bg-brand-surface/95 border-r border-slate-800/80 
                    transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 
                    transition-transform duration-300 ease-in-out flex flex-col justify-between backdrop-blur-xl
                `}>
                    <div>
                        {/* Sidebar Brand Header */}
                        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
                            <Link href="/dashboard" className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-red via-brand-blue to-brand-green p-[2px] shadow-md">
                                    <div className="w-full h-full bg-brand-dark rounded-[10px] flex items-center justify-center">
                                        <Camera className="w-5 h-5 text-brand-blue animate-pulse-slow" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">
                                        PHOTOBOOTH<span className="text-brand-red">.</span>
                                    </h1>
                                    <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                                        Studio Platform
                                    </span>
                                </div>
                            </Link>

                            <button 
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Active Live Kiosk Quick Card (Conditioned on live booth) */}
                        {hasLiveBooth && (
                            <div className="p-3.5 mx-3.5 my-3 rounded-xl glass-panel border border-brand-red/30 bg-gradient-to-r from-brand-red/10 via-transparent to-brand-blue/10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Radio className="w-3.5 h-3.5 text-brand-red animate-pulse" />
                                        <span className="text-xs font-bold text-slate-200">Booth Retail #01</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-brand-red/20 text-brand-red border border-brand-red/40 animate-pulse">
                                        LIVE
                                    </span>
                                </div>
                                <Link 
                                    href="/admin/kiosk"
                                    className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg bg-brand-red text-white text-xs font-bold shadow-lg shadow-brand-red/20 hover:bg-brand-red-hover transition-colors"
                                >
                                    <span>Buka Live Kiosk</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}

                        {/* Navigation Menu */}
                        <nav className="px-3 py-2 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentUrl === item.href || (item.href !== '/dashboard' && currentUrl.startsWith(item.href));
                                
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`
                                            flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                                            ${isActive 
                                                ? 'bg-brand-card text-white shadow-md border border-slate-700/60 font-bold' 
                                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`
                                                w-4 h-4 transition-colors
                                                ${isActive 
                                                    ? item.accent === 'red' ? 'text-brand-red' : item.accent === 'green' ? 'text-brand-green' : 'text-brand-blue'
                                                    : 'text-slate-400 group-hover:text-slate-200'}
                                            `} />
                                            <span>{item.name}</span>
                                        </div>

                                        {/* Show LIVE badge ONLY if showLiveBadge is true */}
                                        {item.showLiveBadge && (
                                            <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-brand-red text-white shadow-sm shadow-brand-red/40 animate-pulse">
                                                LIVE
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Sidebar Footer User Info */}
                    <div className="p-4 border-t border-slate-800/80">
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-brand-card/60 border border-slate-800">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-green p-[2px] shrink-0">
                                    <div className="w-full h-full bg-brand-surface rounded-[6px] flex items-center justify-center font-bold text-white text-xs">
                                        {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
                                    </div>
                                </div>
                                <div className="truncate">
                                    <p className="text-xs font-bold text-white truncate">
                                        {auth?.user?.name || 'Admin Studio'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate">
                                        {auth?.user?.email || 'admin@photobooth.com'}
                                    </p>
                                </div>
                            </div>

                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button"
                                className="p-2 rounded-lg text-slate-400 hover:text-brand-red hover:bg-brand-red/10 transition-colors shrink-0"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Topbar Navbar */}
                    <header className="sticky top-0 z-30 px-6 py-4 border-b border-slate-800/80 bg-brand-dark/80 backdrop-blur-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    {title || 'Dashboard'}
                                </h2>
                            </div>
                        </div>

                        {/* Topbar Right Actions */}
                        <div className="flex items-center gap-3">
                            {hasLiveBooth && (
                                <Link
                                    href="/admin/kiosk"
                                    className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-red text-white text-xs font-bold shadow-lg shadow-brand-red/20 hover:bg-brand-red-hover transition-colors"
                                >
                                    <Play className="w-3.5 h-3.5 fill-white" />
                                    <span>Kiosk Live</span>
                                </Link>
                            )}
                        </div>
                    </header>

                    {/* Page Body */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
