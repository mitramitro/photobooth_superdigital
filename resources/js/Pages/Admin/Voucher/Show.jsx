import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft,
    Calendar,
    Check,
    Copy,
    FolderKanban,
    Gauge,
    ShieldOff,
    Ticket,
    Timer,
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
} from '@/Components/ui';
import {
    voucherStatusLabel,
    voucherStatusTone,
    usageLabel,
    timeAgo,
    formatDateTime,
    formatDateOnly,
} from '@/Components/Vouchers/voucherMeta';

export default function Show({ voucher, projects = [], can = {} }) {
    const { toast } = useToast();
    const [confirmRevoke, setConfirmRevoke] = useState(false);
    const [copied, setCopied] = useState(false);

    const isRevoked = voucher.status === 'revoked';
    const projectLocked = voucher.used_count > 0;

    const { data, setData, put, processing, errors } = useForm({
        project_id: voucher.project?.id ? String(voucher.project.id) : '',
        max_uses: String(voucher.max_uses),
        valid_from: voucher.valid_from ?? '',
        expires_at: voucher.expires_at ?? '',
    });

    const copyCode = () => {
        if (!navigator.clipboard) {
            toast({ tone: 'info', title: 'Kode voucher', message: voucher.code });
            return;
        }
        navigator.clipboard
            .writeText(voucher.code ?? '')
            .then(() => {
                setCopied(true);
                toast({ tone: 'success', title: 'Kode disalin', message: 'Bagikan kode voucher ke tamu.' });
                setTimeout(() => setCopied(false), 1600);
            })
            .catch(() => {
                toast({ tone: 'danger', title: 'Gagal menyalin', message: 'Salin kode secara manual.' });
            });
    };

    const save = () => {
        put(route('admin.vouchers.update', voucher.id), {
            preserveScroll: true,
        });
    };

    const revoke = () => {
        router.post(route('admin.vouchers.revoke', voucher.id), {}, {
            preserveScroll: true,
            onSuccess: () => setConfirmRevoke(false),
        });
    };

    return (
        <AdminLayout title="Detail Voucher">
            <Head title={`${voucher.code} - Voucher`} />

            <Link
                href={route('admin.vouchers.index')}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"
            >
                <ArrowLeft className="h-4 w-4" /> Kembali ke Voucher
            </Link>

            <PageHeader
                title={voucher.code}
                description={voucher.project?.name ?? 'Tanpa proyek'}
                icon={Ticket}
                actions={
                    <StatusBadge tone={voucherStatusTone(voucher.status)} dot>
                        {voucherStatusLabel(voucher.status)}
                    </StatusBadge>
                }
            />

            {/* Kode */}
            <Card className="mb-6 border-brand/40">
                <CardBody>
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-semibold text-ink">Kode Voucher</p>
                            <p className="mt-0.5 text-sm text-ink-muted">
                                Masukkan kode ini di aplikasi booth perangkat untuk memvalidasi.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <code className="rounded-input border border-edge bg-slate-50 px-3 py-2 font-mono text-base font-bold tracking-widest text-brand">
                                {voucher.code}
                            </code>
                            <Button variant="secondary" size="sm" icon={copied ? Check : Copy} onClick={copyCode}>
                                {copied ? 'Tersalin' : 'Salin'}
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-7">
                    <Card>
                        <CardHeader title="Informasi Voucher" description="Ringkasan penggunaan dan masa berlaku" icon={Ticket} />
                        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InfoItem icon={FolderKanban} label="Proyek" value={voucher.project?.name ?? '—'} />
                            <InfoItem icon={Ticket} label="Status efektif" value={voucherStatusLabel(voucher.status)} />
                            <InfoItem icon={Gauge} label="Batas penggunaan" value={`${voucher.max_uses} kali`} />
                            <InfoItem icon={Timer} label="Pemakaian" value={usageLabel(voucher)} />
                            <InfoItem icon={Timer} label="Sisa penggunaan" value={`${voucher.remaining_uses} kali`} />
                            <InfoItem icon={Calendar} label="Terakhir dipakai" value={timeAgo(voucher.last_used_at)} />
                            <InfoItem icon={Calendar} label="Mulai berlaku" value={formatDateOnly(voucher.valid_from)} />
                            <InfoItem icon={Calendar} label="Kadaluarsa" value={formatDateOnly(voucher.expires_at)} />
                            <InfoItem icon={Calendar} label="Dibuat" value={formatDateTime(voucher.created_at)} />
                            {voucher.revoked_at && (
                                <InfoItem icon={ShieldOff} label="Dicabut" value={formatDateTime(voucher.revoked_at)} />
                            )}
                        </CardBody>
                    </Card>

                    {can.update && !isRevoked && (
                        <Card>
                            <CardHeader title="Ubah Voucher" description="Batas penggunaan dan masa berlaku" icon={Check} />
                            <CardBody className="space-y-4">
                                <Field
                                    label="Proyek"
                                    htmlFor="edit-project"
                                    required
                                    error={errors.project_id}
                                    hint={projectLocked ? 'Proyek terkunci karena voucher sudah digunakan.' : undefined}
                                >
                                    <Select
                                        id="edit-project"
                                        value={data.project_id}
                                        onChange={(e) => setData('project_id', e.target.value)}
                                        disabled={projectLocked}
                                    >
                                        {projects.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>

                                <Field
                                    label="Batas Penggunaan"
                                    htmlFor="edit-max-uses"
                                    required
                                    error={errors.max_uses}
                                    hint="Tidak boleh kurang dari pemakaian saat ini."
                                >
                                    <Input
                                        id="edit-max-uses"
                                        type="number"
                                        min="1"
                                        value={data.max_uses}
                                        onChange={(e) => setData('max_uses', e.target.value)}
                                        error={!!errors.max_uses}
                                    />
                                </Field>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Field label="Berlaku Mulai" htmlFor="edit-valid-from" error={errors.valid_from}>
                                        <Input
                                            id="edit-valid-from"
                                            type="date"
                                            value={data.valid_from}
                                            onChange={(e) => setData('valid_from', e.target.value)}
                                            error={!!errors.valid_from}
                                        />
                                    </Field>
                                    <Field label="Berlaku Sampai" htmlFor="edit-expires-at" error={errors.expires_at}>
                                        <Input
                                            id="edit-expires-at"
                                            type="date"
                                            value={data.expires_at}
                                            onChange={(e) => setData('expires_at', e.target.value)}
                                            error={!!errors.expires_at}
                                        />
                                    </Field>
                                </div>

                                {errors.voucher && (
                                    <p className="rounded-input bg-danger-subtle px-3 py-2 text-xs font-medium text-danger">
                                        {errors.voucher}
                                    </p>
                                )}

                                <div className="flex justify-end">
                                    <Button icon={Check} loading={processing} onClick={save}>
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    )}

                    {can.revoke && !isRevoked && (
                        <Card>
                            <CardBody className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                <div>
                                    <p className="text-sm font-semibold text-ink">Cabut voucher</p>
                                    <p className="text-xs text-ink-muted">
                                        Voucher tidak dapat digunakan lagi, namun datanya tetap tersimpan.
                                    </p>
                                </div>
                                <Button
                                    variant="outline-destructive"
                                    icon={ShieldOff}
                                    size="sm"
                                    onClick={() => setConfirmRevoke(true)}
                                >
                                    Cabut Voucher
                                </Button>
                            </CardBody>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-5">
                    <Card>
                        <CardHeader title="Siklus Hidup" description="Aturan status efektif voucher" icon={Calendar} />
                        <CardBody className="space-y-2.5 text-sm text-ink-muted">
                            <LifecycleRow number={1} text="revoked_at terisi → Dicabut" />
                            <LifecycleRow number={2} text="Kadaluarsa sudah lewat → Kadaluarsa" />
                            <LifecycleRow number={3} text="Pemakaian mencapai batas → Terpakai" />
                            <LifecycleRow number={4} text="Sisanya → Aktif" />
                            <p className="rounded-input bg-slate-50 px-3 py-2 text-xs text-ink-faint">
                                Status di atas dihitung otomatis dari aturan bisnis, bukan hanya kolom tersimpan.
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <ConfirmDialog
                open={confirmRevoke}
                onClose={() => setConfirmRevoke(false)}
                onConfirm={revoke}
                title="Cabut voucher ini?"
                message={`Voucher "${voucher.code}" tidak akan dapat digunakan lagi oleh perangkat booth. Data tetap tersimpan untuk audit.`}
                confirmLabel="Ya, Cabut"
            />
        </AdminLayout>
    );
}

function LifecycleRow({ number, text }) {
    return (
        <div className="flex items-center gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-subtle text-[10px] font-bold text-brand">
                {number}
            </span>
            <span className="truncate">{text}</span>
        </div>
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