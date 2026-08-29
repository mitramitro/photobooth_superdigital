import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Camera, Printer, QrCode, Layers, Sliders, Check, RefreshCw, Zap } from 'lucide-react';
import { PageHeader, Button, Card, CardHeader, CardBody, Modal, useToast, StatusBadge } from '@/Components/ui';

const frames = [
    { id: 'classic', name: 'Classic White', tone: 'border-slate-300 bg-white', label: 'text-slate-900', chip: 'bg-slate-100 text-slate-700' },
    { id: 'wedding', name: 'Wedding Elegant', tone: 'border-amber-300 bg-amber-50', label: 'text-amber-900', chip: 'bg-amber-100 text-amber-800' },
    { id: 'party', name: 'Party Neon', tone: 'border-violet-300 bg-violet-50', label: 'text-violet-900', chip: 'bg-violet-100 text-violet-800' },
    { id: 'retro', name: 'Retro 90s', tone: 'border-orange-300 bg-orange-50', label: 'text-orange-900', chip: 'bg-orange-100 text-orange-800' },
];

const filters = [
    { id: 'normal', name: 'Original', style: 'none' },
    { id: 'sepia', name: 'Sepia Warm', style: 'sepia(0.6) contrast(1.1)' },
    { id: 'viv', name: 'Vivid', style: 'saturate(1.4) contrast(1.1)' },
    { id: 'emerald', name: 'Emerald Glow', style: 'hue-rotate(90deg) brightness(1.1)' },
    { id: 'noir', name: 'Noir B&W', style: 'grayscale(1) contrast(1.2)' },
];

