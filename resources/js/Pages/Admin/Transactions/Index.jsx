import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Receipt, Download, CreditCard } from 'lucide-react';
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
    useToast,
} from '@/Components/ui';

const transactions = [
    { id: 'TRX-9981', project: 'Photobox Retail Grand Mall', device: 'Booth #01 Main Hall', qty: 2, total: 35000, method: 'QRIS Statis', status: 'paid', date: '2026-08-25 14:32' },
    { id: 'TRX-9980', project: 'Wedding Party Classic Event', device: 'Booth #02 VIP Stage', qty: 4, total: 70000, method: 'E-Wallet DANA', status: 'paid', date: '2026-08-25 14:15' },
    { id: 'TRX-9979', project: 'Self Studio Cafe Corner', device: 'Booth #03 Lounge Bar', qty: 1, total: 25000, method: 'Cash / Tunai', status: 'pending', date: '2026-08-25 13:50' },
    { id: 'TRX-9978', project: 'Photobox Retail Grand Mall', device: 'Booth #01 Main Hall', qty: 2, total: 35000, method: 'QRIS GoPay', status: 'paid', date: '2026-08-25 13:12' },
    { id: 'TRX-9977', project: 'Self Studio Cafe Corner', device: 'Booth #04 Outdoor Deck', qty: 2, total: 35000, method: 'QRIS OVO', status: 'refunded', date: '2026-08-24 18:44' },
    { id: 'TRX-9976', project: 'Wedding Party Classic Event', device: 'Booth #02 VIP Stage', qty: 3, total: 52500, method: 'E-Wallet LinkAja', status: 'paid', date: '2026-08-24 17:20' },
];

const statusTone = { paid: 'success', pending: 'warning', refunded: 'neutral', failed: 'danger' };
const statusLabel = { paid: 'Lunas', pending: 'Pending', refunded: 'Refund', failed: 'Gagal' };

const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');

export default function Index() {
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(8);
    const [sort, setSort] = useState(null);

    const paidTotal = transactions.filter((t) => t.status === 'paid').reduce((s, t) => s + t.total, 0);
    const todayTotal = transactions.filter((t) => t.date.startsWith('2026-08-25')).reduce((s, t) => s + t.total, 0);

    const filtered = useMemo(() => {
        let rows = [...transactions];
        if (status !== 'all') rows = rows.filter((r) => r.status === status);
        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter(
                (r) =>
                    r.id.toLowerCase().includes(q) ||
                    r.project.toLowerCase().includes(q) ||
                    r.method.toLowerCase().includes(q),
            );
        }
        if (sort) {
            rows.sort((a, b) => {
                const av = String(a[sort.key] ?? '');
                const bv = String(b[sort.key] ?? '');
                const cmp = av.localeCompare(bv, undefined, { numeric: true });
                return sort.dir === 'asc' ? cmp : -cmp;
            });
        }
        return rows;
    }, [transactions, search, status, sort]);

    const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

    const columns = [
        {
            key: 'id',
            label: 'ID Transaksi',
            sortable: true,
            render: (r) => <span className="font-mono text-xs text-brand">{r.id}</span>,
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
        { key: 'qty', label: 'Jumlah', align: 'right', render: (r) => <span className="text-sm">{r.qty} strip</span> },
        { key: 'method', label: 'Metode', render: (r) => <span className="text-sm text-ink">{r.method}</span> },
        { key: 'total', label: 'Total', align: 'right', sortable: true, render: (r) => <span className="font-semibold text-ink">{fmt(r.total)}</span> },
        { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge tone={statusTone[r.status]} dot>{statusLabel[r.status]}</StatusBadge> },
        { key: 'date', label: 'Tanggal', align: 'right', render: (r) => <span className="text-xs text-ink-muted">{r.date}</span> },
    ];

    return (
        <AdminLayout title="Transaksi">
            <Head title="Transaksi - Photobooth Studio" />

            <PageHeader
                title="Transaksi"
                description="Pantau pendapatan dan riwayat transaksi cetak photo strip."
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
                <StatCard label="Jumlah Transaksi" value={String(transactions.length)} tone="slate" icon={Receipt} />
            </div>

            <div className="mb-4">
                <FilterBar>
                    <SearchInput
                        placeholder="Cari ID, proyek, atau metode…"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full lg:w-80"
                    />
                    <FilterPill
                        value={status}
                        onChange={(v) => {
                            setStatus(v);
                            setPage(1);
                        }}
                        options={[
                            { value: 'all', label: 'Semua' },
                            { value: 'paid', label: 'Lunas' },
                            { value: 'pending', label: 'Pending' },
                            { value: 'refunded', label: 'Refund' },
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
                        description="Belum ada transaksi yang cocok dengan filter Anda."
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
        </AdminLayout>
    );
}
