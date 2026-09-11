import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Camera, LogOut } from 'lucide-react';
import { Button, StatusBadge } from '@/Components/ui';

export default function Station() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10 text-ink">
            <Head title="Booth Station - Photobooth Studio" />

            <div className="w-full max-w-md">
                <div className="rounded-card border border-edge bg-surface p-8 text-center shadow-card">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand">
                        <Camera className="h-7 w-7 text-white" />
                    </div>

                    <h1 className="mt-5 text-xl font-bold tracking-tight text-ink">Booth Photobooth</h1>
                    <p className="mt-1 text-sm text-ink-muted">
                        Stasiun photo booth ini adalah perangkat mandiri milik studio Anda.
                    </p>

                    <div className="mt-6 space-y-2 text-left">
                        <div className="flex items-center justify-between rounded-input border border-edge bg-white px-4 py-3">
                            <span className="text-sm text-ink-muted">Mode layanan</span>
                            <StatusBadge tone="info" dot>
                                Self-service
                            </StatusBadge>
                        </div>
                        <div className="flex items-center justify-between rounded-input border border-edge bg-white px-4 py-3">
                            <span className="text-sm text-ink-muted">Mode operator</span>
                            <StatusBadge tone="neutral">Segera hadir</StatusBadge>
                        </div>
                    </div>

                    <p className="mt-6 rounded-card bg-brand-subtle px-4 py-3 text-xs leading-relaxed text-brand-dark">
                        Halaman ini adalah tempat login awal untuk perangkat booth. Mode operator &amp; daftar
                        sesi foto akan menyusul di fase berikutnya.
                    </p>

                    <div className="mt-6">
                        <Link href={route('logout')} method="post" as="button" className="w-full">
                            <Button variant="secondary" type="submit" className="w-full">
                                <LogOut className="h-4 w-4" /> Keluar
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}