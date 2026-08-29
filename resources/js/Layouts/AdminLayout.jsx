import React, { useState, useEffect } from 'react';
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
    Play,
    ChevronDown,
} from 'lucide-react';

export default function AdminLayout({ children, title, hasLiveBooth = true }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarMinimized, setSidebarMinimized] = useState(false);

    const currentUrl = window.location.pathname;

    const navItems = [
        { name: 'Dashboard',   href: '/dashboard',            icon: LayoutDashboard, group: 'main' },
        { name: 'Proyek',      href: '/admin/projects',       icon: FolderKanban,    group: 'main' },
        { name: 'Perangkat',   href: '/admin/devices',        icon: Monitor,         group: 'main', showLiveBadge: hasLiveBooth },
        { name: 'Galery',      href: '/admin/gallery',        icon: ImageIcon,       group: 'main' },
        { name: 'Transaksi',   href: '/admin/transactions',   icon: Receipt,         group: 'main' },
        { name: 'Profile',     href: '/profile',              icon: User,            group: 'account' },
        { name: 'Langganan',   href: '/admin/subscription',   icon: Crown,           group: 'account' },
        { name: 'Dompet',      href: '/admin/wallet',         icon: Wallet,          group: 'account' },
    ];

    const mainNav    = navItems.filter(i => i.group === 'main');
    const accountNav = navItems.filter(i => i.group === 'account');

    const NavItem = ({ item }) => {
        const Icon = item.icon;
        const isActive = currentUrl === item.href || (item.href !== '/dashboard' && currentUrl.startsWith(item.href));

        return (
            <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                title={sidebarMinimized ? item.name : undefined}
                className={`
                    flex items-center ${sidebarMinimized ? 'lg:justify-center' : 'justify-between'} px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group
                    ${isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}
                `}
            >
                <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span className={`${sidebarMinimized ? 'lg:hidden' : 'block'} whitespace-nowrap`}>{item.name}</span>
                </div>

                {item.showLiveBadge && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ${sidebarMinimized ? 'lg:hidden' : 'inline-flex'}`}>
                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                    </span>
                )}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans relative">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200/80
                transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                transition-all duration-300 ease-in-out flex flex-col justify-between
                ${sidebarMinimized ? 'lg:w-20 w-64' : 'w-64'}
            `}>
                <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
                    {/* Brand Header */}
                    <div className={`flex items-center ${sidebarMinimized ? 'lg:justify-center px-4' : 'justify-between px-5'} py-5 border-b border-slate-100 transition-all`}>
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shrink-0">
                                <Camera className="w-4 h-4 text-white" />
                            </div>
                            <div className={`transition-opacity duration-300 ${sidebarMinimized ? 'lg:hidden' : 'block'}`}>
                                <h1 className="text-sm font-bold text-slate-900 leading-none whitespace-nowrap">
                                    Photobooth<span className="text-indigo-600">.</span>
                                </h1>
                                <span className="text-[10px] text-slate-400 font-medium tracking-wide whitespace-nowrap">Studio Platform</span>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Live Booth Card */}
                    {hasLiveBooth && (
                        <div className={`mx-3 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 transition-all ${sidebarMinimized ? 'lg:hidden' : 'block'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                                    <span className="text-xs font-semibold text-emerald-800">Booth Retail #01</span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white">
                                    LIVE
                                </span>
                            </div>
                            <Link
                                href="/admin/kiosk"
                                className="flex items-center justify-between w-full py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                <span>Buka Live Kiosk</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className={`flex-1 px-3 py-4 space-y-4 ${hasLiveBooth && sidebarMinimized ? 'lg:mt-6' : ''}`}>
                        {/* Main Menu */}
                        <div>
                            <p className={`px-3 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider ${sidebarMinimized ? 'lg:hidden' : 'block'}`}>Menu Utama</p>
                            <div className="space-y-0.5">
                                {mainNav.map(item => <NavItem key={item.name} item={item} />)}
                            </div>
                        </div>

                        {/* Account Menu */}
                        <div>
                            <p className={`px-3 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider ${sidebarMinimized ? 'lg:hidden' : 'block'}`}>Akun</p>
                            <div className="space-y-0.5">
                                {accountNav.map(item => <NavItem key={item.name} item={item} />)}
                            </div>
                        </div>
                    </nav>

                    {/* User Footer */}
                    <div className="p-3 border-t border-slate-100 mt-auto">
                        <div className={`flex items-center ${sidebarMinimized ? 'lg:justify-center lg:p-2 lg:bg-transparent lg:border-none' : 'justify-between'} p-2.5 rounded-xl bg-slate-50 border border-slate-200 transition-all`}>
                            <div className={`flex items-center gap-2.5 overflow-hidden ${sidebarMinimized ? 'lg:hidden' : 'flex'}`}>
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
                                    {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                                <div className="truncate">
                                    <p className="text-xs font-semibold text-slate-800 truncate">
                                        {auth?.user?.name || 'Admin Studio'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate">
                                        {auth?.user?.email || 'admin@photobooth.com'}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={typeof route !== 'undefined' ? route('logout') : '/logout'}
                                method="post"
                                as="button"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">

                {/* Topbar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (window.innerWidth >= 1024) {
                                    setSidebarMinimized(!sidebarMinimized);
                                } else {
                                    setSidebarOpen(true);
                                }
                            }}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className={`${sidebarMinimized ? 'lg:ml-2' : ''} transition-all`}>
                            <h2 className="text-base font-bold text-slate-900 leading-none">
                                {title || 'Dashboard'}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {hasLiveBooth && (
                            <Link
                                href="/admin/kiosk"
                                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                Kiosk Live
                            </Link>
                        )}
                    </div>
                </header>

                {/* Page Body */}
                <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
