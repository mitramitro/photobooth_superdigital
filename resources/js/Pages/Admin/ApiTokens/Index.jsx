import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    KeyRound, 
    Smartphone, 
    Plus, 
    Copy, 
    Check, 
    Trash2, 
    ShieldCheck, 
    BookOpen, 
    Code2,
    Sparkles,
    AlertCircle
} from 'lucide-react';

export default function Index() {
    const [tokens, setTokens] = useState([
        { id: 1, name: 'Flutter Mobile App (iOS)', token: '1|sanctum_token_8891abc728x9910', permissions: ['photos:read', 'sessions:create'], created: '2 jam yang lalu', lastUsed: '5 menit yang lalu' },
        { id: 2, name: 'Android Photobooth App', token: '2|sanctum_token_7721xyz991q0021', permissions: ['photos:read', 'sessions:create', 'print:send'], created: '1 hari yang lalu', lastUsed: '12 menit yang lalu' },
        { id: 3, name: 'Kiosk Controller Station #01', token: '3|sanctum_token_9912kiosk8817263', permissions: ['*'], created: '3 hari yang lalu', lastUsed: 'Sedang aktif' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [tokenName, setTokenName] = useState('');
    const [copiedToken, setCopiedToken] = useState(null);

    const handleCreateToken = (e) => {
        e.preventDefault();
        if (!tokenName) return;

        const newToken = {
            id: Date.now(),
            name: tokenName,
            token: `${tokens.length + 1}|sanctum_token_${Math.random().toString(36).substring(2, 12)}`,
            permissions: ['photos:read', 'sessions:create'],
            created: 'Baru saja',
            lastUsed: 'Belum pernah',
        };

        setTokens([newToken, ...tokens]);
        setTokenName('');
        setShowModal(false);
    };

    const handleCopy = (tokenString) => {
        navigator.clipboard.writeText(tokenString);
        setCopiedToken(tokenString);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    const handleDelete = (id) => {
        setTokens(tokens.filter(t => t.id !== id));
    };

    return (
        <AdminLayout title="Manajemen Sanctum API Token Mobile">
            <Head title="Sanctum API Tokens - Photobooth Studio" />

            {/* Header Banner */}
            <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-r from-brand-blue/15 via-brand-dark to-brand-green/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-slate-700 text-xs font-bold text-brand-blue mb-3">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>SANCTUM API ENGINE READY</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">
                        Integrasi Aplikasi Mobile & Sanctum API Tokens
                    </h2>
                    <p className="text-slate-300 text-sm mt-1 max-w-xl">
                        Kelola kunci autentikasi Bearer Token untuk pengembang aplikasi mobile (iOS/Android/Flutter) dan perangkat Photobooth Kiosk.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <Link
                        href="/docs"
                        className="py-3 px-5 rounded-2xl bg-brand-green text-brand-dark font-extrabold text-sm shadow-lg hover:bg-brand-green-light transition-all flex items-center gap-2"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>Buka Scalar API Docs</span>
                    </Link>

                    <button
                        onClick={() => setShowModal(true)}
                        className="py-3 px-5 rounded-2xl bg-brand-blue text-brand-dark font-extrabold text-sm shadow-lg hover:bg-brand-blue-light transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Buat Token Baru</span>
                    </button>
                </div>
            </div>

            {/* Tokens List Table */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-brand-blue" />
                        <h3 className="font-bold text-white text-base">Token Aktif ({tokens.length})</h3>
                    </div>
                </div>

                <div className="space-y-4">
                    {tokens.map((t) => (
                        <div key={t.id} className="p-4 sm:p-5 rounded-2xl bg-brand-surface/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-white text-sm">{t.name}</span>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-blue/20 text-brand-blue border border-brand-blue/30">
                                        Bearer Token
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-brand-dark/80 px-3 py-1.5 rounded-lg border border-slate-800 w-fit">
                                    <span>{t.token}</span>
                                    <button 
                                        onClick={() => handleCopy(t.token)}
                                        className="text-slate-400 hover:text-brand-blue transition-colors ml-2"
                                        title="Copy token"
                                    >
                                        {copiedToken === t.token ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                <div className="text-right hidden sm:block">
                                    <p className="text-slate-300 font-medium">Terakhir Digunakan: {t.lastUsed}</p>
                                    <p className="text-[10px]">Dibuat: {t.created}</p>
                                </div>

                                <button
                                    onClick={() => handleDelete(t.id)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-brand-red hover:bg-brand-red/10 transition-colors"
                                    title="Hapus Token"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Token Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-blue/40 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-extrabold text-white mb-2">Buat Sanctum API Token</h3>
                        <p className="text-xs text-slate-400 mb-6">Masukkan nama aplikasi mobile atau klien yang akan terhubung ke backend Laravel Sanctum.</p>

                        <form onSubmit={handleCreateToken} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Nama Token App</label>
                                <input
                                    type="text"
                                    value={tokenName}
                                    onChange={(e) => setTokenName(e.target.value)}
                                    placeholder="Contoh: Flutter Mobile iOS Client"
                                    className="w-full px-4 py-3 bg-brand-dark border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-blue"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 rounded-xl bg-brand-blue text-brand-dark font-extrabold text-xs shadow-lg hover:bg-brand-blue-light"
                                >
                                    Generate Token
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
