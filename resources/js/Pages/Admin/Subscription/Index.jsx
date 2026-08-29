import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CreditCard, Check, Sparkles, ArrowRight, Calendar, Shirt } from 'lucide-react';
import {
    PageHeader,
    Button,
    Card,
    CardBody,
    StatusBadge,
    Alert,
    useToast,
    Modal,
    Field,
    Select,
} from '@/Components/ui';

const plans = [
    {
        name: 'Starter',
        price: 'Rp 299rb',
        period: '/bulan',
        desc: 'Cocok untuk 1 lokasi photobooth retail.',
        features: ['1 perangkat booth', 'Maks. 5 proyek aktif', 'Filter & frame standar', 'Akses API Sanctum'],
        popular: false,
    },
    {
        name: 'Event Pro',
        price: 'Rp 699rb',
        period: '/bulan',
        desc: 'Solusi terbaik untuk penyedia jasa photobooth event.',
        features: ['5 perangkat booth', 'Proyek tanpa batas', 'Custom frame & watermark', 'Telemetry kiosk live', 'Sync QR mobile instan'],
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Rp 1,5jt',
        period: '/bulan',
        desc: 'Untuk bisnis photobooth multi-cabang.',
        features: ['Perangkat tanpa batas', 'SLA uptime 99.9%', 'Custom domain & branding', 'Dedicated support 24/7'],
        popular: false,
    },
];

export default function Index() {
    const { toast } = useToast();
    const [modal, setModal] = useState(null);
    const [cycle, setCycle] = useState('monthly');

    const current = 'Event Pro';

    return (
        <AdminLayout title="Langganan">
            <Head title="Langganan - Photobooth Studio" />

            <PageHeader
                title="Langganan"
                description="Kelola paket berlangganan dan metode pembayaran workspace Anda."
                icon={CreditCard}
            />

            {/* Current subscription status */}
            <Card className="mb-6">
                <CardBody className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-input bg-brand-subtle">
                            <Sparkles className="h-6 w-6 text-brand" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-ink">Paket {current}</p>
                                <StatusBadge tone="success" dot>Active</StatusBadge>
                            </div>
                            <p className="text-sm text-ink-muted">Batas langganan: 12 Sep 2026 · 5 perangkat booth</p>
                        </div>
                    </div>
                    <div className="flex gap-2.5">
                        <Button variant="secondary" icon={Calendar} size="sm" onClick={() => setModal('renew')}>
                            Perpanjang
                        </Button>
                        <Button icon={Shirt} size="sm" onClick={() => toast({ tone: 'info', title: 'Pembayaran', message: 'Kelola metode pembayaran kartu / transfer.' })}>
                            Kelola Pembayaran
                        </Button>
                    </div>
                </CardBody>
            </Card>

            <Alert title="Perubahan paket" tone="info" className="mb-6">
                Perbedaan harga akan disesuaikan secara prorata saat Anda beralih paket di tengah siklus.
            </Alert>

            {/* Billing cycle toggle */}
            <div className="mb-6 flex items-center justify-center">
                <div className="inline-flex items-center gap-0.5 rounded-input border border-edge bg-white p-0.5">
                    {['monthly', 'yearly'].map((c) => (
                        <button
                            key={c}
                            onClick={() => setCycle(c)}
                            className={`rounded-input px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                                cycle === c ? 'bg-brand text-white' : 'text-ink-muted hover:text-ink'
                            }`}
                        >
                            {c === 'monthly' ? 'Bulanan' : 'Tahunan'}{' '}
                            {c === 'yearly' && <span className="text-xs opacity-80">(hemat 20%)</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plans */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {plans.map((plan) => {
                    const isCurrent = plan.name === current;
                    return (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col justify-between rounded-card border bg-white p-6 ${
                                plan.popular ? 'border-brand ring-2 ring-brand/20' : 'border-edge'
                            }`}
                        >
                            {plan.popular && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-0.5 text-xs font-semibold text-white">
                                    Paling populer
                                </span>
                            )}
                            <div>
                                <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                                <p className="mt-1 text-sm text-ink-muted">{plan.desc}</p>
                                <div className="mt-5">
                                    <span className="text-3xl font-bold tracking-tight text-ink">{plan.price}</span>
                                    <span className="text-sm text-ink-muted">{plan.period}</span>
                                </div>
                                <ul className="mt-6 space-y-2.5">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-ink">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-7">
                                {isCurrent ? (
                                    <Button variant="secondary" className="w-full" disabled>
                                        Paket aktif
                                    </Button>
                                ) : (
                                    <Button
                                        variant={plan.popular ? 'primary' : 'secondary'}
                                        className="w-full"
                                        icon={ArrowRight}
                                        onClick={() => setModal(plan.name)}
                                    >
                                        Pilih paket
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal
                open={!!modal}
                onClose={() => setModal(null)}
                maxWidth="md"
                title={modal === 'renew' ? 'Perpanjang langganan' : `Pindah ke paket ${modal}`}
                icon={CreditCard}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModal(null)}>Batal</Button>
                        <Button
                            onClick={() => {
                                const label = modal === 'renew' ? 'Langganan diperpanjang' : `Beralih ke ${modal}`;
                                toast({ tone: 'success', title: label, message: 'Perubahan berhasil disimulasikan.' });
                                setModal(null);
                            }}
                        >
                            Konfirmasi
                        </Button>
                    </>
                }
            >
                <Field label="Siklus penagihan">
                    <Select value={cycle} onChange={(e) => setCycle(e.target.value)}>
                        <option value="monthly">Bulanan</option>
                        <option value="yearly">Tahunan (hemat 20%)</option>
                    </Select>
                </Field>
                <p className="mt-4 text-sm text-ink-muted">
                    Anda akan diarahkan ke pembayaran untuk mengonfirmasi perubahan paket Anda.
                </p>
            </Modal>
        </AdminLayout>
    );
}
