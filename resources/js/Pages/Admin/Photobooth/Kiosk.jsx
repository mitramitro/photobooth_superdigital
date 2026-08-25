import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Camera, 
    Sparkles, 
    Sliders, 
    Printer, 
    QrCode, 
    RotateCcw, 
    Layers, 
    Check, 
    Play, 
    Download,
    Volume2,
    Eye,
    Zap,
    Maximize2
} from 'lucide-react';

export default function Kiosk() {
    const [selectedFrame, setSelectedFrame] = useState('cyberpunk');
    const [selectedFilter, setSelectedFilter] = useState('normal');
    const [isCapturing, setIsCapturing] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [photosCaptured, setPhotosCaptured] = useState([]);
    const [showResultModal, setShowResultModal] = useState(false);
    const [flashEffect, setFlashEffect] = useState(false);

    const frames = [
        { id: 'cyberpunk', name: 'Cyberpunk Neon 4-Strip', accent: 'from-brand-red to-brand-blue', border: 'border-brand-red' },
        { id: 'wedding', name: 'Wedding Classic White', accent: 'from-amber-200 to-amber-400', border: 'border-amber-300' },
        { id: 'emerald', name: 'Emerald Party Night', accent: 'from-brand-green to-teal-400', border: 'border-brand-green' },
        { id: 'retro', name: 'Retro Vintage 90s', accent: 'from-orange-500 to-yellow-400', border: 'border-orange-400' },
    ];

    const filters = [
        { id: 'normal', name: 'Original', style: 'none' },
        { id: 'sepia', name: 'Sepia Warm', style: 'sepia(0.6) contrast(1.1)' },
        { id: 'cyber', name: 'Cyber Neon', style: 'hue-rotate(180deg) saturate(1.4)' },
        { id: 'emerald', name: 'Emerald Glow', style: 'hue-rotate(90deg) brightness(1.1)' },
        { id: 'bw', name: 'Noir B&W', style: 'grayscale(1) contrast(1.2)' },
    ];

    // Trigger Photo Shutter Countdown
    const startShutterSession = () => {
        setIsCapturing(true);
        setPhotosCaptured([]);
        setCountdown(3);
    };

    useEffect(() => {
        let timer;
        if (isCapturing && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (isCapturing && countdown === 0) {
            // Flash camera effect
            setFlashEffect(true);
            setTimeout(() => setFlashEffect(false), 300);

            // Add simulated photo strip frame
            const newPhoto = {
                id: Date.now(),
                url: `https://picsum.photos/seed/${Date.now()}/400/300`,
                filter: selectedFilter,
            };

            setPhotosCaptured(prev => {
                const nextPhotos = [...prev, newPhoto];
                if (nextPhotos.length < 4) {
                    setCountdown(3); // Trigger next photo in sequence
                } else {
                    setIsCapturing(false);
                    setShowResultModal(true); // Complete 4-strip sequence
                }
                return nextPhotos;
            });
        }

        return () => clearTimeout(timer);
    }, [isCapturing, countdown]);

    return (
        <AdminLayout title="Photobooth Kiosk Live Simulator">
            <Head title="Live Kiosk Simulator - Photobooth Studio" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Controls & Camera Viewport (8 Columns) */}
                <div className="lg:col-span-8 flex flex-col space-y-6">
                    {/* Camera Viewport Screen Container */}
                    <div className="relative rounded-3xl overflow-hidden glass-panel border-2 border-slate-700 shadow-2xl bg-black min-h-[420px] sm:min-h-[480px] flex items-center justify-center">
                        {/* Flash Screen Overlay */}
                        {flashEffect && (
                            <div className="absolute inset-0 bg-white z-50 animate-ping"></div>
                        )}

                        {/* Viewport Live Simulation Canvas */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-all duration-300 flex flex-col justify-between p-6"
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop')`,
                                filter: filters.find(f => f.id === selectedFilter)?.style || 'none',
                            }}
                        >
                            {/* Live Overlay Frame Branding Header */}
                            <div className="flex items-center justify-between z-10">
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-extrabold tracking-wider">
                                    <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-ping"></span>
                                    <span>LIVE CAMERA 1080P</span>
                                </div>

                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-brand-green text-xs font-bold">
                                    <span>FRAME: {frames.find(f => f.id === selectedFrame)?.name}</span>
                                </div>
                            </div>

                            {/* Live Countdown Overlay Big Text */}
                            {isCapturing && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs z-30">
                                    <span className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-brand-red via-brand-blue to-brand-green animate-bounce">
                                        {countdown}
                                    </span>
                                    <span className="text-sm font-bold text-white uppercase tracking-widest mt-2">
                                        SMILE! TAKING PHOTO {photosCaptured.length + 1} OF 4
                                    </span>
                                </div>
                            )}

                            {/* Viewport Bottom Overlay Indicator */}
                            <div className="flex items-end justify-between z-10">
                                <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4].map(num => (
                                            <div 
                                                key={num} 
                                                className={`w-3 h-3 rounded-full border border-white/40 ${photosCaptured.length >= num ? 'bg-brand-green' : 'bg-white/20'}`}
                                            ></div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-white font-bold">
                                        {photosCaptured.length} / 4 Frames
                                    </span>
                                </div>

                                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-slate-300">
                                    Filter: {filters.find(f => f.id === selectedFilter)?.name}
                                </div>
                            </div>
                        </div>

                        {/* Camera Grid Lines Overlay */}
                        <div className="absolute inset-0 border border-white/10 pointer-events-none grid grid-cols-3 grid-rows-3">
                            <div className="border-r border-b border-white/5"></div>
                            <div className="border-r border-b border-white/5"></div>
                            <div className="border-b border-white/5"></div>
                            <div className="border-r border-b border-white/5"></div>
                            <div className="border-r border-b border-white/5"></div>
                            <div className="border-b border-white/5"></div>
                        </div>
                    </div>

                    {/* Big Ruby Red Shutter Action Button Bar */}
                    <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red">
                                <Zap className="w-6 h-6 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-white text-base">Shutter Control</h3>
                                <p className="text-xs text-slate-400">Tekan tombol merah untuk memulai sesi foto 4-strip</p>
                            </div>
                        </div>

                        <button
                            onClick={startShutterSession}
                            disabled={isCapturing}
                            className={`
                                px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-red to-rose-600 text-white font-extrabold text-base tracking-wider
                                shadow-2xl shadow-brand-red/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3
                                disabled:opacity-50 disabled:scale-100 cursor-pointer
                            `}
                        >
                            <div className="w-4 h-4 rounded-full bg-white animate-ping"></div>
                            <span>{isCapturing ? 'CAPTURING...' : 'CAPTURE PHOTO STRIP'}</span>
                        </button>
                    </div>
                </div>

                {/* Right Options Sidebar: Frame & Filter Selector (4 Columns) */}
                <div className="lg:col-span-4 flex flex-col space-y-6">
                    {/* Frame Picker Panel */}
                    <div className="p-6 rounded-3xl glass-panel border border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers className="w-5 h-5 text-brand-blue" />
                            <h3 className="font-bold text-white text-base">Pilih Frame Photobooth</h3>
                        </div>

                        <div className="space-y-3">
                            {frames.map((frame) => (
                                <button
                                    key={frame.id}
                                    onClick={() => setSelectedFrame(frame.id)}
                                    className={`
                                        w-full p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between
                                        ${selectedFrame === frame.id 
                                            ? `bg-brand-surface ${frame.border} border-2 shadow-lg` 
                                            : 'border-slate-800 bg-brand-dark/50 text-slate-400 hover:border-slate-700 hover:text-white'}
                                    `}
                                >
                                    <div>
                                        <p className="text-xs font-bold text-white">{frame.name}</p>
                                        <p className="text-[10px] text-slate-400">Event Overlay Design</p>
                                    </div>
                                    {selectedFrame === frame.id && (
                                        <Check className="w-4 h-4 text-brand-green" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter Control Panel */}
                    <div className="p-6 rounded-3xl glass-panel border border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <Sliders className="w-5 h-5 text-brand-green" />
                            <h3 className="font-bold text-white text-base">Filter Warna Foto</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id)}
                                    className={`
                                        p-3 rounded-xl border text-center transition-all duration-200 text-xs font-bold
                                        ${selectedFilter === filter.id 
                                            ? 'bg-brand-green/20 border-brand-green text-brand-green shadow-md' 
                                            : 'border-slate-800 text-slate-400 bg-brand-dark/50 hover:bg-slate-800 hover:text-white'}
                                    `}
                                >
                                    {filter.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Photo Strip Result Modal */}
            {showResultModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-brand-blue/50 max-w-lg w-full shadow-2xl relative animate-float">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-brand-green/20 text-brand-green border border-brand-green/40 flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-white">Sesi Foto Selesai!</h3>
                            <p className="text-xs text-slate-400">Photo strip Anda telah berhasil di-generate dengan frame {selectedFrame}</p>
                        </div>

                        {/* Simulated Photo Strip Preview */}
                        <div className="bg-brand-dark p-4 rounded-2xl border border-slate-700 mb-6 flex flex-col items-center gap-2.5">
                            <div className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">PHOTOBOOTH STUDIO STRIP</div>
                            <div className="grid grid-cols-2 gap-2 w-full">
                                {photosCaptured.map((photo, i) => (
                                    <div key={i} className="aspect-video rounded-lg overflow-hidden border border-slate-700">
                                        <img src={photo.url} alt={`Snap ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-[9px] text-slate-500 font-mono">ID: SESH-{Math.floor(1000 + Math.random() * 9000)} • SANCTUM MOBILE SYNC OK</div>
                        </div>

                        {/* Actions: Print & Share QR */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => { alert('Perintah Cetak Dikirim ke Printer Photobooth!'); setShowResultModal(false); }}
                                className="flex-1 py-3 px-4 rounded-xl bg-brand-green text-brand-dark font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 hover:bg-brand-green-light"
                            >
                                <Printer className="w-4 h-4" />
                                <span>CETAK STRIP</span>
                            </button>

                            <button
                                onClick={() => { alert('QR Code Dibuat! Pengguna HP dapat mengunduh foto via Sanctum API.'); setShowResultModal(false); }}
                                className="flex-1 py-3 px-4 rounded-xl bg-brand-blue text-brand-dark font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 hover:bg-brand-blue-light"
                            >
                                <QrCode className="w-4 h-4" />
                                <span>BAGIKAN QR MOBILE</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
