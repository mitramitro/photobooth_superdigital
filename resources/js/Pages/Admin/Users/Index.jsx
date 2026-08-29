import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Users as UsersIcon, Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import {
    PageHeader,
    Button,
    SearchInput,
    FilterBar,
    FilterPill,
    Card,
    EmptyState,
    Table,
    Pagination,
    StatusBadge,
    DefaultAvatar,
    Modal,
    Field,
    Input,
    Select,
    ConfirmDialog,
    useToast,
    Dropdown,
} from '@/Components/ui';

const users = [
    { id: 1, name: 'Andika Pratama', email: 'andika@photobooth.com', role: 'Admin', status: 'active', lastActive: 'Aktif sekarang', created: '12 Jan 2026' },
    { id: 2, name: 'Siti Rahayu', email: 'siti@photobooth.com', role: 'Operator', status: 'active', lastActive: '5 menit lalu', created: '20 Feb 2026' },
    { id: 3, name: 'Budi Santoso', email: 'budi@photobooth.com', role: 'Staff', status: 'active', lastActive: '2 jam lalu', created: '03 Mar 2026' },
    { id: 4, name: 'Dewi Lestari', email: 'dewi@photobooth.com', role: 'Operator', status: 'inactive', lastActive: '3 hari lalu', created: '15 Mar 2026' },
];

const roleTone = { Admin: 'info', Operator: 'neutral', Staff: 'success' };
const statusTone = { active: 'success', inactive: 'neutral' };
const statusLabel = { active: 'Aktif', inactive: 'Nonaktif' };

