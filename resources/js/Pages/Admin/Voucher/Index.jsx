import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Check,
    Copy,
    FolderKanban,
    Ticket,
    Plus,
} from 'lucide-react';
import {
    PageHeader,
    Button,
    Card,
    CardBody,
    StatusBadge,
    Table,
    Modal,
    Field,
    Input,
    Select,
    EmptyState,
    SearchInput,
    FilterBar,
    FilterPill,
    Pagination,
    useToast,
} from '@/Components/ui';
import {
    voucherStatusLabel,
    voucherStatusTone,
    usageLabel,
    timeAgo,
    formatDateOnly,
} from '@/Components/Vouchers/voucherMeta';

const STATUS_OPTIONS = [
    { value: '', label: 'Semua' },
    { value: 'active', label: 'Aktif' },
    { value: 'used', label: 'Terpakai' },
    { value: 'expired', label: 'Kadaluarsa' },
    { value: 'revoked', label: 'Dicabut' },
];

export default function Index({ vouchers = [], filters = {}, projects = [], createdVoucher = null }) {
    return (
        <AdminLayout title="Voucher">
            <Head title="Voucher - Photobooth Studio" />

            <PageHeader
                title="Voucher"
                description="Buat, pantau, dan cabut voucher yang bisa dipakai perangkat booth."
                icon={Ticket}
            />

            <VouchersPane vouchers={vouchers} filters={filters} projects={projects} createdVoucher={createdVoucher} />
        </AdminLayout>
    );
}

