import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Shapes, Plus, Pencil, Trash2, Copy } from 'lucide-react';
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
    Dropdown,
} from '@/Components/ui';

const frames = [
    { id: 'FRM-001', name: 'Cyberpunk Neon Border', category: 'Neon', orientation: 'Portrait', status: 'active', usage: 6, preview: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop' },
    { id: 'FRM-002', name: 'Wedding White Elegant', category: 'Wedding', orientation: 'Portrait', status: 'active', usage: 4, preview: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop' },
    { id: 'FRM-003', name: 'Retro Polaroid', category: 'Retro', orientation: 'Landscape', status: 'active', usage: 3, preview: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
    { id: 'FRM-004', name: 'Emerald Glow', category: 'Neon', orientation: 'Portrait', status: 'draft', usage: 0, preview: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop' },
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
        let rows = [...frames];
        if (category !== 'all') rows = rows.filter((r) => r.category === category);
        if (status !== 'all') rows = rows.filter((r) => r.status === status);
        if (search.trim()) rows = rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
        return rows;
    }, [search, category, status]);

    const categories = ['all', ...new Set(frames.map((f) => f.category))];

    return (
        <AdminLayout title="Frame">
            <Head title="Frame - Photobooth Studio" />

            <PageHeader
                title="Frame"
                description="Kelola bingkai & overlay desain untuk hasil foto."
                icon={Shapes}
                actions={
                    <Button
                        icon={Plus}
                        onClick={() => toast({ tone: 'info', title: 'Frame baru', message: 'Alur pembuatan frame akan segera hadir.' })}
                    >
                        Tambah Frame
                    </Button>
                }
            />

            <div className="mb-4">
                <FilterBar>
                    <SearchInput
                        placeholder="Cari frame…"
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
                        icon={Shapes}
                        title="Belum ada frame"
                        description="Tidak ada frame yang cocok dengan filter Anda."
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((f) => (
                        <Card key={f.id} className="flex flex-col overflow-hidden transition-shadow hover:shadow-cardHover">
                            <div className="p-3">
                                <div
                                    className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-card bg-slate-100 ${f.orientation === 'Landscape' ? 'p-8' : 'p-4'}`}
                                >
                                    <img
                                        src={f.preview}
                                        alt={f.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                            <CardBody className="flex-1 pt-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-ink">{f.name}</p>
                                        <p className="mt-0.5 text-xs text-ink-muted">{f.category} · {f.orientation}</p>
                                    </div>
                                    <StatusBadge tone={statusTone[f.status]} dot>
                                        {statusLabel[f.status]}
                                    </StatusBadge>
                                </div>
                                <p className="mt-2 text-xs text-ink-faint">Digunakan {f.usage} proyek</p>
                            </CardBody>
                            <div className="flex items-center justify-between border-t border-edge px-4 py-2.5">
                                <span className="text-xs text-ink-faint">{f.id}</span>
                                <Dropdown
                                    items={[
                                        { label: 'Duplikat', icon: Copy, onClick: () => toast({ tone: 'success', title: 'Frame diduplikasi' }) },
                                        { label: 'Ubah', icon: Pencil, onClick: () => toast({ tone: 'info', title: 'Edit frame' }) },
                                        { divider: true },
                                        { label: 'Hapus', icon: Trash2, danger: true, onClick: () => setConfirm(f) },
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
                    toast({ tone: 'warning', title: 'Frame dihapus', message: `${confirm.name} telah dihapus.` });
                }}
                title="Hapus frame?"
                message={`Frame "${confirm?.name}" akan dihapus.`}
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
