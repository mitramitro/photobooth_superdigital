import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Receipt, Download, CreditCard, Printer, Eye, QrCode } from 'lucide-react';
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
    StatCard,
    Drawer,
    useToast,
} from '@/Components/ui';

const rows = [
    { id: 'SESH-8891', trxId: 'TRX-9981', project: 'Photobox Retail Grand Mall', device: 'Booth #01 Main Hall', date: '2026-08-25', start: '25 Agu · 14:32', end: '25 Agu · 14:44', duration: '12 mnt', style: 'Cyberpunk Neon', qty: 4, reprints: 1, payStatus: 'paid', sesiStatus: 'completed', total: 70000, method: 'QRIS Statis' },
    { id: 'SESH-8890', trxId: 'TRX-9980', project: 'Wedding Party Classic Event', device: 'Booth #02 VIP Stage', date: '2026-08-25', start: '25 Agu · 14:15', end: '25 Agu · 14:25', duration: '10 mnt', style: 'Wedding Elegant', qty: 4, reprints: 0, payStatus: 'paid', sesiStatus: 'completed', total: 70000, method: 'E-Wallet DANA' },
    { id: 'SESH-8889', trxId: 'TRX-9979', project: 'Self Studio Cafe Corner', device: 'Booth #03 Lounge Bar', date: '2026-08-25', start: '25 Agu · 13:50', end: '25 Agu · 13:58', duration: '08 mnt', style: 'Birthday Retro', qty: 3, reprints: 0, payStatus: 'pending', sesiStatus: 'processing', total: 52500, method: 'Cash / Tunai' },
    { id: 'SESH-8893', trxId: 'TRX-9982', project: 'Photobox Retail Grand Mall', device: 'Booth #01 Main Hall', date: '2026-08-25', start: '25 Agu · 13:12', end: '25 Agu · 13:20', duration: '08 mnt', style: 'Neon Party', qty: 4, reprints: 0, payStatus: 'voucher', sesiStatus: 'capturing', total: 0, method: 'Voucher · Kode Unik' },
    { id: 'SESH-8887', trxId: 'TRX-9978', project: 'Self Studio Cafe Corner', device: 'Booth #04 Outdoor Deck', date: '2026-08-24', start: '24 Agu · 19:02', end: '24 Agu · 19:08', duration: '06 mnt', style: 'Minimalist B&W', qty: 2, reprints: 2, payStatus: 'paid', sesiStatus: 'completed', total: 35000, method: 'QRIS GoPay' },
    { id: 'SESH-8886', trxId: 'TRX-9977', project: 'Wedding Party Classic Event', device: 'Booth #02 VIP Stage', date: '2026-08-24', start: '24 Agu · 18:42', end: '24 Agu · 18:50', duration: '08 mnt', style: 'Wedding Elegant', qty: 3, reprints: 0, payStatus: 'refunded', sesiStatus: 'failed', total: 52500, method: 'QRIS OVO' },
    { id: 'SESH-8885', trxId: 'TRX-9976', project: 'Wedding Party Classic Event', device: 'Booth #02 VIP Stage', date: '2026-08-24', start: '24 Agu · 17:20', end: '24 Agu · 17:27', duration: '07 mnt', style: 'Neon Party', qty: 2, reprints: 0, payStatus: 'paid', sesiStatus: 'completed', total: 35000, method: 'E-Wallet LinkAja' },
];

const payTone = { paid: 'success', pending: 'warning', voucher: 'info', refunded: 'neutral', failed: 'danger' };
const payLabel = { paid: 'Lunas', pending: 'Pending', voucher: 'Voucher', refunded: 'Refund', failed: 'Gagal' };
const sesiTone = { completed: 'success', processing: 'info', capturing: 'warning', failed: 'danger' };
const sesiLabel = { completed: 'Selesai', processing: 'Diproses', capturing: 'Mengambil', failed: 'Gagal' };

const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');

