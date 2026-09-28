<?php

namespace App\Support;

/**
 * Generates human-friendly, cryptographically secure voucher codes.
 */
class VoucherCode
{
    public const PREFIX = 'VCR';

    /**
     * Alphabet without confusable characters (0/O, 1/I/L).
     */
    private const ALPHABET = 'ABCDFGHJKLMNPRSTVWXYZ23456789';

    public const LENGTH = 8;

    /**
     * Generate a voucher code in the shape "VCR-XXXX-XXXX".
     */
    public static function generate(): string
    {
        $random = self::randomString(self::LENGTH);

        return self::PREFIX.'-'.substr($random, 0, 4).'-'.substr($random, 4);
    }

    /**
     * Build a code guaranteed to be unique against an existing set of codes.
     *
     * @param  iterable<string>  $existing  codes already in use (retried until free)
     */
    public static function generateUnique(iterable $existing): string
    {
        $existing = is_array($existing) ? $existing : iterator_to_array($existing, false);
        $taken = array_flip($existing);

        do {
            $code = self::generate();
        } while (isset($taken[$code]));

        return $code;
    }

    private static function randomString(int $length): string
    {
        $alphabet = self::ALPHABET;
        $alphabetLength = strlen($alphabet);

        $result = '';
        $bytes = random_bytes($length);

        for ($i = 0; $i < $length; $i++) {
            $index = ord($bytes[$i]) % $alphabetLength;
            $result .= $alphabet[$index];
        }

        return $result;
    }
}