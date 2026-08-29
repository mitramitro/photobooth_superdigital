import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Activity, Wifi, WifiOff, AlertTriangle, Wrench, Radio } from 'lucide-react';
import {
    PageHeader,
    Card,
    CardHeader,
    CardBody,
    DeviceHealthIndicator,
    Button,
    useToast,
    StatusBadge,
} from '@/Components/ui';

const devices = [
    { id: 'DEV-001', name: 'Booth #01 Main Hall', project: 'Photobox Retail', status: 'online', heartbeat: 'Aktif sekarang', camera: 'OK', printer: 'OK', storage: '68%' },
    { id: 'DEV-002', name: 'Booth #02 VIP Stage', project: 'Wedding Party', status: 'online', heartbeat: '30 detik lalu', camera: 'OK', printer: 'OK', storage: '54%' },
    { id: 'DEV-003', name: 'Booth #03 Lounge Bar', project: 'Self Studio', status: 'warning', heartbeat: '5 menit lalu', camera: 'OK', printer: 'Low ink', storage: '91%' },
    { id: 'DEV-004', name: 'Booth #04 Outdoor Deck', project: '—', status: 'offline', heartbeat: '1 hari lalu', camera: '—', printer: '—', storage: '—' },
];

const events = [
    { level: 'error', text: 'Booth #04 kehilangan koneksi', time: '14:20' },
    { level: 'warning', text: 'Tinta printer Booth #03 rendah', time: '14:05' },
    { level: 'warning', text: 'Penyimpanan Booth #03 91% penuh', time: '13:40' },
    { level: 'info', text: 'Booth #02 menyelesaikan sesi SESH-8890', time: '13:15' },
    { level: 'info', text: 'Proyek diterapkan di Booth #01', time: '12:50' },
];

export default function Index() {
    const { toast } = useToast();
    const [filter, setFilter] = useState('all');

    const counts = {
        online: devices.filter((d) => d.status === 'online').length,
        warning: devices.filter((d) => d.status === 'warning').length,
        offline: devices.filter((d) => d.status === 'offline').length,
        total: devices.length,
    };

    const visible = filter === 'all' ? devices : devices.filter((d) => d.status === filter);
    const healthy = counts.online / counts.total;

    const levelTone = { error: 'danger', warning: 'warning', info: 'info' };

    return (
        <AdminLayout title="Monitoring">
            <Head title="Monitoring - Photobooth Studio" />

            <PageHeader
                title="Monitoring"
                description="Kesehatan sistem dan perangkat photobooth secara keseluruhan."
                icon={Activity}
                actions={
                    <Button
                        variant="secondary"
                        icon={Wifi}
                        onClick={() => toast({ tone: 'success', title: 'Ping dikirim', message: 'Semua perangkat online merespons.' })}
                    >
                        Ping semua
                    </Button>
                }
            />

            {/* Health summary */}
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <HealthCard label="Sistem Sehat" value={`${Math.round(healthy * 100)}%`} tone="success" icon={Wifi} />
                <HealthCard label="Online" value={counts.online} tone="success" icon={Radio} />
                <HealthCard label="Warning" value={counts.warning} tone="warning" icon={AlertTriangle} />
                <HealthCard label="Offline" value={counts.offline} tone="danger" icon={WifiOff} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Device health list */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader
                            title="Status Perangkat"
                            description="Heartbeat & kesehatan komponen perangkat"
                            icon={Monitor}
                            actions={
                                <div className="flex items-center gap-1 rounded-input border border-edge bg-white p-0.5">
                                    {['all', 'online', 'warning', 'offline'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`rounded-input px-2.5 py-1 text-xs font-medium capitalize cursor-pointer ${
                                                filter === f ? 'bg-slate-100 text-ink' : 'text-ink-muted hover:text-ink'
                                            }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            }
                        />
                        <CardBody className="divide-y divide-edge p-0">
                            {visible.map((d) => (
                                <div key={d.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <DeviceHealthIndicator status={d.status} />
                                        <div>
                                            <p className="text-sm font-semibold text-ink">{d.name}</p>
                                            <p className="text-xs text-ink-muted">{d.id} · Heartbeat {d.heartbeat}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="rounded-input bg-slate-100 px-2 py-1 text-ink-muted">Kamera: {d.camera}</span>
                                        <span
                                            className={`rounded-input px-2 py-1 ${
                                                d.printer === 'OK' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
                                            }`}
                                        >
                                            Printer: {d.printer}
                                        </span>
                                        <span className="rounded-input bg-slate-100 px-2 py-1 text-ink-muted">Storage: {d.storage}</span>
                                    </div>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>

                {/* Events */}
                <div>
                    <Card>
                        <CardHeader title="Kejadian Terkini" description="Error, warning, dan info" icon={Activity} />
                        <CardBody className="space-y-3">
                            {events.map((e, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <StatusBadge tone={levelTone[e.level]} className="mt-0.5 shrink-0">{e.level}</StatusBadge>
                                    <div className="min-w-0">
                                        <p className="text-sm text-ink">{e.text}</p>
                                        <p className="text-xs text-ink-faint">{e.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

function HealthCard({ label, value, tone, icon: Icon }) {
    const color =
        tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : tone === 'danger' ? 'text-danger' : 'text-ink';
    const bg = tone === 'success' ? 'bg-success-subtle' : tone === 'warning' ? 'bg-warning-subtle' : tone === 'danger' ? 'bg-danger-subtle' : 'bg-slate-100';
    const iconColor = tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : tone === 'danger' ? 'text-danger' : 'text-ink-muted';
    return (
        <div className="surface flex items-center gap-4 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-input ${bg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div>
                <p className="text-xs text-ink-muted">{label}</p>
                <p className={`text-2xl font-bold tracking-tight ${color}`}>{value}</p>
            </div>
        </div>
    );
}
