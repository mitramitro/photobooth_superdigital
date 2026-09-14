import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Activity,
    Download,
    FolderKanban,
    Monitor,
    Plus,
    Radio,
    Smartphone,
    Wifi,
    WifiOff,
} from 'lucide-react';
import {
    PageHeader,
    Button,
    Card,
    CardHeader,
    CardBody,
    StatusBadge,
    Table,
    Tabs,
    Modal,
    Field,
    Input,
    Select,
    EmptyState,
    DeviceHealthIndicator,
    useToast,
} from '@/Components/ui';
import {
    platformLabel,
    deviceStatusLabel,
    pairStatusLabel,
    pairStatusTone,
    timeAgo,
} from '@/Components/Devices/deviceMeta';

export default function Index({ devices = [], projects = [], downloads = [] }) {
    const [tab, setTab] = useState('devices');

    const counts = {
        total: devices.length,
        online: devices.filter((d) => d.status === 'online').length,
        waiting: devices.filter((d) => d.pair_status === 'waiting').length,
        revoked: devices.filter((d) => d.pair_status === 'revoked').length,
    };

    return (
        <AdminLayout title="Perangkat">
            <Head title="Perangkat - Photobooth Studio" />

            <PageHeader
                title="Perangkat"
                description="Kelola, pantau, dan siapkan perangkat photobooth kiosk Anda."
                icon={Monitor}
            />

            <Tabs
                tabs={[
                    { value: 'devices', label: 'Perangkat', icon: Monitor, count: counts.total },
                    { value: 'monitoring', label: 'Monitoring', icon: Activity, count: counts.online },
                    { value: 'downloads', label: 'Download', icon: Download },
                ]}
                active={tab}
                onChange={setTab}
            />

            <div className="py-6">
                {tab === 'devices' && <DevicesPane devices={devices} counts={counts} projects={projects} />}
                {tab === 'monitoring' && <MonitoringPane devices={devices} counts={counts} />}
                {tab === 'downloads' && <DownloadsPane downloads={downloads} />}
            </div>
        </AdminLayout>
    );
}

