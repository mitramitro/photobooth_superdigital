import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Image as ImageIcon, 
    Plus, 
    Calendar, 
    Layers, 
    Download, 
    Printer, 
    QrCode, 
    Search, 
    Filter, 
    X,
    FolderKanban,
    Sparkles
} from 'lucide-react';

export default function Index() {
    const [galleryPhotos, setGalleryPhotos] = useState([
        { id: 'SESH-8891', project: 'Photobox Retail Grand Mall', date: '2026-08-25', session: 'Sesi #142', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop', template: 'Cyberpunk Neon' },
        { id: 'SESH-8890', project: 'Wedding Party Classic Event', date: '2026-08-25', session: 'Sesi #141', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop', template: 'Wedding Elegant' },
        { id: 'SESH-8889', project: 'Self Studio Cafe Corner', date: '2026-08-24', session: 'Sesi #140', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop', template: 'Retro 90s' },
        { id: 'SESH-8888', project: 'Photobox Retail Grand Mall', date: '2026-08-24', session: 'Sesi #139', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop', template: 'Cyberpunk Neon' },
    ]);

    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [filterProject, setFilterProject] = useState('all');

    return (
        <AdminLayout title="Galery Foto Event & Sesi Photobooth">
            <Head title="Galery Sesi - Photobooth Studio" />

            {/* Banner Header */}
            <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-r from-brand-blue/15 via-brand-dark to-brand-green/15 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-slate-700 text-xs font-bold text-brand-blue mb-3">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>GALERY SESI FOTO EVENT</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">
                        Koleksi Galery Photo Strip
                    </h2>
                    <p className="text-slate-300 text-sm mt-1 max-w-xl">
                        Lihat galeri hasil cetak foto berdasarkan proyek, rentang tanggal, dan sesi event. Tambahkan event baru untuk menyimpan album sesi.
                    </p>
                </div>

                <button
                    onClick={() => setShowAddEventModal(true)}
                    className="py-3.5 px-6 rounded-2xl bg-brand-blue text-brand-dark font-extrabold text-sm shadow-xl hover:bg-brand-blue-light transition-all flex items-center gap-2.5 shrink-0"
                >
                    <Plus className="w-5 h-5" />
                    <span>+ EVENT BARU</span>
                </button>
            </div>

            {/* Galery Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {galleryPhotos.map((photo) => (
                    <div key={photo.id} className="glass-panel rounded-3xl border border-slate-800 overflow-hidden glass-panel-hover group">
                        <div className="relative h-56 bg-slate-900 overflow-hidden">
                            <img src={photo.url} alt={photo.id} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
                            
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-brand-surface/90 text-brand-blue border border-slate-700 backdrop-blur-md">
                                {photo.id}
                            </span>
                        </div>

                        <div className="p-4 space-y-2">
                            <h4 className="font-bold text-white text-sm truncate">{photo.project}</h4>
                            <p className="text-[10px] text-slate-400">{photo.date} • {photo.session} • {photo.template}</p>

                            <div className="flex gap-2 pt-2">
                                <button onClick={() => alert(`Mengunduh photo strip ${photo.id}...`)} className="flex-1 py-2 rounded-xl bg-brand-surface border border-slate-700 hover:border-brand-green hover:text-brand-green text-xs font-bold text-slate-300 flex items-center justify-center gap-1">
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Download</span>
                                </button>

                                <button onClick={() => alert(`Pengiriman cetak photo strip ${photo.id}...`)} className="p-2 rounded-xl bg-brand-surface border border-slate-700 hover:border-brand-blue hover:text-brand-blue text-slate-300">
                                    <Printer className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal + Event Baru (Tambah Foto) */}
            {showAddEventModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-blue/50 max-w-md w-full shadow-2xl relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-extrabold text-white">+ Event Baru (Tambah Foto)</h3>
                            <button onClick={() => setShowAddEventModal(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); alert('Event baru berhasil ditambahkan!'); setShowAddEventModal(false); }} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">1. Pilih Proyek</label>
                                <select className="w-full px-4 py-3 bg-brand-dark border border-slate-700 rounded-xl text-sm text-white focus:outline-none">
                                    <option>Photobox Retail Grand Mall</option>
                                    <option>Wedding Party Classic Event</option>
                                    <option>Self Studio Cafe Corner</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">2. Pilih Rentang Tanggal</label>
                                <input type="date" defaultValue="2026-08-25" className="w-full px-4 py-3 bg-brand-dark border border-slate-700 rounded-xl text-sm text-white" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">3. Pilih Sesi</label>
                                <select className="w-full px-4 py-3 bg-brand-dark border border-slate-700 rounded-xl text-sm text-white focus:outline-none">
                                    <option>Sesi #142 (Main Hall)</option>
                                    <option>Sesi #141 (VIP Stage)</option>
                                    <option>Sesi #140 (Lounge Bar)</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full py-3.5 px-4 rounded-xl bg-brand-blue text-brand-dark font-extrabold text-sm shadow-xl">
                                Tambah Ke Galeri Event
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
