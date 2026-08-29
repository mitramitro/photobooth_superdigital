import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button, Field, Input } from '@/Components/ui';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-ink tracking-tight">Atur ulang password</h1>
                <p className="mt-1.5 text-sm text-ink-muted">Buat password baru untuk akun Anda.</p>
            </div>

            <div className="surface p-6 sm:p-8">
                <form onSubmit={submit} className="space-y-5" noValidate>
                    <Field label="Email" htmlFor="email" required error={errors.email}>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            error={!!errors.email}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </Field>

                    <Field label="Password Baru" htmlFor="password" required error={errors.password}>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            error={!!errors.password}
                            autoComplete="new-password"
                            isFocused
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </Field>

                    <Field
                        label="Konfirmasi Password Baru"
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
                        />
                    </Field>

                    <Button type="submit" size="lg" className="w-full" loading={processing}>
                        Reset password
                    </Button>
                </form>
            </div>
        </GuestLayout>
    );
}
