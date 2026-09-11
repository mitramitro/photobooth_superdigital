import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Ticket } from 'lucide-react';
import { PageHeader, Card, CardBody, EmptyState, Button } from '@/Components/ui';

export default function Index() {
    return (
        <AdminLayout title="Voucher">
            <Head title="Voucher - Photobooth Studio" />

            <PageHeader
                title="Voucher"
                description="Kode promo dan voucher yang bisa diterapkan pada transaksi photo booth Anda."
                icon={Ticket}
            />

            <Card>
                <CardBody className="p-0">
                    <EmptyState
                        icon={Ticket}
                        title="Voucher belum tersedia"
                        description="Fitur pembuatan dan pengelolaan voucher akan hadir pada fase berikutnya."
                        action={<Button disabled>Buat Voucher</Button>}
                    />
                </CardBody>
            </Card>
        </AdminLayout>
    );
}