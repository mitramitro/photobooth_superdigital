import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FolderKanban, Store, PartyPopper, Sparkles, Check, Smartphone, Monitor, ArrowLeft } from 'lucide-react';
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
import { PROJECT_TYPE_DESCRIPTIONS } from '@/Components/Projects/projectMeta';

const TYPE_OPTIONS = [
    { value: 'retail', name: 'Photobox Retail', description: PROJECT_TYPE_DESCRIPTIONS.retail, icon: Store },
    { value: 'event', name: 'Photobox Event', description: PROJECT_TYPE_DESCRIPTIONS.event, icon: PartyPopper },
    { value: 'self', name: 'Photobox Self', description: PROJECT_TYPE_DESCRIPTIONS.self, icon: Sparkles },
];

const STATUS_OPTIONS = [
    { value: 'draft', label: 'Draf' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Nonaktif' },
];

const ORIENTATION_OPTIONS = [
    { value: 'portrait', label: 'Portrait', hint: '9:16 — vertikal', icon: Smartphone },
    { value: 'landscape', label: 'Landscape', hint: '16:9 — horizontal', icon: Monitor },
];

export default function Create() {
    const [step, setStep] = useState(1);
    const form = useForm({
        name: '',
        type: null,
        orientation: 'portrait',
        status: 'draft',
        welcome_image: null,
    });

    const selectedType = TYPE_OPTIONS.find((t) => t.value === form.data.type);

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route('admin.projects.store'), {
            forceFormData: true,
            onError: (errors) => {
                if (errors.type) setStep(1);
            },
        });
    };

    const hasTopErrors = Object.keys(form.errors).length > 0;

    return (
        <AdminLayout title="Tambah Proyek">
            <Head title="Tambah Proyek - Photobooth Studio" />

            <PageHeader
                title="Tambah Proyek"
                description="Konfigurasikan proyek photobooth baru untuk pengalaman foto langsung."
                icon={FolderKanban}
                breadcrumbs={[{ label: 'Proyek', href: route('admin.projects.index') }, { label: 'Tambah' }]}
            />

            {/* Step indicator */}
            <ol className="mb-6 flex items-center gap-2" aria-label="Langkah pembuatan proyek">
                {[1, 2].map((s, i) => (
                    <React.Fragment key={s}>
                        {i > 0 && <span className="h-px flex-1 bg-edge" />}
                        <li
                            className={`flex items-center gap-2 rounded-input px-3 py-1.5 text-sm font-medium ${
                                step === s ? 'bg-brand-subtle text-brand-dark' : 'text-ink-muted'
                            }`}
                            aria-current={step === s ? 'step' : undefined}
                        >
                            <span
                                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                                    step >= s ? 'bg-brand text-white' : 'bg-slate-200 text-ink-faint'
                                }`}
                            >
                                {s}
                            </span>
                            {s === 1 ? 'Pilih Jenis' : 'Informasi Proyek'}
                        </li>
                    </React.Fragment>
                ))}
            </ol>

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

            {step === 1 ? (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {TYPE_OPTIONS.map((t) => {
                            const Icon = t.icon;
                            const selected = form.data.type === t.value;
                            return (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => form.setData('type', t.value)}
                                    aria-pressed={selected}
                                    className={`group relative flex flex-col items-start rounded-card border p-5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                                        selected
                                            ? 'border-brand bg-brand-subtle/60 ring-2 ring-brand/40'
                                            : 'border-edge bg-surface hover:border-brand/40 hover:bg-brand-subtle/30'
                                    }`}
                                >
                                    {selected && (
                                        <span className="absolute right-4 top-4 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand">
                                            <Check className="h-3 w-3 text-white" />
                                        </span>
                                    )}
                                    <span
                                        className={`flex h-11 w-11 items-center justify-center rounded-card ${
                                            selected ? 'bg-brand text-white' : 'bg-brand-subtle text-brand group-hover:bg-brand group-hover:text-white'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <span className="mt-4 text-sm font-semibold text-ink">{t.name}</span>
                                    <span className="mt-1.5 text-xs leading-relaxed text-ink-muted">{t.description}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between">
                        <Link href={route('admin.projects.index')} className="text-sm font-medium text-ink-muted hover:text-ink">
                            Batal
                        </Link>
                        <Button
                            disabled={!form.data.type}
                            onClick={() => setStep(2)}
                            className={!form.data.type ? 'cursor-not-allowed' : ''}
                        >
                            Lanjut
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate>
                    <Card>
                        <CardHeader
                            title="Informasi Proyek"
                            description={`${selectedType?.name} · orientasi dan tampilan sambutan`}
                            icon={FolderKanban}
                        />
                        <CardBody className="space-y-6">
                            {/* Type (context) */}
                            <div className="flex items-center justify-between gap-3 rounded-input border border-edge bg-slate-50 px-4 py-3">
                                <div>
                                    <p className="text-xs font-medium text-ink-muted">Jenis proyek</p>
                                    <p className="text-sm font-semibold text-ink">{selectedType?.name}</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    icon={ArrowLeft}
                                    onClick={() => setStep(1)}
                                    className="shrink-0"
                                >
                                    Ubah
                                </Button>
                            </div>

                            <Field label="Judul Proyek" htmlFor="name" required error={form.errors.name}>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    error={!!form.errors.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Contoh: Mall Booth Indramayu"
                                    autoFocus
                                />
                            </Field>

                            <div>
                                <p className="text-sm font-medium text-ink" id="orientation-label">
                                    Orientasi <span className="ml-0.5 text-danger">*</span>
                                </p>
                                <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup" aria-labelledby="orientation-label">
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
                                    value={form.data.welcome_image}
                                    onChange={(file) => form.setData('welcome_image', file)}
                                    error={form.errors.welcome_image}
                                    hint="Gambar yang tampil saat tamu memulai sesi. Dapat diisi saat ini atau kemudian."
                                />
                            </Field>

                            <Field label="Status" htmlFor="status" hint="Draf: tersimpan tanpa tampil aktif.">
                                <Select
                                    id="status"
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
                        <Button type="button" variant="ghost" icon={ArrowLeft} onClick={() => setStep(1)}>
                            Kembali
                        </Button>
                        <div className="flex items-center gap-3">
                            <Link href={route('admin.projects.index')} className="text-sm font-medium text-ink-muted hover:text-ink">
                                Batal
                            </Link>
                            <Button type="submit" loading={form.processing} disabled={form.processing}>
                                {form.processing ? 'Menyimpan…' : 'Buat Proyek'}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </AdminLayout>
    );
}