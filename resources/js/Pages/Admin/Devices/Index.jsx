import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Monitor, 
    Download, 
    Smartphone, 
    MonitorPlay, 
    Activity, 
    History, 
    Radio, 
    Play, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    HardDrive,
    Wifi,
    Camera
} from 'lucide-react';

export default function Index() {
    const [devices, setDevices] = useState([
        { 
            id: 'DEV-001', 
            name: 'Booth #01 Main Hall', 
            type: 'Android Photobox Retail', 
            activeProject: 'Photobox Retail Grand Mall', 
            status: 'LIVE', 
            ipAddress: '192.168.1.102', 
            camera: 'Canon EOS DSLR (USB 3.0)', 
            lastOnline: 'Sedang aktif', 
            sessionsCount: 412 
        },
        { 
            id: 'DEV-002', 
            name: 'Booth #02 VIP Stage', 
            type: 'Windows Kiosk Client', 
            activeProject: 'Wedding Party Classic Event', 
            status: 'READY', 
            ipAddress: '192.168.1.105', 
            camera: 'Logitech Brio 4K Webcam', 
            lastOnline: '2 menit yang lalu', 
            sessionsCount: 289 
        },
        { 
            id: 'DEV-003', 
            name: 'Booth #03 Lounge Bar', 
            type: 'Android Photobox Retail', 
            activeProject: 'Self Studio Cafe Corner', 
            status: 'OFFLINE', 
            ipAddress: '192.168.1.110', 
            camera: 'Sony Alpha 6400', 
            lastOnline: '1 jam yang lalu', 
            sessionsCount: 194 
        },
    ]);

    const [selectedDevice, setSelectedDevice] = useState(devices[0]);

    return (
        <AdminLayout title="Manajemen Perangkat Photobooth" hasLiveBooth={devices.some(d => d.status === 'LIVE')}>
            <Head title="Manajemen Perangkat - Photobooth Studio" />

            {/* Download Client Apps Section */}
            <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-panel border border-brand-green/40 bg-gradient-to-r from-brand-dark via-brand-surface to-brand-green/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/40 text-xs font-bold text-brand-green mb-3">
                        <Download className="w-3.5 h-3.5" />
                        <span>DOWNLOAD CLIENT APPLICATION SOFTWARE</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">
                        Aplikasi Client Photobooth Kiosk
                    </h2>
                    <p className="text-slate-300 text-sm mt-1 max-w-xl">
                        Unduh software client installer untuk dipasang di perangkat Photobooth Kiosk Android atau PC Windows.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => alert('Mengunduh Photobox Retail APK v2.4...')}
                        className="py-3 px-5 rounded-2xl bg-brand-green text-brand-dark font-extrabold text-xs shadow-lg hover:bg-brand-green-light transition-all flex items-center gap-2"
                    >
                        <Smartphone className="w-4 h-4" />
                        <span>Download APK (Android)</span>
                    </button>

                    <button
                        onClick={() => alert('Mengunduh Photobooth Kiosk Windows Executable v2.4...')}
                        className="py-3 px-5 rounded-2xl bg-brand-blue text-brand-dark font-extrabold text-xs shadow-lg hover:bg-brand-blue-light transition-all flex items-center gap-2"
                    >
                        <MonitorPlay className="w-4 h-4" />
                        <span>Download EXE (Windows)</span>
                    </button>
                </div>
            </div>

            {/* Monitoring Section (Pilih Perangkat & Detail Telemetry) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Perangkat List (5 Columns) */}
                <div className="lg:col-span-5 space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">
                        Daftar Perangkat Terdaftar ({devices.length})
                    </h3>

                    {devices.map((device) => (
                        <div
                            key={device.id}
                            onClick={() => setSelectedDevice(device)}
                            className={`
                                p-5 rounded-3xl border cursor-pointer transition-all duration-200 block relative overflow-hidden
                                ${selectedDevice.id === device.id 
                                    ? 'bg-brand-surface border-brand-blue border-2 shadow-xl' 
                                    : 'border-slate-800 bg-brand-dark/50 hover:bg-slate-800/60'}
                            `}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-4 h-4 text-brand-blue" />
                                    <span className="font-bold text-white text-sm">{device.name}</span>
                                </div>

                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${device.status === 'LIVE' ? 'bg-brand-red text-white animate-pulse shadow-md shadow-brand-red/40' : device.status === 'READY' ? 'bg-brand-green/20 text-brand-green border border-brand-green/40' : 'bg-slate-800 text-slate-400'}`}>
                                    {device.status}
                                </span>
                            </div>

                            <p className="text-xs text-slate-300">Proyek Aktif: <strong className="text-white">{device.activeProject}</strong></p>
                            <p className="text-[10px] text-slate-400 mt-1">IP: {device.ipAddress} • {device.camera}</p>
                        </div>
                    ))}
                </div>

                {/* Device Telemetry & History (7 Columns) */}
                <div className="lg:col-span-7">
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <span className="text-[10px] font-mono text-brand-blue font-bold">{selectedDevice.id}</span>
                                <h3 className="text-xl font-extrabold text-white">{selectedDevice.name}</h3>
                            </div>

                            <Link
                                href="/admin/kiosk"
                                className="py-2.5 px-4 rounded-xl bg-brand-red text-white text-xs font-bold shadow-lg hover:bg-brand-red-hover flex items-center gap-2"
                            >
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>Buka Live Kiosk</span>
                            </Link>
                        </div>

                        {/* Telemetry Grid */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="p-4 rounded-2xl bg-brand-dark border border-slate-800 space-y-1">
                                <span className="text-slate-400 font-medium">Tipe Kiosk / OS</span>
                                <p className="font-bold text-white text-sm">{selectedDevice.type}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-brand-dark border border-slate-800 space-y-1">
                                <span className="text-slate-400 font-medium">Kamera Terhubung</span>
                                <p className="font-bold text-brand-green text-sm">{selectedDevice.camera}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-brand-dark border border-slate-800 space-y-1">
                                <span className="text-slate-400 font-medium">Alamat IP Jaringan</span>
                                <p className="font-mono font-bold text-slate-200 text-sm">{selectedDevice.ipAddress}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-brand-dark border border-slate-800 space-y-1">
                                <span className="text-slate-400 font-medium">Total Sesi Diperproses</span>
                                <p className="font-bold text-brand-blue text-sm">{selectedDevice.sessionsCount} Sesi</p>
                            </div>
                        </div>

                        {/* History Log Section */}
                        <div className="space-y-3 pt-2">
                            <h4 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                                <History className="w-4 h-4 text-brand-blue" />
                                <span>Riwayat Aktivitas Perangkat</span>
                            </h4>

                            <div className="space-y-2 text-xs">
                                <div className="p-3 rounded-xl bg-brand-surface/60 border border-slate-800 flex justify-between">
                                    <span className="text-slate-300">Sesi Foto SESH-8891 selesai & dicetak</span>
                                    <span className="text-slate-400 text-[10px]">2 menit yang lalu</span>
                                </div>
                                <div className="p-3 rounded-xl bg-brand-surface/60 border border-slate-800 flex justify-between">
                                    <span className="text-slate-300">Menerapkan proyek Proyek Photobox Retail Grand Mall</span>
                                    <span className="text-slate-400 text-[10px]">15 menit yang lalu</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
