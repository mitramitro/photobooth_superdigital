import React from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button, Field, Input } from '@/Components/ui';
import { ShieldCheck } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Password" />

            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-modal bg-brand-subtle">
                    <ShieldCheck className="h-7 w-7 text-brand" />
                </div>
                <h1 className="text-2xl font-bold text-ink tracking-tight">Konfirmasi password</h1>
                <p className="mt-2 text-sm text-ink-muted">
                    Ini adalah area aman. Masukkan password Anda untuk melanjutkan.
                </p>
            </div>

            <div className="surface p-6 sm:p-8">
                <form onSubmit={submit} className="space-y-5" noValidate>
                    <Field label="Password" htmlFor="password" required error={errors.password}>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            error={!!errors.password}
                            isFocused
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </Field>

                    <Button type="submit" size="lg" className="w-full" loading={processing}>
                        Konfirmasi
                    </Button>
                </form>
            </div>
        </GuestLayout>
    );
}
