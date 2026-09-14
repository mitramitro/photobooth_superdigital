<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Device
    |--------------------------------------------------------------------------
    |
    | Threshold (in seconds) used to decide whether a paired device is
    | considered online based on its last heartbeat (`last_seen_at`).
    |
    */
    'device' => [
        'online_threshold_seconds' => (int) env('PHOTOBOOTH_DEVICE_ONLINE_THRESHOLD_SECONDS', 120),
    ],

    /*
    |--------------------------------------------------------------------------
    | Client Release Shells
    |--------------------------------------------------------------------------
    |
    | Placeholders used by the Download page. Point `url` at a real release
    | artifact when binaries are published; `enabled` gates the download
    | button while `version` is surfaced to the admin.
    |
    */
    'releases' => [
        'android' => [
            'label' => 'Android App',
            'version' => env('PHOTOBOOTH_ANDROID_VERSION', 'Belum tersedia'),
            'enabled' => (bool) env('PHOTOBOOTH_ANDROID_RELEASE_ENABLED', false),
            'url' => env('PHOTOBOOTH_ANDROID_RELEASE_URL'),
            'notes' => 'Paket APK akan diunggah setelah build rilis tersedia.',
        ],
        'windows' => [
            'label' => 'Windows App',
            'version' => env('PHOTOBOOTH_WINDOWS_VERSION', 'Belum tersedia'),
            'enabled' => (bool) env('PHOTOBOOTH_WINDOWS_RELEASE_ENABLED', false),
            'url' => env('PHOTOBOOTH_WINDOWS_RELEASE_URL'),
            'notes' => 'Installer Windows akan diunggah setelah build rilis tersedia.',
        ],
    ],
];