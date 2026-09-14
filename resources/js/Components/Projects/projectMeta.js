export const PROJECT_TYPE_LABELS = {
    retail: 'Photobox Retail',
    event: 'Photobox Event',
    self: 'Photobox Self',
};

export const PROJECT_TYPE_DESCRIPTIONS = {
    retail: 'Cocok untuk lokasi permanen seperti mall, cafe, store, atau area self-service publik.',
    event: 'Cocok untuk wedding, corporate event, festival, booth activation, dan event dengan traffic tinggi.',
    self: 'Cocok untuk pengalaman self-service sederhana dan fleksibel.',
};

export const PROJECT_STATUS_LABELS = {
    draft: 'Draf',
    active: 'Aktif',
    inactive: 'Nonaktif',
};

export const PROJECT_STATUS_TONES = {
    draft: 'neutral',
    active: 'success',
    inactive: 'neutral',
};

export const PROJECT_ORIENTATION_LABELS = {
    portrait: 'Portrait',
    landscape: 'Landscape',
};

export const projectTypeLabel = (type) => PROJECT_TYPE_LABELS[type] ?? type;
export const projectStatusLabel = (status) => PROJECT_STATUS_LABELS[status] ?? status;
export const projectOrientationLabel = (orientation) => PROJECT_ORIENTATION_LABELS[orientation] ?? orientation;