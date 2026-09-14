export const TIMER_OPTIONS = [
    { value: 3, short: '3 s', label: '3 detik', description: 'Cepat & spontan — cocok untuk sesi ramai.' },
    { value: 5, short: '5 s', label: '5 detik', description: 'Seimbang untuk individu maupun pasangan.' },
    { value: 10, short: '10 s', label: '10 detik', description: 'Ideal untuk grup atau pose berantai.' },
];

export const LAYOUT_OPTIONS = [
    { value: 'single', label: '1 Foto' },
    { value: 'double_vertical', label: '2 Vertikal' },
    { value: 'double_horizontal', label: '2 Horizontal' },
    { value: 'grid_4', label: '4 Foto' },
    { value: 'strip_3', label: 'Strip 3' },
    { value: 'strip_4', label: 'Strip 4' },
];

export const FRAME_OPTIONS = [
    { value: 'none', label: 'Tanpa Frame' },
    { value: 'polaroid', label: 'Polaroid' },
    { value: 'film_strip', label: 'Film Strip' },
    { value: 'classic', label: 'Classic' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'birthday', label: 'Birthday' },
];

export const FILTER_OPTIONS = [
    { value: 'original', label: 'Original', swatch: 'linear-gradient(135deg,#cbd5e1,#f1f5f9)' },
    { value: 'warm', label: 'Warm', swatch: 'linear-gradient(135deg,#f59e0b,#fcd34d)' },
    { value: 'cool', label: 'Cool', swatch: 'linear-gradient(135deg,#3b82f6,#67e8f9)' },
    { value: 'bw', label: 'Hitam Putih', swatch: 'linear-gradient(135deg,#111827,#9ca3af)' },
    { value: 'vintage', label: 'Vintage', swatch: 'linear-gradient(135deg,#92400e,#d6bfa3)' },
];

export const FILTER_CSS = {
    original: 'none',
    warm: 'sepia(0.3) saturate(1.2)',
    cool: 'saturate(0.95) hue-rotate(10deg)',
    bw: 'grayscale(1)',
    vintage: 'sepia(0.5) contrast(0.95)',
};

/**
 * Combined CSS filter string for the device preview.
 */
export function previewFilter(values) {
    const base = FILTER_CSS[values.filter] ?? 'none';
    const brightness = Number(values.brightness) || 0;
    const brightnessCss = `brightness(${(100 + brightness) / 100})`;
    return base === 'none' ? brightnessCss : `${base} ${brightnessCss}`;
}

// ── Layout cell geometry (percentage) ───────────────────────────────────────
const cell = (x, y, w, h) => ({ x, y, w, h });

export function layoutCells(layout) {
    switch (layout) {
        case 'double_vertical':
            return [cell(3, 3, 45.5, 94), cell(51.5, 3, 45.5, 94)];
        case 'double_horizontal':
            return [cell(3, 3, 94, 45.5), cell(3, 51.5, 94, 45.5)];
        case 'grid_4':
            return [cell(3, 3, 45.5, 45.5), cell(51.5, 3, 45.5, 45.5), cell(3, 51.5, 45.5, 45.5), cell(51.5, 51.5, 45.5, 45.5)];
        case 'strip_3':
            return [cell(3, 10, 29.33, 80), cell(35.33, 10, 29.33, 80), cell(67.67, 10, 29.33, 80)];
        case 'strip_4':
            return [cell(3, 10, 21.25, 80), cell(27.25, 10, 21.25, 80), cell(51.5, 10, 21.25, 80), cell(75.75, 10, 21.25, 80)];
        case 'single':
        default:
            return [cell(8, 8, 84, 84)];
    }
}

export const brightnessLabel = (value) => {
    const v = Number(value) || 0;
    if (v <= -40) return 'Gelap';
    if (v >= 40) return 'Terang';
    return 'Normal';
};

export const findOption = (options, value) => options.find((o) => o.value === value);
