import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Alert } from '@/Components/ui';
import { Mail } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-modal bg-brand-subtle">
                    <Mail className="h-7 w-7 text-brand" />
                </div>
                <h1 className="text-2xl font-bold text-ink tracking-tight">Verifikasi email Anda</h1>
                <p className="mt-2 text-sm text-ink-muted">
                    Terima kasih telah mendaftar! Kami telah mengirimkan tautan verifikasi ke email
                    Anda. Jika belum menerimanya, kirim ulang tautan verifikasi.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4">
                    <Alert tone="success">Tautan verifikasi baru telah dikirim ke email Anda.</Alert>
                </div>
            )}

            <div className="surface p-6 sm:p-8">
                <form onSubmit={submit} className="space-y-4">
                    <Button type="submit" size="lg" className="w-full" loading={processing}>
                        Kirim ulang email verifikasi
                    </Button>

                    <div className="text-center">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-sm font-medium text-ink-muted hover:text-ink"
                        >
                            Keluar
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
