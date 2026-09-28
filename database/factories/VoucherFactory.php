<?php

namespace Database\Factories;

use App\Enums\ProjectStatus;
use App\Enums\VoucherStatus;
use App\Models\Project;
use App\Models\User;
use App\Models\Voucher;
use App\Support\VoucherCode;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Voucher>
 */
class VoucherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $project = Project::factory()->create(['status' => ProjectStatus::ACTIVE->value]);

        return [
            'user_id' => $project->user_id,
            'project_id' => $project->id,
            'code' => VoucherCode::generate(),
            'status' => VoucherStatus::ACTIVE->value,
            'max_uses' => 1,
            'used_count' => 0,
            'valid_from' => null,
            'expires_at' => null,
            'last_used_at' => null,
            'revoked_at' => null,
        ];
    }

    /**
     * Voucher that can be redeemed today (no restrictions).
     */
    public function active(): static
    {
        return $this->state([
            'status' => VoucherStatus::ACTIVE->value,
            'valid_from' => null,
            'expires_at' => null,
            'used_count' => 0,
            'revoked_at' => null,
        ]);
    }

    /**
     * Voucher that expired in the past.
     */
    public function expired(): static
    {
        return $this->state([
            'status' => VoucherStatus::EXPIRED->value,
            'valid_from' => now()->subDays(10)->toDateString(),
            'expires_at' => now()->subDay()->toDateString(),
            'used_count' => 0,
            'revoked_at' => null,
        ]);
    }

    /**
     * Voucher that has been revoked by its owner.
     */
    public function revoked(): static
    {
        return $this->state([
            'status' => VoucherStatus::REVOKED->value,
            'revoked_at' => now()->subHour(),
        ]);
    }

    /**
     * Voucher exhausted by usage (single-use exhaustion by default; pass
     * max_uses + used_count explicitly for multi-use exhaustion).
     */
    public function used(): static
    {
        return $this->state([
            'status' => VoucherStatus::USED->value,
            'used_count' => 1,
            'last_used_at' => now()->subHour(),
            'revoked_at' => null,
        ]);
    }
}