function DevicesPane({ devices, counts, projects }) {
    const [addOpen, setAddOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        platform: 'android',
        project_id: '',
    });

    const openAdd = () => {
        reset();
        setAddOpen(true);
    };

    const submit = () => {
        post(route('admin.devices.store'), {
            onSuccess: () => setAddOpen(false),
        });
    };

    const columns = [
        {
            key: 'name',
            label: 'Perangkat',
            render: (d) => (
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-input bg-slate-100 text-ink-muted">
                        {PlatformIcon(d.platform, 'h-4 w-4')}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{d.name}</p>
                        <p className="text-xs text-ink-faint">{platformLabel(d.platform)}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'project',
            label: 'Proyek',
            render: (d) =>
                d.project ? (
                    <span className="inline-flex items-center gap-1.5 text-sm text-ink">
                        <FolderKanban className="h-3.5 w-3.5 text-ink-faint" />
                        {d.project.name}
                    </span>
                ) : (
                    <span className="text-sm text-ink-faint">—</span>
                ),
        },
        {
            key: 'pair_status',
            label: 'Status',
            render: (d) => (
                <StatusBadge tone={pairStatusTone(d.pair_status)} dot pulse={d.status === 'online'}>
                    {d.status === 'online' ? 'Online' : pairStatusLabel(d.pair_status)}
                </StatusBadge>
            ),
        },
        {
            key: 'app_version',
            label: 'Versi',
            render: (d) => <span className="text-sm text-ink-muted">{d.app_version ?? '—'}</span>,
        },
        {
            key: 'last_seen_at',
            label: 'Terakhir aktif',
            render: (d) => <span className="text-sm text-ink-muted">{timeAgo(d.last_seen_at)}</span>,
        },
        {
            key: 'action',
            label: '',
            align: 'right',
            render: (d) => (
                <Link
                    href={route('admin.devices.show', d.id)}
                    className="inline-flex items-center rounded-input border border-edge bg-white px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-slate-50 hover:text-ink"
                >
                    Buka
                </Link>
            ),
        },
    ];

    return (
        <>
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard label="Total" value={counts.total} tone="neutral" />
                <SummaryCard label="Online" value={counts.online} tone="success" dotClass="bg-success" />
                <SummaryCard label="Menunggu pairing" value={counts.waiting} tone="info" dotClass="bg-brand" />
                <SummaryCard label="Dicabut" value={counts.revoked} tone="danger" dotClass="bg-danger" />
            </div>

            <Button icon={Plus} onClick={openAdd} className="mb-5">
                Tambah Perangkat
            </Button>

            <Card>
                {devices.length === 0 ? (
                    <CardBody>
                        <EmptyState
                            icon={Monitor}
                            title="Belum ada perangkat."
                            description="Daftarkan perangkat booth untuk mulai pairing dengan proyek photobooth Anda."
                            action={
                                <Button icon={Plus} onClick={openAdd}>
                                    Tambah Perangkat
                                </Button>
                            }
                        />
                    </CardBody>
                ) : (
                    <>
                        <div className="hidden lg:block">
                            <Table columns={columns} rows={devices} rowKey="id" />
                        </div>
                        <div className="divide-y divide-edge lg:hidden">
                            {devices.map((d) => (
                                <DeviceRow key={d.id} device={d} />
                            ))}
                        </div>
                    </>
                )}
            </Card>

            <Modal
                open={addOpen}
                onClose={() => setAddOpen(false)}
                title="Tambah Perangkat"
                description="Daftarkan perangkat baru untuk menghasilkan kode pairing."
                icon={Monitor}
                maxWidth="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setAddOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={submit} loading={processing} icon={Plus}>
                            Simpan Perangkat
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Field label="Nama perangkat" htmlFor="device-name" required error={errors.name}>
                        <Input
                            id="device-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Mis. Booth #01 Main Hall"
                            error={!!errors.name}
                        />
                    </Field>

                    <Field label="Platform" htmlFor="device-platform" required error={errors.platform}>
                        <Select
                            id="device-platform"
                            value={data.platform}
                            onChange={(e) => setData('platform', e.target.value)}
                            disabled={processing}
                        >
                            <option value="android">Android</option>
                            <option value="windows">Windows</option>
                        </Select>
                    </Field>

                    <Field label="Proyek" htmlFor="device-project" error={errors.project_id}>
                        <Select
                            id="device-project"
                            value={data.project_id}
                            onChange={(e) => setData('project_id', e.target.value)}
                            disabled={processing}
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
            </Modal>
        </>
    );
}

function SummaryCard({ label, value, tone, dotClass }) {
    const color =
        tone === 'success' ? 'text-success'
            : tone === 'danger' ? 'text-danger'
                : tone === 'info' ? 'text-brand' : 'text-ink';
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

function DeviceRow({ device }) {
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
                {PlatformIcon(device.platform, 'h-4 w-4 shrink-0 text-ink-muted')}
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{device.name}</p>
                    <p className="truncate text-xs text-ink-faint">
                        {device.project ? device.project.name : 'Belum ada proyek'} ·{' '}
                        {timeAgo(device.last_seen_at)}
                    </p>
                </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
                <DeviceHealthIndicator status={device.status} label={deviceStatusLabel(device.status)} />
                <Link
                    href={route('admin.devices.show', device.id)}
                    className="rounded-input border border-edge bg-white px-2.5 py-1 text-xs font-semibold text-ink hover:bg-slate-50"
                >
                    Buka
                </Link>
            </div>
        </div>
    );
}

