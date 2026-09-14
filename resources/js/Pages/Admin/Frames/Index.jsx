import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Shapes,
    Plus,
    Pencil,
    Trash2,
    Copy,
    Download,
    Globe,
    Eye,
    LayoutGrid,
    List,
    Search,
    SlidersHorizontal,
    Star,
    Heart,
    CloudDownload,
    CheckCircle2,
    Clock,
    Image as ImageIcon,
    Upload,
    Palette,
    X,
    ExternalLink,
    Filter,
    ArrowDownToLine,
    Sparkles,
} from 'lucide-react';
import {
    PageHeader,
    Button,
    SearchInput,
    FilterBar,
    FilterPill,
    Card,
    CardBody,
    CardHeader,
    EmptyState,
    StatusBadge,
    ConfirmDialog,
    useToast,
    Dropdown,
    Tabs,
    Modal,
} from '@/Components/ui';

/* ───── Dummy data: Bingkai Saya ─────────────────────────── */
const myFrames = [
    {
        id: 'FRM-001',
        name: 'Neon Cyberpunk',
        category: 'Party',
        orientation: 'Portrait',
        slots: 4,
        status: 'active',
        usage: 6,
        updatedAt: '2 hari lalu',
        preview: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'FRM-002',
        name: 'Wedding Floral',
        category: 'Wedding',
        orientation: 'Portrait',
        slots: 3,
        status: 'active',
        usage: 12,
        updatedAt: '5 hari lalu',
        preview: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'FRM-003',
        name: 'Retro Polaroid',
        category: 'Retro',
        orientation: 'Landscape',
        slots: 1,
        status: 'active',
        usage: 3,
        updatedAt: '1 minggu lalu',
        preview: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'FRM-004',
        name: 'Elegant Gold',
        category: 'Formal',
        orientation: 'Portrait',
        slots: 6,
        status: 'draft',
        usage: 0,
        updatedAt: 'Baru saja',
        preview: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'FRM-005',
        name: 'Minimalist B&W',
        category: 'Minimal',
        orientation: 'Portrait',
        slots: 2,
        status: 'active',
        usage: 8,
        updatedAt: '3 hari lalu',
        preview: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'FRM-006',
        name: 'Tropical Summer',
        category: 'Party',
        orientation: 'Landscape',
        slots: 4,
        status: 'draft',
        usage: 0,
        updatedAt: '1 hari lalu',
        preview: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=400&auto=format&fit=crop',
    },
];

/* ───── Dummy data: Download dari Internet ───────────────── */
const onlineFrames = [
    {
        id: 'OL-001',
        name: 'Galaxy Sparkle Frame',
        author: 'FrameStudio',
        downloads: 2340,
        rating: 4.8,
        tags: ['Galaxy', 'Party'],
        free: true,
        downloaded: false,
        preview: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'OL-002',
        name: 'Sakura Blossom',
        author: 'DesignPack',
        downloads: 1890,
        rating: 4.9,
        tags: ['Nature', 'Wedding'],
        free: true,
        downloaded: false,
        preview: 'https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'OL-003',
        name: 'Vintage Film Strip',
        author: 'RetroLab',
        downloads: 3120,
        rating: 4.7,
        tags: ['Retro', 'Film'],
        free: false,
        downloaded: true,
        preview: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'OL-004',
        name: 'Neon Glow Border',
        author: 'NeonArts',
        downloads: 4560,
        rating: 4.6,
        tags: ['Neon', 'Party'],
        free: true,
        downloaded: false,
        preview: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'OL-005',
        name: 'Elegant White Lace',
        author: 'WeddingDesign',
        downloads: 1450,
        rating: 4.9,
        tags: ['Wedding', 'Elegant'],
        free: false,
        downloaded: false,
        preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'OL-006',
        name: 'Comic Pop Art',
        author: 'ArtPack',
        downloads: 780,
        rating: 4.3,
        tags: ['Fun', 'Comic'],
        free: true,
        downloaded: false,
        preview: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'OL-007',
        name: 'Christmas Joy',
        author: 'HolidayArts',
        downloads: 5210,
        rating: 4.8,
        tags: ['Holiday', 'Christmas'],
        free: true,
        downloaded: true,
        preview: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?q=80&w=400&auto=format&fit=crop',
    },
    {
        id: 'OL-008',
        name: 'Abstract Gradient',
        author: 'ModernFrame',
        downloads: 920,
        rating: 4.5,
        tags: ['Modern', 'Abstract'],
        free: false,
        downloaded: false,
        preview: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=400&auto=format&fit=crop',
    },
];

