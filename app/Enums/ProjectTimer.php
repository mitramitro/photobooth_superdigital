<?php

namespace App\Enums;

enum ProjectTimer: int
{
    case THREE = 3;
    case FIVE = 5;
    case TEN = 10;

    /**
     * All allowed timer values as an array of integers.
     *
     * @return array<int, int>
     */
    public static function values(): array
    {
        return array_map(fn (self $case) => $case->value, self::cases());
    }
}