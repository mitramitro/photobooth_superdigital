<?php

namespace App\Enums;

enum DeviceStatus: string
{
    case ONLINE = 'online';
    case OFFLINE = 'offline';

    /**
     * All allowed status keys.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}