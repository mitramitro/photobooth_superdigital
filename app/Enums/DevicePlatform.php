<?php

namespace App\Enums;

enum DevicePlatform: string
{
    case ANDROID = 'android';
    case WINDOWS = 'windows';

    /**
     * All allowed platform keys.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label(): string
    {
        return match ($this) {
            self::ANDROID => 'Android',
            self::WINDOWS => 'Windows',
        };
    }
}