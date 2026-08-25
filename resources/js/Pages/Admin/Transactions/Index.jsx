import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Receipt, 
    Filter, 
    Search, 
    Download, 
    Printer, 
    CheckCircle2, 
    Clock, 
    XCircle,
    QrCode,
    CreditCard,
    DollarSign
} from 'lucide-react';

export default function Index() {
    const [transactions, setTransactions] = useState([
        { id: 'TRX-9981', project: 'Photobox Retail Grand Mall', device: 'Booth #01 Main Hall', qty: '2 Photo Strips', total: 'Rp 35.000', method: 'QRIS Statis', status: 'Lunas', statusColor: 'green', date: '2026-08-25 14:32' },
        { id: 'TRX-9980', project: 'Wedding Party Classic Event', device: 'Booth #02 VIP Stage', qty: '4 Photo Strips', total: 'Rp 70.000', method: 'E-Wallet DANA', status: 'Lunas', statusColor: 'green', date: '2026-08-25 14:15' },
        { id: 'TRX-9979', project: 'Self Studio Cafe Corner', device: 'Booth #03 Lounge Bar', qty: '1 Photo Strip', total: 'Rp 25.000', method: 'Cash / Tunai', status: 'Pending', statusColor: 'blue', date: '2026-08-25 13:50' },
        { id: 'TRX-9978', project: 'Photobox Retail Grand Mall', device: 'Booth #01 Main Hall', qty: '2 Photo Strips', total: 'Rp 35.000', method: 'QRIS GoPay', status: 'Lunas', statusColor: 'green', date: '2026-08-25 13:12' },
        { id: 'TRX-9977', project: 'Self Studio Cafe Corner', device: 'Booth #04 Outdoor Deck', qty: '2 Photo Strips', total: 'Rp 35.000', method: 'QRIS OVO', status: 'Refunded', statusColor: 'red', date: '2026-08-24 18:44' },
    ]);

    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

    const filteredTransactions = selectedStatusFilter === 'all' 
        ? transactions 
        : transactions.filter(t => t.status.toLowerCase() === selectedStatusFilter.toLowerCase());

    return (
        <AdminLayout title="Riwayat Transaksi & Keuangan Photobooth">
            <Head title="Tabel Transaksi - Photobooth Studio" />

            {/* Header Summary Banner */}
            <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-panel border border-brand-green/40 bg-gradient-to-r from-brand-dark via-brand-surface to-brand-green/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/40 text-xs font-bold text-brand-green mb-3">
                        <Receipt className="w-3.5 h-3.5" />
                        <span>REKAP TRANSAKSI PENJUALAN</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">
                        Laporan Tabel Transaksi Photobooth
                    </h2>
                    <p className="text-slate-300 text-sm mt-1 max-w-xl">
                        Pantau seluruh riwayat transaksi cetak photo strip, metode pembayaran QRIS/E-wallet/Tunai, dan status pembayaran lunas.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-brand-dark p-4 rounded-2xl border border-slate-800 shrink-0">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Total Pendapatan Hari Ini</span>
                        <p className="text-2xl font-extrabold text-brand-green">Rp 1.485.000</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar & Table Section */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-brand-blue" />
                        <span className="text-xs font-bold text-slate-300 uppercase">Filter Status:</span>
                        <div className="flex gap-1.5">
                            {['all', 'lunas', 'pending', 'refunded'].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setSelectedStatusFilter(st)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-colors ${selectedStatusFilter === st ? 'bg-brand-blue text-brand-dark' : 'bg-brand-surface text-slate-400 hover:text-white'}`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={() => alert('Mengeksport laporan transaksi ke Excel/CSV...')} className="py-2 px-4 rounded-xl bg-brand-surface border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>

                {/* Tabel Transaksi */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 px-3">ID Transaksi</th>
                                <th className="pb-3 px-3">Proyek & Perangkat</th>
                                <th className="pb-3 px-3">Jumlah Photo Strip</th>
                                <th className="pb-3 px-3">Metode Pembayaran</th>
                                <th className="pb-3 px-3">Total</th>
                                <th className="pb-3 px-3">Status</th>
                                <th className="pb-3 px-3 text-right">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                            {filteredTransactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3.5 px-3 font-mono font-bold text-brand-blue">
                                        {trx.id}
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <p className="font-bold text-white">{trx.project}</p>
                                        <p className="text-[10px] text-slate-400">{trx.device}</p>
                                    </td>
                                    <td className="py-3.5 px-3 text-slate-300">
                                        {trx.qty}
                                    </td>
                                    <td className="py-3.5 px-3 font-medium text-slate-200">
                                        {trx.method}
                                    </td>
                                    <td className="py-3.5 px-3 font-extrabold text-white">
                                        {trx.total}
                                    </td>
                                    <td className="py-3.5 px-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                                            trx.statusColor === 'green' ? 'bg-brand-green/10 text-brand-green border border-brand-green/30' :
                                            trx.statusColor === 'blue' ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/30' :
                                            'bg-brand-red/10 text-brand-red border border-brand-red/30'
                                        }`}>
                                            {trx.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-3 text-right text-slate-400 font-mono text-[11px]">
                                        {trx.date}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
