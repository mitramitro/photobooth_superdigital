import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Settings as SettingsIcon, Building2, Camera, Printer, Image as ImageIcon, Bell, KeyRound, Save } from 'lucide-react';
import {
    PageHeader,
    Card,
    CardHeader,
    CardBody,
    Button,
    Field,
    Input,
    Select,
    Switch,
    FormSection,
    useToast,
} from '@/Components/ui';

const sections = [
    { id: 'general', label: 'Umum', icon: Building2 },
    { id: 'photobooth', label: 'Photobooth', icon: Camera },
    { id: 'printing', label: 'Percetakan', icon: Printer },
    { id: 'gallery', label: 'Galeri', icon: ImageIcon },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'api', label: 'API', icon: KeyRound },
];

export default function Index() {
    const { toast } = useToast();
    const [active, setActive] = useState('general');

    const notify = (title, msg) =>
        toast({ tone: 'success', title, message: msg });

    const renderSection = () => {
        switch (active) {
            case 'general':
                return (
                    <FormSection title="Informasi Workspace" description="Identitas dasar untuk ruang kerja Anda.">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field label="Nama Workspace">
                                <Input defaultValue="Photobooth Studio" />
                            </Field>
                            <Field label="Domain" hint="Digunakan untuk link publik.">
                                <Input defaultValue="studio.photobooth.id" />
                            </Field>
                        </div>
                        <Field label="Zona Waktu">
                            <Select defaultValue="Asia/Jakarta">
                                <option>Asia/Jakarta</option>
                                <option>Asia/Makassar</option>
                                <option>Asia/Shanghai</option>
                            </Select>
                        </Field>
                        <Field label="Mata uang">
                            <Select defaultValue="IDR">
                                <option>IDR</option>
                                <option>USD</option>
                                <option>SGD</option>
                            </Select>
                        </Field>
                    </FormSection>
                );
            case 'photobooth':
                return (
                    <FormSection title="Konfigurasi Photobooth" description="Nilai default untuk penangkapan foto.">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field label="Timer default (detik)">
                                <Select defaultValue="5"><option value="3">3</option><option value="5">5</option><option value="10">10</option></Select>
                            </Field>
                            <Field label="Jumlah frame per strip">
                                <Select defaultValue="4"><option value="2">2</option><option value="3">3</option><option value="4">4</option></Select>
                            </Field>
                        </div>
                        <div className="space-y-3">
                            <Switch
                                label="Izinkan ulang foto (retake)"
                                description="Pelanggan dapat mengulang sesi foto jika tidak puas."
                                checked
                                onChange={() => {}}
                            />
                            <Switch
                                label="Mode selfie otomatis"
                                description="Aktifkan sesi tanpa bantuan operator."
                                checked={false}
                                onChange={() => {}}
                            />
                        </div>
                    </FormSection>
                );
            case 'printing':
                return (
                    <FormSection title="Percetakan" description="Preferensi output cetak photo strip.">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field label="Kualitas cetak">
                                <Select defaultValue="high"><option value="draft">Draft</option><option value="high">High</option><option value="best">Best</option></Select>
                            </Field>
                            <Field label="Jenis kertas">
                                <Select defaultValue="glossy"><option value="glossy">Glossy</option><option value="matte">Matte</option></Select>
                            </Field>
                        </div>
                        <Switch
                            label="Cetak otomatis"
                            description="Cetak strip otomatis setelah sesi selesai."
                            checked
                            onChange={() => {}}
                        />
                    </FormSection>
                );
            case 'gallery':
                return (
                    <FormSection title="Galeri & Berbagi" description="Pengaturan akses galeri hasil foto.">
                        <Field label="Mode galeri">
                            <Select defaultValue="public">
                                <option value="public">Publik (link + QR)</option>
                                <option value="private">Privat</option>
                            </Select>
                        </Field>
                        <div className="space-y-3">
                            <Switch label="Izinkan unduhan" description="Pelanggan dapat mengunduh hasil foto." checked onChange={() => {}} />
                            <Switch label="Aktifkan QR mobile" description="Tampilkan QR untuk akses mobile." checked={false} onChange={() => {}} />
                        </div>
                    </FormSection>
                );
            case 'notifications':
                return (
                    <FormSection title="Notifikasi" description="Atur bagaimana Anda diberi tahu.">
                        <div className="space-y-3">
                            <Switch label="Perangkat offline" description="Diberi tahu saat perangkat putus koneksi." checked onChange={() => {}} />
                            <Switch label="Transaksi baru" description="Diberi tahu setiap ada penjualan." checked onChange={() => {}} />
                            <Switch label="Rundown penyimpanan" description="Diberi tahu saat penyimpanan hampir penuh." checked={false} onChange={() => {}} />
                        </div>
                    </FormSection>
                );
            case 'api':
                return (
                    <FormSection title="API & Integrasi" description="Kelola kunci API dan integrasi eksternal.">
                        <Field label="Base URL API">
                            <Input defaultValue="https://api.photobooth.id/v1" />
                        </Field>
                        <Card className="border-brand/30 bg-brand-subtle/50">
                            <CardBody className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <KeyRound className="h-5 w-5 text-brand" />
                                    <div>
                                        <p className="text-sm font-semibold text-ink">Sanctum API</p>
                                        <p className="text-xs text-ink-muted">Kelola token akses untuk aplikasi mobile.</p>
                                    </div>
                                </div>
                                <Button variant="secondary" size="sm" onClick={() => (window.location.href = '/admin/api-tokens')}>
                                    Kelola Token
                                </Button>
                            </CardBody>
                        </Card>
                    </FormSection>
                );
            default:
                return null;
        }
    };

    return (
        <AdminLayout title="Pengaturan">
            <Head title="Pengaturan - Photobooth Studio" />

            <PageHeader
                title="Pengaturan"
                description="Konfigurasi platform dan preferensi workspace Anda."
                icon={SettingsIcon}
            />

            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Section nav */}
                <nav className="w-full lg:w-56 shrink-0">
                    <div className="flex gap-1 overflow-x-auto lg:flex-col">
                        {sections.map((s) => {
                            const Icon = s.icon;
                            const isActive = active === s.id;
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setActive(s.id)}
                                    className={`inline-flex shrink-0 items-center gap-2.5 rounded-input px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                                        isActive ? 'bg-brand-subtle text-brand-dark' : 'text-ink-muted hover:bg-slate-100 hover:text-ink'
                                    }`}
                                >
                                    <Icon className={`h-4 w-4 ${isActive ? 'text-brand' : 'text-ink-faint'}`} />
                                    {s.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Content */}
                <Card className="flex-1">
                    <CardBody className="space-y-6">{renderSection()}</CardBody>
                    <div className="flex justify-end border-t border-edge px-5 py-4">
                        <Button
                            icon={Save}
                            onClick={() => notify('Pengaturan disimpan', `Pengaturan bagian ${sections.find((s) => s.id === active)?.label} berhasil disimpan.`)}
                        >
                            Simpan Perubahan
                        </Button>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
}