function MonitoringPane({ devices, counts }) {
    const paired = devices.filter((d) => d.pair_status === 'paired');

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader
                        title="Status Perangkat"
                        description="Ketersediaan berdasar heartbeat terakhir perangkat"
                        icon={Activity}
                    />
                    <CardBody className="space-y-2.5">
                        {devices.length === 0 ? (
                            <EmptyState
                                icon={Activity}
                                title="Belum ada perangkat"
                                description="Daftarkan perangkat untuk mulai memantau kehadirannya."
                            />
                        ) : (
                            devices.map((d) => (
                                <div
                                    key={d.id}
                                    className="flex flex-col gap-3 rounded-card border border-edge px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <DeviceHealthIndicator status={d.status} label={deviceStatusLabel(d.status)} />
                                        <div>
                                            <p className="text-sm font-semibold text-ink">{d.name}</p>
                                            <p className="text-xs text-ink-muted">
                                                {platformLabel(d.platform)} · Heartbeat{' '}
                                                {timeAgo(d.last_seen_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="rounded-input bg-slate-100 px-2 py-1 text-ink-muted">
                                            Proyek: {d.project?.name ?? 'Belum ditugaskan'}
                                        </span>
                                        {d.app_version && (
                                            <span className="rounded-input bg-slate-100 px-2 py-1 text-ink-muted">
                                                Versi {d.app_version}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </CardBody>
                </Card>
            </div>

            <div>
                <Card>
                    <CardHeader title="Ringkasan Ketersediaan" description="Derivasi dari heartbeat terakhir" icon={Radio} />
                    <CardBody className="space-y-3">
                        <Metric icon={Wifi} label="Online" value={counts.online} tone="success" />
                        <Metric
                            icon={WifiOff}
                            label="Offline / belum aktif"
                            value={counts.total - counts.online}
                            tone="neutral"
                        />
                        <Metric icon={Smartphone} label="Menunggu pairing" value={counts.waiting} tone="info" />
                        <Metric icon={Monitor} label="Perangkat terdaftar" value={counts.total} tone="neutral" />
                        {paired.length > 0 && (
                            <p className="rounded-input bg-success-subtle px-3 py-2 text-xs font-medium text-success">
                                {paired.length} perangkat tersambung aktif
                            </p>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

function Metric({ icon: Icon, label, value, tone }) {
    const color = tone === 'success' ? 'text-success' : tone === 'info' ? 'text-brand' : 'text-ink';
    const bg = tone === 'success' ? 'bg-success-subtle' : tone === 'info' ? 'bg-brand-subtle' : 'bg-slate-100';
    return (
        <div className="flex items-center justify-between rounded-card border border-edge px-4 py-3">
            <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-input ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <span className="text-sm text-ink-muted">{label}</span>
            </div>
            <span className={`text-lg font-bold ${color}`}>{value}</span>
        </div>
    );
}

function DownloadsPane({ downloads }) {
    const { toast } = useToast();

    const list = downloads.length
        ? downloads
        : [
              { platform: 'android', label: 'Photobooth Android', version: 'Belum tersedia', available: false },
              { platform: 'windows', label: 'Photobooth Kiosk Windows', version: 'Belum tersedia', available: false },
          ];

    return (
        <Card>
            <CardHeader
                title="Aplikasi Client Booth"
                description="Unduh installer untuk perangkat Android atau Windows."
                icon={Download}
            />
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {list.map((item) => (
                    <div key={item.platform} className="flex flex-col gap-3 rounded-card border border-edge p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-input bg-brand-subtle">
                                {PlatformIcon(item.platform, 'h-5 w-5 text-brand')}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-ink">{item.label}</p>
                                <p className="text-xs text-ink-muted">{item.version}</p>
                            </div>
                        </div>
                        <Button
                            variant="secondary"
                            icon={Download}
                            disabled={!item.available}
                            onClick={() =>
                                toast({
                                    tone: 'info',
                                    title: 'Belum tersedia',
                                    message: 'Installer belum dipublikasikan. Rilis akan segera hadir.',
                                })
                            }
                        >
                            {item.available ? 'Download' : 'Belum tersedia'}
                        </Button>
                    </div>
                ))}
            </CardBody>
        </Card>
    );
}

function PlatformIcon(platform, className) {
    return platform === 'windows' ? <Monitor className={className} /> : <Smartphone className={className} />;
}