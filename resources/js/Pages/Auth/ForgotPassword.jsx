import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Field, Input, Alert } from '@/Components/ui';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Password" />

            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-ink tracking-tight">Reset password</h1>
                <p className="mt-1.5 text-sm text-ink-muted">
                    Masukkan email Anda, kami akan mengirimkan tautan untuk mengatur ulang password.
                </p>
            </div>

            {status && (
                <div className="mb-4">
                    <Alert tone="success">{status}</Alert>
                </div>
            )}

            <div className="surface p-6 sm:p-8">
                <form onSubmit={submit} className="space-y-5" noValidate>
                    <Field label="Email" htmlFor="email" required error={errors.email}>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            error={!!errors.email}
                            isFocused
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </Field>

                    <Button type="submit" size="lg" className="w-full" loading={processing}>
                        Kirim tautan reset
                    </Button>

                    <p className="text-center text-sm text-ink-muted">
                        <Link href={route('login')} className="font-medium text-brand hover:text-brand-dark">
                            Kembali ke login
                        </Link>
                    </p>
                </form>
            </div>
        </GuestLayout>
    );
}
