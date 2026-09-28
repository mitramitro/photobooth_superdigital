<?php

namespace App\Enums;

enum VoucherStatus: string
{
    case ACTIVE = 'active';
    case USED = 'used';
    case EXPIRED = 'expired';
    case REVOKED = 'revoked';

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