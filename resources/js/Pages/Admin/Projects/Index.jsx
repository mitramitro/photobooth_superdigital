import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    FolderKanban,
    Plus,
    Sliders,
    Timer,
    LayoutGrid,
    Layers,
    Sun,
    Play,
    Pencil,
    X,
    Upload,
    Monitor,
    Radio,
    ChevronRight,
    Sparkles,
    CheckCircle2,
    Clock,
    Maximize2,
} from 'lucide-react';

// ─── Data & Constants ────────────────────────────────────────────────────────

const TEMPLATE_OPTIONS = [
    { id: 'photobox retail',   label: 'Photobox Retail',   desc: 'Sistem Toko / Stand' },
    { id: 'Photobox - Event',  label: 'Photobox Event',    desc: 'Pernikahan / Pesta' },
    { id: 'photobox self',     label: 'Photobox Self',     desc: 'Self Service Corner' },
];

const TIMER_OPTIONS = [3, 5, 10, 15];
const LAYOUT_OPTIONS = ['4-Grid Strip', 'Classic 3-Strip', 'Single Portrait'];

const SAMPLE_PROJECTS = [
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
        thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
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
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
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
        thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
        welcomeMessage: 'Tap Screen to Start Self Studio Session',
        assignedDevice: 'Belum terhubung',
        isLive: false,
    },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function MetaBadge({ icon: Icon, label, color = 'slate' }) {
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/80">
            <Icon className={`w-3 h-3 shrink-0 text-${color}-500`} />
            <span className="truncate max-w-[100px]">{label}</span>
        </span>
    );
}

