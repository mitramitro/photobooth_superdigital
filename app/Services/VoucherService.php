<?php

namespace App\Services;

use App\Enums\ProjectStatus;
use App\Enums\VoucherStatus;
use App\Models\Device;
use App\Models\Voucher;
use App\Support\VoucherCode;

class VoucherService
{
    /**
     * Generate a unique voucher code using a secure random source.
     */
    public function generateUniqueCode(): string
    {
        return VoucherCode::generateUnique(Voucher::pluck('code'));
    }

    /**
     * Effective status derived from business rules, never the raw column.
     */
    public function effectiveStatus(Voucher $voucher): string
    {
        return $voucher->effectiveStatus();
    }

    /**
     * Remaining uses before exhaustion.
     */
    public function remainingUses(Voucher $voucher): int
    {
        return $voucher->remainingUses();
    }

    /**
     * Validate a voucher against the business rules for a given device.
     *
     * Validation is a pure read: no usage is incremented, no last_used_at is
     * touched and no session is created. Phase 6 will add an atomic redeem()
     * wrapped in DB::transaction + lockForUpdate on top of this service.
     *
     * @return array<string, mixed>
     */
    public function validate(Voucher $voucher, ?Device $device): array
    {
        if ($voucher->revoked_at !== null) {
            return $this->invalid('revoked');
        }

        if ($voucher->valid_from !== null && $voucher->valid_from->isFuture()) {
            return $this->invalid('not_started');
        }

        if ($voucher->expires_at !== null && $voucher->expires_at->isPast()) {
            return $this->invalid('expired');
        }

        if ($voucher->used_count >= $voucher->max_uses) {
            return $this->invalid('used');
        }

        $project = $device?->project;

        if (! $device || $project === null) {
            return $this->invalid('device_unassigned');
        }

        if ($project->status !== ProjectStatus::ACTIVE) {
            return $this->invalid('project_inactive');
        }

        if ($voucher->project_id !== $project->id) {
            return $this->invalid('project_mismatch');
        }

        return [
            'valid' => true,
            'voucher' => [
                'code' => $voucher->code,
                'remaining_uses' => $voucher->remainingUses(),
                'expires_at' => $voucher->expires_at?->toDateString(),
                'project_id' => $voucher->project_id,
            ],
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
            ],
        ];
    }

    /**
     * Machine-readable business invalidity result. Terminal auth failures
     * (401/403) are not part of this contract.
     *
     * @return array{valid: bool, reason: string}
     */
    private function invalid(string $reason): array
    {
        return [
            'valid' => false,
            'reason' => $reason,
        ];
    }
}