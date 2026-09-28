import { Ticket } from 'lucide-react';

export const VOUCHER_STATUS_META = {
    active: { label: 'Aktif', tone: 'success' },
    used: { label: 'Terpakai', tone: 'warning' },
    expired: { label: 'Kadaluarsa', tone: 'neutral' },
    revoked: { label: 'Dicabut', tone: 'danger' },
};

export function voucherStatusLabel(status) {
    return VOUCHER_STATUS_META[status]?.label ?? status;
}

export function voucherStatusTone(status) {
    return VOUCHER_STATUS_META[status]?.tone ?? 'neutral';
}

export function usageLabel(voucher) {
    return `${voucher.used_count} / ${voucher.max_uses}`;
}

/**
 * Friendly Indonesian relative time for a voucher timestamp.
 */
export function timeAgo(iso) {
    if (!iso) return 'Belum pernah';

    const then = new Date(iso).getTime();
    const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));

    if (seconds < 45) return 'Baru saja';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;

    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
}

export function formatDateTime(iso) {
    if (!iso) return 'Tidak ada';

    const date = new Date(iso);
    return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatDateOnly(iso) {
    if (!iso) return 'Segera';

    const date = new Date(iso);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export { Ticket as VoucherIcon };