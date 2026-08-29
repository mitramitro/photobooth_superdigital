import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Monitor, Smartphone, MonitorPlay, History, Play, Camera, HardDrive, Activity, Download } from 'lucide-react';
import {
    PageHeader,
    Button,
    Card,
    CardHeader,
    CardBody,
    StatusBadge,
    DeviceHealthIndicator,
    EmptyState,
    useToast,
    Tabs,
} from '@/Components/ui';

const initialDevices = [
    { id: 'DEV-001', name: 'Booth #01 Main Hall', type: 'Android Photobox Retail', activeProject: 'Photobox Retail Grand Mall', status: 'online', ip: '192.168.1.102', camera: 'Canon EOS DSLR (USB 3.0)', lastOnline: 'Aktif sekarang', sessions: 412, storage: '68%', version: 'v2.4.0' },
    { id: 'DEV-002', name: 'Booth #02 VIP Stage', type: 'Windows Kiosk Client', activeProject: 'Wedding Party Classic Event', status: 'online', ip: '192.168.1.105', camera: 'Logitech Brio 4K', lastOnline: '2 menit lalu', sessions: 289, storage: '54%', version: 'v2.4.0' },
    { id: 'DEV-003', name: 'Booth #03 Lounge Bar', type: 'Android Photobox Retail', activeProject: 'Self Studio Cafe Corner', status: 'warning', ip: '192.168.1.110', camera: 'Sony Alpha 6400', lastOnline: 'Lampu error', sessions: 194, storage: '91%', version: 'v2.3.1' },
    { id: 'DEV-004', name: 'Booth #04 Outdoor Deck', type: 'Windows Kiosk Client', activeProject: '—', status: 'offline', ip: '192.168.1.112', camera: 'Logitech C920', lastOnline: '1 hari lalu', sessions: 87, storage: '40%', version: 'v2.2.0' },
];

const telemetry = [
    { label: 'Tipe Kiosk / OS', value: (d) => d.type },
    { label: 'Kamera', value: (d) => d.camera },
    { label: 'Alamat IP', value: (d) => <span className="font-mono">{d.ip}</span> },
    { label: 'Total sesi', value: (d) => `${d.sessions} sesi` },
    { label: 'Penyimpanan', value: (d) => d.storage },
    { label: 'Versi aplikasi', value: (d) => d.version },
];

const history = [
    { text: 'Sesi foto SESH-8891 selesai & dicetak', time: '2 menit lalu' },
    { text: 'Menerapkan proyek Photobox Retail Grand Mall', time: '15 menit lalu' },
    { text: 'Penyimpanan mencapai 90%', time: '1 jam lalu' },
];

