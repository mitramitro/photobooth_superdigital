import React, { useCallback } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    FolderKanban,
    Pencil,
    Save,
    Monitor,
    Timer,
    LayoutGrid,
    Frame,
    Palette,
    Lightbulb,
} from 'lucide-react';
import {
    PageHeader,
    Button,
    Card,
    CardHeader,
    CardBody,
    StatusBadge,
} from '@/Components/ui';
import ExperiencePreview from '@/Components/Projects/ExperiencePreview';
import {
    projectTypeLabel,
    projectOrientationLabel,
    projectStatusLabel,
    PROJECT_STATUS_TONES,
} from '@/Components/Projects/projectMeta';
import {
    TIMER_OPTIONS,
    LAYOUT_OPTIONS,
    FRAME_OPTIONS,
    FILTER_OPTIONS,
    layoutCells,
    findOption,
    brightnessLabel,
} from '@/Components/Projects/experienceMeta';

// ── Helpers ─────────────────────────────────────────────────────────────────

function SettingsCard({ icon: Icon, title, description, id, disabled, error, children }) {
    return (
        <Card>
            <CardHeader title={title} description={description} icon={Icon} />
            <CardBody>
                <fieldset disabled={disabled} className="group/fieldset">
                    {children}
                </fieldset>
                {error && (
                    <p role="alert" className="mt-3 text-xs text-danger">
                        {error}
                    </p>
                )}
            </CardBody>
        </Card>
    );
}

function selectClasses(selected) {
    const base =
        'flex flex-col items-center rounded-card border px-3 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40';
    const state = selected
        ? 'border-brand bg-brand-subtle/60 ring-2 ring-brand/40'
        : 'border-edge bg-white hover:border-brand/40 hover:bg-brand-subtle/30';
    return `${base} ${state}`;
}

// ── Mini layout preview (tiny SVG) ──────────────────────────────────────────

function MiniLayoutPreview({ layout }) {
    const cells = layoutCells(layout);
    return (
        <svg viewBox="0 0 100 100" className="mb-1 h-8 w-8 text-ink-muted">
            {cells.map((c, i) => (
                <rect
                    key={i}
                    x={c.x}
                    y={c.y}
                    width={c.w}
                    height={c.h}
                    rx="2"
                    fill="currentColor"
                    fillOpacity="0.18"
                    stroke="currentColor"
                    strokeWidth="2"
                />
            ))}
        </svg>
    );
}

// ── Mini frame swatch ───────────────────────────────────────────────────────

function FrameSwatch({ frame }) {
    if (frame === 'none') {
        return <span className="mb-1 block h-8 w-8 rounded border border-dashed border-ink-faint" />;
    }
    if (frame === 'film_strip') {
        return (
            <span className="relative mb-1 block h-8 w-8 rounded-sm bg-ink/80">
                <span className="absolute left-0.5 top-0 h-full w-[3px] bg-white/60" />
                <span className="absolute right-0.5 top-0 h-full w-[3px] bg-white/60" />
            </span>
        );
    }
    if (frame === 'polaroid') {
        return (
            <span className="mb-1 block h-8 w-8 rounded-sm border-[4px] border-white bg-slate-200 shadow-sm" />
        );
    }
    if (frame === 'classic') {
        return <span className="mb-1 block h-8 w-8 rounded-sm border-2 border-ink/30" />;
    }
    if (frame === 'wedding') {
        return <span className="mb-1 block h-8 w-8 rounded-sm border-[3px] border-[#f4e7cf] shadow-[0_0_0_1px_rgba(217,155,62,0.3)_inset]" />;
    }
    // birthday
    return <span className="mb-1 block h-8 w-8 rounded-sm border-2 border-dashed border-pink-400" />;
}

// ── Main component ──────────────────────────────────────────────────────────

