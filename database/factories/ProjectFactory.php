<?php

namespace Database\Factories;

use App\Enums\ProjectOrientation;
use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
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
            'name' => fake()->sentence(3),
            'type' => fake()->randomElement(ProjectType::cases())->value,
            'orientation' => fake()->randomElement(ProjectOrientation::cases())->value,
            'welcome_image' => null,
            'status' => fake()->randomElement([ProjectStatus::DRAFT, ProjectStatus::ACTIVE])->value,
        ];
    }
}