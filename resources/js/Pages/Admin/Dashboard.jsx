import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Activity,
    Camera,
    Printer,
    Monitor,
    CreditCard,
    ArrowRight,
    RefreshCw,
} from 'lucide-react';
import {
    PageHeader,
    StatCard,
    Card,
    CardHeader,
    CardBody,
    StatusBadge,
    Table,
    Section,
    Button,
} from '@/Components/ui';
import { useToast } from '@/Components/ui';

const sessionTone = {
    Printed: 'success',
    Processing: 'info',
    Capturing: 'warning',
    Pending: 'warning',
    Failed: 'danger',
};

const boothStatus = [
    { name: 'Booth #01 Main Hall', template: 'Cyberpunk Neon', status: 'Capturing', icon: Camera },
    { name: 'Booth #02 VIP Stage', template: 'Classic Wedding', status: 'Online', icon: Monitor },
    { name: 'Booth #03 Lounge Bar', template: 'Retro Party', status: 'Printing', icon: Printer },
    { name: 'Booth #04 Outdoor Deck', template: 'Summer Glow', status: 'Online', icon: Monitor },
];

export default function Dashboard() {
    const { toast } = useToast();

    const stats = [
        { label: 'Total Sesi Foto', value: '1.428', delta: '+18,4%', deltaUp: true, tone: 'blue', icon: Camera },
        { label: 'Foto Dicetak', value: '3.890', hint: '99,4% printer ready', tone: 'green', icon: Printer },
        { label: 'Photobooth Aktif', value: '4', hint: '2 lokasi', tone: 'blue', icon: Monitor },
        { label: 'Transaksi Hari Ini', value: 'Rp 1.485.000', delta: '+9,2%', deltaUp: true, tone: 'green', icon: CreditCard },
    ];

    const recentSessions = [
        { id: 'SESH-8891', booth: 'Booth #01 Main Hall', template: 'Cyberpunk Neon 4-Strip', photos: 4, time: '2 menit lalu', status: 'Printed' },
        { id: 'SESH-8890', booth: 'Booth #02 VIP Stage', template: 'Classic Wedding Elegant', photos: 3, time: '5 menit lalu', status: 'Printed' },
        { id: 'SESH-8889', booth: 'Booth #01 Main Hall', template: 'Birthday Retro Vintage', photos: 4, time: '9 menit lalu', status: 'Processing' },
        { id: 'SESH-8888', booth: 'Booth #03 Lounge Bar', template: 'Cyberpunk Neon 4-Strip', photos: 4, time: '14 menit lalu', status: 'Capturing' },
        { id: 'SESH-8887', booth: 'Booth #04 Outdoor Deck', template: 'Minimalist B&W', photos: 2, time: '22 menit lalu', status: 'Printed' },
    ];

    const sessionColumns = [
        { key: 'id', label: 'ID Sesi', render: (r) => <span className="font-mono text-xs text-brand">{r.id}</span> },
        { key: 'booth', label: 'Perangkat' },
        { key: 'template', label: 'Template' },
        { key: 'photos', label: 'Foto', align: 'right' },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge tone={sessionTone[r.status]} dot>{r.status}</StatusBadge> },
        { key: 'time', label: 'Waktu', align: 'right', render: (r) => <span className="text-xs text-ink-muted">{r.time}</span> },
    ];

    const activity = [
        { type: 'Sesi selesai', detail: 'SESH-8891 dicetak di Booth #01', time: '2 menit lalu' },
        { type: 'Proyek diterapkan', detail: 'Wedding Party Classic di Booth #02', time: '15 menit lalu' },
        { type: 'Transaksi', detail: 'TRX-9981 · Rp 35.000 (QRIS)', time: '25 menit lalu' },
        { type: 'Perangkat online', detail: 'Booth #04 kembali online', time: '1 jam lalu' },
        { type: 'Pembayaran', detail: 'TRX-9977 refund diproses', time: '2 jam lalu' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard - Photobooth Studio" />

            <PageHeader
                title="Ringkasan Operasional"
                description="Pantau kesehatan dan performa platform photobooth Anda hari ini."
                icon={Activity}
                actions={
                    <Button
                        variant="secondary"
                        icon={RefreshCw}
                        onClick={() => toast({ tone: 'info', title: 'Data diperbarui', message: 'Ringkasan terbaru berhasil dimuat.' })}
                    >
                        Muat ulang
                    </Button>
                }
            />

            {/* KPI row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                    <StatCard key={s.label} {...s} />
                ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent sessions */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader
                            title="Sesi Foto Terakhir"
                            description="Aktivitas sesi terbaru di seluruh perangkat"
                            icon={Camera}
                            actions={
                                <Link href="/admin/sessions" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark">
                                    Lihat semua <ArrowRight className="h-4 w-4" />
                                </Link>
                            }
                        />
                        <Table columns={sessionColumns} rows={recentSessions} rowKey="id" />
                    </Card>
                </div>

                {/* Device status */}
                <div className="grid grid-cols-1 gap-6">
                    <Card>
                        <CardHeader
                            title="Status Perangkat"
                            description="Kondisi real-time booth"
                            icon={Monitor}
                            actions={
                                <Link href="/admin/devices" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark">
                                    Kelola <ArrowRight className="h-4 w-4" />
                                </Link>
                            }
                        />
                        <CardBody className="space-y-3">
                            {boothStatus.map((b) => (
                                <div key={b.name} className="flex items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <b.icon className="h-4 w-4 shrink-0 text-ink-muted" />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-ink">{b.name}</p>
                                            <p className="truncate text-xs text-ink-muted">{b.template}</p>
                                        </div>
                                    </div>
                                    <StatusBadge tone={b.status === 'Capturing' || b.status === 'Printing' ? 'info' : 'success'} dot pulse={b.status === 'Capturing' || b.status === 'Printing'}>
                                        {b.status}
                                    </StatusBadge>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Recent activity */}
            <div className="mt-6">
                <Section title="Aktivitas Terbaru" description="Peristiwa terkini di seluruh sistem" icon={Activity}>
                    <Card>
                        <CardBody className="divide-y divide-edge p-0">
                            {activity.map((a, i) => (
                                <div key={i} className="flex items-center justify-between gap-4 px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                                        <div>
                                            <p className="text-sm font-medium text-ink">{a.type}</p>
                                            <p className="text-xs text-ink-muted">{a.detail}</p>
                                        </div>
                                    </div>
                                    <span className="shrink-0 text-xs text-ink-faint">{a.time}</span>
                                </div>
                            ))}
                        </CardBody>
                    </Card>
                </Section>
            </div>
        </AdminLayout>
    );
}
