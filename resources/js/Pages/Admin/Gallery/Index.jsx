import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Image as ImageIcon, Download, Printer, Trash2, Upload, X } from 'lucide-react';
import {
    PageHeader,
    Button,
    SearchInput,
    FilterBar,
    Select,
    Card,
    EmptyState,
    useToast,
    PhotoThumbnail,
    ConfirmDialog,
    Modal,
} from '@/Components/ui';

const initialPhotos = [
    { id: 'SESH-8891', project: 'Photobox Retail Grand Mall', session: 'Sesi #142', date: '2026-08-25', template: 'Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop' },
    { id: 'SESH-8890', project: 'Wedding Party Classic Event', session: 'Sesi #141', date: '2026-08-25', template: 'Wedding Elegant', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop' },
    { id: 'SESH-8889', project: 'Self Studio Cafe Corner', session: 'Sesi #140', date: '2026-08-24', template: 'Retro 90s', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
    { id: 'SESH-8888', project: 'Photobox Retail Grand Mall', session: 'Sesi #139', date: '2026-08-24', template: 'Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop' },
    { id: 'SESH-8887', project: 'Self Studio Cafe Corner', session: 'Sesi #138', date: '2026-08-23', template: 'Retro 90s', url: 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?q=80&w=600&auto=format&fit=crop' },
];

export default function Index() {
    const { toast } = useToast();
    const [photos, setPhotos] = useState(initialPhotos);
    const [search, setSearch] = useState('');
    const [projectFilter, setProjectFilter] = useState('all');
    const [selected, setSelected] = useState({});
    const [preview, setPreview] = useState(null);
    const [confirm, setConfirm] = useState(null);

    const projects = ['all', ...new Set(photos.map((p) => p.project))];

    const filtered = useMemo(() => {
        let rows = [...photos];
        if (projectFilter !== 'all') rows = rows.filter((r) => r.project === projectFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter((r) => r.id.toLowerCase().includes(q) || r.session.toLowerCase().includes(q));
        }
        return rows;
    }, [photos, search, projectFilter]);

    const selectedIds = Object.keys(selected).filter((k) => selected[k]);
    const allSelected = filtered.length > 0 && filtered.every((p) => selected[p.id]);

    const toggleAll = () => {
        if (allSelected) setSelected({});
        else {
            const next = {};
            filtered.forEach((p) => (next[p.id] = true));
            setSelected(next);
        }
    };

    const toggleOne = (id) => setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

    const bulkDelete = () => {
        setPhotos((prev) => prev.filter((p) => !selected[p.id]));
        toast({ tone: 'warning', title: 'Foto dihapus', message: `${selectedIds.length} foto telah dihapus.` });
        setSelected({});
        setConfirm(null);
    };

    const projectsForFilter = ['Seluruh proyek', ...projects.filter((p) => p !== 'all')];

    return (
        <AdminLayout title="Galeri">
            <Head title="Galeri Sesi - Photobooth Studio" />

            <PageHeader
                title="Galeri"
                description="Koleksi hasil foto sesi & event di seluruh proyek."
                icon={ImageIcon}
                actions={
                    <Button
                        variant="secondary"
                        icon={Upload}
                        onClick={() => toast({ tone: 'info', title: 'Unggah foto', message: 'Fitur unggah akan segera hadir.' })}
                    >
                        Unggah
                    </Button>
                }
            />

            {/* Toolbar */}
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <FilterBar>
                    <SearchInput
                        placeholder="Cari ID sesi…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full lg:w-72"
                    />
                    <div className="w-56">
                        <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
                            {projectsForFilter.map((p, i) => (
                                <option key={i} value={p === 'Seluruh proyek' ? 'all' : p}>
                                    {p}
                                </option>
                            ))}
                        </Select>
                    </div>
                </FilterBar>
            </div>

            {/* Bulk toolbar */}
            {selectedIds.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-card border border-brand/30 bg-brand-subtle px-4 py-2.5">
                    <span className="text-sm font-medium text-brand-dark">
                        {selectedIds.length} foto dipilih
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={Download}
                            onClick={() => toast({ tone: 'success', title: 'Unduhan dimulai', message: `${selectedIds.length} foto sedang diunduh.` })}
                        >
                            Unduh
                        </Button>
                        <Button
                            variant="outline-destructive"
                            size="sm"
                            icon={Trash2}
                            onClick={() => setConfirm({ type: 'bulk' })}
                        >
                            Hapus
                        </Button>
                        <button
                            onClick={() => setSelected({})}
                            className="inline-flex items-center gap-1 rounded-input p-1.5 text-ink-muted hover:text-ink"
                        >
                            <X className="h-4 w-4" /> Batal
                        </button>
                    </div>
                </div>
            )}

            {filtered.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={ImageIcon}
                        title="Belum ada foto"
                        description="Belum ada hasil sesi pada filter ini. Mulai sebuah sesi atau unggah foto."
                    />
                </Card>
            ) : (
                <>
                    <div className="mb-2 flex items-center justify-end">
                        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={toggleAll}
                                className="h-4 w-4 rounded border-edge text-brand focus:ring-brand/40"
                            />
                            Pilih semua ({filtered.length})
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {filtered.map((p) => (
                            <PhotoThumbnail
                                key={p.id}
                                src={p.url}
                                alt={p.id}
                                aspect="square"
                                selected={!!selected[p.id]}
                                onSelect={() => toggleOne(p.id)}
                                overlay={
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[11px] font-medium text-white">{p.id}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreview(p);
                                            }}
                                            className="rounded bg-white/20 p-1 text-white hover:bg-white/40"
                                            title="Lihat detail"
                                        >
                                            <ImageIcon className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Preview modal */}
            <Modal
                open={!!preview}
                onClose={() => setPreview(null)}
                maxWidth="2xl"
                title={preview?.id}
                description={preview ? `${preview.project} · ${preview.session}` : ''}
                icon={ImageIcon}
                footer={
                    <>
                        <Button
                            variant="secondary"
                            icon={Printer}
                            onClick={() => toast({ tone: 'success', title: 'Perintah cetak dikirim' })}
                        >
                            Cetak
                        </Button>
                        <Button icon={Download} onClick={() => toast({ tone: 'success', title: 'Sedang mengunduh' })}>
                            Unduh
                        </Button>
                    </>
                }
            >
                {preview && (
                    <div className="flex items-center justify-center rounded-card bg-slate-100 p-2">
                        <img src={preview.url} alt={preview.id} className="max-h-[420px] w-auto rounded-card object-contain" />
                    </div>
                )}
                {preview && (
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                        <div>
                            <p className="text-xs text-ink-faint">Proyek</p>
                            <p className="font-medium text-ink">{preview.project}</p>
                        </div>
                        <div>
                            <p className="text-xs text-ink-faint">Sesi</p>
                            <p className="font-medium text-ink">{preview.session}</p>
                        </div>
                        <div>
                            <p className="text-xs text-ink-faint">Tanggal</p>
                            <p className="font-medium text-ink">{preview.date}</p>
                        </div>
                        <div>
                            <p className="text-xs text-ink-faint">Template</p>
                            <p className="font-medium text-ink">{preview.template}</p>
                        </div>
                    </div>
                )}
            </Modal>

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={bulkDelete}
                title="Hapus foto?"
                message={
                    confirm?.type === 'bulk'
                        ? `${selectedIds.length} foto yang dipilih akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`
                        : 'Setiap foto yang dipilih akan dihapus permanen.'
                }
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
