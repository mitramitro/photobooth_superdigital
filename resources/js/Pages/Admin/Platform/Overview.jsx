import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Globe,
    Building2,
    Crown,
    CreditCard,
    Camera,
    Clock,
    ArrowRight,
    RefreshCw,
    Boxes,
    Banknote,
    CheckCircle2,
    XCircle,
    Activity,
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
    useToast,
} from '@/Components/ui';

const planTone = { Starter: 'neutral', 'Event Pro': 'info', Enterprise: 'success' };
const planBar = {
    Starter: 'bg-slate-400',
    'Event Pro': 'bg-brand',
    Enterprise: 'bg-emerald-500',
};

const latestTenants = [
    { id: 1, name: 'Klik Foto Studio', owner: 'Andika Pratama', plan: 'Event Pro', status: 'active', joined: '02 Sep 2026', operators: 3 },
    { id: 2, name: 'Boothku.id', owner: 'Hasan Basri', plan: 'Starter', status: 'pending', joined: '01 Sep 2026', operators: 1 },
    { id: 3, name: 'Snapot Studio', owner: 'Rina Wijaya', plan: 'Event Pro', status: 'pending', joined: '01 Sep 2026', operators: 2 },
    { id: 4, name: 'PicBox Pro', owner: 'Dewi Lestari', plan: 'Enterprise', status: 'active', joined: '28 Agu 2026', operators: 5 },
    { id: 5, name: 'Selfie Lab', owner: 'Fajar Nugraha', plan: 'Starter', status: 'active', joined: '26 Agu 2026', operators: 2 },
];

const pendingRegistrations = [
    { id: 'REG-1009', workspace: 'Snapot Studio', owner: 'Rina Wijaya', plan: 'Event Pro', amount: 699000, time: '5 menit lalu' },
    { id: 'REG-1008', workspace: 'Boothku.id', owner: 'Hasan Basri', plan: 'Starter', amount: 299000, time: '22 menit lalu' },
    { id: 'REG-1007', workspace: 'FrameTime', owner: 'Clara Putri', plan: 'Enterprise', amount: 1500000, time: '1 jam lalu' },
];

const planDistribution = [
    { name: 'Starter', count: 10, total: 24 },
    { name: 'Event Pro', count: 9, total: 24 },
    { name: 'Enterprise', count: 5, total: 24 },
];

const globalActivity = [
    { level: 'success', text: 'SESI-8891 · 4 foto dicetak di Klik Foto Studio', time: '2 menit lalu' },
    { level: 'success', text: 'Tenant PicBox Pro memperpanjang langganan', time: '18 menit lalu' },
    { level: 'info', text: 'SESI-8890 · 3 foto di Selfie Lab', time: '32 menit lalu' },
    { level: 'warning', text: 'Pembayaran REG-1008 masih menunggu konfirmasi', time: '48 menit lalu' },
    { level: 'danger', text: 'Perangkat offline di FrameTime (BOOTH-04)', time: '1 jam lalu' },
];

const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');

const tenantStatus = { active: { label: 'Aktif', tone: 'success' }, pending: { label: 'Pending', tone: 'warning' }, suspended: { label: 'Suspend', tone: 'danger' } };

