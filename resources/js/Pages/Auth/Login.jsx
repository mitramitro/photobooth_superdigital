import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button, Field, Input } from '@/Components/ui';
import { Eye, EyeOff } from 'lucide-react';
import { Alert } from '@/Components/ui';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors } = useForm({
        email: 'admin@photobooth.com',
        password: 'password',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Masuk - Photobooth Studio" />

            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-ink tracking-tight">Selamat datang kembali</h1>
                <p className="mt-1.5 text-sm text-ink-muted">
                    Masuk untuk mengelola photobooth studio Anda.
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
                            autoComplete="username"
                            placeholder="nama@perusahaan.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </Field>

                    <Field label="Password" htmlFor="password" required error={errors.password}>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                error={!!errors.password}
                                className="pr-10"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-ink-faint hover:text-ink"
                                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </Field>

                    <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 rounded border-edge text-brand focus:ring-brand/40 cursor-pointer"
                            />
                            <span className="text-sm text-ink">Ingat saya</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium text-brand hover:text-brand-dark"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>

                    <Button type="submit" size="lg" className="w-full" loading={processing}>
                        Masuk
                    </Button>
                </form>
            </div>
        </GuestLayout>
    );
}