const statusTone = { active: 'success', draft: 'neutral' };
const statusLabel = { active: 'Aktif', draft: 'Draf' };

/* ───── Slot preview visualization ───────────────────────── */
function SlotPreview({ slots, className = '' }) {
    const layouts = {
        1: [{ x: 10, y: 10, w: 80, h: 80 }],
        2: [
            { x: 5, y: 10, w: 43, h: 80 },
            { x: 52, y: 10, w: 43, h: 80 },
        ],
        3: [
            { x: 5, y: 5, w: 55, h: 45 },
            { x: 64, y: 5, w: 31, h: 45 },
            { x: 5, y: 54, w: 90, h: 42 },
        ],
        4: [
            { x: 5, y: 5, w: 43, h: 43 },
            { x: 52, y: 5, w: 43, h: 43 },
            { x: 5, y: 52, w: 43, h: 43 },
            { x: 52, y: 52, w: 43, h: 43 },
        ],
        6: [
            { x: 3, y: 3, w: 30, h: 30 },
            { x: 35, y: 3, w: 30, h: 30 },
            { x: 67, y: 3, w: 30, h: 30 },
            { x: 3, y: 36, w: 30, h: 30 },
            { x: 35, y: 36, w: 30, h: 30 },
            { x: 67, y: 36, w: 30, h: 30 },
        ],
    };
    const layout = layouts[slots] || layouts[4];
    return (
        <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`}>
            <rect x="0" y="0" width="100" height="100" rx="6" fill="#f1f5f9" />
            {layout.map((s, i) => (
                <rect
                    key={i}
                    x={s.x}
                    y={s.y}
                    width={s.w}
                    height={s.h}
                    rx="3"
                    fill="#e2e8f0"
                    stroke="#cbd5e1"
                    strokeWidth="0.5"
                />
            ))}
            {layout.map((s, i) => (
                <text
                    key={`t-${i}`}
                    x={s.x + s.w / 2}
                    y={s.y + s.h / 2 + 3}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#94a3b8"
                    fontWeight="600"
                >
                    {i + 1}
                </text>
            ))}
        </svg>
    );
}

/* ───── Create Frame Modal ───────────────────────────────── */
function CreateFrameModal({ open, onClose }) {
    const { toast } = useToast();
    const options = [
        {
            icon: Palette,
            title: 'Desain Baru',
            description: 'Buat bingkai dari awal dengan editor visual',
            color: 'bg-brand-subtle text-brand',
        },
        {
            icon: Upload,
            title: 'Upload File',
            description: 'Upload file bingkai PNG/PSD dari komputer',
            color: 'bg-success-subtle text-success',
        },
        {
            icon: Copy,
            title: 'Duplikat Template',
            description: 'Salin & modifikasi dari bingkai yang sudah ada',
            color: 'bg-warning-subtle text-warning',
        },
    ];

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Buat Bingkai Baru"
            description="Pilih metode untuk membuat bingkai photobooth"
            icon={Shapes}
            maxWidth="md"
        >
            <div className="space-y-3">
                {options.map((opt) => (
                    <button
                        key={opt.title}
                        onClick={() => {
                            onClose();
                            toast({
                                tone: 'info',
                                title: opt.title,
                                message: 'Fitur ini sedang dalam pengembangan.',
                            });
                        }}
                        className="group flex w-full items-center gap-4 rounded-card border border-edge p-4 text-left transition-all duration-150 hover:border-brand/30 hover:bg-brand-subtle/40 hover:shadow-card cursor-pointer"
                    >
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-card ${opt.color} transition-transform duration-150 group-hover:scale-110`}
                        >
                            <opt.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-ink">{opt.title}</p>
                            <p className="mt-0.5 text-xs text-ink-muted">{opt.description}</p>
                        </div>
                        <ExternalLink className="ml-auto h-4 w-4 shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                ))}
            </div>
        </Modal>
    );
}

