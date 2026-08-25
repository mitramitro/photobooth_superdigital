import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Crown, Check, Zap, Sparkles } from 'lucide-react';

export default function Index() {
    const plans = [
        { name: 'Photobox Starter', price: 'Rp 299.000', period: '/ bulan', desc: 'Cocok untuk 1 lokasi photobooth retail', features: ['Mendukung 1 Perangkat Booth', 'Max 5 Proyek Aktif', 'Filter & Frame Standard', 'Scalar Sanctum API Access'], isPopular: false },
        { name: 'Photobox Event Pro', price: 'Rp 699.000', period: '/ bulan', desc: 'Solusi terbaik untuk penyedia jasa Photobooth Event', features: ['Mendukung 5 Perangkat Booth', 'Proyek Tanpa Batas', 'Custom Frame & Watermark', 'Live Kiosk Telemetry', 'Mobile App QR Instant Sync'], isPopular: true },
        { name: 'Enterprise Unlimited', price: 'Rp 1.499.000', period: '/ bulan', desc: 'Untuk bisnis photobox retail multi-cabang', features: ['Perangkat Booth Tanpa Batas', 'SLA Uptime 99.9%', 'Custom Domain & Branding', 'Dedicated Support 24/7'], isPopular: false },
    ];

    return (
        <AdminLayout title="Paket Langganan Photobooth Studio">
            <Head title="Langganan - Photobooth Studio" />

            <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/40 text-xs font-bold text-brand-red mb-3">
                    <Crown className="w-3.5 h-3.5" />
                    <span>PAKET LANGGANAN PLATFORM</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white">Pilih Paket Langganan Photobooth</h2>
                <p className="text-sm text-slate-300 mt-1">Tingkatkan kapasitas perangkat booth dan fitur proyek photobooth sesuai kebutuhan bisnis Anda.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, idx) => (
                    <div key={idx} className={`glass-panel p-6 sm:p-8 rounded-3xl border flex flex-col justify-between relative ${plan.isPopular ? 'border-brand-red shadow-2xl scale-[1.03] bg-gradient-to-b from-brand-red/10 to-brand-surface' : 'border-slate-800'}`}>
                        {plan.isPopular && (
                            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold bg-brand-red text-white shadow-lg">RECOMMENDED FOR EVENTS</span>
                        )}

                        <div>
                            <h3 className="text-xl font-extrabold text-white mb-1">{plan.name}</h3>
                            <p className="text-xs text-slate-400 mb-6">{plan.desc}</p>

                            <div className="mb-6">
                                <span className="text-3xl font-black text-white">{plan.price}</span>
                                <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
                            </div>

                            <ul className="space-y-3 text-xs text-slate-300 mb-8">
                                {plan.features.map((feat, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-brand-green shrink-0" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button onClick={() => alert(`Mengaktifkan langganan ${plan.name}...`)} className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs shadow-lg transition-all ${plan.isPopular ? 'bg-brand-red text-white hover:bg-brand-red-hover' : 'bg-brand-surface border border-slate-700 text-white hover:border-brand-blue hover:text-brand-blue'}`}>
                            Pilih Paket Langganan
                        </button>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
