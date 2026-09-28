<?php

namespace App\Models;

use App\Enums\BoothSessionMode;
use App\Enums\BoothSessionStatus;
use Database\Factories\BoothSessionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'session_code',
    'device_id',
    'project_id',
    'voucher_id',
    'mode',
    'status',
    'started_at',
    'completed_at',
    'cancelled_at',
])]
class BoothSession extends Model
{
    /** @use HasFactory<BoothSessionFactory> */
    use HasFactory;

    /**
     * Explicit so the table name never depends on Eloquent inflection.
     */
    protected $table = 'booth_sessions';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'mode' => BoothSessionMode::class,
            'status' => BoothSessionStatus::class,
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(Device::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function voucher(): BelongsTo
    {
        return $this->belongsTo(Voucher::class);
    }

    /**
     * The device is only allowed to hold a single running session.
     */
    public function isActive(): bool
    {
        return $this->status === BoothSessionStatus::ACTIVE;
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', BoothSessionStatus::ACTIVE->value);
    }

    /**
     * Ownership scope: a device may only ever reach its own sessions.
     */
    public function scopeOwnedBy(Builder $query, Device $device): Builder
    {
        return $query->where('device_id', $device->id);
    }
}
