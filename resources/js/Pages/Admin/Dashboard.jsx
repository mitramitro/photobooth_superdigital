import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Camera, 
    Printer, 
    Monitor, 
    Smartphone, 
    Sparkles, 
    Play, 
    QrCode, 
    Download, 
    RefreshCw, 
    CheckCircle2, 
    Clock, 
    Layers, 
    Activity,
    Sliders,
    Zap
} from 'lucide-react';

export default function Dashboard() {
    const [filterBooth, setFilterBooth] = useState('all');

    const stats = [
        { title: 'Total Sesi Foto', value: '1,428', change: '+18.4% hari ini', icon: Camera, color: 'red', border: 'border-brand-red/40', text: 'text-brand-red', bg: 'bg-brand-red/10' },
        { title: 'Foto Dicetak', value: '3,890', change: '99.4% printer ready', icon: Printer, color: 'green', border: 'border-brand-green/40', text: 'text-brand-green', bg: 'bg-brand-green/10' },
        { title: 'Photobooth Aktif', value: '4 Booths', change: 'Main Hall & VIP Zone', icon: Monitor, color: 'blue', border: 'border-brand-blue/40', text: 'text-brand-blue', bg: 'bg-brand-blue/10' },
        { title: 'Mobile Sanctum Calls', value: '24.5k', change: 'Latency 12ms', icon: Smartphone, color: 'cyan', border: 'border-cyan-500/40', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    ];

    const recentSessions = [
        { id: 'SESH-8891', booth: 'Booth #01 Main Hall', template: 'Cyberpunk Neon 4-Strip', photos: 4, time: '2 mins ago', status: 'Printed', statusColor: 'green' },
        { id: 'SESH-8890', booth: 'Booth #02 VIP Stage', template: 'Classic Wedding Elegant', photos: 3, time: '5 mins ago', status: 'Printed', statusColor: 'green' },
        { id: 'SESH-8889', booth: 'Booth #01 Main Hall', template: 'Birthday Retro Vintage', photos: 4, time: '9 mins ago', status: 'Processing', statusColor: 'blue' },
        { id: 'SESH-8888', booth: 'Booth #03 Lounge Bar', template: 'Cyberpunk Neon 4-Strip', photos: 4, time: '14 mins ago', status: 'Capturing', statusColor: 'red' },
        { id: 'SESH-8887', booth: 'Booth #04 Outdoor Deck', template: 'Minimalist Black & White', photos: 2, time: '22 mins ago', status: 'Printed', statusColor: 'green' },
    ];

    return (
        <AdminLayout title="Dashboard Control Center">
            <Head title="Admin Dashboard - Photobooth Studio" />

            {/* Quick Hero Banner */}
            <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-700/80 bg-gradient-to-r from-brand-red/15 via-brand-blue/10 to-brand-green/15 relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-slate-700 text-xs font-bold text-gradient-rgb mb-3">
                            <Zap className="w-3.5 h-3.5 text-brand-red" />
                            <span>LIVE EVENT SYSTEM ACTIVE</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Selamat Datang di Photobooth Studio Platform
                        </h2>
                        <p className="text-slate-300 text-sm mt-1 max-w-xl">
                            Kelola sesi foto real-time, pantau perangkat photobooth, dan cetak photo strip dengan performa tinggi. Integrasi Sanctum API siap untuk aplikasi mobile.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href="/admin/kiosk"
                            className="py-3 px-5 rounded-2xl bg-brand-red text-white font-bold text-sm shadow-xl shadow-brand-red/30 hover:bg-brand-red-hover hover:scale-[1.02] transition-all flex items-center gap-2"
                        >
                            <Play className="w-4 h-4 fill-white" />
                            <span>Buka Live Kiosk</span>
                        </Link>
                        <Link
                            href="/docs"
                            className="py-3 px-5 rounded-2xl glass-panel text-white font-bold text-sm border border-slate-700 hover:border-brand-green hover:text-brand-green transition-all flex items-center gap-2"
                        >
                            <Sparkles className="w-4 h-4 text-brand-green" />
                            <span>Scalar API Docs</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Metric Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className={`p-6 rounded-2xl glass-panel border ${stat.border} glass-panel-hover relative overflow-hidden`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {stat.title}
                                </span>
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${stat.text}`} />
                                </div>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                                    {stat.value}
                                </h3>
                                <span className={`text-xs font-semibold ${stat.text}`}>
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Live Telemetry & Session Monitoring Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Photobooth Booths Status Panel */}
                <div className="lg:col-span-1 p-6 rounded-2xl glass-panel border border-slate-800">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-brand-blue" />
                            <h3 className="font-bold text-white text-base">Photobooth Kiosks</h3>
                        </div>
                        <span className="text-xs text-brand-green font-bold bg-brand-green/10 border border-brand-green/30 px-2.5 py-1 rounded-full">
                            4 Online
                        </span>
                    </div>

                    <div className="space-y-3.5">
                        {[
                            { name: 'Booth #01 Main Hall', template: 'Cyberpunk Neon', status: 'Capturing Session', color: 'red', badge: 'LIVE' },
                            { name: 'Booth #02 VIP Stage', template: 'Classic Wedding', status: 'Idle / Ready', color: 'green', badge: 'READY' },
                            { name: 'Booth #03 Lounge Bar', template: 'Retro Party', status: 'Printing Photo', color: 'blue', badge: 'PRINT' },
                            { name: 'Booth #04 Outdoor Deck', template: 'Summer Glow', status: 'Idle / Ready', color: 'green', badge: 'READY' },
                        ].map((booth, i) => (
                            <div key={i} className="p-3.5 rounded-xl bg-brand-surface/80 border border-slate-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${booth.color === 'red' ? 'bg-brand-red animate-ping' : booth.color === 'blue' ? 'bg-brand-blue animate-pulse' : 'bg-brand-green'}`}></div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{booth.name}</p>
                                        <p className="text-[10px] text-slate-400">{booth.template} • {booth.status}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${booth.color === 'red' ? 'bg-brand-red/20 text-brand-red border border-brand-red/40' : booth.color === 'blue' ? 'bg-brand-blue/20 text-brand-blue border border-brand-blue/40' : 'bg-brand-green/20 text-brand-green border border-brand-green/40'}`}>
                                    {booth.badge}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Photo Sessions Table Panel */}
                <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <Layers className="w-5 h-5 text-brand-red" />
                                <h3 className="font-bold text-white text-base">Sesi Foto Terakhir</h3>
                            </div>

                            <button className="p-2 rounded-xl bg-brand-surface border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="pb-3 px-3">Session ID</th>
                                        <th className="pb-3 px-3">Perangkat Booth</th>
                                        <th className="pb-3 px-3">Template Frame</th>
                                        <th className="pb-3 px-3">Status Sesi</th>
                                        <th className="pb-3 px-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-xs">
                                    {recentSessions.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="py-3 px-3 font-mono font-bold text-brand-blue">
                                                {row.id}
                                            </td>
                                            <td className="py-3 px-3 font-medium text-slate-200">
                                                {row.booth}
                                            </td>
                                            <td className="py-3 px-3 text-slate-300">
                                                {row.template}
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                                                    row.statusColor === 'green' ? 'bg-brand-green/10 text-brand-green border border-brand-green/30' :
                                                    row.statusColor === 'blue' ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/30' :
                                                    'bg-brand-red/10 text-brand-red border border-brand-red/30 animate-pulse'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        row.statusColor === 'green' ? 'bg-brand-green' :
                                                        row.statusColor === 'blue' ? 'bg-brand-blue' : 'bg-brand-red'
                                                    }`}></span>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button title="Print Photo Strip" className="p-1.5 rounded-lg bg-brand-surface border border-slate-700 hover:border-brand-green hover:text-brand-green transition-colors text-slate-300">
                                                        <Printer className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button title="QR Share Link" className="p-1.5 rounded-lg bg-brand-surface border border-slate-700 hover:border-brand-blue hover:text-brand-blue transition-colors text-slate-300">
                                                        <QrCode className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span>Menampilkan 5 dari 1,428 Sesi Hari Ini</span>
                        <Link href="/admin/gallery" className="text-brand-blue font-bold hover:underline">
                            Lihat Semua Galeri Sesi →
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