export default function Index() {
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [payFilter, setPayFilter] = useState('all');
    const [sesiFilter, setSesiFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(8);
    const [detail, setDetail] = useState(null);
    const [sort, setSort] = useState(null);

    const paidTotal = rows.filter((r) => r.payStatus === 'paid').reduce((s, r) => s + r.total, 0);
    const todayTotal = rows.filter((r) => r.date === '2026-08-25').reduce((s, r) => s + r.total, 0);

    const filtered = useMemo(() => {
        let list = [...rows];
        if (payFilter !== 'all') list = list.filter((r) => r.payStatus === payFilter);
        if (sesiFilter !== 'all') list = list.filter((r) => r.sesiStatus === sesiFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (r) =>
                    r.id.toLowerCase().includes(q) ||
                    r.trxId.toLowerCase().includes(q) ||
                    r.project.toLowerCase().includes(q) ||
                    r.method.toLowerCase().includes(q),
            );
        }
        if (sort) {
            list.sort((a, b) => {
                const av = String(a[sort.key] ?? '');
                const bv = String(b[sort.key] ?? '');
                const cmp = av.localeCompare(bv, undefined, { numeric: true });
                return sort.dir === 'asc' ? cmp : -cmp;
            });
        }
        return list;
    }, [rows, search, payFilter, sesiFilter, sort]);

    const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

    const columns = [
        {
            key: 'no',
            label: 'No',
            render: (r) => <span className="text-sm text-ink-muted">{pageRows.indexOf(r) + (page - 1) * perPage + 1}</span>,
        },
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
        {
            key: 'project',
            label: 'Proyek',
            sortable: true,
            render: (r) => (
                <div>
                    <p className="text-sm font-medium text-ink">{r.project}</p>
                    <p className="text-xs text-ink-muted">{r.device}</p>
                </div>
            ),
        },
        { key: 'start', label: 'Waktu Mulai', render: (r) => <span className="text-xs text-ink-muted">{r.start}</span> },
        { key: 'end', label: 'Waktu Selesai', render: (r) => <span className="text-xs text-ink-muted">{r.end}</span> },
        { key: 'duration', label: 'Durasi', render: (r) => <span className="text-sm text-ink">{r.duration}</span> },
        { key: 'style', label: 'Gaya', render: (r) => <span className="text-sm text-ink">{r.style}</span> },
        { key: 'qty', label: 'Jumlah', align: 'right', render: (r) => <span className="text-sm">{r.qty} strip</span> },
        {
            key: 'reprints',
            label: 'Cetak Ulang',
            align: 'right',
            render: (r) =>
                r.reprints === 0 ? (
                    <span className="text-sm text-ink-faint">—</span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-ink">
                        <Printer className="h-3.5 w-3.5 text-ink-muted" />
                        {r.reprints}
                    </span>
                ),
        },
        {
            key: 'payStatus',
            label: 'Status Pembayaran',
            sortable: true,
            render: (r) => (
                <StatusBadge tone={payTone[r.payStatus]} dot>
                    {payLabel[r.payStatus]}
                </StatusBadge>
            ),
        },
        {
            key: 'sesiStatus',
            label: 'Status Sesi',
            sortable: true,
            render: (r) => (
                <StatusBadge tone={sesiTone[r.sesiStatus]} dot pulse={r.sesiStatus === 'capturing'}>
                    {sesiLabel[r.sesiStatus]}
                </StatusBadge>
            ),
        },
        {
            key: 'detail',
            label: 'Detail',
            align: 'right',
            render: (r) => (
                <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={(e) => {
                        e.stopPropagation();
                        setDetail(r);
                    }}
                >
                    Detail
                </Button>
            ),
        },
    ];

    return (
        <AdminLayout title="Transaksi">
            <Head title="Transaksi - Photobooth Studio" />

            <PageHeader
                title="Transaksi"
                description="Sesi foto beserta transaksi pembayaran per sesi."
                icon={Receipt}
                actions={
                    <Button
                        variant="secondary"
                        icon={Download}
                        onClick={() => toast({ tone: 'success', title: 'Laporan diekspor', message: 'Transaksi berhasil diekspor ke CSV.' })}
                    >
                        Export CSV
                    </Button>
                }
            />

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Pendapatan Hari Ini" value={fmt(todayTotal)} tone="green" icon={CreditCard} />
                <StatCard label="Total Pendapatan (Lunas)" value={fmt(paidTotal)} tone="blue" icon={Receipt} />
                <StatCard label="Jumlah Sesi" value={String(rows.length)} tone="slate" icon={Receipt} />
            </div>

            <div className="mb-4">
                <FilterBar>
                    <SearchInput
                        placeholder="Cari ID sesi, proyek, atau metode…"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full lg:w-80"
                    />
                    <FilterPill
                        value={payFilter}
                        onChange={(v) => {
                            setPayFilter(v);
                            setPage(1);
                        }}
                        options={[
                            { value: 'all', label: 'Semua' },
                            { value: 'paid', label: 'Lunas' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'voucher', label: 'Voucher' },
                            { value: 'refunded', label: 'Refund' },
                            { value: 'failed', label: 'Gagal' },
                        ]}
                    />
                    <FilterPill
                        value={sesiFilter}
                        onChange={(v) => {
                            setSesiFilter(v);
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
                        icon={Receipt}
                        title="Belum ada transaksi"
                        description="Belum ada sesi atau transaksi yang cocok dengan filter Anda."
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
                title={detail ? `${detail.id} · ${detail.trxId}` : ''}
                description={detail ? `${detail.project} · ${detail.device}` : ''}
                icon={Receipt}
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
                            <Info label="ID Sesi" value={detail.id} mono />
                            <Info label="ID Transaksi" value={detail.trxId} mono />
                            <Info label="Proyek" value={detail.project} />
                            <Info label="Perangkat" value={detail.device} />
                            <Info label="Gaya" value={detail.style} />
                            <Info label="Jumlah" value={`${detail.qty} strip`} />
                            <Info label="Waktu Mulai" value={detail.start} />
                            <Info label="Waktu Selesai" value={detail.end} />
                            <Info label="Durasi" value={detail.duration} />
                            <Info label="Metode" value={detail.method} />
                            <Info label="Total" value={detail.total === 0 ? 'Gratis' : fmt(detail.total)} bold />
                            <div>
                                <p className="text-xs text-ink-faint">Status Pembayaran</p>
                                <div className="mt-1">
                                    <StatusBadge tone={payTone[detail.payStatus]} dot>
                                        {payLabel[detail.payStatus]}
                                    </StatusBadge>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-card border border-edge bg-slate-50 p-4">
                            <p className="text-xs text-ink-faint">Status Sesi</p>
                            <div className="mt-1">
                                <StatusBadge tone={sesiTone[detail.sesiStatus]} dot pulse={detail.sesiStatus === 'capturing'}>
                                    {sesiLabel[detail.sesiStatus]}
                                </StatusBadge>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </AdminLayout>
    );
}

function Info({ label, value, mono = false, bold = false }) {
    return (
        <div>
            <p className="text-xs text-ink-faint">{label}</p>
            <p className={`mt-0.5 text-sm ${mono ? 'font-mono' : ''} ${bold ? 'font-semibold' : 'font-medium'} text-ink`}>{value}</p>
        </div>
    );
}