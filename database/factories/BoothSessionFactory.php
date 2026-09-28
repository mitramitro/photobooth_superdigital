<?php

namespace Database\Factories;

use App\Enums\BoothSessionMode;
use App\Enums\BoothSessionStatus;
use App\Models\BoothSession;
use App\Models\Device;
use App\Models\Project;
use App\Models\Voucher;
use App\Support\SessionCode;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BoothSession>
 */
class BoothSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $project = Project::factory()->create();

        $device = Device::factory()->create(['project_id' => $project->id]);

        $voucher = Voucher::factory()->create([
            'user_id' => $project->user_id,
            'project_id' => $project->id,
        ]);

        return [
            'session_code' => SessionCode::generate(),
            'device_id' => $device->id,
            'project_id' => $project->id,
            'voucher_id' => $voucher->id,
            'mode' => BoothSessionMode::SELF_SERVICE->value,
            'status' => BoothSessionStatus::ACTIVE->value,
            'started_at' => now(),
            'completed_at' => null,
            'cancelled_at' => null,
        ];
    }

    /**
     * Running session — the only state a device may hold one of at a time.
     */
    public function active(): static
    {
        return $this->state([
            'status' => BoothSessionStatus::ACTIVE->value,
            'started_at' => now(),
            'completed_at' => null,
            'cancelled_at' => null,
        ]);
    }

    /**
     * Session the guest walked away from. Voucher usage stays consumed.
     */
    public function cancelled(): static
    {
        return $this->active()->state([
            'status' => BoothSessionStatus::CANCELLED->value,
            'cancelled_at' => now(),
        ]);
    }

    /**
     * Finished session (used from the photo/result flow, a later phase).
     */
    public function completed(): static
    {
        return $this->active()->state([
            'status' => BoothSessionStatus::COMPLETED->value,
            'completed_at' => now(),
        ]);
    }
}