export default function Index() {
    const { toast } = useToast();
    const [rows, setRows] = useState(users);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(8);
    const [sort, setSort] = useState(null);
    const [modal, setModal] = useState(null);
    const [confirm, setConfirm] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', role: 'Staff' });
    const [errors, setErrors] = useState({});

    const filtered = useMemo(() => {
        let r = [...rows];
        if (roleFilter !== 'all') r = r.filter((x) => x.role === roleFilter);
        if (statusFilter !== 'all') r = r.filter((x) => x.status === statusFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            r = r.filter((x) => x.name.toLowerCase().includes(q) || x.email.toLowerCase().includes(q));
        }
        if (sort) {
            r.sort((a, b) => {
                const cmp = String(a[sort.key] ?? '').localeCompare(String(b[sort.key] ?? ''));
                return sort.dir === 'asc' ? cmp : -cmp;
            });
        }
        return r;
    }, [rows, search, roleFilter, statusFilter, sort]);

    const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

    const openCreate = () => {
        setForm({ name: '', email: '', role: 'Staff' });
        setErrors({});
        setModal('create');
    };

    const openEdit = (u) => {
        setForm(u);
        setErrors({});
        setModal('edit');
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Nama wajib diisi.';
        if (!form.email.trim()) e.email = 'Email wajib diisi.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const save = () => {
        if (!validate()) return;
        if (modal === 'create') {
            setRows((prev) => [{ ...form, id: Date.now(), status: 'active', lastActive: 'Baru', created: 'Baru saja' }, ...prev]);
            toast({ tone: 'success', title: 'Pengguna ditambahkan', message: `${form.name} berhasil ditambahkan.` });
        } else {
            setRows((prev) => prev.map((u) => (u.id === form.id ? { ...u, ...form } : u)));
            toast({ tone: 'success', title: 'Pengguna diperbarui', message: `${form.name} berhasil diperbarui.` });
        }
        setModal(null);
    };

    const remove = () => {
        setRows((prev) => prev.filter((u) => u.id !== confirm.id));
        toast({ tone: 'warning', title: 'Pengguna dihapus', message: `${confirm.name} telah dihapus.` });
        setConfirm(null);
    };

    const columns = [
        {
            key: 'name',
            label: 'Pengguna',
            sortable: true,
            render: (r) => (
                <div className="flex items-center gap-3">
                    <DefaultAvatar name={r.name} />
                    <div>
                        <p className="font-medium text-ink">{r.name}</p>
                        <p className="text-xs text-ink-muted">{r.email}</p>
                    </div>
                </div>
            ),
        },
        { key: 'role', label: 'Role', sortable: true, render: (r) => <StatusBadge tone={roleTone[r.role]}>{r.role}</StatusBadge> },
        { key: 'status', label: 'Status', sortable: true, render: (r) => <StatusBadge tone={statusTone[r.status]} dot>{statusLabel[r.status]}</StatusBadge> },
        { key: 'lastActive', label: 'Aktif terakhir', render: (r) => <span className="text-sm text-ink-muted">{r.lastActive}</span> },
        { key: 'created', label: 'Dibuat', render: (r) => <span className="text-sm text-ink-muted">{r.created}</span> },
        {
            key: 'actions',
            label: '',
            align: 'right',
            render: (r) => (
                <Dropdown
                    items={[
                        { label: 'Ubah', icon: Pencil, onClick: () => openEdit(r) },
                        { label: 'Kelola izin', icon: ShieldCheck, onClick: () => toast({ tone: 'info', title: 'Kelola izin', message: `Mengelola izin ${r.name}.` }) },
                        { divider: true },
                        { label: 'Hapus', icon: Trash2, danger: true, onClick: () => setConfirm(r) },
                    ]}
                />
            ),
        },
    ];

    return (
        <AdminLayout title="Pengguna">
            <Head title="Pengguna - Photobooth Studio" />

            <PageHeader
                title="Pengguna"
                description="Kelola akun pengguna yang memiliki akses ke platform."
                icon={UsersIcon}
                actions={
                    <Button icon={Plus} onClick={openCreate}>
                        Tambah Pengguna
                    </Button>
                }
            />

            <div className="mb-4">
                <FilterBar>
                    <SearchInput
                        placeholder="Cari nama atau email…"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="w-full lg:w-72"
                    />
                    <FilterPill
                        value={roleFilter}
                        onChange={(v) => {
                            setRoleFilter(v);
                            setPage(1);
                        }}
                        options={[
                            { value: 'all', label: 'Semua role' },
                            { value: 'Admin', label: 'Admin' },
                            { value: 'Operator', label: 'Operator' },
                            { value: 'Staff', label: 'Staff' },
                        ]}
                    />
                    <FilterPill
                        value={statusFilter}
                        onChange={(v) => {
                            setStatusFilter(v);
                            setPage(1);
                        }}
                        options={[
                            { value: 'all', label: 'Semua status' },
                            { value: 'active', label: 'Aktif' },
                            { value: 'inactive', label: 'Nonaktif' },
                        ]}
                    />
                </FilterBar>
            </div>

            {filtered.length === 0 ? (
                <Card>
                    <EmptyState
                        icon={UsersIcon}
                        title="Belum ada pengguna"
                        description="Tidak ada pengguna yang cocok dengan filter Anda."
                    />
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <Table columns={columns} rows={pageRows} rowKey="id" sort={sort} onSort={setSort} />
                    <Pagination
                        page={page}
                        total={filtered.length}
                        perPage={perPage}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </Card>
            )}

            <Modal
                open={!!modal}
                onClose={() => setModal(null)}
                maxWidth="md"
                title={modal === 'create' ? 'Tambah Pengguna' : 'Ubah Pengguna'}
                icon={UsersIcon}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModal(null)}>Batal</Button>
                        <Button onClick={save}>{modal === 'create' ? 'Tambahkan' : 'Simpan'}</Button>
                    </>
                }
            >
                <div className="space-y-5">
                    <Field label="Nama" required error={errors.name}>
                        <Input value={form.name} error={!!errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </Field>
                    <Field label="Email" required error={errors.email}>
                        <Input type="email" value={form.email} error={!!errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </Field>
                    <Field label="Role">
                        <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                            <option>Admin</option>
                            <option>Operator</option>
                            <option>Staff</option>
                        </Select>
                    </Field>
                </div>
            </Modal>

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={remove}
                title="Hapus pengguna?"
                message={`Pengguna "${confirm?.name}" akan dihapus dan kehilangan akses.`}
                confirmLabel="Hapus"
            />
        </AdminLayout>
    );
}
