import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Store,
    Eye,
    Ban,
    CheckCircle2,
    Trash2,
    Users,
    Monitor,
    Camera,
    CreditCard,
    Crown,
    Mail,
    Phone,
    Building2,
    Clock,
    FilterX,
} from 'lucide-react';
import {
    PageHeader,
    Button,
    SearchInput,
    FilterBar,
    FilterPill,
    Card,
    EmptyState,
    Table,
    Pagination,
    StatusBadge,
    DefaultAvatar,
    Dropdown,
    Drawer,
    ConfirmDialog,
    useToast,
} from '@/Components/ui';

const tenants = [
    { id: 1, name: 'Klik Foto Studio', owner: 'Andika Pratama', email: 'andika@klikfoto.id', phone: '0812-8412-7702', plan: 'Event Pro', status: 'active', since: '02 Sep 2026', endsAt: '02 Okt 2026', operators: 3, devices: 4, mrr: 699000 },
    { id: 2, name: 'Boothku.id', owner: 'Hasan Basri', email: 'hasan@boothku.id', phone: '0813-4421-0090', plan: 'Starter', status: 'pending', since: '01 Sep 2026', endsAt: '—', operators: 1, devices: 1, mrr: 299000 },
    { id: 3, name: 'Snapot Studio', owner: 'Rina Wijaya', email: 'rina@snapot.co', phone: '0811-2211-3344', plan: 'Event Pro', status: 'pending', since: '01 Sep 2026', endsAt: '—', operators: 2, devices: 2, mrr: 699000 },
    { id: 4, name: 'PicBox Pro', owner: 'Dewi Lestari', email: 'dewi@picboxpro.com', phone: '0857-1098-2233', plan: 'Enterprise', status: 'active', since: '28 Agu 2026', endsAt: '28 Sep 2026', operators: 5, devices: 8, mrr: 1500000 },
    { id: 5, name: 'Selfie Lab', owner: 'Fajar Nugraha', email: 'fajar@selfielab.net', phone: '0821-5533-8890', plan: 'Starter', status: 'active', since: '26 Agu 2026', endsAt: '26 Sep 2026', operators: 2, devices: 1, mrr: 299000 },
    { id: 6, name: 'FrameTime', owner: 'Clara Putri', email: 'clara@frametime.co', phone: '0856-7788-0123', plan: 'Enterprise', status: 'pending', since: '24 Agu 2026', endsAt: '—', operators: 1, devices: 2, mrr: 1500000 },
    { id: 7, name: 'Photo.ID', owner: 'Bambang Surya', email: 'bambang@photo.id', phone: '0819-3345-6712', plan: 'Event Pro', status: 'active', since: '22 Agu 2026', endsAt: '22 Sep 2026', operators: 4, devices: 5, mrr: 699000 },
    { id: 8, name: 'Stripz Studio', owner: 'Nadya Kirana', email: 'nadya@stripz.id', phone: '0812-9090-1122', plan: 'Starter', status: 'active', since: '20 Agu 2026', endsAt: '20 Sep 2026', operators: 2, devices: 2, mrr: 299000 },
    { id: 9, name: 'Moment Box', owner: 'Rizky Ananda', email: 'rizky@momentbox.cam', phone: '0857-2233-4455', plan: 'Event Pro', status: 'suspended', since: '18 Agu 2026', endsAt: '17 Sep 2026', operators: 3, devices: 3, mrr: 699000 },
    { id: 10, name: 'Booth Bejo', owner: 'Bejo Santoso', email: 'bejo@boothbejo.com', phone: '0812-5566-7788', plan: 'Starter', status: 'active', since: '15 Agu 2026', endsAt: '15 Sep 2026', operators: 1, devices: 1, mrr: 299000 },
    { id: 11, name: 'Snap Square', owner: 'Intan Permata', email: 'intan@snapsquare.id', phone: '0856-1122-3344', plan: 'Event Pro', status: 'active', since: '12 Agu 2026', endsAt: '12 Sep 2026', operators: 2, devices: 3, mrr: 699000 },
    { id: 12, name: 'Omtanke Booth', owner: 'Livia Chen', email: 'livia@omtanke.my', phone: '0813-7766-5544', plan: 'Starter', status: 'suspended', since: '08 Agu 2026', endsAt: '07 Sep 2026', operators: 1, devices: 1, mrr: 299000 },
];

const planTone = { Starter: 'neutral', 'Event Pro': 'info', Enterprise: 'success' };
const statusMap = {
    active: { label: 'Aktif', tone: 'success' },
    pending: { label: 'Pending', tone: 'warning' },
    suspended: { label: 'Suspend', tone: 'danger' },
};

const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');

