import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    FolderKanban,
    Monitor,
    Image as ImageIcon,
    Receipt,
    Crown,
    Wallet,
    LogOut,
    Menu,
    X,
    Camera,
    Play,
    Bell,
    ChevronDown,
    LayoutTemplate,
    Shapes,
    Radio,
    Activity,
    Users,
    Shield,
    Settings,
    KeyRound,
    ChevronRight,
    User as UserIcon,
} from 'lucide-react';

const NAV_GROUPS = [
    {
        label: 'Workspace',
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Proyek', href: '/admin/projects', icon: FolderKanban },
            { name: 'Template', href: '/admin/templates', icon: LayoutTemplate },
            { name: 'Galeri', href: '/admin/gallery', icon: ImageIcon },
        ],
    },
    {
        label: 'Operasional',
        items: [
            { name: 'Sesi Foto', href: '/admin/sessions', icon: Camera },
            { name: 'Transaksi', href: '/admin/transactions', icon: Receipt },
            { name: 'Perangkat', href: '/admin/devices', icon: Monitor },
            { name: 'Monitoring', href: '/admin/monitoring', icon: Activity },
        ],
    },
    {
        label: 'Administrasi',
        items: [
            { name: 'Pengguna', href: '/admin/users', icon: Users },
            { name: 'Roles & Izin', href: '/admin/roles', icon: Shield },
            { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
            { name: 'API Tokens', href: '/admin/api-tokens', icon: KeyRound },
        ],
    },
    {
        label: 'Akun',
        items: [
            { name: 'Profil', href: '/profile', icon: UserIcon },
            { name: 'Langganan', href: '/admin/subscription', icon: Crown },
            { name: 'Dompet', href: '/admin/wallet', icon: Wallet },
        ],
    },
];

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);

    const currentUrl = window.location.pathname;

    const isActive = (href) => {
        if (href === '/dashboard') return currentUrl === '/dashboard' || currentUrl === '/';
        return currentUrl === href || currentUrl.startsWith(href + '/');
    };

    const NavItem = ({ item }) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
            <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                title={minimized ? item.name : undefined}
                className={`group relative flex items-center gap-2.5 rounded-input px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    minimized ? 'lg:justify-center' : 'justify-start'
                } ${
                    active
                        ? 'bg-brand-subtle text-brand-dark font-semibold'
                        : 'text-ink-muted hover:bg-slate-100 hover:text-ink'
                }`}
            >
                {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand" />
                )}
                <Icon
                    className={`h-4 w-4 shrink-0 ${active ? 'text-brand' : 'text-ink-faint group-hover:text-ink-muted'}`}
                />
                <span className={`${minimized ? 'lg:hidden' : 'block'} whitespace-nowrap`}>{item.name}</span>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-canvas text-ink flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-edge bg-surface transition-all duration-200 lg:static ${
                    minimized ? 'lg:w-[72px]' : 'lg:w-64'
                } w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Brand */}
                <div
                    className={`flex items-center border-b border-edge ${
                        minimized ? 'lg:justify-center' : 'justify-between'
                    } px-4 py-4`}
                >
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-input bg-brand">
                            <Camera className="h-4 w-4 text-white" />
                        </div>
                        <div className={`${minimized ? 'lg:hidden' : 'block'}`}>
                            <p className="text-sm font-bold leading-none text-ink">Photobooth</p>
                            <p className="mt-0.5 text-[10px] font-medium text-ink-faint">Studio Platform</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded p-1 text-ink-faint hover:bg-slate-100 lg:hidden"
                        aria-label="Tutup menu"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className={`flex-1 overflow-y-auto ${minimized ? 'lg:px-2' : 'px-3'} py-4`}>
                    <div className="space-y-5">
                        {NAV_GROUPS.map((group) => (
                            <div key={group.label}>
                                <p
                                    className={`px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-faint ${
                                        minimized ? 'lg:hidden' : 'block'
                                    }`}
                                >
                                    {group.label}
                                </p>
                                <div className="space-y-0.5">
                                    {group.items.map((item) => (
                                        <NavItem key={item.name} item={item} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </nav>

                {/* User footer */}
                <div className="border-t border-edge p-3">
                    <div
                        className={`flex items-center ${
                            minimized ? 'lg:justify-center' : 'justify-between'
                        } rounded-card p-2 transition-colors`}
                    >
                        <div className={`flex min-w-0 items-center gap-2.5 ${minimized ? 'lg:hidden' : 'flex'}`}>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-xs font-bold text-brand">
                                {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-ink">
                                    {auth?.user?.name || 'Admin Studio'}
                                </p>
                                <p className="truncate text-[10px] text-ink-faint">
                                    {auth?.user?.email || 'admin@photobooth.com'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            {minimized && (
                                <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-brand-subtle text-xs font-bold text-brand lg:flex">
                                    {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
                                </div>
                            )}
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="rounded p-1.5 text-ink-faint hover:bg-danger-subtle hover:text-danger"
                                title="Keluar"
                            >
                                <LogOut className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main column ─────────────────────────────────────── */}
            <div className="flex min-h-screen min-w-0 flex-1 flex-col">
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-edge bg-surface/90 px-4 py-3 backdrop-blur sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (window.innerWidth >= 1024) {
                                    setMinimized((v) => !v);
                                } else {
                                    setSidebarOpen(true);
                                }
                            }}
                            className="rounded-input p-2 text-ink-muted hover:bg-slate-100 hover:text-ink"
                            aria-label="Buka menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        <div className="min-w-0">
                            <p className="truncate text-[15px] font-semibold text-ink">{title}</p>
                            <nav className="hidden truncate text-xs text-ink-faint sm:block">
                                <span className="font-medium text-brand-dark">Photobooth</span>
                                <ChevronRight className="mx-1 inline h-3 w-3" />
                                <span className="capitalize">{title}</span>
                            </nav>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/kiosk"
                            className="inline-flex items-center gap-1.5 rounded-input bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-card transition-colors hover:bg-brand-dark"
                        >
                            <Play className="h-3.5 w-3.5 fill-white" />
                            Kiosk Live
                        </Link>

                        <Link
                            href="/admin/monitoring"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-input border border-edge bg-white text-ink-muted transition-colors hover:bg-slate-50 hover:text-ink"
                            title="Monitoring"
                        >
                            <Activity className="h-4 w-4" />
                        </Link>

                        <button
                            className="relative inline-flex h-9 w-9 items-center justify-center rounded-input border border-edge bg-white text-ink-muted transition-colors hover:bg-slate-50 hover:text-ink"
                            title="Notifikasi"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
                        </button>

                        <Link
                            href="/profile"
                            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-subtle text-sm font-bold text-brand transition-colors hover:bg-brand-lighter"
                        >
                            {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'A'}
                        </Link>
                    </div>
                </header>

                {/* Page body */}
                <main className="page-container flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}
