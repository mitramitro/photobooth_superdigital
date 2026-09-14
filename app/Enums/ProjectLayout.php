<?php

namespace App\Enums;

enum ProjectLayout: string
{
    case SINGLE = 'single';
    case DOUBLE_VERTICAL = 'double_vertical';
    case DOUBLE_HORIZONTAL = 'double_horizontal';
    case GRID_4 = 'grid_4';
    case STRIP_3 = 'strip_3';
    case STRIP_4 = 'strip_4';

    /**
     * All allowed layout keys.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}