export default function Overview() {
    const { toast } = useToast();

    const tenantColumns = [
        {
            key: 'name',
            label: 'Workspace',
            render: (r) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-input bg-brand-subtle text-xs font-bold text-brand">
                        {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-ink">{r.name}</p>
                        <p className="text-xs text-ink-muted">{r.owner}</p>
                    </div>
                </div>
            ),
        },
        { key: 'plan', label: 'Paket', render: (r) => <StatusBadge tone={planTone[r.plan]}>{r.plan}</StatusBadge> },
        { key: 'status', label: 'Status', render: (r) => <StatusBadge tone={tenantStatus[r.status].tone} dot>{tenantStatus[r.status].label}</StatusBadge> },
        { key: 'operators', label: 'Operator', align: 'right' },
        { key: 'joined', label: 'Bergabung', align: 'right', render: (r) => <span className="text-sm text-ink-muted">{r.joined}</span> },
    ];

    return (
        <AdminLayout title="Platform Overview">
            <Head title="Platform Overview - Photobooth Studio" />

            <PageHeader
                title="Platform Overview"
                description="Ringkasan seluruh tenant dan kondisi platform Anda hari ini."
                icon={Globe}
                actions={
                    <Button
                        variant="secondary"
                        icon={RefreshCw}
                        onClick={() => toast({ tone: 'info', title: 'Data diperbarui', message: 'Ringkasan platform berhasil dimuat.' })}
                    >
                        Muat ulang
                    </Button>
                }
            />

            {/* KPI row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Tenant" value="24" delta="+3" tone="blue" icon={Building2} />
                <StatCard label="Tenant Aktif" value="18" hint="6 menunggu pembayaran" tone="green" icon={Crown} />
                <StatCard label="MRR Estimasi" value={fmt(8412000)} delta="+12,5%" tone="green" icon={Banknote} />
                <StatCard label="Transaksi Hari Ini" value={fmt(2150000)} delta="+9,2%" tone="blue" icon={CreditCard} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Tenant terbaru */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader
                            title="Tenant Terbaru"
                            description="Workspace yang terdaftar baru-baru ini"
                            icon={Building2}
                            actions={
                                <Link href="/admin/platform/tenants" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark">
                                    Lihat semua <ArrowRight className="h-4 w-4" />
                                </Link>
                            }
                        />
                        <Table columns={tenantColumns} rows={latestTenants} rowKey="id" />
                    </Card>
                </div>

                {/* Pendaftaran menunggu pembayaran */}
                <Card>
                    <CardHeader
                        title="Menunggu Pembayaran"
                        description="Franchise yang belum membayar"
                        icon={Clock}
                        actions={
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning-subtle text-xs font-bold text-warning">
                                {pendingRegistrations.length}
                            </span>
                        }
                    />
                    <CardBody className="divide-y divide-edge p-0">
                        {pendingRegistrations.map((p) => (
                            <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-medium text-ink">{p.workspace}</p>
                                        <StatusBadge tone={planTone[p.plan]}>{p.plan}</StatusBadge>
                                    </div>
                                    <p className="mt-0.5 text-xs text-ink-muted">{p.id} · {p.owner} · {p.time}</p>
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-1.5">
                                    <span className="text-sm font-semibold text-ink">{fmt(p.amount)}</span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => toast({ tone: 'success', title: 'Pembayaran dikonfirmasi', message: `${p.workspace} diaktifkan.` })}
                                            className="rounded p-1.5 text-success hover:bg-success-subtle cursor-pointer"
                                            aria-label={`Konfirmasi pembayaran ${p.workspace}`}
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => toast({ tone: 'warning', title: 'Pembayaran ditolak', message: `${p.workspace} ditandai gagal.` })}
                                            className="rounded p-1.5 text-danger hover:bg-danger-subtle cursor-pointer"
                                            aria-label={`Tolak pembayaran ${p.workspace}`}
                                        >
                                            <XCircle className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Distribusi paket */}
                <Card>
                    <CardHeader title="Distribusi Paket" description="Sebaran langganan seluruh tenant" icon={Boxes} />
                    <CardBody className="space-y-4">
                        {planDistribution.map((p) => {
                            const pct = Math.round((p.count / p.total) * 100);
                            return (
                                <div key={p.name}>
                                    <div className="mb-1.5 flex items-center justify-between text-sm">
                                        <span className="font-medium text-ink">{p.name}</span>
                                        <span className="text-xs text-ink-muted">{p.count} tenant · {pct}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div className={`h-full rounded-full ${planBar[p.name]}`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </CardBody>
                </Card>

                {/* Aktivitas global */}
                <div className="lg:col-span-2">
                    <Section title="Aktivitas Global Terkini" description="Peristiwa lintas seluruh tenant" icon={Activity}>
                        <Card>
                            <CardBody className="divide-y divide-edge p-0">
                                {globalActivity.map((a, i) => (
                                    <div key={i} className="flex items-center justify-between gap-4 px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-input bg-brand-subtle">
                                                <Camera className="h-4 w-4 text-brand" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-ink">{a.text}</p>
                                                <p className="text-xs text-ink-faint">{a.time}</p>
                                            </div>
                                        </div>
                                        <StatusBadge tone={a.level === 'success' ? 'success' : a.level === 'warning' ? 'warning' : a.level === 'danger' ? 'danger' : 'info'} dot>
                                            {a.level}
                                        </StatusBadge>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>
                    </Section>
                </div>
            </div>
        </AdminLayout>
    );
}