import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight, Plus, Download, Landmark } from 'lucide-react';
import {
    PageHeader,
    Button,
    Card,
    CardHeader,
    CardBody,
    StatCard,
    StatusBadge,
    Table,
    Pagination,
    FilterPill,
    FilterBar,
    useToast,
    EmptyState,
} from '@/Components/ui';

const mutasi = [
    { id: 'MUT-001', type: 'Pencairan Otomatis', ref: 'TRX-9981', amount: 35000, isIncome: true, date: '25 Agu 2026 · 14:32', method: 'Automatis' },
    { id: 'MUT-002', type: 'Pencairan Otomatis', ref: 'TRX-9980', amount: 70000, isIncome: true, date: '25 Agu 2026 · 14:15', method: 'Automatis' },
    { id: 'MUT-003', type: 'Biaya Langganan', ref: 'Event Pro', amount: 699000, isIncome: false, date: '20 Agu 2026 · 09:00', method: 'Langganan' },
    { id: 'MUT-004', type: 'Top Up Saldo', ref: 'Transfer Bank', amount: 1000000, isIncome: true, date: '12 Agu 2026 · 10:11', method: 'Manual' },
];

const income = mutasi.filter((m) => m.isIncome).reduce((s, m) => s + m.amount, 0);
const expense = mutasi.filter((m) => !m.isIncome).reduce((s, m) => s + m.amount, 0);
const balance = 4850000 + income - expense;

const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');

export default function Index() {
    const { toast } = useToast();
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(6);

    const visible = useMemo(
        () => (filter === 'all' ? mutasi : mutasi.filter((m) => (filter === 'income' ? m.isIncome : !m.isIncome))),
        [filter],
    );

    const columns = [
        {
            key: 'type',
            label: 'Mutasi',
            render: (r) => (
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-9 w-9 items-center justify-center rounded-input ${
                            r.isIncome ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                        }`}
                    >
                        {r.isIncome ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                        <p className="font-medium text-ink">{r.type}</p>
                        <p className="text-xs text-ink-muted">{r.ref}</p>
                    </div>
                </div>
            ),
        },
        { key: 'date', label: 'Tanggal', render: (r) => <span className="text-sm text-ink-muted">{r.date}</span> },
        { key: 'method', label: 'Metode', render: (r) => <StatusBadge tone="neutral">{r.method}</StatusBadge> },
        {
            key: 'amount',
            label: 'Nominal',
            align: 'right',
            render: (r) => (
                <span className={`font-medium tabular-nums ${r.isIncome ? 'text-success' : 'text-ink'}`}>
                    {r.isIncome ? '+' : '−'} {fmt(r.amount)}
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title="Dompet">
            <Head title="Dompet - Photobooth Studio" />

            <PageHeader
                title="Dompet"
                description="Saldo operator dan riwayat mutasi transaksi photobooth."
                icon={WalletIcon}
                actions={
                    <Button icon={Plus} onClick={() => toast({ tone: 'info', title: 'Top up', message: 'Pembayaran top up diarahkan ke bank terkait.' })}>
                        Top Up
                    </Button>
                }
            />

            {/* Balance card */}
            <div className="mb-6">
                <div className="relative overflow-hidden rounded-card border border-brand/20 bg-gradient-to-br from-brand to-brand-dark p-6 text-white sm:p-8">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                    <div className="pointer-events-none absolute -bottom-14 -left-8 h-40 w-40 rounded-full bg-white/5" />
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-brand-light/80">Saldo Utama</p>
                            <p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{fmt(balance)}</p>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-light/80">
                                <Landmark className="h-3.5 w-3.5" /> Siap untuk pencairan
                            </p>
                        </div>
                        <div className="flex gap-2.5">
                            <button
                                onClick={() => toast({ tone: 'info', title: 'Tarik saldo', message: 'Ajukan penarikan ke rekening bank terdaftar.' })}
                                className="rounded-input bg-white/95 px-4 py-2 text-sm font-semibold text-brand-dark transition-colors hover:bg-white cursor-pointer"
                            >
                                Tarik Saldo
                            </button>
                            <button
                                onClick={() => toast({ tone: 'info', title: 'Unduh laporan', message: 'Laporan mutasi diunduh sebagai CSV.' })}
                                className="flex items-center gap-2 rounded-input border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 cursor-pointer"
                            >
                                <Download className="h-4 w-4" /> Laporan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Pemasukan" value={fmt(income)} note="30 hari terakhir" tone="success" />
                <StatCard label="Total Pengeluaran" value={fmt(expense)} note="30 hari terakhir" tone="danger" />
                <StatCard label="Jumlah Transaksi" value={mutasi.length} note="Semua waktu" />
            </div>

            <Card>
                <CardHeader
                    title="Riwayat Mutasi"
                    description="Semua perubahan saldo dompet"
                    icon={WalletIcon}
                    actions={
                        <FilterPill
                            value={filter}
                            onChange={(v) => {
                                setFilter(v);
                                setPage(1);
                            }}
                            options={[
                                { value: 'all', label: 'Semua' },
                                { value: 'income', label: 'Masuk' },
                                { value: 'expense', label: 'Keluar' },
                            ]}
                        />
                    }
                />
                {visible.length === 0 ? (
                    <EmptyState icon={WalletIcon} title="Tidak ada mutasi" description="Belum ada mutasi untuk filter ini." />
                ) : (
                    <>
                        <Table columns={columns} rows={visible.slice((page - 1) * perPage, page * perPage)} rowKey="id" />
                        <Pagination page={page} total={visible.length} perPage={perPage} onPageChange={setPage} onPerPageChange={setPerPage} />
                    </>
                )}
            </Card>
        </AdminLayout>
    );
}
