import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Shield, Plus, Check, Trash2, Copy } from 'lucide-react';
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
    DefaultAvatar,
    Tabs,
    EmptyState,
} from '@/Components/ui';

const modules = ['Proyek', 'Template', 'Sesi', 'Galeri', 'Transaksi', 'Perangkat', 'Pengguna', 'Pengaturan'];
const actions = ['Lihat', 'Buat', 'Ubah', 'Hapus'];

const permissionMap = {
    Admin: modules.reduce((acc, m) => ({ ...acc, [m]: { Lihat: true, Buat: true, Ubah: true, Hapus: true } }), {}),
    Operator: {
        ...Object.fromEntries(modules.map((m) => [m, { Lihat: true, Buat: m === 'Sesi' || m === 'Transaksi', Ubah: m === 'Sesi', Hapus: false }])),
    },
    Staff: {
        ...Object.fromEntries(
            modules.map((m) => [m, { Lihat: true, Buat: false, Ubah: false, Hapus: false }]),
        ),
    },
};

const initialRoles = [
    { id: 1, name: 'Admin', users: 1, color: 'info' },
    { id: 2, name: 'Operator', users: 2, color: 'neutral' },
    { id: 3, name: 'Staff', users: 1, color: 'success' },
];

const colorMap = { info: 'info', neutral: 'neutral', success: 'success' };

export default function Index() {
    const { toast } = useToast();
    const [roles, setRoles] = useState(initialRoles);
    const [activeRole, setActiveRole] = useState('Admin');
    const [perms, setPerms] = useState({ ...permissionMap });
    const [createModal, setCreateModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [confirm, setConfirm] = useState(null);

    const role = roles.find((r) => r.name === activeRole);

    const toggle = (module, action) => {
        setPerms((prev) => ({
            ...prev,
            [activeRole]: {
                ...prev[activeRole],
                [module]: { ...prev[activeRole][module], [action]: !prev[activeRole][module][action] },
            },
        }));
    };

    const save = () => {
        toast({ tone: 'success', title: 'Izin disimpan', message: `Izin role ${activeRole} berhasil disimpan.` });
    };

    const createRole = () => {
        if (!newName.trim()) return;
        setRoles((prev) => [...prev, { id: Date.now(), name: newName.trim(), users: 0, color: 'neutral' }]);
        const base = Object.fromEntries(modules.map((m) => [m, { Lihat: true, Buat: false, Ubah: false, Hapus: false }]));
        setPerms((prev) => ({ ...prev, [newName.trim()]: base }));
        setActiveRole(newName.trim());
        setNewName('');
        setCreateModal(false);
        toast({ tone: 'success', title: 'Role dibuat', message: `Role ${newName.trim()} berhasil dibuat.` });
    };

    return (
        <AdminLayout title="Roles & Izin">
            <Head title="Roles & Izin - Photobooth Studio" />

            <PageHeader
                title="Roles & Izin"
                description="Atur tingkat akses setiap role di platform."
                icon={Shield}
                actions={
                    <Button icon={Plus} onClick={() => setCreateModal(true)}>
                        Buat Role
                    </Button>
                }
            />

            <div className="mb-6 flex flex-wrap gap-3">
                {roles.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => setActiveRole(r.name)}
                        className={`inline-flex items-center gap-2.5 rounded-card border px-4 py-2.5 text-left transition-colors cursor-pointer ${
                            activeRole === r.name ? 'border-brand bg-brand-subtle' : 'border-edge bg-white hover:bg-slate-50'
                        }`}
                    >
                        <DefaultAvatar name={r.name} size="sm" />
                        <div>
                            <p className="text-sm font-semibold text-ink">{r.name}</p>
                            <p className="text-xs text-ink-muted">{r.users} pengguna</p>
                        </div>
                    </button>
                ))}
            </div>

            <Card>
                <CardHeader
                    title={`Izin Role: ${activeRole}`}
                    description="Centang aksi yang diizinkan untuk setiap modul."
                    icon={Shield}
                    actions={
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" icon={Copy} onClick={() => toast({ tone: 'info', title: 'Role diduplikasi' })}>
                                Duplikat
                            </Button>
                            <Button variant="outline-destructive" size="sm" icon={Trash2} onClick={() => setConfirm(role)}>
                                Hapus
                            </Button>
                        </div>
                    }
                />
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-y border-edge bg-slate-50/60">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">Modul</th>
                                {actions.map((a) => (
                                    <th key={a} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-ink-muted">
                                        {a}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-edge">
                            {modules.map((m) => (
                                <tr key={m} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm font-medium text-ink">{m}</td>
                                    {actions.map((a) => {
                                        const val = perms[activeRole]?.[m]?.[a] ?? false;
                                        return (
                                            <td key={a} className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => toggle(m, a)}
                                                    title={`${a} ${m}`}
                                                    className={`inline-flex h-7 w-7 items-center justify-center rounded-input transition-colors cursor-pointer ${
                                                        val ? 'bg-brand text-white' : 'bg-slate-100 text-ink-faint hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {val && <Check className="h-4 w-4" />}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end border-t border-edge px-5 py-4">
                    <Button onClick={save}>Simpan Izin</Button>
                </div>
            </Card>

            <Modal
                open={createModal}
                onClose={() => setCreateModal(false)}
                maxWidth="md"
                title="Buat Role Baru"
                icon={Shield}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setCreateModal(false)}>Batal</Button>
                        <Button onClick={createRole} disabled={!newName.trim()}>Buat</Button>
                    </>
                }
            >
                <Field label="Nama role" required>
                    <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Contoh: Manager" />
                </Field>
            </Modal>

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={() => {
                    const name = confirm?.name;
                    setRoles((prev) => prev.filter((r) => r.name !== name));
                    if (activeRole === name) {
                        const next = roles.find((r) => r.name !== name);
                        setActiveRole(next?.name || '');
                    }
                    setConfirm(null);
                    toast({ tone: 'warning', title: 'Role dihapus', message: `Role ${name} telah dihapus.` });
                }}
                title="Hapus role?"
                message={`Role "${confirm?.name}" akan dihapus.`}
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
