import { Monitor, Smartphone } from 'lucide-react';

export const PLATFORM_META = {
    android: { label: 'Android', icon: Smartphone },
    windows: { label: 'Windows', icon: Monitor },
};

export const DEVICE_STATUS_META = {
    online: { label: 'Online', tone: 'success' },
    offline: { label: 'Offline', tone: 'neutral' },
};

export const PAIR_STATUS_META = {
    waiting: { label: 'Menunggu', tone: 'info' },
    paired: { label: 'Terhubung', tone: 'success' },
    revoked: { label: 'Dicabut', tone: 'danger' },
};

export function platformLabel(platform) {
    return PLATFORM_META[platform]?.label ?? platform;
}

export function deviceStatusLabel(status) {
    return DEVICE_STATUS_META[status]?.label ?? status;
}

export function pairStatusLabel(pairStatus) {
    return PAIR_STATUS_META[pairStatus]?.label ?? pairStatus;
}

export function pairStatusTone(pairStatus) {
    return PAIR_STATUS_META[pairStatus]?.tone ?? 'neutral';
}

/**
 * Friendly Indonesian relative time for a device activity timestamp.
 */
export function timeAgo(iso) {
    if (!iso) return 'Belum pernah';

    const then = new Date(iso).getTime();
    const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));

    if (seconds < 45) return 'Aktif sekarang';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;

    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
}

export function formatDateTime(iso) {
    if (!iso) return '—';

    const date = new Date(iso);
    return date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}