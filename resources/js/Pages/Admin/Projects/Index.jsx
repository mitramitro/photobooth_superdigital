import React, { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    FolderKanban,
    Plus,
    LayoutGrid,
    List,
    Timer,
    LayoutPanelTop,
    Layers,
    Sun,
    Monitor,
    Radio,
    Pencil,
    Trash2,
    Play,
    LayoutTemplate,
    Shapes,
} from 'lucide-react';
import {
    PageHeader,
    Button,
    SearchInput,
    FilterBar,
    FilterPill,
    Table,
    Pagination,
    EmptyState,
    Card,
    CardHeader,
    CardBody,
    StatusBadge,
    Drawer,
    Field,
    Input,
    Select,
    Checkbox,
    ConfirmDialog,
    useToast,
    PhotoThumbnail,
} from '@/Components/ui';

const TEMPLATE_OPTIONS = ['Photobox Retail', 'Photobox Event', 'Photobox Self'];
const LAYOUT_OPTIONS = ['4-Grid Strip', 'Classic 3-Strip', 'Single Portrait'];
const TIMER_OPTIONS = [3, 5, 10, 15];

const initialProjects = [
    {
        id: 'PRJ-001',
        name: 'Photobox Retail Grand Mall',
        template: 'Photobox Retail',
        orientation: 'Portrait',
        timer: 5,
        layout: '4-Grid Strip',
        frame: 'Cyberpunk Neon',
        filter: 'Cyber Neon',
        lighting: 'High Brightness',
        thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
        assignedDevice: 'Booth #01 Main Hall',
        status: 'active',
    },
    {
        id: 'PRJ-002',
        name: 'Wedding Party Classic Event',
        template: 'Photobox Event',
        orientation: 'Landscape',
        timer: 3,
        layout: 'Classic 3-Strip',
        frame: 'Wedding Elegant White',
        filter: 'Sepia Warm',
        lighting: 'Soft Studio Glow',
        thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
        assignedDevice: 'Booth #02 VIP Stage',
        status: 'active',
    },
    {
        id: 'PRJ-003',
        name: 'Self Studio Cafe Corner',
        template: 'Photobox Self',
        orientation: 'Portrait',
        timer: 10,
        layout: 'Single Portrait',
        frame: 'Retro Vintage 90s',
        filter: 'Noir B&W',
        lighting: 'Natural Ambient',
        thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
        assignedDevice: '',
        status: 'draft',
    },
];

const statusTone = { active: 'success', draft: 'neutral', archived: 'neutral' };
const statusLabel = { active: 'Aktif', draft: 'Draf', archived: 'Arsip' };

const emptyForm = () => ({
    name: '',
    description: '',
    template: 'Photobox Retail',
    orientation: 'Portrait',
    timer: 5,
    layout: '4-Grid Strip',
    frame: 'Standard Frame',
    filter: 'Original',
    lighting: 'Standard',
    assignedDevice: '',
    status: 'draft',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
});

