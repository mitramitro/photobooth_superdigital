import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FolderKanban, Smartphone, Monitor, Info } from 'lucide-react';
import {
    PageHeader,
    Button,
    Field,
    Input,
    Select,
    Card,
    CardHeader,
    CardBody,
} from '@/Components/ui';
import WelcomeImageUpload from '@/Components/Projects/WelcomeImageUpload';
import { projectTypeLabel } from '@/Components/Projects/projectMeta';

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draf' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Nonaktif' },
];

const ORIENTATION_OPTIONS = [
    { value: 'portrait', label: 'Portrait', hint: '9:16 — vertikal', icon: Smartphone },
    { value: 'landscape', label: 'Landscape', hint: '16:9 — horizontal', icon: Monitor },
];

export default function Edit({ project }) {
    const form = useForm({
        name: project.name,
        orientation: project.orientation,
        status: project.status,
        welcome_image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.put(route('admin.projects.update', project.id), { forceFormData: true });
    };

    const hasTopErrors = Object.keys(form.errors).length > 0;

    return (
        <AdminLayout title="Ubah Proyek">
            <Head title={`Ubah ${project.name} - Photobooth Studio`} />

            <PageHeader
                title="Ubah Proyek"
                description="Perbarui informasi dasar proyek ini."
                icon={FolderKanban}
                breadcrumbs={[
                    { label: 'Proyek', href: route('admin.projects.index') },
                    { label: project.name, href: route('admin.projects.show', project.id) },
                    { label: 'Ubah' },
                ]}
            />

            {hasTopErrors && (
                <div role="alert" className="mb-5 rounded-card border border-danger/30 bg-danger-subtle/60 p-4">
                    <h2 className="text-sm font-semibold text-danger">Form belum lengkap</h2>
                    <ul className="mt-1 list-inside list-disc text-xs text-danger/90">
                        {Object.values(form.errors).map((msg, i) => (
                            <li key={i}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <Card>
                    <CardHeader title="Informasi Proyek" description="Data dasar yang dimiliki proyek ini" icon={FolderKanban} />
                    <CardBody className="space-y-6">
                        {/* Type — read only on edit */}
                        <div className="flex items-start gap-3 rounded-input border border-edge bg-slate-50 px-4 py-3">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
                            <div>
                                <p className="text-xs font-medium text-ink-muted">Jenis proyek</p>
                                <p className="text-sm font-semibold text-ink">{projectTypeLabel(project.type)}</p>
                                <p className="mt-0.5 text-xs text-ink-muted">Jenis proyek tidak dapat diubah setelah dibuat.</p>
                            </div>
                        </div>

                        <Field label="Judul Proyek" htmlFor="name" required error={form.errors.name}>
                            <Input
                                id="name"
                                value={form.data.name}
                                error={!!form.errors.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                            />
                        </Field>

                        <div>
                            <p className="text-sm font-medium text-ink" id="orientation-label-edit">
                                Orientasi <span className="ml-0.5 text-danger">*</span>
                            </p>
                            <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="orientation-label-edit">
                                {ORIENTATION_OPTIONS.map((o) => {
                                    const Icon = o.icon;
                                    const selected = form.data.orientation === o.value;
                                    return (
                                        <button
                                            key={o.value}
                                            type="button"
                                            onClick={() => form.setData('orientation', o.value)}
                                            aria-pressed={selected}
                                            className={`flex items-center gap-3 rounded-input border px-4 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                                                selected
                                                    ? 'border-brand bg-brand-subtle/60 ring-2 ring-brand/40'
                                                    : 'border-edge bg-white hover:border-brand/40'
                                            }`}
                                        >
                                            <Icon className={`h-5 w-5 shrink-0 ${selected ? 'text-brand' : 'text-ink-faint'}`} />
                                            <span>
                                                <span className="block text-sm font-semibold text-ink">{o.label}</span>
                                                <span className="block text-xs text-ink-muted">{o.hint}</span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {form.errors.orientation && (
                                <p role="alert" className="mt-1.5 text-xs text-danger">
                                    {form.errors.orientation}
                                </p>
                            )}
                        </div>

                        <Field label="Welcome Screen">
                            <WelcomeImageUpload
                                inputId="welcome_image_edit"
                                value={form.data.welcome_image}
                                existingUrl={project.welcome_image_url}
                                onChange={(file) => form.setData('welcome_image', file)}
                                error={form.errors.welcome_image}
                                hint="Biarkan kosong untuk mempertahankan gambar saat ini. Gambar baru akan menggantikan yang lama."
                            />
                        </Field>

                        <Field label="Status" htmlFor="status_edit">
                            <Select
                                id="status_edit"
                                value={form.data.status}
                                onChange={(e) => form.setData('status', e.target.value)}
                                error={!!form.errors.status}
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </Select>
                            {form.errors.status && (
                                <p role="alert" className="mt-1.5 text-xs text-danger">
                                    {form.errors.status}
                                </p>
                            )}
                        </Field>
                    </CardBody>
                </Card>

                <div className="mt-5 flex items-center justify-between gap-3">
                    <Link href={route('admin.projects.show', project.id)} className="text-sm font-medium text-ink-muted hover:text-ink">
                        Batal
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.projects.show', project.id)}
                            className="text-sm font-medium text-ink-muted hover:text-ink"
                        >
                            Lihat Detail
                        </Link>
                        <Button type="submit" loading={form.processing} disabled={form.processing}>
                            {form.processing ? 'Menyimpan…' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}