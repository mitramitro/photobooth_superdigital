import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Camera, Eye, Printer, QrCode } from 'lucide-react';
import {
    PageHeader,
    SearchInput,
    FilterBar,
    FilterPill,
    Card,
    EmptyState,
    Table,
    Pagination,
    StatusBadge,
    Button,
    Drawer,
    useToast,
} from '@/Components/ui';

const sessions = [
    { id: 'SESH-8891', project: 'Photobox Retail Grand Mall', device: 'Booth #01 Main Hall', date: '2026-08-25 · 14:32', photos: 4, status: 'completed', output: 'Printed', template: 'Cyberpunk Neon' },
    { id: 'SESH-8890', project: 'Wedding Party Classic Event', device: 'Booth #02 VIP Stage', date: '2026-08-25 · 14:15', photos: 3, status: 'completed', output: 'Printed', template: 'Wedding Elegant' },
    { id: 'SESH-8889', project: 'Photobox Retail Grand Mall', device: 'Booth #01 Main Hall', date: '2026-08-25 · 13:50', photos: 4, status: 'processing', output: 'Queued', template: 'Birthday Retro' },
    { id: 'SESH-8888', project: 'Self Studio Cafe Corner', device: 'Booth #03 Lounge Bar', date: '2026-08-25 · 13:12', photos: 4, status: 'capturing', output: '—', template: 'Cyberpunk Neon' },
    { id: 'SESH-8887', project: 'Self Studio Cafe Corner', device: 'Booth #04 Outdoor Deck', date: '2026-08-24 · 19:02', photos: 2, status: 'completed', output: 'Printed', template: 'Minimalist B&W' },
    { id: 'SESH-8886', project: 'Wedding Party Classic Event', device: 'Booth #02 VIP Stage', date: '2026-08-24 · 18:40', photos: 0, status: 'failed', output: 'Failed', template: 'Wedding Elegant' },
];

const statusTone = {
    completed: 'success',
    processing: 'info',
    capturing: 'warning',
    failed: 'danger',
};
const statusLabel = {
    completed: 'Selesai',
    processing: 'Diproses',
    capturing: 'Mengambil foto',
    failed: 'Gagal',
};
const outputTone = {
    Printed: 'success',
    Queued: 'info',
    Failed: 'danger',
};

export default function Index() {
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(8);
    const [detail, setDetail] = useState(null);
    const [sort, setSort] = useState(null);

    const filtered = useMemo(() => {
        let rows = [...sessions];
        if (statusFilter !== 'all') rows = rows.filter((r) => r.status === statusFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter((r) => r.id.toLowerCase().includes(q) || r.project.toLowerCase().includes(q) || r.device.toLowerCase().includes(q));
        }
        if (sort) {
            rows.sort((a, b) => {
                const av = String(a[sort.key] ?? '');
                const bv = String(b[sort.key] ?? '');
                const cmp = av.localeCompare(bv);
                return sort.dir === 'asc' ? cmp : -cmp;
            });
        }
        return rows;
    }, [sessions, search, statusFilter, sort]);

    const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

    const columns = [
        {
            key: 'id',
            label: 'ID Sesi',
            sortable: true,
            render: (r) => (
                <button onClick={() => setDetail(r)} className="font-mono text-xs text-brand hover:underline cursor-pointer">
                    {r.id}
                </button>
            ),
        },
        { key: 'project', label: 'Proyek', sortable: true },
        { key: 'device', label: 'Perangkat', render: (r) => <span className="text-sm text-ink">{r.device}</span> },
        { key: 'date', label: 'Tanggal', render: (r) => <span className="text-xs text-ink-muted">{r.date}</span> },
        { key: 'photos', label: 'Foto', align: 'right' },
        { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge tone={statusTone[r.status]} dot pulse={r.status === 'capturing'}>{statusLabel[r.status]}</StatusBadge> },
        { key: 'output', label: 'Output', render: (r) => (r.output === '—' ? <span className="text-sm text-ink-faint">—</span> : <StatusBadge tone={outputTone[r.output]}>{r.output}</StatusBadge>) },
    ];

    return (
        <AdminLayout title="Sesi Foto">
            <Head title="Sesi Foto - Photobooth Studio" />

            <PageHeader
                title="Sesi Foto"
                description="Riwayat dan status sesi foto di seluruh perangkat."
                icon={Camera}
            />

            <div className="mb-4">
                <FilterBar>
                    <SearchInput
                        placeholder="Cari ID sesi, proyek, atau perangkat…"
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
                            { value: 'all', label: 'Semua' },
                            { value: 'completed', label: 'Selesai' },
                            { value: 'processing', label: 'Diproses' },
                            { value: 'capturing', label: 'Mengambil' },
                            { value: 'failed', label: 'Gagal' },
                        ]}
                    />
                </FilterBar>
            </div>

            {filtered.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={Camera}
                        title="Belum ada sesi"
                        description="Belum ada sesi foto yang cocok dengan filter Anda."
                    />
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <Table columns={columns} rows={pageRows} rowKey="id" sort={sort} onSort={setSort} onRowClick={setDetail} />
                    <Pagination
                        page={page}
                        total={filtered.length}
                        perPage={perPage}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </Card>
            )}

            {/* Detail drawer */}
            <Drawer
                open={!!detail}
                onClose={() => setDetail(null)}
                title={detail?.id}
                description={detail ? `${detail.project} · ${detail.device}` : ''}
                icon={Camera}
                size="md"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            icon={Printer}
                            onClick={() => toast({ tone: 'success', title: 'Perintah cetak dikirim' })}
                        >
                            Cetak ulang
                        </Button>
                        <Button
                            icon={QrCode}
                            onClick={() => toast({ tone: 'success', title: 'QR link dibuat', message: 'Pelanggan dapat mengunduh foto via QR.' })}
                        >
                            Bagikan QR
                        </Button>
                    </>
                }
            >
                {detail && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <Info label="Proyek" value={detail.project} />
                            <Info label="Perangkat" value={detail.device} />
                            <Info label="Template" value={detail.template} />
                            <Info label="Tanggal" value={detail.date} />
                            <Info label="Jumlah foto" value={`${detail.photos} strip`} />
                            <div>
                                <p className="text-xs text-ink-faint">Status</p>
                                <div className="mt-1">
                                    <StatusBadge tone={statusTone[detail.status]} dot>
                                        {statusLabel[detail.status]}
                                    </StatusBadge>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-card border border-edge bg-slate-50 p-4 text-sm text-ink-muted">
                            Pratinjau hasil foto sesi ini dapat diakses dari halaman Galeri.
                            <div className="mt-2">
                                <Button variant="secondary" size="sm" icon={Eye} onClick={() => toast({ tone: 'info', title: 'Buka di galeri' })}>
                                    Lihat di galeri
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </AdminLayout>
    );
}

function Info({ label, value }) {
    return (
        <div>
            <p className="text-xs text-ink-faint">{label}</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
        </div>
    );
}