/* ───── My Frames Grid Card ─────────────────────────────── */
function MyFrameCard({ frame, onDelete, viewMode }) {
    const { toast } = useToast();

    if (viewMode === 'list') {
        return (
            <Card className="flex items-center gap-4 px-4 py-3 transition-shadow hover:shadow-cardHover">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-input">
                    <SlotPreview slots={frame.slots} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{frame.name}</p>
                    <p className="text-xs text-ink-muted">
                        {frame.category} · {frame.orientation} · {frame.slots} slot
                    </p>
                </div>
                <div className="hidden items-center gap-3 sm:flex">
                    <StatusBadge tone={statusTone[frame.status]} dot>
                        {statusLabel[frame.status]}
                    </StatusBadge>
                    <span className="text-xs text-ink-faint">{frame.updatedAt}</span>
                </div>
                <Dropdown
                    items={[
                        {
                            label: 'Preview',
                            icon: Eye,
                            onClick: () => toast({ tone: 'info', title: 'Preview bingkai' }),
                        },
                        {
                            label: 'Duplikat',
                            icon: Copy,
                            onClick: () =>
                                toast({ tone: 'success', title: 'Bingkai diduplikasi' }),
                        },
                        {
                            label: 'Edit',
                            icon: Pencil,
                            onClick: () => toast({ tone: 'info', title: 'Edit bingkai' }),
                        },
                        { divider: true },
                        {
                            label: 'Hapus',
                            icon: Trash2,
                            danger: true,
                            onClick: () => onDelete(frame),
                        },
                    ]}
                />
            </Card>
        );
    }

    return (
        <Card className="group flex flex-col overflow-hidden transition-all duration-200 hover:shadow-cardHover hover:-translate-y-0.5">
            {/* Preview area */}
            <div className="relative p-3">
                <div className="relative aspect-square overflow-hidden rounded-card bg-slate-50">
                    {/* Background image */}
                    <img
                        src={frame.preview}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover opacity-20"
                    />
                    {/* Slot layout overlay */}
                    <div className="absolute inset-3 flex items-center justify-center">
                        <SlotPreview slots={frame.slots} />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-card bg-ink/0 opacity-0 transition-all duration-200 group-hover:bg-ink/40 group-hover:opacity-100">
                        <button
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-card transition-transform hover:scale-110 cursor-pointer"
                            title="Preview"
                            onClick={() => toast({ tone: 'info', title: 'Preview bingkai' })}
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                        <button
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-card transition-transform hover:scale-110 cursor-pointer"
                            title="Edit"
                            onClick={() => toast({ tone: 'info', title: 'Edit bingkai' })}
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                {/* Status badge top-right */}
                <div className="absolute right-5 top-5">
                    <StatusBadge tone={statusTone[frame.status]} dot>
                        {statusLabel[frame.status]}
                    </StatusBadge>
                </div>
            </div>

            {/* Info */}
            <CardBody className="flex-1 pt-0">
                <p className="truncate text-sm font-semibold text-ink">{frame.name}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
                    <span>{frame.category}</span>
                    <span className="text-ink-faint">·</span>
                    <span>{frame.slots} slot</span>
                    <span className="text-ink-faint">·</span>
                    <span>{frame.orientation}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-ink-faint">
                        <Clock className="mr-1 inline h-3 w-3" />
                        {frame.updatedAt}
                    </p>
                    <p className="text-xs text-ink-faint">
                        {frame.usage > 0 ? `${frame.usage} proyek` : 'Belum digunakan'}
                    </p>
                </div>
            </CardBody>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-edge px-4 py-2.5">
                <span className="text-xs font-mono text-ink-faint">{frame.id}</span>
                <Dropdown
                    items={[
                        {
                            label: 'Preview',
                            icon: Eye,
                            onClick: () => toast({ tone: 'info', title: 'Preview bingkai' }),
                        },
                        {
                            label: 'Duplikat',
                            icon: Copy,
                            onClick: () =>
                                toast({ tone: 'success', title: 'Bingkai diduplikasi' }),
                        },
                        {
                            label: 'Edit',
                            icon: Pencil,
                            onClick: () => toast({ tone: 'info', title: 'Edit bingkai' }),
                        },
                        { divider: true },
                        {
                            label: 'Hapus',
                            icon: Trash2,
                            danger: true,
                            onClick: () => onDelete(frame),
                        },
                    ]}
                />
            </div>
        </Card>
    );
}

