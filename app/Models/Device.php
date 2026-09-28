<?php

namespace App\Models;

use App\Enums\DevicePlatform;
use App\Enums\DeviceStatus;
use Database\Factories\DeviceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'user_id',
    'project_id',
    'name',
    'device_code',
    'platform',
    'status',
    'last_seen_at',
    'app_version',
    'device_identifier',
    'paired_at',
    'revoked_at',
])]
class Device extends Authenticatable
{
    /** @use HasFactory<DeviceFactory> */
    use HasApiTokens;
    use HasFactory;

    /**
     * How many seconds without a heartbeat a paired device is still online.
     */
    public const ONLINE_THRESHOLD_SECONDS = 120;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'platform' => DevicePlatform::class,
            'status' => DeviceStatus::class,
            'last_seen_at' => 'datetime',
            'paired_at' => 'datetime',
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

    public function events(): HasMany
    {
        return $this->hasMany(DeviceEvent::class)->latest();
    }

    public function boothSessions(): HasMany
    {
        return $this->hasMany(BoothSession::class);
    }

    /**
     * Whether the device has been revoked by its owner.
     */
    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }

    /**
     * Whether the device is registered but not yet paired by the booth app.
     */
    public function isWaitingForPair(): bool
    {
        return $this->paired_at === null && $this->revoked_at === null;
    }

    /**
     * Whether the device has successfully completed pairing.
     */
    public function isPaired(): bool
    {
        return $this->paired_at !== null && ! $this->isRevoked();
    }

    /**
     * Derived presence based on the last heartbeat and the configured threshold.
     * Storage/source of truth is `last_seen_at`, not the raw status column.
     */
    public function isOnline(): bool
    {
        if (! $this->isPaired() || $this->last_seen_at === null) {
            return false;
        }

        $threshold = config('photobooth.device.online_threshold_seconds', self::ONLINE_THRESHOLD_SECONDS);

        return $this->last_seen_at->diffInSeconds(now()) <= $threshold;
    }

    /**
     * Pair lifecycle used by UI/API: waiting | paired | revoked.
     */
    public function pairStatus(): string
    {
        if ($this->isRevoked()) {
            return 'revoked';
        }

        return $this->isPaired() ? 'paired' : 'waiting';
    }

    /**
     * Presence shown to the UI. Online only when paired and recently seen.
     */
    public function displayStatus(): DeviceStatus
    {
        return $this->isOnline() ? DeviceStatus::ONLINE : DeviceStatus::OFFLINE;
    }

    /**
     * Sanity check used by the device API: a revoked (or token-less) device
     * is not allowed to use its endpoints anymore.
     */
    public function canCommunicate(): bool
    {
        return $this->isPaired() && ! $this->isRevoked();
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
            'name' => $this->name,
            'device_code' => $this->device_code,
            'platform' => $this->platform->value,
            'status' => $this->displayStatus()->value,
            'pair_status' => $this->pairStatus(),
            'last_seen_at' => $this->last_seen_at?->toIso8601String(),
            'app_version' => $this->app_version,
            'device_identifier' => $this->device_identifier,
            'paired_at' => $this->paired_at?->toIso8601String(),
            'revoked_at' => $this->revoked_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'project' => $this->project ? [
                'id' => $this->project->id,
                'name' => $this->project->name,
            ] : null,
        ];
    }
}