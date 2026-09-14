<?php

namespace Database\Factories;

use App\Enums\DevicePlatform;
use App\Enums\DeviceStatus;
use App\Models\Device;
use App\Models\Project;
use App\Models\User;
use App\Support\DeviceCode;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Device>
 */
class DeviceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'project_id' => null,
            'name' => fake()->words(3, true),
            'device_code' => DeviceCode::generate(),
            'platform' => fake()->randomElement(DevicePlatform::cases())->value,
            'status' => DeviceStatus::OFFLINE->value,
            'last_seen_at' => null,
            'app_version' => null,
            'device_identifier' => null,
            'paired_at' => null,
            'revoked_at' => null,
        ];
    }

    public function android(): static
    {
        return $this->state(['platform' => DevicePlatform::ANDROID->value]);
    }

    public function windows(): static
    {
        return $this->state(['platform' => DevicePlatform::WINDOWS->value]);
    }

    public function assignedTo(?Project $project = null): static
    {
        return $this->state(['project_id' => $project?->id ?? Project::factory()]);
    }

    public function waitingForPair(): static
    {
        return $this->state([
            'paired_at' => null,
            'last_seen_at' => null,
            'status' => DeviceStatus::OFFLINE->value,
        ]);
    }

    public function paired(): static
    {
        return $this->state(fn () => [
            'paired_at' => now()->subDay(),
            'status' => DeviceStatus::ONLINE->value,
        ]);
    }

    public function seenRecently(): static
    {
        return $this->paired()->state(['last_seen_at' => now()->subSeconds(30)]);
    }

    public function seenLongAgo(): static
    {
        return $this->paired()->state(['last_seen_at' => now()->subHours(5)]);
    }

    public function revoked(): static
    {
        return $this->paired()->state([
            'revoked_at' => now()->subHour(),
            'status' => DeviceStatus::OFFLINE->value,
        ]);
    }
}