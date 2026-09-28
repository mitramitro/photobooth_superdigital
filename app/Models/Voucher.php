<?php

namespace App\Models;

use App\Enums\VoucherStatus;
use Database\Factories\VoucherFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id',
    'project_id',
    'code',
    'status',
    'max_uses',
    'used_count',
    'valid_from',
    'expires_at',
    'last_used_at',
    'revoked_at',
])]
class Voucher extends Model
{
    /** @use HasFactory<VoucherFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => VoucherStatus::class,
            'max_uses' => 'integer',
            'used_count' => 'integer',
            'valid_from' => 'date',
            'expires_at' => 'date',
            'last_used_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function boothSessions(): HasMany
    {
        return $this->hasMany(BoothSession::class);
    }

    /**
     * Effective status computed from business rules instead of trusting the
     * stored column: revoked > expired > used > active.
     */
    public function effectiveStatus(): string
    {
        if ($this->revoked_at !== null) {
            return VoucherStatus::REVOKED->value;
        }

        if ($this->expires_at !== null && $this->expires_at->isPast()) {
            return VoucherStatus::EXPIRED->value;
        }

        if ($this->used_count >= $this->max_uses) {
            return VoucherStatus::USED->value;
        }

        return VoucherStatus::ACTIVE->value;
    }

    /**
     * Remaining uses before the voucher is exhausted.
     */
    public function remainingUses(): int
    {
        return max(0, $this->max_uses - $this->used_count);
    }

    /**
     * Whether the voucher can still be redeemed: effective status active and,
     * when a start date exists, the voucher period has started.
     */
    public function isUsable(): bool
    {
        if ($this->effectiveStatus() !== VoucherStatus::ACTIVE->value) {
            return false;
        }

        return $this->valid_from === null || $this->valid_from->isPast();
    }

    /**
     * Filter vouchers by their computed effective status.
     */
    public function scopeEffectiveStatus(Builder $query, string $status): Builder
    {
        return match ($status) {
            'active' => $query
                ->whereNull('revoked_at')
                ->where(fn (Builder $q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
                ->whereColumn('used_count', '<', 'max_uses'),
            'used' => $query
                ->whereNull('revoked_at')
                ->where(fn (Builder $q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
                ->whereColumn('used_count', '>=', 'max_uses'),
            'expired' => $query
                ->whereNull('revoked_at')
                ->where('expires_at', '<=', now()),
            'revoked' => $query->whereNotNull('revoked_at'),
            default => $query,
        };
    }

    /**
     * Derived shape consumed by the Inertia admin pages.
     *
     * @return array<string, mixed>
     */
    public function toAdminArray(): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'status' => $this->effectiveStatus(),
            'max_uses' => $this->max_uses,
            'used_count' => $this->used_count,
            'remaining_uses' => $this->remainingUses(),
            'valid_from' => $this->valid_from?->toDateString(),
            'expires_at' => $this->expires_at?->toDateString(),
            'last_used_at' => $this->last_used_at?->toIso8601String(),
            'revoked_at' => $this->revoked_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'project' => $this->project ? [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ] : null,
        ];
    }
}