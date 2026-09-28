<?php

namespace App\Services;

use App\Enums\BoothSessionMode;
use App\Enums\BoothSessionStatus;
use App\Models\BoothSession;
use App\Models\Device;
use App\Models\Project;
use App\Support\SessionCode;
use Illuminate\Support\Facades\DB;

class BoothSessionService
{
    /**
     * How many times a start is retried when the database reports a deadlock
     * or lock-wait timeout. Safe because the closure's only side effect is the
     * database work it performs.
     */
    private const TRANSACTION_ATTEMPTS = 3;

    public function __construct(private readonly VoucherService $vouchers) {}

    /**
     * Start a booth session, consuming one voucher use.
     *
     * A single transaction covers the whole operation. Lock order matters and
     * must stay device-first: locking the device serialises concurrent starts
     * from the same booth, and only then is the active-session check performed
     * so a second request cannot slip past it. The voucher is locked last, and
     * is never touched when the device already holds a running session.
     *
     * @return array{valid: true, session: BoothSession, voucher: \App\Models\Voucher}
     *         |array{valid: false, reason: string, session?: BoothSession}
     */
    public function start(Device $device, string $code, BoothSessionMode $mode): array
    {
        // Operator sessions are not part of the MVP and must never silently
        // become a voucher-free path.
        if ($mode === BoothSessionMode::OPERATOR) {
            return ['valid' => false, 'reason' => 'unsupported_mode'];
        }

        return DB::transaction(function () use ($device, $code, $mode) {
            $lockedDevice = Device::query()
                ->whereKey($device->id)
                ->lockForUpdate()
                ->first();

            if (! $lockedDevice || ! $lockedDevice->canCommunicate()) {
                return ['valid' => false, 'reason' => 'device_revoked'];
            }

            $existing = BoothSession::query()
                ->ownedBy($lockedDevice)
                ->active()
                ->first();

            if ($existing) {
                return [
                    'valid' => false,
                    'reason' => 'active_session_exists',
                    'session' => $existing,
                ];
            }

            $redemption = $this->vouchers->redeemLockedForDevice($lockedDevice, $code);

            if (! $redemption['valid']) {
                return ['valid' => false, 'reason' => $redemption['reason']];
            }

            $session = BoothSession::create([
                'session_code' => SessionCode::generateUnique(BoothSession::pluck('session_code')),
                'device_id' => $lockedDevice->id,
                'project_id' => $lockedDevice->project_id,
                'voucher_id' => $redemption['voucher']->id,
                'mode' => $mode->value,
                'status' => BoothSessionStatus::ACTIVE->value,
                'started_at' => now(),
            ]);

            return [
                'valid' => true,
                'session' => $session,
                'voucher' => $redemption['voucher'],
            ];
        }, self::TRANSACTION_ATTEMPTS);
    }

    /**
     * The device's single running session, if any. Read-only: no locks, no
     * writes, so the booth can call it on reload without side effects.
     */
    public function currentFor(Device $device): ?BoothSession
    {
        return BoothSession::query()
            ->ownedBy($device)
            ->active()
            ->first();
    }

    /**
     * The device's own session, never another device's.
     */
    public function findOwned(Device $device, int $sessionId): ?BoothSession
    {
        return BoothSession::query()
            ->ownedBy($device)
            ->whereKey($sessionId)
            ->first();
    }

    /**
     * Cancel a running session.
     *
     * Voucher usage is deliberately NOT refunded: the voucher already started
     * a session, and the refund/retry policy is a later decision. Cancelling
     * an already cancelled session is a no-op rather than an error, and a
     * finished session is never converted back to cancelled.
     *
     * @return array{session: BoothSession, changed: bool, reason: ?string}
     */
    public function cancel(BoothSession $session): array
    {
        if (! $session->isActive()) {
            return [
                'session' => $session,
                'changed' => false,
                'reason' => $session->status === BoothSessionStatus::CANCELLED
                    ? 'already_cancelled'
                    : 'session_not_cancellable',
            ];
        }

        $session->forceFill([
            'status' => BoothSessionStatus::CANCELLED->value,
            'cancelled_at' => now(),
        ])->save();

        return ['session' => $session, 'changed' => true, 'reason' => null];
    }

    /**
     * Project context attached to a session response.
     */
    public function projectFor(BoothSession $session): ?Project
    {
        return $session->project;
    }
}
