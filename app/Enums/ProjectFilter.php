<?php

namespace App\Enums;

enum ProjectFilter: string
{
    case ORIGINAL = 'original';
    case WARM = 'warm';
    case COOL = 'cool';
    case BW = 'bw';
    case VINTAGE = 'vintage';

    /**
     * All allowed filter preset keys.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}