/* ───── Online Frame Card ────────────────────────────────── */
function OnlineFrameCard({ frame }) {
    const { toast } = useToast();
    return (
        <Card className="group flex flex-col overflow-hidden transition-all duration-200 hover:shadow-cardHover hover:-translate-y-0.5">
            <div className="relative">
                <div className="aspect-[4/3] overflow-hidden">
                    <img
                        src={frame.preview}
                        alt={frame.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                {/* Top badges */}
                <div className="absolute left-3 top-3 flex gap-1.5">
                    {frame.free ? (
                        <span className="rounded-full bg-success/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            Gratis
                        </span>
                    ) : (
                        <span className="rounded-full bg-warning/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                            Premium
                        </span>
                    )}
                    {frame.downloaded && (
                        <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-success backdrop-blur">
                            <CheckCircle2 className="h-3 w-3" />
                            Terunduh
                        </span>
                    )}
                </div>
                {/* Bottom info */}
                <div className="absolute bottom-3 left-3 right-3">
                    <p className="truncate text-sm font-semibold text-white drop-shadow">{frame.name}</p>
                    <p className="text-xs text-white/80">oleh {frame.author}</p>
                </div>
            </div>

            <CardBody className="flex-1 pt-3 pb-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {frame.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-ink-muted"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                {/* Stats */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-ink-muted">
                            <Star className="h-3 w-3 fill-warning text-warning" />
                            {frame.rating}
                        </span>
                        <span className="flex items-center gap-1 text-ink-faint">
                            <ArrowDownToLine className="h-3 w-3" />
                            {frame.downloads.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>
            </CardBody>

            {/* Action */}
            <div className="border-t border-edge px-4 py-2.5">
                {frame.downloaded ? (
                    <button
                        onClick={() => toast({ tone: 'info', title: 'Sudah terunduh', message: 'Bingkai ini sudah ada di koleksi Anda.' })}
                        className="flex w-full items-center justify-center gap-2 rounded-input bg-slate-50 px-3 py-2 text-xs font-semibold text-ink-muted transition-colors hover:bg-slate-100 cursor-pointer"
                    >
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        Sudah Diunduh
                    </button>
                ) : (
                    <button
                        onClick={() =>
                            toast({
                                tone: 'success',
                                title: 'Mengunduh bingkai',
                                message: `${frame.name} sedang diunduh...`,
                            })
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-input bg-brand px-3 py-2 text-xs font-semibold text-white shadow-card transition-colors hover:bg-brand-dark cursor-pointer"
                    >
                        <CloudDownload className="h-3.5 w-3.5" />
                        Download Bingkai
                    </button>
                )}
            </div>
        </Card>
    );
}

/* ═══════════════════════════════════════════════════════════ */
/*  Main Page                                                 */
/* ═══════════════════════════════════════════════════════════ */
export default function Index() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('my');
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [status, setStatus] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [confirm, setConfirm] = useState(null);
    const [createOpen, setCreateOpen] = useState(false);

    // Online tab filters
    const [onlineSearch, setOnlineSearch] = useState('');
    const [onlineTag, setOnlineTag] = useState('all');

    /* ── Filter: Bingkai Saya ─────────────────── */
    const filteredMy = useMemo(() => {
        let rows = [...myFrames];
        if (category !== 'all') rows = rows.filter((r) => r.category === category);
        if (status !== 'all') rows = rows.filter((r) => r.status === status);
        if (search.trim())
            rows = rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
        return rows;
    }, [search, category, status]);

    const myCategories = ['all', ...new Set(myFrames.map((f) => f.category))];

    /* ── Filter: Download dari Internet ───────── */
    const filteredOnline = useMemo(() => {
        let rows = [...onlineFrames];
        if (onlineTag !== 'all')
            rows = rows.filter((r) => r.tags.some((t) => t === onlineTag));
        if (onlineSearch.trim())
            rows = rows.filter((r) =>
                r.name.toLowerCase().includes(onlineSearch.toLowerCase())
            );
        return rows;
    }, [onlineSearch, onlineTag]);

    const allTags = ['all', ...new Set(onlineFrames.flatMap((f) => f.tags))];

    /* ── Tab configuration ────────────────────── */
    const tabItems = [
        { value: 'my', label: 'Bingkai Saya', icon: Shapes, count: myFrames.length },
        { value: 'online', label: 'Download Bingkai', icon: Globe, count: onlineFrames.length },
    ];

    return (
        <AdminLayout title="Bingkai">
            <Head title="Bingkai - Photobooth Studio" />

            <PageHeader
                title="Manajemen Bingkai"
                description="Buat, kelola, dan unduh bingkai photobooth untuk proyek Anda."
                icon={Shapes}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            icon={CloudDownload}
                            size="md"
                            onClick={() => setActiveTab('online')}
                        >
                            Download Bingkai
                        </Button>
                        <Button icon={Plus} onClick={() => setCreateOpen(true)}>
                            Buat Bingkai
                        </Button>
                    </div>
                }
            />

            {/* Tabs */}
            <Tabs tabs={tabItems} active={activeTab} onChange={setActiveTab} className="mb-5" />

            {/* ═══ Tab: Bingkai Saya ═══════════════════════════════ */}
            {activeTab === 'my' && (
                <>
                    <div className="mb-4">
                        <FilterBar>
                            <SearchInput
                                placeholder="Cari bingkai…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full lg:w-72"
                            />
                            <FilterPill
                                value={category}
                                onChange={setCategory}
                                options={myCategories.map((c) => ({
                                    value: c,
                                    label: c === 'all' ? 'Semua kategori' : c,
                                }))}
                            />
                            <FilterPill
                                value={status}
                                onChange={setStatus}
                                options={[
                                    { value: 'all', label: 'Semua status' },
                                    { value: 'active', label: 'Aktif' },
                                    { value: 'draft', label: 'Draf' },
                                ]}
                            />
                            {/* View mode toggle */}
                            <div className="ml-auto flex items-center rounded-input border border-edge bg-white">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex h-8 w-8 items-center justify-center rounded-l-input transition-colors cursor-pointer ${
                                        viewMode === 'grid'
                                            ? 'bg-brand-subtle text-brand'
                                            : 'text-ink-faint hover:text-ink'
                                    }`}
                                    title="Tampilan grid"
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex h-8 w-8 items-center justify-center rounded-r-input transition-colors cursor-pointer ${
                                        viewMode === 'list'
                                            ? 'bg-brand-subtle text-brand'
                                            : 'text-ink-faint hover:text-ink'
                                    }`}
                                    title="Tampilan list"
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </FilterBar>
                    </div>

                    {/* Stats summary */}
                    <div className="mb-5 flex items-center gap-4 text-xs text-ink-muted">
                        <span className="font-medium text-ink">{filteredMy.length} bingkai</span>
                        <span>·</span>
                        <span>{myFrames.filter((f) => f.status === 'active').length} aktif</span>
                        <span>·</span>
                        <span>{myFrames.filter((f) => f.status === 'draft').length} draf</span>
                    </div>

                    {filteredMy.length === 0 ? (
                        <Card>
                            <EmptyState
                                icon={Shapes}
                                title="Belum ada bingkai"
                                description="Buat bingkai pertama Anda atau download dari galeri online."
                                action={
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            icon={CloudDownload}
                                            size="sm"
                                            onClick={() => setActiveTab('online')}
                                        >
                                            Download
                                        </Button>
                                        <Button
                                            icon={Plus}
                                            size="sm"
                                            onClick={() => setCreateOpen(true)}
                                        >
                                            Buat Bingkai
                                        </Button>
                                    </div>
                                }
                            />
                        </Card>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredMy.map((f) => (
                                <MyFrameCard
                                    key={f.id}
                                    frame={f}
                                    viewMode="grid"
                                    onDelete={setConfirm}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredMy.map((f) => (
                                <MyFrameCard
                                    key={f.id}
                                    frame={f}
                                    viewMode="list"
                                    onDelete={setConfirm}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ═══ Tab: Download dari Internet ═════════════════════ */}
            {activeTab === 'online' && (
                <>
                    {/* Banner */}
                    <div className="mb-5 rounded-card bg-gradient-to-r from-brand via-blue-600 to-indigo-600 p-5 text-white shadow-card">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">Galeri Bingkai Online</h3>
                                <p className="text-xs text-white/80">
                                    Jelajahi ribuan bingkai siap pakai dari komunitas desainer.
                                    Download gratis atau premium langsung ke koleksi Anda.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <FilterBar>
                            <SearchInput
                                placeholder="Cari bingkai online…"
                                value={onlineSearch}
                                onChange={(e) => setOnlineSearch(e.target.value)}
                                className="w-full lg:w-72"
                            />
                            <FilterPill
                                value={onlineTag}
                                onChange={setOnlineTag}
                                options={allTags.map((t) => ({
                                    value: t,
                                    label: t === 'all' ? 'Semua kategori' : t,
                                }))}
                            />
                        </FilterBar>
                    </div>

                    <div className="mb-4 flex items-center gap-4 text-xs text-ink-muted">
                        <span className="font-medium text-ink">
                            {filteredOnline.length} bingkai ditemukan
                        </span>
                        <span>·</span>
                        <span>{onlineFrames.filter((f) => f.free).length} gratis</span>
                        <span>·</span>
                        <span>{onlineFrames.filter((f) => f.downloaded).length} sudah diunduh</span>
                    </div>

                    {filteredOnline.length === 0 ? (
                        <Card>
                            <EmptyState
                                icon={Globe}
                                title="Tidak ditemukan"
                                description="Coba ubah kata kunci atau filter pencarian Anda."
                            />
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredOnline.map((f) => (
                                <OnlineFrameCard key={f.id} frame={f} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ── Modals ──────────────────────────────────────────── */}
            <CreateFrameModal open={createOpen} onClose={() => setCreateOpen(false)} />

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={() => {
                    setConfirm(null);
                    toast({
                        tone: 'warning',
                        title: 'Bingkai dihapus',
                        message: `${confirm.name} telah dihapus.`,
                    });
                }}
                title="Hapus bingkai?"
                message={`Bingkai "${confirm?.name}" akan dihapus permanen. Proyek yang menggunakan bingkai ini akan terpengaruh.`}
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
