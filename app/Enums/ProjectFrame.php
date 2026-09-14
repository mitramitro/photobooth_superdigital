<?php

namespace App\Enums;

enum ProjectFrame: string
{
    case NONE = 'none';
    case POLAROID = 'polaroid';
    case FILM_STRIP = 'film_strip';
    case CLASSIC = 'classic';
    case WEDDING = 'wedding';
    case BIRTHDAY = 'birthday';

    /**
     * All allowed frame preset keys.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}