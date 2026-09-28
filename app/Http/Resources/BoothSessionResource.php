<?php

namespace App\Http\Resources;

use App\Models\BoothSession;
use App\Models\Project;
use App\Models\Voucher;

/**
 * Device-facing booth session payload.
 *
 * Deliberately narrow: the booth only needs a code it can show, its state and
 * the project context to render. No user, owner, token, revocation or
 * internal counters are exposed here.
 */
class BoothSessionResource
{
    /**
     * @return array<string, mixed>
     */
    public static function session(BoothSession $session): array
    {
        return [
            'id' => $session->id,
            'code' => $session->session_code,
            'status' => $session->status->value,
            'mode' => $session->mode->value,
            'started_at' => $session->started_at?->toIso8601String(),
        ];
    }

    /**
     * Full start/current payload: session plus the project it runs and the
     * experience configuration to apply.
     *
     * @return array<string, mixed>
     */
    public static function resolve(BoothSession $session, ?Voucher $voucher = null): array
    {
        return [
            'valid' => true,
            'session' => self::session($session),
            'project' => self::project($session->project),
            'experience' => self::experience($session->project),
            'voucher' => $voucher ? [
                'remaining_uses' => $voucher->remainingUses(),
            ] : null,
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function project(?Project $project): ?array
    {
        return $project ? ProjectContextResource::project($project) : null;
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function experience(?Project $project): ?array
    {
        return $project ? ProjectContextResource::experience($project) : null;
    }

    /**
     * Machine-readable business failure, shaped exactly like the voucher
     * validation contract. When a running session is what blocks the start,
     * its safe representation travels with the reason so the booth can resume
     * instead of showing a dead end.
     *
     * @return array<string, mixed>
     */
    public static function failure(string $reason, ?BoothSession $session = null): array
    {
        return [
            'valid' => false,
            'reason' => $reason,
            'session' => $session ? self::session($session) : null,
        ];
    }
}
