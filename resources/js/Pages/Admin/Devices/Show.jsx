import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft,
    Calendar,
    Check,
    Copy,
    FolderKanban,
    KeyRound,
    Monitor,
    PenLine,
    Radio,
    ShieldOff,
} from 'lucide-react';
import {
    PageHeader,
    Button,
    Card,
    CardHeader,
    CardBody,
    StatusBadge,
    Field,
    Input,
    Select,
    ConfirmDialog,
    useToast,
    EmptyState,
} from '@/Components/ui';
import {
    platformLabel,
    pairStatusLabel,
    pairStatusTone,
    timeAgo,
    formatDateTime,
} from '@/Components/Devices/deviceMeta';

const EVENT_LABEL = {
    created: 'Perangkat didaftarkan',
    paired: 'Pairing berhasil',
    project_assigned: 'Ditugaskan ke proyek',
    project_unassigned: 'Dilepas dari proyek',
    revoked: 'Perangkat diputuskan',
    app_version_changed: 'Versi aplikasi diperbarui',
};

export default function Show({ device, events = [], projects = [], can = {} }) {
    const { toast } = useToast();
    const [confirmRevoke, setConfirmRevoke] = useState(false);
    const [copied, setCopied] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: device.name ?? '',
        platform: device.platform ?? 'android',
        project_id: device.project?.id ? String(device.project.id) : '',
    });

    const isWaiting = device.pair_status === 'waiting';

    const copyCode = () => {
        if (!navigator.clipboard) {
            toast({ tone: 'info', title: 'Kode pairing', message: device.device_code });
            return;
        }
        navigator.clipboard
            .writeText(device.device_code ?? '')
            .then(() => {
                setCopied(true);
                toast({ tone: 'success', title: 'Kode disalin', message: 'Tempelkan kode ke aplikasi booth.' });
                setTimeout(() => setCopied(false), 1600);
            })
            .catch(() => {
                toast({ tone: 'danger', title: 'Gagal menyalin', message: 'Salin kode secara manual.' });
            });
    };

    const save = () => {
        put(route('admin.devices.update', device.id), {
            preserveScroll: true,
        });
    };

    const revoke = () => {
        router.post(route('admin.devices.revoke', device.id), {}, {
            preserveScroll: true,
            onSuccess: () => setConfirmRevoke(false),
        });
    };

    return (
        <AdminLayout title="Detail Perangkat">
            <Head title={`${device.name} - Perangkat`} />

            <Link
                href={route('admin.devices.index')}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
            >
                <ArrowLeft className="h-4 w-4" /> Kembali ke Perangkat
            </Link>

            <PageHeader
                title={device.name}
                description={`Kode ${device.device_code} · ${platformLabel(device.platform)}`}
                icon={Monitor}
                actions={
                    <StatusBadge tone={pairStatusTone(device.pair_status)} dot pulse={device.status === 'online'}>
                        {device.status === 'online' ? 'Online' : pairStatusLabel(device.pair_status)}
                    </StatusBadge>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-7">
                    {isWaiting && (
                        <PairingCard device={device} copied={copied} onCopy={copyCode} />
                    )}

                    {/* Info */}
                    <Card>
                        <CardHeader title="Informasi Perangkat" description="Ringkasan identitas dan koneksi" icon={Monitor} />
                        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoItem icon={Radio} label="Status koneksi" value={device.status === 'online' ? 'Online' : 'Offline'} />
                            <InfoItem icon={KeyRound} label="Kode perangkat" value={device.device_code} mono />
                            <InfoItem icon={FolderKanban} label="Proyek" value={device.project?.name ?? 'Belum ditugaskan'} />
                            <InfoItem icon={Monitor} label="Platform" value={platformLabel(device.platform)} />
                            <InfoItem icon={Radio} label="Versi aplikasi" value={device.app_version ?? '—'} />
                            <InfoItem icon={Radio} label="ID perangkat" value={device.device_identifier ?? '—'} mono />
                            <InfoItem icon={Calendar} label="Terakhir aktif" value={timeAgo(device.last_seen_at)} />
                            <InfoItem icon={Calendar} label="Dibuat" value={formatDateTime(device.created_at)} />
                            {device.paired_at && (
                                <InfoItem icon={Calendar} label="Dipairing" value={formatDateTime(device.paired_at)} />
                            )}
                            {device.revoked_at && (
                                <InfoItem icon={ShieldOff} label="Dicabut" value={formatDateTime(device.revoked_at)} />
                            )}
                        </CardBody>
                    </Card>

                    {/* Edit */}
                    {can.update && (
                        <Card>
                            <CardHeader title="Ubah Perangkat" description="Nama, platform, dan penugasan proyek" icon={PenLine} />
                            <CardBody className="space-y-4">
                                <Field label="Nama perangkat" htmlFor="edit-name" required error={errors.name}>
                                    <Input
                                        id="edit-name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={!!errors.name}
                                    />
                                </Field>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Field label="Platform" htmlFor="edit-platform" required error={errors.platform}>
                                        <Select
                                            id="edit-platform"
                                            value={data.platform}
                                            onChange={(e) => setData('platform', e.target.value)}
                                        >
                                            <option value="android">Android</option>
                                            <option value="windows">Windows</option>
                                        </Select>
                                    </Field>
                                    <Field label="Proyek" htmlFor="edit-project" error={errors.project_id}>
                                        <Select
                                            id="edit-project"
                                            value={data.project_id}
                                            onChange={(e) => setData('project_id', e.target.value)}
                                        >
                                            <option value="">
                                                {projects.length ? 'Belum ditugaskan' : 'Belum ada proyek'}
                                            </option>
                                            {projects.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </Field>
                                </div>
                                <div className="flex justify-end">
                                    <Button icon={Check} loading={processing} onClick={save}>
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {/* Revoke */}
                    {can.revoke && device.pair_status !== 'revoked' && (
                        <Card>
                            <CardBody className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                <div>
                                    <p className="text-sm font-semibold text-ink">Putuskan perangkat</p>
                                    <p className="text-xs text-ink-muted">
                                        Perangkat tidak dapat terhubung lagi dan semua token akses dihapus.
                                    </p>
                                </div>
                                <Button
                                    variant="outline-destructive"
                                    icon={ShieldOff}
                                    size="sm"
                                    onClick={() => setConfirmRevoke(true)}
                                >
                                    Putuskan Perangkat
                                </Button>
                            </CardBody>
                        </Card>
                    )}
                </div>

                {/* History */}
                <div className="lg:col-span-5">
                    <Card>
                        <CardHeader title="Riwayat Aktivitas" description="Peristiwa penting perangkat" icon={Calendar} />
                        <CardBody className="space-y-3">
                            {events.length === 0 ? (
                                <EmptyState
                                    icon={Calendar}
                                    title="Belum ada aktivitas"
                                    description="Peristiwa penting perangkat akan muncul di sini."
                                />
                            ) : (
                                events.map((e) => (
                                    <div
                                        key={e.id}
                                        className="flex items-start gap-3 rounded-card border border-edge px-4 py-3"
                                    >
                                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-ink">
                                                {EVENT_LABEL[e.event] ?? e.event}
                                                {e.metadata?.project_name && (
                                                    <span className="text-ink-muted"> — {e.metadata.project_name}</span>
                                                )}
                                                {e.metadata?.app_version && (
                                                    <span className="ml-1 rounded-input bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">
                                                        v{e.metadata.app_version}
                                                    </span>
                                                )}
                                            </p>
                                            <p className="mt-0.5 text-xs text-ink-faint">{formatDateTime(e.created_at)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>

            <ConfirmDialog
                open={confirmRevoke}
                onClose={() => setConfirmRevoke(false)}
                onConfirm={revoke}
                title="Putuskan perangkat ini?"
                message={`"${device.name}" tidak akan dapat terhubung lagi dan token aksesnya dihapus. Perangkat dapat didaftarkan ulang kapan saja.`}
                confirmLabel="Ya, Putuskan"
            />
        </AdminLayout>
    );
}

function PairingCard({ device, copied, onCopy }) {
    return (
        <Card className="border-brand/40">
            <CardBody>
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold text-ink">Kode Pairing</p>
                        <p className="mt-0.5 text-sm text-ink-muted">
                            Masukkan kode ini di aplikasi booth pada perangkat saat proses pairing.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <code className="rounded-input border border-edge bg-slate-50 px-3 py-2 font-mono text-sm font-bold tracking-wide text-brand">
                            {device.device_code}
                        </code>
                        <Button variant="secondary" size="sm" icon={copied ? Check : Copy} onClick={onCopy}>
                            {copied ? 'Tersalin' : 'Salin'}
                        </Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

function InfoItem({ icon: Icon, label, value, mono = false }) {
    return (
        <div className="rounded-card border border-edge bg-slate-50/60 p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-ink-faint">
                <Icon className="h-3.5 w-3.5" />
                {label}
            </div>
            <p className={`mt-1 truncate text-sm font-semibold text-ink ${mono ? 'font-mono' : ''}`}>{value}</p>
        </div>
    );
}