export default function Kiosk() {
    const { toast } = useToast();
    const [selectedFrame, setSelectedFrame] = useState('classic');
    const [selectedFilter, setSelectedFilter] = useState('normal');
    const [isCapturing, setIsCapturing] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [photos, setPhotos] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [flash, setFlash] = useState(false);

    const startSession = () => {
        setIsCapturing(true);
        setPhotos([]);
        setCountdown(3);
    };

    useEffect(() => {
        let timer;
        if (isCapturing && countdown > 0) {
            timer = setTimeout(() => setCountdown((p) => p - 1), 1000);
        } else if (isCapturing && countdown === 0) {
            setFlash(true);
            setTimeout(() => setFlash(false), 300);
            setPhotos((prev) => {
                const next = [
                    ...prev,
                    {
                        id: Date.now(),
                        url: `https://picsum.photos/seed/${Date.now()}/400/300`,
                        filter: selectedFilter,
                    },
                ];
                if (next.length < 4) {
                    setCountdown(3);
                } else {
                    setIsCapturing(false);
                    setShowResult(true);
                }
                return next;
            });
        }
        return () => clearTimeout(timer);
    }, [isCapturing, countdown, selectedFilter]);

    const frame = frames.find((f) => f.id === selectedFrame);

    return (
        <AdminLayout title="Kiosk Simulator">
            <Head title="Kiosk Simulator - Photobooth Studio" />

            <PageHeader
                title="Kiosk Simulator"
                description="Simulasi live sesi foto & kontrol frame photobooth."
                icon={Camera}
                actions={
                    <Button
                        variant="secondary"
                        icon={RefreshCw}
                        onClick={() => {
                            setPhotos([]);
                            setShowResult(false);
                            setIsCapturing(false);
                            setCountdown(0);
                        }}
                    >
                        Reset
                    </Button>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Camera viewport */}
                <div className="flex flex-col gap-6 lg:col-span-8">
                    <Card>
                        <CardBody className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-card bg-slate-900 sm:min-h-[480px]">
                            {flash && <div className="absolute inset-0 z-50 animate-ping bg-white" />}
                            <div
                                className="absolute inset-0 flex flex-col justify-between bg-cover bg-center p-6 transition-all duration-300"
                                style={{
                                    backgroundImage: `url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop')`,
                                    filter: filters.find((f) => f.id === selectedFilter)?.style || 'none',
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                                        <span className="h-2 w-2 animate-ping rounded-full bg-red-500" /> LIVE
                                    </span>
                                    <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                                        Frame: {frame?.name}
                                    </span>
                                </div>

                                {isCapturing && (
                                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40">
                                        <span className="text-7xl font-black text-white sm:text-8xl">{countdown}</span>
                                        <span className="mt-2 text-sm font-semibold uppercase tracking-widest text-white">
                                            Foto {photos.length + 1} dari 4
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-end justify-between">
                                    <div className="flex items-center gap-3 rounded-input bg-black/60 p-2.5 text-xs font-semibold text-white">
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3, 4].map((n) => (
                                                <span
                                                    key={n}
                                                    className={`h-2.5 w-2.5 rounded-full border border-white/40 ${
                                                        photos.length >= n ? 'bg-emerald-400' : 'bg-white/20'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span>{photos.length} / 4</span>
                                    </div>
                                    <span className="rounded-input bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
                                        {filters.find((f) => f.id === selectedFilter)?.name}
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Shutter control */}
                    <Card>
                        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-input bg-danger-subtle">
                                    <Zap className="h-5 w-5 text-danger" />
                                </div>
                                <div>
                                    <p className="font-semibold text-ink">Shutter Control</p>
                                    <p className="text-xs text-ink-muted">Tekan untuk memulai sesi foto 4-strip</p>
                                </div>
                            </div>
                            <Button
                                onClick={startSession}
                                disabled={isCapturing}
                                className="shrink-0"
                            >
                                {isCapturing ? 'Memotret…' : 'Mulai Sesi Foto'}
                            </Button>
                        </CardBody>
                    </Card>
                </div>

                {/* Controls sidebar */}
                <div className="flex flex-col gap-6 lg:col-span-4">
                    <Card>
                        <CardHeader title="Pilih Frame" icon={Layers} />
                        <CardBody className="space-y-2.5">
                            {frames.map((fl) => (
                                <button
                                    key={fl.id}
                                    onClick={() => setSelectedFrame(fl.id)}
                                    className={`flex w-full items-center justify-between rounded-card border p-3 text-left transition-colors cursor-pointer ${
                                        selectedFrame === fl.id ? 'border-brand ring-2 ring-brand/20' : 'border-edge hover:border-slate-300'
                                    }`}
                                >
                                    <span className={`flex items-center gap-2.5 rounded-card border px-3 py-1.5 text-xs font-semibold ${fl.tone} ${fl.label}`}>
                                        {fl.name}
                                    </span>
                                    {selectedFrame === fl.id && <Check className="h-4 w-4 text-brand" />}
                                </button>
                            ))}
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader title="Filter Warna" icon={Sliders} />
                        <CardBody className="grid grid-cols-2 gap-2.5">
                            {filters.map((fl) => (
                                <button
                                    key={fl.id}
                                    onClick={() => setSelectedFilter(fl.id)}
                                    className={`rounded-card border px-2 py-2.5 text-center text-xs font-medium transition-colors cursor-pointer ${
                                        selectedFilter === fl.id
                                            ? 'border-brand bg-brand-subtle text-brand-dark'
                                            : 'border-edge text-ink-muted hover:border-slate-300 hover:text-ink'
                                    }`}
                                >
                                    {fl.name}
                                </button>
                            ))}
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Result modal */}
            <Modal
                open={showResult}
                onClose={() => setShowResult(false)}
                maxWidth="lg"
                title="Sesi Foto Selesai"
                icon={Camera}
                footer={
                    <>
                        <Button
                            variant="secondary"
                            icon={QrCode}
                            onClick={() => {
                                toast({ tone: 'info', title: 'QR dibuat', message: 'Pengguna dapat mengunduh via link galeri.' });
                                setShowResult(false);
                            }}
                        >
                            Bagikan QR
                        </Button>
                        <Button
                            icon={Printer}
                            onClick={() => {
                                toast({ tone: 'success', title: 'Cetak dikirim', message: 'Perintah cetak diteruskan ke printer.' });
                                setShowResult(false);
                            }}
                        >
                            Cetak Strip
                        </Button>
                    </>
                }
            >
                <p className="mb-4 text-sm text-ink-muted">
                    Strip foto berhasil dibuat menggunakan frame {frame?.name}.
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                    {photos.map((p, i) => (
                        <img
                            key={p.id}
                            src={p.url}
                            alt={`Snap ${i + 1}`}
                            className="aspect-video w-full rounded-card border border-edge object-cover"
                        />
                    ))}
                </div>
            </Modal>
        </AdminLayout>
    );
}