export default function Tenants() {
    const { toast } = useToast();
    const [rows, setRows] = useState(tenants);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(8);
    const [sort, setSort] = useState(null);
    const [detail, setDetail] = useState(null);
    const [confirm, setConfirm] = useState(null);

    const filtered = useMemo(() => {
        let r = [...rows];
        if (statusFilter !== 'all') r = r.filter((x) => x.status === statusFilter);
        if (planFilter !== 'all') r = r.filter((x) => x.plan === planFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            r = r.filter((x) => x.name.toLowerCase().includes(q) || x.owner.toLowerCase().includes(q) || x.email.toLowerCase().includes(q));
        }
        if (sort) {
            r.sort((a, b) => {
                const av = String(a[sort.key] ?? '');
                const bv = String(b[sort.key] ?? '');
                const cmp = av.localeCompare(bv, undefined, { numeric: true });
                return sort.dir === 'asc' ? cmp : -cmp;
            });
        }
        return r;
    }, [rows, search, statusFilter, planFilter, sort]);

    const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

    const summary = {
        total: rows.length,
        active: rows.filter((x) => x.status === 'active').length,
        pending: rows.filter((x) => x.status === 'pending').length,
        suspended: rows.filter((x) => x.status === 'suspended').length,
    };

    const toggleStatus = (t) => {
        const next = t.status === 'suspended' ? 'active' : 'suspended';
        setRows((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
        toast({
            tone: next === 'active' ? 'success' : 'warning',
            title: next === 'active' ? 'Tenant diaktifkan' : 'Tenant disuspend',
            message: `${t.name} sekarang ${statusMap[next].label}.`,
        });
    };

    const remove = () => {
        setRows((prev) => prev.filter((u) => u.id !== confirm.id));
        toast({ tone: 'warning', title: 'Tenant dihapus', message: `${confirm.name} telah dihapus dari platform.` });
        setConfirm(null);
    };

    const columns = [
        {
            key: 'name',
            label: 'Workspace',
            sortable: true,
            render: (r) => (
                <div className="flex items-center gap-3">
                    <DefaultAvatar name={r.name} />
                    <div>
                        <p className="font-medium text-ink">{r.name}</p>
                        <p className="text-xs text-ink-muted">{r.owner} · {r.email}</p>
                    </div>
                </div>
            ),
        },
        { key: 'plan', label: 'Paket', sortable: true, render: (r) => <StatusBadge tone={planTone[r.plan]}>{r.plan}</StatusBadge> },
        { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge tone={statusMap[r.status].tone} dot>{statusMap[r.status].label}</StatusBadge> },
        { key: 'operators', label: 'Operator', align: 'right' },
        { key: 'devices', label: 'Device', align: 'right' },
        { key: 'mrr', label: 'MRR', align: 'right', render: (r) => <span className="font-medium text-ink">{fmt(r.mrr)}</span> },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (r) => (
                <Dropdown
                    items={[
                        { label: 'Lihat detail', icon: Eye, onClick: () => setDetail(r) },
                        r.status === 'suspended'
                            ? { label: 'Aktifkan', icon: CheckCircle2, onClick: () => toggleStatus(r) }
                            : { label: 'Suspend', icon: Ban, onClick: () => toggleStatus(r) },
                        { divider: true },
                        { label: 'Hapus', icon: Trash2, danger: true, onClick: () => setConfirm(r) },
                    ]}
                />
            ),
        },
    ];

    const paymentHistory = detail
        ? [
              { id: `PAY-${detail.id}01`, order: `PB-${detail.id}-2481`, amount: detail.mrr, status: 'paid', date: detail.since },
              { id: `PAY-${detail.id}02`, order: `PB-${detail.id}-1102`, amount: detail.mrr, status: 'paid', date: '10 Agu 2026' },
              { id: `PAY-${detail.id}03`, order: `PB-${detail.id}-0890`, amount: detail.mrr, status: 'paid', date: '12 Jul 2026' },
          ]
        : [];

    return (
        <AdminLayout title="Tenant">
            <Head title="Tenant - Photobooth Studio" />

            <PageHeader
                title="Daftar Tenant"
                description="Kelola seluruh workspace / tenaga franchise di platform."
                icon={Store}
                actions={
                    <Button
                        variant="secondary"
                        icon={FilterX}
                        onClick={() => {
                            setSearch('');
                            setStatusFilter('all');
                            setPlanFilter('all');
                            setPage(1);
                        }}
                    >
                        Atur Ulang
                    </Button>
                }
            />

            {/* Ringkasan */}
            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <SummaryBox label="Total Tenant" value={summary.total} tone="slate" icon={Building2} />
                <SummaryBox label="Aktif" value={summary.active} tone="success" icon={CheckCircle2} />
                <SummaryBox label="Pending" value={summary.pending} tone="warning" icon={Clock} />
                <SummaryBox label="Suspend" value={summary.suspended} tone="danger" icon={Ban} />
            </div>

            <div className="mb-4">
                <FilterBar>
                    <SearchInput
                        placeholder="Cari nama workspace, pemilik, atau email…"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full lg:w-80"
                    />
                    <FilterPill
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v);
                            setPage(1);
                        }}
                        options={[
                            { value: 'all', label: 'Semua status' },
                            { value: 'active', label: 'Aktif' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'suspended', label: 'Suspend' },
                        ]}
                    />
                    <FilterPill
                        value={planFilter}
                        onChange={(v) => {
                            setPlanFilter(v);
                            setPage(1);
                        }}
                        options={[
                            { value: 'all', label: 'Semua paket' },
                            { value: 'Starter', label: 'Starter' },
                            { value: 'Event Pro', label: 'Event Pro' },
                            { value: 'Enterprise', label: 'Enterprise' },
                        ]}
                    />
                </FilterBar>
            </div>

            {filtered.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={Store}
                        title="Belum ada tenant"
                        description="Tidak ada tenant yang cocok dengan filter Anda."
                    />
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <Table columns={columns} rows={pageRows} rowKey="id" sort={sort} onSort={setSort} />
                    <Pagination
                        page={page}
                        total={filtered.length}
                        perPage={perPage}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </Card>
            )}

            {/* Drawer detail tenant */}
            <Drawer
                open={!!detail}
                onClose={() => setDetail(null)}
                title="Detail Tenant"
                description={detail ? `Workspace ${detail.name}` : undefined}
                icon={Store}
                size="2xl"
                footer={
                    detail && (
                        <>
                            <Button variant="secondary" onClick={() => setDetail(null)}>Tutup</Button>
                            <Button
                                variant={detail.status === 'suspended' ? 'primary' : 'danger'}
                                icon={detail.status === 'suspended' ? CheckCircle2 : Ban}
                                onClick={() => {
                                    toggleStatus(detail);
                                    setDetail({ ...detail, status: detail.status === 'suspended' ? 'active' : 'suspended' });
                                }}
                            >
                                {detail.status === 'suspended' ? 'Aktifkan tenant' : 'Suspend tenant'}
                            </Button>
                        </>
                    )
                }
            >
                {detail && (
                    <div className="space-y-5">
                        {/* Profil */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-card bg-brand-subtle text-lg font-bold text-brand">
                                    {detail.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-base font-semibold text-ink">{detail.name}</p>
                                        <StatusBadge tone={planTone[detail.plan]}>{detail.plan}</StatusBadge>
                                        <StatusBadge tone={statusMap[detail.status].tone} dot>{statusMap[detail.status].label}</StatusBadge>
                                    </div>
                                    <p className="mt-1 text-sm text-ink-muted">{detail.owner}</p>
                                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-faint">
                                        <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {detail.email}</span>
                                        <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {detail.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-ink">{fmt(detail.mrr)}</p>
                                <p className="text-xs text-ink-muted">
                                    {detail.status === 'pending' ? 'Menunggu pembayaran pertama' : `MRR / bulan · s.d. ${detail.endsAt}`}
                                </p>
                            </div>
                        </div>

                        {/* Statistik */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <DetailStat label="Operator" value={detail.operators} icon={Users} />
                            <DetailStat label="Perangkat" value={detail.devices} icon={Monitor} />
                            <DetailStat label="Sesi 7 hari" value={detail.devices * 18} icon={Camera} />
                            <DetailStat label="Transaksi 7 hari" value={fmt(Math.round(detail.mrr / 12))} icon={CreditCard} />
                        </div>

                        {/* Langganan */}
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">Langganan</p>
                            <div className="rounded-card border border-edge p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-input bg-brand-subtle">
                                        <Crown className="h-4 w-4 text-brand" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-ink">Paket {detail.plan}</p>
                                        <p className="text-xs text-ink-muted">
                                            Mulai {detail.since} · Berakhir {detail.endsAt === '—' ? 'menunggu pembayaran' : detail.endsAt}
                                        </p>
                                    </div>
                                    <StatusBadge tone={statusMap[detail.status].tone} dot>{statusMap[detail.status].label}</StatusBadge>
                                </div>
                            </div>
                        </div>

                        {/* Riwayat pembayaran */}
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">Riwayat Pembayaran</p>
                            <div className="divide-y divide-edge rounded-card border border-edge">
                                {paymentHistory.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between px-4 py-3">
                                        <div>
                                            <p className="text-sm font-medium text-ink">{p.order}</p>
                                            <p className="text-xs text-ink-muted">{p.id} · {p.date}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-ink">{fmt(p.amount)}</span>
                                            <StatusBadge tone="success" dot>Lunas</StatusBadge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={remove}
                title="Hapus tenant?"
                message={`Workspace "${confirm?.name}" beserta seluruh datanya akan dihapus dari platform. Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus tenant"
            />
        </AdminLayout>
    );
}

function SummaryBox({ label, value, tone, icon: Icon }) {
    const color =
        tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : tone === 'danger' ? 'text-danger' : 'text-ink';
    const bg = tone === 'success' ? 'bg-success-subtle' : tone === 'warning' ? 'bg-warning-subtle' : tone === 'danger' ? 'bg-danger-subtle' : 'bg-slate-100';
    return (
        <div className="surface flex items-center gap-4 p-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-input ${bg}`}>
                <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-ink-muted">{label}</p>
                <p className={`text-xl font-bold tracking-tight ${color}`}>{value}</p>
            </div>
        </div>
    );
}

function DetailStat({ label, value, icon: Icon }) {
    return (
        <div className="rounded-card border border-edge p-3.5">
            <div className="flex items-center gap-2 text-xs text-ink-muted">
                <Icon className="h-3.5 w-3.5" />
                {label}
            </div>
            <p className="mt-1.5 text-lg font-bold text-ink">{value}</p>
        </div>
    );
}