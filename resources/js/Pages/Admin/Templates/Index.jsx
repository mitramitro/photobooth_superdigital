import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { LayoutTemplate, Plus, Pencil, Trash2, Copy, Filter as FilterIcon } from 'lucide-react';
import {
    PageHeader,
    Button,
    SearchInput,
    FilterBar,
    FilterPill,
    Card,
    CardBody,
    EmptyState,
    StatusBadge,
    ConfirmDialog,
    useToast,
    PhotoThumbnail,
    Dropdown,
} from '@/Components/ui';

const templates = [
    { id: 'TPL-001', name: 'Cyberpunk Neon 4-Strip', category: 'Party', type: '4-Strip', orientation: 'Portrait', status: 'active', usage: 12, thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop' },
    { id: 'TPL-002', name: 'Wedding Elegant Classic', category: 'Wedding', type: '3-Strip', orientation: 'Portrait', status: 'active', usage: 8, thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop' },
    { id: 'TPL-003', name: 'Retro Vintage 90s', category: 'Retro', type: 'Single', orientation: 'Portrait', status: 'active', usage: 5, thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
    { id: 'TPL-004', name: 'Summer Glow', category: 'Party', type: '4-Strip', orientation: 'Landscape', status: 'draft', usage: 0, thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop' },
    { id: 'TPL-005', name: 'Minimalist B&W', category: 'Minimal', type: '3-Strip', orientation: 'Portrait', status: 'draft', usage: 0, thumbnail: 'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?q=80&w=600&auto=format&fit=crop' },
];

const statusTone = { active: 'success', draft: 'neutral' };
const statusLabel = { active: 'Aktif', draft: 'Draf' };

export default function Index() {
    const { toast } = useToast();
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [status, setStatus] = useState('all');
    const [confirm, setConfirm] = useState(null);

    const filtered = useMemo(() => {
        let rows = [...templates];
        if (category !== 'all') rows = rows.filter((r) => r.category === category);
        if (status !== 'all') rows = rows.filter((r) => r.status === status);
        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter((r) => r.name.toLowerCase().includes(q));
        }
        return rows;
    }, [search, category, status]);

    const categories = ['all', ...new Set(templates.map((t) => t.category))];

    return (
        <AdminLayout title="Template">
            <Head title="Template - Photobooth Studio" />

            <PageHeader
                title="Template"
                description="Kelola tata letak & template cetak foto untuk proyek Anda."
                icon={LayoutTemplate}
                actions={
                    <Button
                        icon={Plus}
                        onClick={() => toast({ tone: 'info', title: 'Template baru', message: 'Alur pembuatan template akan segera hadir.' })}
                    >
                        Tambah Template
                    </Button>
                }
            />

            <div className="mb-4">
                <FilterBar>
                    <SearchInput
                        placeholder="Cari template…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full lg:w-72"
                    />
                    <FilterPill value={category} onChange={setCategory} options={categories.map((c) => ({ value: c, label: c === 'all' ? 'Semua kategori' : c }))} />
                    <FilterPill
                        value={status}
                        onChange={setStatus}
                        options={[
                            { value: 'all', label: 'Semua status' },
                            { value: 'active', label: 'Aktif' },
                            { value: 'draft', label: 'Draf' },
                        ]}
                    />
                </FilterBar>
            </div>

            {filtered.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={LayoutTemplate}
                        title="Belum ada template"
                        description="Tidak ada template yang cocok dengan filter Anda."
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((t) => (
                        <Card key={t.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-cardHover">
                            <div className="p-3">
                                <PhotoThumbnail
                                    src={t.thumbnail}
                                    alt={t.name}
                                    aspect="portrait"
                                    badge={t.type}
                                    overlay={
                                        <div className="flex items-end justify-between gap-2">
                                            <span className="text-xs font-semibold text-white">{t.name}</span>
                                        </div>
                                    }
                                />
                            </div>
                            <CardBody className="flex-1 pt-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-ink">{t.name}</p>
                                        <p className="mt-0.5 text-xs text-ink-muted">{t.category} · {t.orientation}</p>
                                    </div>
                                    <StatusBadge tone={statusTone[t.status]} dot>
                                        {statusLabel[t.status]}
                                    </StatusBadge>
                                </div>
                                <p className="mt-2 text-xs text-ink-faint">Digunakan {t.usage} proyek</p>
                            </CardBody>
                            <div className="flex items-center justify-between border-t border-edge px-4 py-2.5">
                                <span className="text-xs text-ink-faint">{t.id}</span>
                                <Dropdown
                                    items={[
                                        { label: 'Duplikat', icon: Copy, onClick: () => toast({ tone: 'success', title: 'Template diduplikasi', message: `${t.name} duplicate dibuat.` }) },
                                        { label: 'Ubah', icon: Pencil, onClick: () => toast({ tone: 'info', title: 'Edit template', message: 'Editor template akan segera hadir.' }) },
                                        { divider: true },
                                        { label: 'Hapus', icon: Trash2, danger: true, onClick: () => setConfirm(t) },
                                    ]}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={() => {
                    setConfirm(null);
                    toast({ tone: 'warning', title: 'Template dihapus', message: `${confirm.name} telah dihapus.` });
                }}
                title="Hapus template?"
                message={`Template "${confirm?.name}" akan dihapus. Proyek yang menggunakannya tidak akan terpengaruh.`}
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