export default function Index() {
    const { toast } = useToast();
    const [devices, setDevices] = useState(initialDevices);
    const [selected, setSelected] = useState(devices[0]);
    const [tab, setTab] = useState('overview');

    const counts = {
        online: devices.filter((d) => d.status === 'online').length,
        warning: devices.filter((d) => d.status === 'warning').length,
        offline: devices.filter((d) => d.status === 'offline').length,
    };

    return (
        <AdminLayout title="Perangkat">
            <Head title="Perangkat - Photobooth Studio" />

            <PageHeader
                title="Perangkat"
                description="Kelola dan pantau perangkat photobooth kiosk Anda."
                icon={Monitor}
            />

            {/* Summary */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatRow label="Online" value={counts.online} tone="success" />
                <StatRow label="Warning" value={counts.warning} tone="warning" />
                <StatRow label="Offline" value={counts.offline} tone="neutral" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Device list */}
                <div className="lg:col-span-5">
                    <Card>
                        <CardHeader
                            title={`Daftar Perangkat (${devices.length})`}
                            description="Klik untuk melihat detail telemetry"
                            icon={Monitor}
                        />
                        <CardBody className="space-y-2.5 p-4">
                            {devices.map((d) => {
                                const active = selected?.id === d.id;
                                return (
                                    <button
                                        key={d.id}
                                        onClick={() => setSelected(d)}
                                        className={`w-full rounded-card border p-4 text-left transition-colors cursor-pointer ${
                                            active ? 'border-brand/50 bg-brand-subtle/60' : 'border-edge hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <Monitor className="h-4 w-4 shrink-0 text-ink-muted" />
                                                <p className="truncate text-sm font-semibold text-ink">{d.name}</p>
                                            </div>
                                            <DeviceHealthIndicator status={d.status} />
                                        </div>
                                        <p className="mt-1.5 truncate text-xs text-ink-muted">Proyek: {d.activeProject}</p>
                                    </button>
                                );
                            })}
                        </CardBody>
                    </Card>
                </div>

                {/* Telemetry */}
                <div className="lg:col-span-7">
                    <Card>
                        <CardHeader
                            title={selected ? selected.name : 'Pilih perangkat'}
                            description={selected ? `${selected.id} · ${selected.type}` : ''}
                            icon={Monitor}
                            actions={
                                selected && (
                                    <>
                                        <StatusBadge tone={selected.status === 'online' ? 'success' : selected.status === 'warning' ? 'warning' : 'neutral'} dot pulse={selected.status === 'online'}>
                                            {selected.status === 'online' ? 'Online' : selected.status === 'warning' ? 'Warning' : 'Offline'}
                                        </StatusBadge>
                                        <Link
                                            href="/admin/kiosk"
                                            className="inline-flex items-center gap-1.5 rounded-input bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
                                        >
                                            <Play className="h-3.5 w-3.5 fill-current" /> Buka Kiosk
                                        </Link>
                                    </>
                                )
                            }
                        />

                        <Tabs
                            tabs={[
                                { value: 'overview', label: 'Ringkasan' },
                                { value: 'history', label: 'Riwayat' },
                            ]}
                            active={tab}
                            onChange={setTab}
                        />

                        <CardBody>
                            {!selected ? (
                                <EmptyState icon={Monitor} title="Pilih perangkat" description="Pilih perangkat dari daftar untuk melihat detail." />
                            ) : tab === 'overview' ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                        {telemetry.map((t) => (
                                            <div key={t.label} className="rounded-card border border-edge bg-slate-50/60 p-3.5">
                                                <p className="text-xs text-ink-faint">{t.label}</p>
                                                <p className="mt-1 text-sm font-semibold text-ink">{t.value(selected)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            variant="secondary"
                                            icon={HardDrive}
                                            size="sm"
                                            onClick={() => toast({ tone: 'info', title: 'Bersihkan penyimpanan', message: 'Perintah pembersihan dikirim ke perangkat.' })}
                                        >
                                            Bersihkan penyimpanan
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            icon={Activity}
                                            size="sm"
                                            onClick={() => toast({ tone: 'success', title: 'Diagnosa dijalankan', message: 'Pemeriksaan kesehatan perangkat selesai.' })}
                                        >
                                            Jalankan diagnosa
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {history.map((h, i) => (
                                        <div key={i} className="flex items-center justify-between gap-4 rounded-card border border-edge px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <History className="h-4 w-4 shrink-0 text-ink-muted" />
                                                <span className="text-sm text-ink">{h.text}</span>
                                            </div>
                                            <span className="shrink-0 text-xs text-ink-faint">{h.time}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Download client apps */}
            <div className="mt-6">
                <Card>
                    <CardHeader
                        title="Aplikasi Client Kiosk"
                        description="Unduh installer untuk perangkat Android atau Windows."
                        icon={Download}
                    />
                    <CardBody className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            variant="secondary"
                            icon={Smartphone}
                            onClick={() => toast({ tone: 'success', title: 'Mengunduh APK', message: 'Photobox Retail APK v2.4 sedang diunduh.' })}
                        >
                            Download APK (Android)
                        </Button>
                        <Button
                            variant="secondary"
                            icon={MonitorPlay}
                            onClick={() => toast({ tone: 'success', title: 'Mengunduh EXE', message: 'Photobooth Kiosk Windows v2.4 sedang diunduh.' })}
                        >
                            Download EXE (Windows)
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </AdminLayout>
    );
}

function StatRow({ label, value, tone }) {
    const color = tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : 'text-ink';
    const dot = tone === 'success' ? 'bg-success' : tone === 'warning' ? 'bg-warning' : 'bg-slate-300';
    return (
        <div className="surface flex items-center gap-3 p-4">
            <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
            <div>
                <p className="text-xs text-ink-muted">{label}</p>
                <p className={`text-2xl font-bold tracking-tight ${color}`}>{value}</p>
            </div>
        </div>
    );
}
