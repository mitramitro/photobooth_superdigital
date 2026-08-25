import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, ShieldCheck } from 'lucide-react';

export default function Index() {
    return (
        <AdminLayout title="Dompet & Saldo Operator Photobooth">
            <Head title="Dompet Saldo - Photobooth Studio" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Balance Summary Card (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="p-8 rounded-3xl glass-panel border border-brand-green/40 bg-gradient-to-tr from-brand-dark via-brand-surface to-brand-green/20 shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Saldo Utama Photobooth</span>
                            <Wallet className="w-6 h-6 text-brand-green" />
                        </div>

                        <div className="mb-6">
                            <span className="text-4xl font-extrabold text-white tracking-tight">Rp 4.850.000</span>
                            <p className="text-xs text-brand-green font-semibold mt-1">● Saldo Siap Ditarik / Payout</p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => alert('Topup Saldo Dompet...')} className="flex-1 py-3 px-4 rounded-xl bg-brand-green text-brand-dark font-extrabold text-xs shadow-lg flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                <span>Top Up Saldo</span>
                            </button>

                            <button onClick={() => alert('Penarikan Saldo Ke Bank...')} className="flex-1 py-3 px-4 rounded-xl bg-brand-surface border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 hover:border-slate-500">
                                <ArrowUpRight className="w-4 h-4 text-brand-blue" />
                                <span>Tarik Saldo</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mutasi Saldo List (7 Cols) */}
                <div className="lg:col-span-7">
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
                        <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">Riwayat Mutasi Saldo Dompet</h3>

                        <div className="space-y-3">
                            {[
                                { id: 'MUT-001', type: 'Pencairan Otomatis TRX-9981', amount: '+ Rp 35.000', isIncome: true, date: '2026-08-25 14:32' },
                                { id: 'MUT-002', type: 'Pencairan Otomatis TRX-9980', amount: '+ Rp 70.000', isIncome: true, date: '2026-08-25 14:15' },
                                { id: 'MUT-003', type: 'Biaya Langganan Event Pro', amount: '- Rp 699.000', isIncome: false, date: '2026-08-20 09:00' },
                            ].map((mut) => (
                                <div key={mut.id} className="p-4 rounded-2xl bg-brand-surface/60 border border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${mut.isIncome ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'}`}>
                                            {mut.isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white">{mut.type}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">{mut.date}</p>
                                        </div>
                                    </div>
                                    <span className={`font-mono font-extrabold text-xs ${mut.isIncome ? 'text-brand-green' : 'text-brand-red'}`}>
                                        {mut.amount}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