export default function Index() {
    const { toast } = useToast();
    const [projects, setProjects] = useState(initialProjects);
    const [view, setView] = useState('grid');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sort, setSort] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(8);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm());
    const [errors, setErrors] = useState({});
    const [confirm, setConfirm] = useState(null);

    const filtered = useMemo(() => {
        let rows = [...projects];
        if (statusFilter !== 'all') rows = rows.filter((r) => r.status === statusFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            rows = rows.filter(
                (r) =>
                    r.name.toLowerCase().includes(q) ||
                    r.template.toLowerCase().includes(q) ||
                    r.id.toLowerCase().includes(q),
            );
        }
        if (sort) {
            rows.sort((a, b) => {
                const av = a[sort.key];
                const bv = b[sort.key];
                const cmp = String(av ?? '').localeCompare(String(bv ?? ''));
                return sort.dir === 'asc' ? cmp : -cmp;
            });
        }
        return rows;
    }, [projects, search, statusFilter, sort]);

    const pageRows = filtered.slice((page - 1) * perPage, page * perPage);
    const activeCount = projects.filter((p) => p.status === 'active').length;

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm());
        setErrors({});
        setDrawerOpen(true);
    };

    const openEdit = (project) => {
        setEditing(project);
        setForm({ ...emptyForm(), ...project });
        setErrors({});
        setDrawerOpen(true);
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Nama proyek wajib diisi.';
        if (!form.description?.trim()) e.description = 'Deskripsi singkat wajib diisi.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) {
            toast({ tone: 'error', title: 'Periksa kembali', message: 'Ada beberapa field yang perlu dilengkapi.' });
            return;
        }
        if (editing) {
            setProjects((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form } : p)));
            toast({ tone: 'success', title: 'Proyek diperbarui', message: `${form.name} berhasil disimpan.` });
        } else {
            const created = { ...form, id: `PRJ-${String(projects.length + 1).padStart(3, '0')}` };
            setProjects((prev) => [created, ...prev]);
            toast({ tone: 'success', title: 'Proyek dibuat', message: `${form.name} berhasil dibuat.` });
        }
        setDrawerOpen(false);
    };

    const handleDelete = () => {
        setProjects((prev) => prev.filter((p) => p.id !== confirm.id));
        toast({ tone: 'warning', title: 'Proyek dihapus', message: `${confirm.name} telah dihapus.` });
        setConfirm(null);
    };

    const set = (k) => (e) =>
        setForm((f) => ({ ...f, [k]: e?.target?.value ?? e }));

    const running = (p) => p.status === 'active' && p.assignedDevice;

    const columns = [
        {
            key: 'name',
            label: 'Proyek',
            sortable: true,
            render: (r) => (
                <div className="flex items-center gap-3">
                    <PhotoThumbnail src={r.thumbnail} alt={r.name} aspect="square" className="h-10 w-10 shrink-0 rounded-input" />
                    <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{r.name}</p>
                        <p className="truncate text-xs text-ink-muted">{r.id}</p>
                    </div>
                </div>
            ),
        },
        { key: 'template', label: 'Template', sortable: true, render: (r) => <span className="text-sm">{r.template}</span> },
        { key: 'layout', label: 'Layout', render: (r) => <span className="text-sm">{r.layout}</span> },
        { key: 'timer', label: 'Timer', align: 'right', render: (r) => <span className="text-sm">{r.timer}s</span> },
        {
            key: 'assignedDevice',
            label: 'Perangkat',
            render: (r) =>
                r.assignedDevice ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-ink">
                        <Monitor className="h-3.5 w-3.5 text-ink-faint" />
                        {r.assignedDevice}
                    </span>
                ) : (
                    <span className="text-sm text-warning">Belum terhubung</span>
                ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (r) => (
                <StatusBadge tone={statusTone[r.status]} dot pulse={running(r)}>
                    {running(r) ? 'LIVE' : statusLabel[r.status]}
                </StatusBadge>
            ),
        },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (r) => (
                <div className="flex items-center justify-end gap-1">
                    {running(r) && (
                        <Link
                            href="/admin/kiosk"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-input text-brand hover:bg-brand-subtle"
                            title="Buka di kiosk"
                        >
                            <Play className="h-3.5 w-3.5 fill-current" />
                        </Link>
                    )}
                    <button
                        onClick={() => openEdit(r)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-input text-ink-muted hover:bg-slate-100 hover:text-ink"
                        title="Ubah"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => setConfirm(r)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-input text-ink-muted hover:bg-danger-subtle hover:text-danger"
                        title="Hapus"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout title="Proyek">
            <Head title="Manajemen Proyek - Photobooth Studio" />

            <PageHeader
                title="Proyek"
                description="Kelola dan konfigurasi proyek photobooth Anda."
                icon={FolderKanban}
                actions={
                    <>
                        <span className="hidden items-center gap-2 text-sm text-ink-muted sm:inline-flex">
                            {projects.length} proyek · {activeCount} aktif
                        </span>
                        <Button icon={Plus} onClick={openCreate}>
                            Tambah Proyek
                        </Button>
                    </>
                }
            />

            {/* Toolbar */}
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <FilterBar>
                    <SearchInput
                        placeholder="Cari proyek…"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full lg:w-72"
                    />
                    <FilterPill
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v);
                            setPage(1);
                        }}
                        options={[
                            { value: 'all', label: 'Semua' },
                            { value: 'active', label: 'Aktif' },
                            { value: 'draft', label: 'Draf' },
                        ]}
                    />
                </FilterBar>

                <div className="flex items-center gap-1 rounded-input border border-edge bg-white p-0.5">
                    <button
                        onClick={() => setView('grid')}
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-input ${view === 'grid' ? 'bg-slate-100 text-ink' : 'text-ink-muted hover:text-ink'}`}
                        title="Tampilan grid"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setView('table')}
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-input ${view === 'table' ? 'bg-slate-100 text-ink' : 'text-ink-muted hover:text-ink'}`}
                        title="Tampilan tabel"
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {filtered.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={FolderKanban}
                        title="Belum ada proyek"
                        description="Buat proyek photobooth pertama Anda untuk mulai mengonfigurasi template, frame, dan perangkat."
                        action={
                            <Button icon={Plus} onClick={openCreate}>
                                Tambah Proyek
                            </Button>
                        }
                    />
                </Card>
            ) : view === 'table' ? (
                <Card className="overflow-hidden">
                    <Table
                        columns={columns}
                        rows={pageRows}
                        rowKey="id"
                        sort={sort}
                        onSort={setSort}
                    />
                    <Pagination
                        page={page}
                        total={filtered.length}
                        perPage={perPage}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {pageRows.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                running={running(project)}
                                onEdit={() => openEdit(project)}
                                onDelete={() => setConfirm(project)}
                            />
                        ))}
                    </div>
                    <div className="mt-4">
                        <Pagination
                            page={page}
                            total={filtered.length}
                            perPage={perPage}
                            onPageChange={setPage}
                            onPerPageChange={setPerPage}
                        />
                    </div>
                </>
            )}

            {/* Create / Edit Drawer */}
            <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={editing ? 'Ubah Proyek' : 'Tambah Proyek Baru'}
                description={
                    editing
                        ? 'Perbarui konfigurasi proyek yang sudah ada.'
                        : 'Konfigurasikan proyek photobooth baru.'
                }
                icon={FolderKanban}
                size="xl"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSave}>{editing ? 'Simpan Perubahan' : 'Buat Proyek'}</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <section className="space-y-5">
                        <div>
                            <h4 className="text-sm font-semibold text-ink">Informasi Dasar</h4>
                            <p className="text-xs text-ink-muted">Informasi umum mengenai proyek.</p>
                        </div>
                        <Field label="Nama proyek" required error={errors.name}>
                            <Input
                                value={form.name}
                                error={!!errors.name}
                                onChange={set('name')}
                                placeholder="Contoh: Grand Opening Retail Mall"
                            />
                        </Field>
                        <Field label="Deskripsi" required error={errors.description}>
                            <Input
                                type="textarea"
                                rows={3}
                                value={form.description}
                                error={!!errors.description}
                                onChange={set('description')}
                                placeholder="Deskripsi singkat proyek"
                            />
                        </Field>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field label="Template" hint="Tentukan jenis template proyek.">
                                <Select value={form.template} onChange={set('template')}>
                                    {TEMPLATE_OPTIONS.map((t) => (
                                        <option key={t}>{t}</option>
                                    ))}
                                </Select>
                            </Field>
                            <Field label="Orientasi">
                                <Select value={form.orientation} onChange={set('orientation')}>
                                    <option value="Portrait">Portrait (9:16)</option>
                                    <option value="Landscape">Landscape (16:9)</option>
                                </Select>
                            </Field>
                        </div>
                        <Field label="Status">
                            <Select value={form.status} onChange={set('status')}>
                                <option value="draft">Draf</option>
                                <option value="active">Aktif</option>
                            </Select>
                        </Field>
                    </section>

                    <div className="border-t border-edge" />

                    <section className="space-y-5">
                        <div>
                            <h4 className="text-sm font-semibold text-ink">Konfigurasi Photobooth</h4>
                            <p className="text-xs text-ink-muted">Atur perilaku sesi foto dan tampilan cetak.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field label="Timer hitung mundur">
                                <Select value={String(form.timer)} onChange={(e) => setForm((f) => ({ ...f, timer: Number(e.target.value) }))}>
                                    {TIMER_OPTIONS.map((t) => (
                                        <option key={t} value={t}>
                                            {t} detik
                                        </option>
                                    ))}
                                </Select>
                            </Field>
                            <Field label="Layout foto">
                                <Select value={form.layout} onChange={set('layout')}>
                                    {LAYOUT_OPTIONS.map((l) => (
                                        <option key={l}>{l}</option>
                                    ))}
                                </Select>
                            </Field>
                            <Field label="Frame">
                                <Input value={form.frame} onChange={set('frame')} />
                            </Field>
                            <Field label="Filter">
                                <Input value={form.filter} onChange={set('filter')} />
                            </Field>
                            <Field label="Pencahayaan">
                                <Input value={form.lighting} onChange={set('lighting')} />
                            </Field>
                        </div>
                        <Field label="Perangkat tertaut" hint="Kosongkan jika belum menautkan perangkat.">
                            <Select value={form.assignedDevice || ''} onChange={(e) => setForm((f) => ({ ...f, assignedDevice: e.target.value }))}>
                                <option value="">Belum terhubung</option>
                                <option value="Booth #01 Main Hall">Booth #01 Main Hall</option>
                                <option value="Booth #02 VIP Stage">Booth #02 VIP Stage</option>
                                <option value="Booth #03 Lounge Bar">Booth #03 Lounge Bar</option>
                            </Select>
                        </Field>
                    </section>
                </div>
            </Drawer>

            {/* Delete confirmation */}
            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={handleDelete}
                title="Hapus proyek?"
                message={`Proyek "${confirm?.name}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus Proyek"
            />
        </AdminLayout>
    );
}

function ProjectCard({ project, running, onEdit, onDelete }) {
    return (
        <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-cardHover">
            <div className="relative">
                <PhotoThumbnail src={project.thumbnail} alt={project.name} aspect="video" />
                <div className="absolute left-2 top-2">
                    <span className="rounded-input bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink shadow-sm">
                        {project.template}
                    </span>
                </div>
                <div className="absolute right-2 top-2">
                    {running ? (
                        <StatusBadge tone="success" dot pulse>
                            LIVE
                        </StatusBadge>
                    ) : (
                        <StatusBadge tone={statusTone[project.status]}>
                            {statusLabel[project.status]}
                        </StatusBadge>
                    )}
                </div>
            </div>

            <CardBody className="flex flex-1 flex-col gap-3">
                <div>
                    <p className="truncate font-semibold text-ink">{project.name}</p>
                    <p className="text-xs text-ink-muted">{project.id}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    <Meta icon={Timer} label={`${project.timer}s`} />
                    <Meta icon={LayoutPanelTop} label={project.layout} />
                    <Meta icon={Layers} label={project.frame} />
                    {project.assignedDevice && <Meta icon={Monitor} label={project.assignedDevice} />}
                </div>
            </CardBody>

            <div className="flex gap-2 border-t border-edge px-5 py-3">
                {running && (
                    <Link
                        href="/admin/kiosk"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-input bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-dark"
                    >
                        <Play className="h-3.5 w-3.5 fill-current" /> Buka Kiosk
                    </Link>
                )}
                <Button variant="secondary" size="sm" className="flex-1" icon={Pencil} onClick={onEdit}>
                    Ubah
                </Button>
                <button
                    onClick={onDelete}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-input border border-edge text-ink-muted hover:bg-danger-subtle hover:text-danger"
                    title="Hapus"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </Card>
    );
}

function Meta({ icon: Icon, label }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-input bg-slate-100 px-2 py-1 text-[11px] font-medium text-ink-muted">
            <Icon className="h-3 w-3" />
            <span className="max-w-[100px] truncate">{label}</span>
        </span>
    );
}
