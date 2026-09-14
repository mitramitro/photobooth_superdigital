<?php

namespace Database\Factories;

use App\Enums\DeviceEventType;
use App\Models\Device;
use App\Models\DeviceEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DeviceEvent>
 */
class DeviceEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'device_id' => Device::factory(),
            'event' => fake()->randomElement(DeviceEventType::cases())->value,
            'metadata' => null,
            'created_at' => now(),
        ];
    }

    public function event(DeviceEventType $type): static
    {
        return $this->state(['event' => $type->value]);
    }
}