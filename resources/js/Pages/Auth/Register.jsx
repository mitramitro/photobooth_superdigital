import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Field, Input } from '@/Components/ui';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar" />

            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-ink tracking-tight">Buat akun baru</h1>
                <p className="mt-1.5 text-sm text-ink-muted">Mulai kelola studio photobooth Anda.</p>
            </div>

            <div className="surface p-6 sm:p-8">
                <form onSubmit={submit} className="space-y-5" noValidate>
                    <Field label="Nama" htmlFor="name" required error={errors.name}>
                        <Input
                            id="name"
                            value={data.name}
                            error={!!errors.name}
                            autoComplete="name"
                            isFocused
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </Field>

                    <Field label="Email" htmlFor="email" required error={errors.email}>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            error={!!errors.email}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </Field>

                    <Field label="Password" htmlFor="password" required error={errors.password}>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            error={!!errors.password}
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </Field>

                    <Field
                        label="Konfirmasi Password"
                        htmlFor="password_confirmation"
                        required
                        error={errors.password_confirmation}
                    >
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            error={!!errors.password_confirmation}
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </Field>

                    <div className="flex items-center justify-between gap-4 pt-1">
                        <Link
                            href={route('login')}
                            className="text-sm font-medium text-brand hover:text-brand-dark"
                        >
                            Sudah punya akun?
                        </Link>
                        <Button type="submit" loading={processing}>
                            Daftar
                        </Button>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