export default function Show({ project, experience, can }) {
    const { auth } = usePage().props;
    const isSuperAdmin = auth?.user?.role === 'super_admin';
    const disabled = !can.update;

    const form = useForm({
        timer_seconds: experience?.timer_seconds ?? 5,
        layout: experience?.layout ?? 'single',
        frame: experience?.frame ?? 'none',
        filter: experience?.filter ?? 'original',
        brightness: experience?.brightness ?? 0,
    });

    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();
            form.patch(route('admin.projects.experience.update', project.id), {
                preserveScroll: true,
            });
        },
        [form, project.id],
    );

    const scrollToPreview = useCallback(() => {
        document.getElementById('experience-preview')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    const hasTopErrors = Object.keys(form.errors).length > 0;

    return (
        <AdminLayout title={project.name}>
            <Head title={`${project.name} — Pengaturan Pengalaman · Photobooth Studio`} />

            <PageHeader
                title={project.name}
                description={`${projectTypeLabel(project.type)} · ${projectOrientationLabel(project.orientation)}`}
                icon={FolderKanban}
                breadcrumbs={[
                    { label: 'Proyek', href: route('admin.projects.index') },
                    { label: project.name },
                ]}
                actions={
                    <>
                        {/* Status badges */}
                        <StatusBadge tone={PROJECT_STATUS_TONES[project.status] ?? 'neutral'} dot>
                            {projectStatusLabel(project.status)}
                        </StatusBadge>
                        {isSuperAdmin && project.user && (
                            <span className="hidden text-xs text-ink-muted xl:inline">
                                {project.user.email}
                            </span>
                        )}

                        {/* Dirty indicator */}
                        {form.isDirty && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-subtle px-2.5 py-1 text-[11px] font-semibold text-warning">
                                <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
                                Perubahan belum disimpan
                            </span>
                        )}

                        {can.update && (
                            <Button variant="secondary" icon={Monitor} size="sm" onClick={scrollToPreview}>
                                Preview Booth
                            </Button>
                        )}

                        {can.update && (
                            <Link href={route('admin.projects.edit', project.id)}>
                                <Button variant="secondary" icon={Pencil} size="sm">
                                    Ubah Proyek
                                </Button>
                            </Link>
                        )}
                    </>
                }
            />

            {/* Read-only notice */}
            {disabled && (
                <div className="mb-5 rounded-card border border-edge bg-slate-50 px-4 py-3 text-xs text-ink-muted">
                    Anda tidak memiliki akses untuk mengedit pengaturan proyek ini.
                </div>
            )}

            {/* Top error summary */}
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
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    {/* ── Left: Settings ──────────────────────────────── */}
                    <div className="space-y-5 lg:col-span-3">
                        {/* Timer */}
                        <SettingsCard
                            icon={Timer}
                            title="Timer"
                            description="Durasi hitung mundur sebelum foto diambil."
                            id="timer"
                            disabled={disabled}
                            error={form.errors.timer_seconds}
                        >
                            <p className="text-sm font-medium text-ink" id="timer-label">
                                Durasi <span className="ml-0.5 text-danger">*</span>
                            </p>
                            <div
                                className="mt-2 grid grid-cols-3 gap-2"
                                role="radiogroup"
                                aria-labelledby="timer-label"
                            >
                                {TIMER_OPTIONS.map((opt) => {
                                    const selected = form.data.timer_seconds === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => form.setData('timer_seconds', opt.value)}
                                            aria-pressed={selected}
                                            aria-label={`${opt.label} — ${opt.description}`}
                                            className={`rounded-card border px-3 py-3 text-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                                                selected
                                                    ? 'border-brand bg-brand-subtle/60 ring-2 ring-brand/40'
                                                    : 'border-edge bg-white hover:border-brand/40 hover:bg-brand-subtle/30'
                                            }`}
                                        >
                                            <span className={`block text-lg font-bold ${selected ? 'text-brand' : 'text-ink'}`}>
                                                {opt.short}
                                            </span>
                                            <span className="mt-0.5 block text-[10px] text-ink-muted">
                                                {opt.value <= 3 ? 'Cepat' : opt.value >= 10 ? 'Santai' : 'Standar'}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </SettingsCard>

                        {/* Layout */}
                        <SettingsCard
                            icon={LayoutGrid}
                            title="Kisi / Layout"
                            description="Pola kisi foto pada strip cetakan."
                            id="layout"
                            disabled={disabled}
                            error={form.errors.layout}
                        >
                            <p className="text-sm font-medium text-ink" id="layout-label">
                                Pola Foto <span className="ml-0.5 text-danger">*</span>
                            </p>
                            <div
                                className="mt-2 grid grid-cols-3 gap-2"
                                role="radiogroup"
                                aria-labelledby="layout-label"
                            >
                                {LAYOUT_OPTIONS.map((opt) => {
                                    const selected = form.data.layout === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => form.setData('layout', opt.value)}
                                            aria-pressed={selected}
                                            className={selectClasses(selected)}
                                        >
                                            <MiniLayoutPreview layout={opt.value} />
                                            <span className={`text-[11px] font-semibold ${selected ? 'text-brand-dark' : 'text-ink'}`}>
                                                {opt.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </SettingsCard>

                        {/* Frame */}
                        <SettingsCard
                            icon={Frame}
                            title="Frame"
                            description="Bingkai dekoratif pembungkus hasil foto."
                            id="frame"
                            disabled={disabled}
                            error={form.errors.frame}
                        >
                            <p className="text-sm font-medium text-ink" id="frame-label">
                                Bingkai <span className="ml-0.5 text-danger">*</span>
                            </p>
                            <div
                                className="mt-2 grid grid-cols-3 gap-2"
                                role="radiogroup"
                                aria-labelledby="frame-label"
                            >
                                {FRAME_OPTIONS.map((opt) => {
                                    const selected = form.data.frame === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => form.setData('frame', opt.value)}
                                            aria-pressed={selected}
                                            className={selectClasses(selected)}
                                        >
                                            <FrameSwatch frame={opt.value} />
                                            <span className={`text-[11px] font-semibold ${selected ? 'text-brand-dark' : 'text-ink'}`}>
                                                {opt.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </SettingsCard>

                        {/* Filter */}
                        <SettingsCard
                            icon={Palette}
                            title="Filter"
                            description="Gaya warna dan tampilan foto."
                            id="filter"
                            disabled={disabled}
                            error={form.errors.filter}
                        >
                            <p className="text-sm font-medium text-ink" id="filter-label">
                                Gaya Warna <span className="ml-0.5 text-danger">*</span>
                            </p>
                            <div
                                className="mt-2 flex flex-wrap gap-2"
                                role="radiogroup"
                                aria-labelledby="filter-label"
                            >
                                {FILTER_OPTIONS.map((opt) => {
                                    const selected = form.data.filter === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => form.setData('filter', opt.value)}
                                            aria-pressed={selected}
                                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                                                selected
                                                    ? 'border-brand bg-brand-subtle/60 ring-2 ring-brand/40 text-brand-dark'
                                                    : 'border-edge bg-white hover:border-brand/40 text-ink'
                                            }`}
                                        >
                                            <span
                                                className="h-3 w-3 shrink-0 rounded-full ring-1 ring-ink/10"
                                                style={{ background: opt.swatch }}
                                                aria-hidden
                                            />
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </SettingsCard>

                        {/* Brightness */}
                        <SettingsCard
                            icon={Lightbulb}
                            title="Pencahayaan"
                            description="Sesuaikan kecerahan tampilan foto (preview)."
                            id="brightness"
                            disabled={disabled}
                            error={form.errors.brightness}
                        >
                            <label htmlFor="brightness-slider" className="text-sm font-medium text-ink">
                                Kecerahan <span className="ml-0.5 text-danger">*</span>
                            </label>
                            <div className="mt-3 flex items-center gap-4">
                                <span className="text-xs text-ink-muted">Gelap</span>
                                <input
                                    id="brightness-slider"
                                    type="range"
                                    min={-100}
                                    max={100}
                                    step={5}
                                    value={form.data.brightness}
                                    onChange={(e) => form.setData('brightness', Number(e.target.value))}
                                    aria-label="Tingkat pencahayaan"
                                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-edge accent-brand"
                                />
                                <span className="text-xs text-ink-muted">Terang</span>
                            </div>
                            <p className="mt-2 text-center text-sm font-semibold text-ink">
                                {form.data.brightness > 0 ? '+' : ''}{form.data.brightness}{' '}
                                <span className="text-xs font-normal text-ink-muted">— {brightnessLabel(form.data.brightness)}</span>
                            </p>
                        </SettingsCard>
                    </div>

                    {/* ── Right: Sticky preview ────────────────────────── */}
                    <div className="lg:col-span-2">
                        <div className="lg:sticky lg:top-20">
                            <Card>
                                <CardHeader title="Preview" description="Pratinjau visual pengalaman booth" icon={Monitor} />
                                <CardBody className="bg-slate-50/60">
                                    <ExperiencePreview project={project} values={form.data} />
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* ── Save bar ───────────────────────────────────────── */}
                {can.update && (
                    <div className="mt-6 flex items-center justify-end gap-4 rounded-card border border-edge bg-surface px-5 py-3.5">
                        {form.isDirty && (
                            <span className="inline-flex items-center gap-1.5 text-xs text-warning">
                                <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
                                Perubahan belum disimpan
                            </span>
                        )}
                        <Button
                            type="submit"
                            icon={Save}
                            loading={form.processing}
                            disabled={form.processing || !form.isDirty}
                        >
                            Simpan Perubahan
                        </Button>
                    </div>
                )}
            </form>
        </AdminLayout>
    );
}