function VouchersPane({ vouchers, filters, projects, createdVoucher }) {
    const { toast } = useToast();
    const [formOpen, setFormOpen] = useState(false);
    const [created, setCreated] = useState(createdVoucher);
    const [copied, setCopied] = useState(false);

    const createdToReveal = created;

    const { data, setData, post, processing, errors, reset } = useForm({
        project_id: '',
        max_uses: '1',
        valid_from: '',
        expires_at: '',
    });

    const counts = {
        total: vouchers.data.length,
        active: vouchers.data.filter((v) => v.status === 'active').length,
        used: vouchers.data.filter((v) => v.status === 'used').length,
        expired: vouchers.data.filter((v) => v.status === 'expired').length,
        revoked: vouchers.data.filter((v) => v.status === 'revoked').length,
    };

    const submit = () => {
        post(route('admin.vouchers.store'), {});
    };

    const copyCode = (code) => {
        if (!navigator.clipboard) {
            toast({ tone: 'info', title: 'Kode voucher', message: code });
            return;
        }
        navigator.clipboard
            .writeText(code)
            .then(() => {
                setCopied(true);
                toast({ tone: 'success', title: 'Kode disalin', message: 'Bagikan kode voucher ke tamu.' });
                setTimeout(() => setCopied(false), 1600);
            })
            .catch(() => {
                toast({ tone: 'danger', title: 'Gagal menyalin', message: 'Salin kode secara manual.' });
            });
    };

    const goto = (params) => {
        router.get(route('admin.vouchers.index'), { page: 1, ...params }, {
            preserveState: true,
            replace: true,
            only: ['vouchers', 'filters'],
        });
    };

    const setStatus = (value) => goto({ status: value });
    const setProject = (value) => goto({ project: value });
    const setSearch = (value) => goto({ search: value });
    const setPage = (page) => router.get(route('admin.vouchers.index'), { ...filters, page }, {
        preserveState: true,
        replace: true,
        only: ['vouchers', 'filters'],
    });

    const meta = vouchers.meta;

    const columns = [
        {
            key: 'code',
            label: 'Kode',
            render: (v) => (
                <span className="inline-flex items-center gap-1.5 rounded-input bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-brand">
                    <Ticket className="h-3.5 w-3.5 text-ink-faint" />
                    {v.code}
                </span>
            ),
        },
        {
            key: 'project',
            label: 'Proyek',
            render: (v) =>
                v.project ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-ink">
                        <FolderKanban className="h-3.5 w-3.5 text-ink-faint" />
                        <span className="truncate">{v.project.name}</span>
                    </span>
                ) : (
                    <span className="text-sm text-ink-faint">—</span>
                ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (v) => (
                <StatusBadge tone={voucherStatusTone(v.status)} dot>
                    {voucherStatusLabel(v.status)}
                </StatusBadge>
            ),
        },
        {
            key: 'usage',
            label: 'Pemakaian',
            render: (v) => <span className="text-sm font-medium text-ink">{usageLabel(v)}</span>,
        },
        {
            key: 'valid_from',
            label: 'Mulai Berlaku',
            render: (v) => <span className="text-sm text-ink-muted">{formatDateOnly(v.valid_from)}</span>,
        },
        {
            key: 'expires_at',
            label: 'Kadaluarsa',
            render: (v) => <span className="text-sm text-ink-muted">{formatDateOnly(v.expires_at)}</span>,
        },
        {
            key: 'last_used_at',
            label: 'Terakhir Dipakai',
            render: (v) => <span className="text-sm text-ink-muted">{timeAgo(v.last_used_at)}</span>,
        },
        {
            key: 'action',
            label: '',
            align: 'right',
            render: (v) => (
                <Link
                    href={route('admin.vouchers.show', v.id)}
                    className="inline-flex items-center rounded-input border border-edge bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-slate-50 hover:text-ink"
                >
                    Buka
                </Link>
            ),
        },
    ];

    return (
        <>
            <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <SummaryCard label="Total di halaman" value={counts.total} tone="neutral" />
                <SummaryCard label="Aktif" value={counts.active} tone="success" dotClass="bg-success" />
                <SummaryCard label="Terpakai" value={counts.used} tone="warning" dotClass="bg-warning" />
                <SummaryCard label="Kadaluarsa" value={counts.expired} tone="neutral" dotClass="bg-slate-400" />
                <SummaryCard label="Dicabut" value={counts.revoked} tone="danger" dotClass="bg-danger" />
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <Button icon={Plus} onClick={() => { reset(); setFormOpen(true); }}>
                    Buat Voucher
                </Button>

                <FilterBar className="w-full sm:w-auto">
                    <SearchInput
                        defaultValue={filters.search}
                        placeholder="Cari kode atau proyek…"
                        className="w-full sm:w-64"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setSearch(e.target.value);
                            }
                        }}
                        aria-label="Cari voucher berdasarkan kode atau proyek"
                    />
                </FilterBar>
            </div>

            <FilterBar className="mb-5">
                <FilterPill label="Filter status" options={STATUS_OPTIONS} value={filters.status} onChange={setStatus} />
                <Select
                    value={filters.project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-56 text-xs h-8"
                    aria-label="Filter voucher berdasarkan proyek"
                >
                    <option value="">Semua proyek</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </Select>
            </FilterBar>

            <Card>
                {vouchers.data.length === 0 ? (
                    <CardBody>
                        <EmptyState
                            icon={Ticket}
                            title="Belum ada voucher."
                            description="Buat voucher pertama untuk mulai membagikan kode ke perangkat booth."
                            action={
                                <Button icon={Plus} onClick={() => { reset(); setFormOpen(true); }}>
                                    Buat Voucher
                                </Button>
                            }
                        />
                    </CardBody>
                ) : (
                    <>
                        <div className="hidden lg:block">
                            <Table columns={columns} rows={vouchers.data} rowKey="id" />
                        </div>
                        <div className="divide-y divide-edge lg:hidden">
                            {vouchers.data.map((v) => (
                                <VoucherRow key={v.id} voucher={v} />
                            ))}
                        </div>
                        <Pagination
                            page={meta.current_page}
                            total={meta.total}
                            perPage={meta.per_page}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </Card>

            <Modal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                title="Buat Voucher"
                description="Kode voucher dibuat otomatis, bukan dimasukkan manual."
                icon={Ticket}
                maxWidth="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setFormOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={submit} loading={processing} icon={Plus}>
                            Buat Voucher
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Field label="Proyek" htmlFor="voucher-project" required error={errors.project_id}>
                        <Select
                            id="voucher-project"
                            value={data.project_id}
                            onChange={(e) => setData('project_id', e.target.value)}
                            disabled={processing}
                        >
                            <option value="">
                                {projects.length ? 'Pilih proyek' : 'Belum ada proyek'}
                            </option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <Field
                        label="Batas Penggunaan"
                        htmlFor="voucher-max-uses"
                        required
                        error={errors.max_uses}
                        hint="Berapa kali voucher boleh dipakai (minimal 1)."
                    >
                        <Input
                            id="voucher-max-uses"
                            type="number"
                            min="1"
                            value={data.max_uses}
                            onChange={(e) => setData('max_uses', e.target.value)}
                            error={!!errors.max_uses}
                        />
                    </Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Berlaku Mulai" htmlFor="voucher-valid-from" error={errors.valid_from}>
                            <Input
                                id="voucher-valid-from"
                                type="date"
                                value={data.valid_from}
                                onChange={(e) => setData('valid_from', e.target.value)}
                                error={!!errors.valid_from}
                            />
                        </Field>
                        <Field label="Berlaku Sampai" htmlFor="voucher-expires-at" error={errors.expires_at}>
                            <Input
                                id="voucher-expires-at"
                                type="date"
                                value={data.expires_at}
                                onChange={(e) => setData('expires_at', e.target.value)}
                                error={!!errors.expires_at}
                            />
                        </Field>
                    </div>
                </div>
            </Modal>

            <VoucherRevealModal
                voucher={createdToReveal}
                copied={copied}
                onCopy={copyCode}
                onClose={() => setCreated(null)}
            />
        </>
    );
}

function VoucherRevealModal({ voucher, copied, onCopy, onClose }) {
    if (!voucher) return null;

    return (
        <Modal
            open
            onClose={onClose}
            title="Voucher dibuat"
            description="Simpan kode berikut untuk dibagikan."
            icon={Check}
            maxWidth="md"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>
                    <Link
                        href={route('admin.vouchers.show', voucher.id)}
                        className="inline-flex items-center justify-center rounded-input bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                    >
                        Lihat Detail
                    </Link>
                </>
            }
        >
            <div className="space-y-4">
                <div className="mx-auto max-w-xs rounded-card border border-brand/30 bg-brand-subtle/50 px-6 py-5 text-center">
                    <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Kode Voucher</p>
                    <p className="mt-2 font-mono text-2xl font-bold tracking-widest text-brand">{voucher.code}</p>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="mt-4"
                        icon={copied ? Check : Copy}
                        onClick={() => onCopy(voucher.code)}
                    >
                        {copied ? 'Tersalin' : 'Salin Kode'}
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-input border border-edge px-3 py-2">
                        <p className="text-xs text-ink-faint">Proyek</p>
                        <p className="mt-0.5 truncate font-medium text-ink">{voucher.project?.name}</p>
                    </div>
                    <div className="rounded-input border border-edge px-3 py-2">
                        <p className="text-xs text-ink-faint">Batas penggunaan</p>
                        <p className="mt-0.5 font-medium text-ink">{voucher.max_uses} kali</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

function SummaryCard({ label, value, tone, dotClass }) {
    const color =
        tone === 'success' ? 'text-success'
            : tone === 'danger' ? 'text-danger'
                : tone === 'warning' ? 'text-warning'
                    : 'text-ink';
    return (
        <div className="surface flex items-center gap-3 p-4">
            <span className={`h-2.5 w-2.5 rounded-full ${dotClass ?? 'bg-slate-300'}`} />
            <div>
                <p className="text-xs text-ink-muted">{label}</p>
                <p className={`text-2xl font-bold tracking-tight ${color}`}>{value}</p>
            </div>
        </div>
    );
}

function VoucherRow({ voucher }) {
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="min-w-0">
                <p className="font-mono text-sm font-bold text-brand">{voucher.code}</p>
                <p className="mt-0.5 truncate text-xs text-ink-faint">
                    {voucher.project?.name ?? 'Tanpa proyek'} · {usageLabel(voucher)} dipakai
                </p>
                <div className="mt-1.5">
                    <StatusBadge tone={voucherStatusTone(voucher.status)} dot>
                        {voucherStatusLabel(voucher.status)}
                    </StatusBadge>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <span className="hidden text-xs text-ink-faint sm:inline">
                    Terakhir dipakai {timeAgo(voucher.last_used_at)}
                </span>
                <Link
                    href={route('admin.vouchers.show', voucher.id)}
                    className="rounded-input border border-edge bg-white px-2.5 py-1 text-xs font-semibold text-ink hover:bg-slate-50"
                >
                    Buka
                </Link>
            </div>
        </div>
    );
}