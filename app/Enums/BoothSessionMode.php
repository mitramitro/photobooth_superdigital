<?php

namespace App\Enums;

enum BoothSessionMode: string
{
    case SELF_SERVICE = 'self_service';
    case OPERATOR = 'operator';

    /**
     * All allowed mode keys.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
