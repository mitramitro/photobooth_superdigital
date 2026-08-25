import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    FolderKanban, 
    Plus, 
    Settings, 
    Sliders, 
    Timer, 
    Grid, 
    Layers, 
    Sun, 
    Image as ImageIcon, 
    Monitor, 
    Play, 
    Edit, 
    Check, 
    X,
    Sparkles,
    Upload,
    Maximize,
    Smartphone
} from 'lucide-react';

export default function Index() {
    const [projects, setProjects] = useState([
        { 
            id: 'PRJ-001', 
            name: 'Photobox Retail Grand Mall', 
            template: 'photobox retail', 
            orientation: 'Portrait', 
            timer: 5, 
            layout: '4-Grid Strip', 
            frame: 'Cyberpunk Neon', 
            filter: 'Cyber Neon', 
            lighting: 'High Brightness', 
            thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
            welcomeMessage: 'Selamat Datang di Photobox Retail!',
            assignedDevice: 'Booth #01 Main Hall',
            isLive: true,
        },
        { 
            id: 'PRJ-002', 
            name: 'Wedding Party Classic Event', 
            template: 'Photobox - Event', 
            orientation: 'Landscape', 
            timer: 3, 
            layout: 'Classic 3-Strip', 
            frame: 'Wedding Elegant White', 
            filter: 'Sepia Warm', 
            lighting: 'Soft Studio Glow', 
            thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop',
            welcomeMessage: 'Welcome to Sarah & Alex Wedding!',
            assignedDevice: 'Booth #02 VIP Stage',
            isLive: false,
        },
        { 
            id: 'PRJ-003', 
            name: 'Self Studio Cafe Corner', 
            template: 'photobox self', 
            orientation: 'Portrait', 
            timer: 10, 
            layout: 'Single Portrait', 
            frame: 'Retro Vintage 90s', 
            filter: 'Noir B&W', 
            lighting: 'Natural Ambient', 
            thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
            welcomeMessage: 'Tap Screen to Start Self Studio Session',
            assignedDevice: 'Belum terhubung',
            isLive: false,
        },
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [activeProjectModal, setActiveProjectModal] = useState(null);
    const [modalTab, setModalTab] = useState('buka'); // 'buka' (controls) or 'ubah' (settings)

    // Form State for Add Proyek
    const [newProject, setNewProject] = useState({
        name: '',
        template: 'photobox retail',
        orientation: 'Portrait',
        welcomeMessage: '',
    });

    const handleCreateProject = (e) => {
        e.preventDefault();
        const created = {
            id: `PRJ-00${projects.length + 1}`,
            name: newProject.name,
            template: newProject.template,
            orientation: newProject.orientation,
            timer: 5,
            layout: '4-Grid Strip',
            frame: 'Standard Event Frame',
            filter: 'Original',
            lighting: 'Standard',
            thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop',
            welcomeMessage: newProject.welcomeMessage || 'Selamat Datang!',
            assignedDevice: 'Belum terhubung',
            isLive: false,
        };

        setProjects([created, ...projects]);
        setShowAddModal(false);
        setNewProject({ name: '', template: 'photobox retail', orientation: 'Portrait', welcomeMessage: '' });
    };

    return (
        <AdminLayout title="Manajemen Proyek Photobooth" hasLiveBooth={projects.some(p => p.isLive)}>
            <Head title="Manajemen Proyek - Photobooth Studio" />

            {/* Header Action Banner */}
            <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-r from-brand-red/15 via-brand-surface to-brand-blue/15 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-slate-700 text-xs font-bold text-gradient-rgb mb-3">
                        <FolderKanban className="w-3.5 h-3.5 text-brand-red" />
                        <span>WORKFLOW SISTEM PROYEK PHOTOBOOTH</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Kumpulan Proyek Photobooth
                    </h2>
                    <p className="text-slate-300 text-sm mt-1 max-w-xl">
                        Buat proyek photobooth terlebih dahulu (pilih template, timer, layout, & frame), lalu terapkan proyek tersebut pada perangkat/kiosk/kamera booth.
                    </p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-red to-brand-blue text-white font-extrabold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2.5 shrink-0"
                >
                    <Plus className="w-5 h-5" />
                    <span>TAMBAH PROYEK BARU</span>
                </button>
            </div>

            {/* Kumpulan Card Proyek Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {projects.map((project) => (
                    <div key={project.id} className="glass-panel rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between glass-panel-hover group relative">
                        <div>
                            {/* Card Image Thumbnail & Status Badge */}
                            <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                                <img 
                                    src={project.thumbnail} 
                                    alt={project.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>

                                <div className="absolute top-3 left-3 flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-brand-surface/90 border border-slate-700 text-white backdrop-blur-md">
                                        {project.template.toUpperCase()}
                                    </span>
                                </div>

                                {project.isLive && (
                                    <div className="absolute top-3 right-3">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-brand-red text-white shadow-lg shadow-brand-red/50 animate-pulse border border-white/20">
                                            ● LIVE AT BOOTH
                                        </span>
                                    </div>
                                )}

                                <div className="absolute bottom-3 left-3 right-3">
                                    <h3 className="font-extrabold text-lg text-white truncate drop-shadow-md">
                                        {project.name}
                                    </h3>
                                    <p className="text-xs text-slate-300 truncate">
                                        Perangkat: <span className="font-bold text-brand-blue">{project.assignedDevice}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Controls Quick Badges */}
                            <div className="p-5 space-y-3 border-b border-slate-800/80">
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="p-2 rounded-xl bg-brand-surface/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                                        <Timer className="w-3.5 h-3.5 text-brand-red shrink-0" />
                                        <span className="truncate">Timer: <strong>{project.timer}s</strong></span>
                                    </div>
                                    <div className="p-2 rounded-xl bg-brand-surface/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                                        <Grid className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                                        <span className="truncate">{project.layout}</span>
                                    </div>
                                    <div className="p-2 rounded-xl bg-brand-surface/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                                        <Layers className="w-3.5 h-3.5 text-brand-green shrink-0" />
                                        <span className="truncate">{project.frame}</span>
                                    </div>
                                    <div className="p-2 rounded-xl bg-brand-surface/60 border border-slate-800 flex items-center gap-2 text-slate-300">
                                        <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        <span className="truncate">{project.lighting}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons: Buka & Ubah */}
                        <div className="p-4 bg-brand-surface/40 flex items-center gap-2">
                            <button
                                onClick={() => { setActiveProjectModal(project); setModalTab('buka'); }}
                                className="flex-1 py-2.5 px-3 rounded-xl bg-brand-surface border border-slate-700 hover:border-brand-blue hover:text-brand-blue text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Sliders className="w-4 h-4 text-brand-blue" />
                                <span>Buka Controls</span>
                            </button>

                            <button
                                onClick={() => { setActiveProjectModal(project); setModalTab('ubah'); }}
                                className="flex-1 py-2.5 px-3 rounded-xl bg-brand-surface border border-slate-700 hover:border-brand-red hover:text-brand-red text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                            >
                                <Edit className="w-4 h-4 text-brand-red" />
                                <span>Ubah Details</span>
                            </button>

                            <Link
                                href="/admin/kiosk"
                                className="p-2.5 rounded-xl bg-brand-red text-white hover:bg-brand-red-hover transition-colors shadow-md"
                                title="Jalankan di Live Kiosk"
                            >
                                <Play className="w-4 h-4 fill-white" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Add Proyek (Template Picker) */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-red/40 max-w-lg w-full shadow-2xl relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-extrabold text-white">Tambah Proyek Photobooth Baru</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Judul Proyek</label>
                                <input
                                    type="text"
                                    required
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                    placeholder="Contoh: Grand Opening Retail Mall"
                                    className="w-full px-4 py-3 bg-brand-dark border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-blue"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Pilih Template Proyek</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'photobox retail', label: 'photobox retail', desc: 'Sistem Toko / Stand' },
                                        { id: 'Photobox - Event', label: 'Photobox - Event', desc: 'Pernikahan / Pesta' },
                                        { id: 'photobox self', label: 'photobox self', desc: 'Self Service Corner' },
                                    ].map((tpl) => (
                                        <button
                                            key={tpl.id}
                                            type="button"
                                            onClick={() => setNewProject({ ...newProject, template: tpl.id })}
                                            className={`
                                                p-3 rounded-xl border text-left transition-all text-xs font-bold flex flex-col justify-between
                                                ${newProject.template === tpl.id 
                                                    ? 'bg-brand-red/20 border-brand-red text-white shadow-md' 
                                                    : 'border-slate-800 bg-brand-dark/50 text-slate-400 hover:bg-slate-800'}
                                            `}
                                        >
                                            <span>{tpl.label}</span>
                                            <span className="text-[10px] font-normal text-slate-400 mt-1">{tpl.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Ukuran Display Tampilan</label>
                                <div className="flex gap-3">
                                    {['Portrait', 'Landscape'].map((orient) => (
                                        <button
                                            key={orient}
                                            type="button"
                                            onClick={() => setNewProject({ ...newProject, orientation: orient })}
                                            className={`
                                                flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center
                                                ${newProject.orientation === orient 
                                                    ? 'bg-brand-blue/20 border-brand-blue text-brand-blue' 
                                                    : 'border-slate-800 bg-brand-dark/50 text-slate-400'}
                                            `}
                                        >
                                            {orient}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Pesan Halaman Selamat Datang</label>
                                <input
                                    type="text"
                                    value={newProject.welcomeMessage}
                                    onChange={(e) => setNewProject({ ...newProject, welcomeMessage: e.target.value })}
                                    placeholder="Contoh: Sentuh Layar Untuk Memulai Foto"
                                    className="w-full px-4 py-3 bg-brand-dark border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-blue"
                                />
                            </div>

                            <div className="pt-3">
                                <button
                                    type="submit"
                                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-red to-brand-blue text-white font-extrabold text-sm shadow-xl hover:opacity-95"
                                >
                                    Buat Proyek
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Detail Proyek (Buka Controls & Ubah Settings) */}
            {activeProjectModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-blue/50 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-brand-blue">{activeProjectModal.id}</span>
                                <h3 className="text-xl font-extrabold text-white">{activeProjectModal.name}</h3>
                            </div>
                            <button onClick={() => setActiveProjectModal(null)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Tab Switcher */}
                        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-3">
                            <button
                                onClick={() => setModalTab('buka')}
                                className={`py-2 px-4 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 ${modalTab === 'buka' ? 'bg-brand-blue text-brand-dark shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Sliders className="w-4 h-4" />
                                <span>BUKA (Timer, Layout, Frame, Filter, Lighting)</span>
                            </button>
                            <button
                                onClick={() => setModalTab('ubah')}
                                className={`py-2 px-4 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 ${modalTab === 'ubah' ? 'bg-brand-red text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Edit className="w-4 h-4" />
                                <span>UBAH (Judul, Ukuran, Thumbnail Welcome)</span>
                            </button>
                        </div>

                        {/* Tab Buka: Controls */}
                        {modalTab === 'buka' && (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-brand-surface/60 border border-slate-800">
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2 flex items-center gap-2">
                                        <Timer className="w-4 h-4 text-brand-red" />
                                        <span>Pengaturan Timer Hitung Mundur (detik)</span>
                                    </label>
                                    <div className="flex gap-2">
                                        {[3, 5, 10, 15].map((t) => (
                                            <button key={t} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${activeProjectModal.timer === t ? 'bg-brand-red text-white border-brand-red' : 'border-slate-800 text-slate-400'}`}>
                                                {t} Detik
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-brand-surface/60 border border-slate-800">
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2 flex items-center gap-2">
                                        <Grid className="w-4 h-4 text-brand-blue" />
                                        <span>Kisi / Layout Foto</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                                        <div className="p-3 rounded-xl border border-brand-blue bg-brand-blue/10 text-brand-blue text-center">4-Grid Strip</div>
                                        <div className="p-3 rounded-xl border border-slate-800 text-slate-400 text-center">Classic 3-Strip</div>
                                        <div className="p-3 rounded-xl border border-slate-800 text-slate-400 text-center">Single Portrait</div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-brand-surface/60 border border-slate-800">
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2 flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-brand-green" />
                                        <span>Pilihan Frame & Filter Presets</span>
                                    </label>
                                    <p className="text-xs text-slate-400">Frame Aktif: <strong className="text-white">{activeProjectModal.frame}</strong> | Filter: <strong className="text-white">{activeProjectModal.filter}</strong></p>
                                </div>
                            </div>
                        )}

                        {/* Tab Ubah: Settings & Thumbnail */}
                        {modalTab === 'ubah' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Judul Proyek</label>
                                    <input 
                                        type="text" 
                                        defaultValue={activeProjectModal.name} 
                                        className="w-full px-4 py-3 bg-brand-dark border border-slate-700 rounded-xl text-sm text-white" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Ukuran Layar (Orientation)</label>
                                    <div className="flex gap-3 text-xs font-bold">
                                        <div className={`flex-1 py-2.5 rounded-xl border text-center ${activeProjectModal.orientation === 'Portrait' ? 'border-brand-blue text-brand-blue bg-brand-blue/10' : 'border-slate-800 text-slate-400'}`}>
                                            Portrait (9:16)
                                        </div>
                                        <div className={`flex-1 py-2.5 rounded-xl border text-center ${activeProjectModal.orientation === 'Landscape' ? 'border-brand-blue text-brand-blue bg-brand-blue/10' : 'border-slate-800 text-slate-400'}`}>
                                            Landscape (16:9)
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Halaman Selamat Datang & Thumbnail Gambar</label>
                                    <div className="p-4 rounded-2xl bg-brand-dark border border-slate-800 flex items-center gap-4">
                                        <img src={activeProjectModal.thumbnail} alt="Welcome Thumbnail" className="w-24 h-20 object-cover rounded-xl border border-slate-700" />
                                        <div className="flex-1 space-y-2">
                                            <input type="text" defaultValue={activeProjectModal.welcomeMessage} className="w-full px-3 py-2 bg-brand-surface border border-slate-700 rounded-lg text-xs text-white" />
                                            <button className="py-1.5 px-3 rounded-lg bg-brand-surface border border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5">
                                                <Upload className="w-3.5 h-3.5" />
                                                <span>Upload Gambar Thumbnail Baru</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                            <button onClick={() => setActiveProjectModal(null)} className="py-2.5 px-5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold">Tutup</button>
                            <button onClick={() => { alert('Perubahan Proyek Berhasil Disimpan!'); setActiveProjectModal(null); }} className="py-2.5 px-5 rounded-xl bg-brand-green text-brand-dark text-xs font-extrabold">Simpan Perubahan</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
