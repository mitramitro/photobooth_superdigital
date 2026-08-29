import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { KeyRound, Plus, Copy, Check, Trash2, Smartphone, ShieldCheck, BookOpen } from 'lucide-react';
import {
    PageHeader,
    Button,
    Card,
    CardHeader,
    CardBody,
    StatusBadge,
    Modal,
    Field,
    Input,
    Checkbox,
    ConfirmDialog,
    useToast,
    EmptyState,
    Alert,
} from '@/Components/ui';

const permissionOptions = ['photos:read', 'sessions:create', 'print:send', '*'];

const initialTokens = [
    { id: 1, name: 'Flutter Mobile App (iOS)', token: '1|sanctum_token_8891abc728x9910', permissions: ['photos:read', 'sessions:create'], created: '2 jam lalu', lastUsed: '5 menit lalu' },
    { id: 2, name: 'Android Photobooth App', token: '2|sanctum_token_7721xyz991q0021', permissions: ['photos:read', 'sessions:create', 'print:send'], created: '1 hari lalu', lastUsed: '12 menit lalu' },
    { id: 3, name: 'Kiosk Controller #01', token: '3|sanctum_token_9912kiosk8817263', permissions: ['*'], created: '3 hari lalu', lastUsed: 'Sedang aktif' },
];

export default function Index() {
    const { toast } = useToast();
    const [tokens, setTokens] = useState(initialTokens);
    const [modal, setModal] = useState(false);
    const [name, setName] = useState('');
    const [selectedPerms, setSelectedPerms] = useState(['photos:read', 'sessions:create']);
    const [confirm, setConfirm] = useState(null);
    const [copied, setCopied] = useState(null);

    const copy = (token) => {
        navigator.clipboard?.writeText(token);
        setCopied(token);
        setTimeout(() => setCopied(null), 2000);
        toast({ tone: 'success', title: 'Token disalin' });
    };

    const togglePerm = (p) => {
        if (p === '*') {
            setSelectedPerms((prev) => (prev.includes('*') ? [] : ['*']));
            return;
        }
        setSelectedPerms((prev) => {
            const base = prev.includes('*') ? [] : prev;
            return base.includes(p) ? base.filter((x) => x !== p) : [...base, p];
        });
    };

    const create = () => {
        if (!name.trim()) return;
        const newToken = {
            id: Date.now(),
            name: name.trim(),
            token: `${tokens.length + 1}|sanctum_token_${Math.random().toString(36).substring(2, 12)}`,
            permissions: selectedPerms,
            created: 'Baru saja',
            lastUsed: 'Belum pernah',
        };
        setTokens((prev) => [newToken, ...prev]);
        setModal(false);
        setName('');
        toast({ tone: 'success', title: 'Token dibuat', message: `${newToken.name} berhasil dibuat.` });
    };

    const remove = () => {
        setTokens((prev) => prev.filter((t) => t.id !== confirm.id));
        toast({ tone: 'warning', title: 'Token dihapus', message: `${confirm.name} telah dihapus.` });
        setConfirm(null);
    };

    return (
        <AdminLayout title="API Tokens">
            <Head title="API Tokens - Photobooth Studio" />

            <PageHeader
                title="API Tokens"
                description="Kelola Sanctum bearer token untuk aplikasi mobile dan kiosk."
                icon={KeyRound}
                actions={
                    <>
                        <Button variant="secondary" icon={BookOpen} onClick={() => (window.location.href = '/admin/scalar-docs')}>
                            Buka API Docs
                        </Button>
                        <Button icon={Plus} onClick={() => setModal(true)}>
                            Buat Token
                        </Button>
                    </>
                }
            />

            <Alert title="Simpan token dengan aman" tone="warning" className="mb-6">
                Token hanya ditampilkan sekali saat pembuatan. Simpan di tempat aman untuk integrasi aplikasi Anda.
            </Alert>

            <Card>
                <CardHeader
                    title={`Token Aktif (${tokens.length})`}
                    description="Client yang terhubung ke backend Sanctum"
                    icon={KeyRound}
                />
                {tokens.length === 0 ? (
                    <EmptyState icon={KeyRound} title="Belum ada token" description="Buat token pertama untuk mengintegrasikan aplikasi." />
                ) : (
                    <CardBody className="divide-y divide-edge">
                        {tokens.map((t) => (
                            <div key={t.id} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 lg:flex-row lg:items-center lg:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Smartphone className="h-4 w-4 text-ink-faint" />
                                        <span className="font-medium text-ink">{t.name}</span>
                                        <StatusBadge tone="info">Bearer</StatusBadge>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <code className="truncate rounded-input bg-slate-100 px-2.5 py-1 font-mono text-xs text-ink-muted">
                                            {t.token}
                                        </code>
                                        <button
                                            onClick={() => copy(t.token)}
                                            className="text-ink-faint transition-colors hover:text-brand cursor-pointer"
                                            title="Salin token"
                                        >
                                            {copied === t.token ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {t.permissions.map((p) => (
                                            <span key={p} className="rounded-input bg-brand-subtle px-1.5 py-0.5 font-mono text-[10px] text-brand-dark">
                                                {p}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-ink-muted lg:shrink-0">
                                    <div className="text-right">
                                        <p className="font-medium text-ink">Terpakai: {t.lastUsed}</p>
                                        <p>Dibuat: {t.created}</p>
                                    </div>
                                    <button
                                        onClick={() => setConfirm(t)}
                                        className="rounded-input border border-edge p-2 text-ink-faint transition-colors hover:border-danger hover:text-danger cursor-pointer"
                                        title="Hapus token"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </CardBody>
                )}
            </Card>

            <Modal
                open={modal}
                onClose={() => setModal(false)}
                maxWidth="md"
                title="Buat API Token"
                icon={KeyRound}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModal(false)}>Batal</Button>
                        <Button onClick={create} disabled={!name.trim()}>Generate Token</Button>
                    </>
                }
            >
                <Field label="Nama token" required hint="Contoh: Flutter Mobile iOS Client">
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama aplikasi / klien" />
                </Field>
                <div className="mt-5">
                    <p className="mb-2 text-sm font-medium text-ink">Perizinan akses</p>
                    <div className="space-y-2.5">
                        {permissionOptions.map((p) => (
                            <Checkbox
                                key={p}
                                checked={selectedPerms.includes('*') || selectedPerms.includes(p)}
                                onChange={() => togglePerm(p)}
                                label={p === '*' ? 'Semua akses (*)' : p}
                                disabled={selectedPerms.includes('*') && p !== '*'}
                            />
                        ))}
                    </div>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={remove}
                title="Hapus token?"
                message={`Token "${confirm?.name}" akan dinonaktifkan dan client kehilangan akses.`}
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