function ProjectCard({ project, onOpenControls, onOpenSettings }) {
    return (
        <article className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
            {/* Thumbnail */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 text-slate-700 border border-slate-200/80 backdrop-blur-sm shadow-sm capitalize">
                        {project.template}
                    </span>
                </div>

                {project.isLive && (
                    <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live at Booth
                        </span>
                    </div>
                )}

                {/* Project name overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-white text-sm leading-snug drop-shadow-md line-clamp-2">
                        {project.name}
                    </h3>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col gap-3">
                {/* Device info */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Monitor className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate font-medium">
                        {project.assignedDevice === 'Belum terhubung'
                            ? <span className="text-amber-600 font-semibold">Belum terhubung ke perangkat</span>
                            : project.assignedDevice}
                    </span>
                </div>

                {/* Meta badges */}
                <div className="flex flex-wrap gap-1.5">
                    <MetaBadge icon={Timer}      label={`Timer ${project.timer}s`}   color="indigo" />
                    <MetaBadge icon={LayoutGrid} label={project.layout}              color="blue"   />
                    <MetaBadge icon={Layers}     label={project.frame}               color="violet" />
                    <MetaBadge icon={Sun}        label={project.lighting}            color="amber"  />
                </div>
            </div>

            {/* Action footer */}
            <div className="px-4 pb-4 flex items-center gap-2">
                <button
                    onClick={() => onOpenControls(project)}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-1.5"
                >
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                    Buka Controls
                </button>
                <button
                    onClick={() => onOpenSettings(project)}
                    className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-1.5"
                >
                    <Pencil className="w-3.5 h-3.5 text-slate-500" />
                    Ubah Details
                </button>
                <Link
                    href="/admin/kiosk"
                    className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
                    title="Jalankan di Live Kiosk"
                >
                    <Play className="w-3.5 h-3.5 fill-white" />
                </Link>
            </div>
        </article>
    );
}

// ─── Modals ──────────────────────────────────────────────────────────────────

function ModalShell({ onClose, children, maxWidth = 'max-w-lg' }) {
    return (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={`bg-white rounded-2xl border border-slate-200 shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto relative`}>
                {children}
            </div>
        </div>
    );
}

function AddProjectModal({ onClose, onCreate }) {
    const [form, setForm] = useState({
        name: '',
        template: 'photobox retail',
        orientation: 'Portrait',
        welcomeMessage: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(form);
    };

    return (
        <ModalShell onClose={onClose}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div>
                    <h3 className="text-base font-bold text-slate-900">Tambah Proyek Baru</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Pilih template lalu konfigurasi proyek photobooth Anda.</p>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                {/* Project Name */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Judul Proyek</label>
                    <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Contoh: Grand Opening Retail Mall"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                    />
                </div>

                {/* Template Picker */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Template Proyek</label>
                    <div className="grid grid-cols-3 gap-2">
                        {TEMPLATE_OPTIONS.map((tpl) => (
                            <button
                                key={tpl.id}
                                type="button"
                                onClick={() => setForm({ ...form, template: tpl.id })}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    form.template === tpl.id
                                        ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500/30'
                                        : 'border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <span className="block text-xs font-semibold text-slate-800">{tpl.label}</span>
                                <span className="block text-[10px] text-slate-500 mt-0.5">{tpl.desc}</span>
                                {form.template === tpl.id && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-1.5" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orientation */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Orientasi Layar</label>
                    <div className="flex gap-2">
                        {['Portrait', 'Landscape'].map((orient) => (
                            <button
                                key={orient}
                                type="button"
                                onClick={() => setForm({ ...form, orientation: orient })}
                                className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-all ${
                                    form.orientation === orient
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <Maximize2 className="w-3.5 h-3.5" />
                                {orient}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Welcome Message */}
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pesan Selamat Datang</label>
                    <input
                        type="text"
                        value={form.welcomeMessage}
                        onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
                        placeholder="Contoh: Sentuh Layar Untuk Memulai Foto"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                    />
                </div>

                {/* Submit */}
                <div className="flex gap-2 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                        <Sparkles className="w-4 h-4" />
                        Buat Proyek
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}

function ProjectDetailModal({ project, defaultTab, onClose }) {
    const [tab, setTab] = useState(defaultTab);
    const [timer, setTimer] = useState(project.timer);
    const [layout, setLayout] = useState(project.layout);

    return (
        <ModalShell onClose={onClose} maxWidth="max-w-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
                <div>
                    <span className="inline-block text-[10px] font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mb-1">
                        {project.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{project.name}</h3>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors mt-0.5">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 pb-0">
                <button
                    onClick={() => setTab('buka')}
                    className={`flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-semibold transition-all border ${
                        tab === 'buka'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Sliders className="w-3.5 h-3.5" />
                    Buka Controls
                </button>
                <button
                    onClick={() => setTab('ubah')}
                    className={`flex items-center gap-1.5 py-2 px-4 rounded-lg text-xs font-semibold transition-all border ${
                        tab === 'ubah'
                            ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Pencil className="w-3.5 h-3.5" />
                    Ubah Details
                </button>
            </div>

            <div className="px-6 py-5 space-y-4">
                {/* ── Tab: Controls ── */}
                {tab === 'buka' && (
                    <>
                        {/* Timer */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
                                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                Timer Hitung Mundur
                            </label>
                            <div className="flex gap-2">
                                {TIMER_OPTIONS.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTimer(t)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                                            timer === t
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {t}s
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Layout Grid */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
                                <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
                                Kisi / Layout Foto
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {LAYOUT_OPTIONS.map((l) => (
                                    <button
                                        key={l}
                                        onClick={() => setLayout(l)}
                                        className={`py-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                                            layout === l
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Frame & Filter */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                                <Layers className="w-3.5 h-3.5 text-violet-500" />
                                Frame & Filter Presets
                            </label>
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="px-3 py-1.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200 text-xs font-semibold">
                                    {project.frame}
                                </span>
                                <span className="px-3 py-1.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                                    Filter: {project.filter}
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {/* ── Tab: Settings ── */}
                {tab === 'ubah' && (
                    <>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Judul Proyek</label>
                            <input
                                type="text"
                                defaultValue={project.name}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Orientasi Layar</label>
                            <div className="flex gap-2">
                                {['Portrait', 'Landscape'].map((o) => (
                                    <div
                                        key={o}
                                        className={`flex-1 py-2.5 rounded-lg border text-xs font-semibold text-center ${
                                            project.orientation === o
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                                : 'border-slate-200 text-slate-500 bg-white'
                                        }`}
                                    >
                                        {o} {o === 'Portrait' ? '(9:16)' : '(16:9)'}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thumbnail & Pesan Selamat Datang</label>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                                <img
                                    src={project.thumbnail}
                                    alt="Welcome Thumbnail"
                                    className="w-24 h-20 object-cover rounded-lg border border-slate-200 shrink-0"
                                />
                                <div className="flex-1 space-y-2.5">
                                    <input
                                        type="text"
                                        defaultValue={project.welcomeMessage}
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
                                    />
                                    <button className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                                        <Upload className="w-3.5 h-3.5" />
                                        Upload Thumbnail Baru
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                    onClick={onClose}
                    className="py-2 px-4 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                    Tutup
                </button>
                <button
                    onClick={() => { alert('Perubahan berhasil disimpan!'); onClose(); }}
                    className="py-2 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Simpan Perubahan
                </button>
            </div>
        </ModalShell>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Index() {
    const [projects, setProjects] = useState(SAMPLE_PROJECTS);
    const [showAddModal, setShowAddModal]     = useState(false);
    const [activeProject, setActiveProject]   = useState(null);
    const [detailTab, setDetailTab]           = useState('buka');

    const openControls = (project) => { setActiveProject(project); setDetailTab('buka'); };
    const openSettings = (project) => { setActiveProject(project); setDetailTab('ubah'); };

    const handleCreate = (form) => {
        const created = {
            id: `PRJ-00${projects.length + 1}`,
            name: form.name,
            template: form.template,
            orientation: form.orientation,
            timer: 5,
            layout: '4-Grid Strip',
            frame: 'Standard Frame',
            filter: 'Original',
            lighting: 'Standard',
            thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
            welcomeMessage: form.welcomeMessage || 'Selamat Datang!',
            assignedDevice: 'Belum terhubung',
            isLive: false,
        };
        setProjects([created, ...projects]);
        setShowAddModal(false);
    };

    const liveCount = projects.filter(p => p.isLive).length;

    return (
        <AdminLayout title="Manajemen Proyek" hasLiveBooth={liveCount > 0}>
            <Head title="Manajemen Proyek - Photobooth Studio" />

            {/* ── Page Header ──────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <FolderKanban className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Manajemen Proyek
                        </h2>
                    </div>
                    <p className="text-sm text-slate-500">
                        Buat proyek photobooth, lalu terapkan ke perangkat atau kiosk Anda.
                    </p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    id="btn-tambah-proyek"
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-colors shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Proyek Baru
                </button>
            </div>

            {/* ── Stats Bar ────────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-700 font-medium shadow-sm">
                    <FolderKanban className="w-4 h-4 text-indigo-500" />
                    <span>{projects.length} Proyek</span>
                </div>
                {liveCount > 0 && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-semibold shadow-sm">
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        <span>{liveCount} Booth Aktif (LIVE)</span>
                    </div>
                )}
            </div>

            {/* ── Project Grid ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onOpenControls={openControls}
                        onOpenSettings={openSettings}
                    />
                ))}

                {/* Add Project CTA Card */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex flex-col items-center justify-center gap-3 bg-white border-2 border-dashed border-slate-300 rounded-2xl p-8 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200 group min-h-[280px]"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                        <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold">Tambah Proyek Baru</span>
                    <span className="text-xs text-slate-400 text-center max-w-[180px]">
                        Pilih template dan konfigurasikan proyek photobooth baru
                    </span>
                </button>
            </div>

            {/* ── Modals ───────────────────────────────────────────────────── */}
            {showAddModal && (
                <AddProjectModal
                    onClose={() => setShowAddModal(false)}
                    onCreate={handleCreate}
                />
            )}

            {activeProject && (
                <ProjectDetailModal
                    project={activeProject}
                    defaultTab={detailTab}
                    onClose={() => setActiveProject(null)}
                />
            )}
        </AdminLayout>
    );
}
