<?php

namespace Database\Factories;

use App\Enums\ProjectFilter;
use App\Enums\ProjectFrame;
use App\Enums\ProjectLayout;
use App\Enums\ProjectTimer;
use App\Models\Project;
use App\Models\ProjectExperienceSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectExperienceSetting>
 */
class ProjectExperienceSettingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'timer_seconds' => ProjectTimer::FIVE->value,
            'layout' => ProjectLayout::SINGLE->value,
            'frame' => ProjectFrame::NONE->value,
            'filter' => ProjectFilter::ORIGINAL->value,
            'brightness' => 0,
        ];
    }
}