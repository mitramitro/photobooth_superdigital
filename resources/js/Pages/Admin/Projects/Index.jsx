import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FolderKanban, Plus, Pencil, Trash2, Image as ImageIcon, SearchX } from 'lucide-react';
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
    Pagination,
    ConfirmDialog,
    PhotoThumbnail,
} from '@/Components/ui';
import {
    projectTypeLabel,
    projectStatusLabel,
    projectOrientationLabel,
    PROJECT_STATUS_TONES,
} from '@/Components/Projects/projectMeta';

export default function Index({ projects, filters = {} }) {
    const { auth } = usePage().props;
    const isSuperAdmin = auth?.user?.role === 'super_admin';
    const [confirm, setConfirm] = useState(null);
    const [search, setSearch] = useState(filters.search ?? '');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search ?? '')) {
                applyFilters({ search: search || undefined }, true);
            }
        }, 350);
        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = (overrides, resetPage = true) => {
        router.get(
            route('admin.projects.index'),
            { ...filters, search: filters.search ?? '', status: filters.status ?? '', ...overrides, page: resetPage ? 1 : undefined },
            { preserveState: true, replace: true },
        );
    };

    const changeStatus = (status) => applyFilters({ status: status === 'all' ? undefined : status });
    const changePage = (page) => applyFilters({}, false);

    const resetQuery = () => applyFilters({ search: undefined, status: undefined }, true);

    const rows = projects.data ?? [];

    return (
        <AdminLayout title="Proyek">
            <Head title="Proyek - Photobooth Studio" />

            <PageHeader
                title="Proyek"
                description="Kelola dan konfigurasi proyek photobooth Anda."
                icon={FolderKanban}
                actions={
                    <>
                        <span className="hidden items-center gap-2 text-sm text-ink-muted sm:inline-flex">
                            {projects.total} proyek ·{' '}
                            {rows.filter((p) => p.status === 'active').length} aktif
                        </span>
                        <Link href={route('admin.projects.create')}>
                            <Button icon={Plus}>Tambah Proyek</Button>
                        </Link>
                    </>
                }
            />

            <div className="mb-4">
                <FilterBar>
                    <SearchInput
                        placeholder="Cari proyek…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full lg:w-72"
                        aria-label="Cari proyek"
                    />
                    <FilterPill
                        value={filters.status ?? 'all'}
                        onChange={changeStatus}
                        options={[
                            { value: 'all', label: 'Semua' },
                            { value: 'draft', label: 'Draf' },
                            { value: 'active', label: 'Aktif' },
                            { value: 'inactive', label: 'Nonaktif' },
                        ]}
                    />
                </FilterBar>
            </div>

            {projects.total === 0 ? (
                <Card>
                    <EmptyState
                        icon={FolderKanban}
                        title="Belum ada proyek."
                        description="Buat proyek photobooth pertama Anda untuk mulai mengonfigurasi pengalaman fotonya."
                        action={
                            <Link href={route('admin.projects.create')}>
                                <Button icon={Plus}>Tambah Proyek</Button>
                            </Link>
                        }
                    />
                </Card>
            ) : rows.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={SearchX}
                        title="Tidak ada proyek yang cocok"
                        description="Coba ubah kata kunci pencarian atau filter status."
                        action={
                            <Button variant="secondary" onClick={resetQuery}>
                                Hapus Filter
                            </Button>
                        }
                    />
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {rows.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                showOwner={isSuperAdmin}
                                onDelete={() => setConfirm(project)}
                            />
                        ))}
                    </div>

                    <div className="mt-4">
                        <Pagination
                            page={projects.current_page}
                            total={projects.total}
                            perPage={projects.per_page}
                            onPageChange={changePage}
                        />
                    </div>
                </>
            )}

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={() => {
                    if (confirm) {
                        router.delete(route('admin.projects.destroy', confirm.id), {
                            preserveScroll: true,
                            onSuccess: () => setConfirm(null),
                        });
                    }
                }}
                title="Hapus proyek?"
                message={`Proyek "${confirm?.name}" beserta datanya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus Proyek"
            />
        </AdminLayout>
    );
}

function ProjectCard({ project, showOwner, onDelete }) {
    return (
        <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-cardHover">
            <div className="relative">
                {project.welcome_image_url ? (
                    <PhotoThumbnail src={project.welcome_image_url} alt={`Gambar sambutan ${project.name}`} aspect="video" />
                ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center border-b border-edge bg-slate-50">
                        <ImageIcon className="h-7 w-7 text-ink-faint" />
                    </div>
                )}

                <div className="absolute left-2 top-2">
                    <span className="rounded-input bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink shadow-sm">
                        {projectTypeLabel(project.type)}
                    </span>
                </div>
                <div className="absolute right-2 top-2">
                    <StatusBadge tone={PROJECT_STATUS_TONES[project.status] ?? 'neutral'} dot>
                        {projectStatusLabel(project.status)}
                    </StatusBadge>
                </div>
            </div>

            <CardBody className="flex flex-1 flex-col gap-3">
                <div>
                    <p className="truncate font-semibold text-ink">{project.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                        {projectOrientationLabel(project.orientation)}
                    </p>
                </div>

                {showOwner && project.user && (
                    <p className="truncate text-xs text-ink-faint">Owner: {project.user.email}</p>
                )}
            </CardBody>

            <div className="flex items-center gap-2 border-t border-edge px-5 py-3">
                <Link
                    href={route('admin.projects.show', project.id)}
                    className="inline-flex flex-1 items-center justify-center rounded-input border border-edge bg-white px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-slate-50 hover:text-ink"
                >
                    Buka
                </Link>
                <Link
                    href={route('admin.projects.edit', project.id)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-input border border-edge bg-white px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-slate-50 hover:text-ink"
                    title="Ubah informasi proyek"
                >
                    <Pencil className="h-3.5 w-3.5" /> Ubah
                </Link>
                <button
                    onClick={onDelete}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-input border border-edge text-ink-muted transition-colors hover:bg-danger-subtle hover:text-danger"
                    title="Hapus proyek"
                    aria-label={`Hapus proyek ${project.name}`}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </Card>
    );
}