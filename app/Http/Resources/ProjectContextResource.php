<?php

namespace App\Http\Resources;

use App\Enums\ProjectStatus;
use App\Models\Project;

/**
 * Shared project + experience payload for device-facing endpoints.
 *
 * Extracted so the device config endpoint and the session endpoints describe a
 * project the exact same way and a booth never has to interpret two shapes.
 */
class ProjectContextResource
{
    /**
     * @return array<string, mixed>
     */
    public static function project(Project $project): array
    {
        return [
            'id' => $project->id,
            'name' => $project->name,
            'type' => $project->type->value,
            'orientation' => $project->orientation->value,
            'welcome_image_url' => $project->welcome_image_url,
            'status' => $project->status->value,
            'available' => self::isAvailable($project),
        ];
    }

    /**
     * Experience settings, only exposed while the project is active: a draft
     * project must not leak its photography configuration to a booth.
     *
     * @return array<string, mixed>|null
     */
    public static function experience(Project $project): ?array
    {
        if (! self::isAvailable($project) || ! $project->experienceSetting) {
            return null;
        }

        $experience = $project->experienceSetting;

        return [
            'timer_seconds' => $experience->timer_seconds,
            'layout' => $experience->layout->value,
            'frame' => $experience->frame->value,
            'filter' => $experience->filter->value,
            'brightness' => $experience->brightness,
        ];
    }

    public static function isAvailable(Project $project): bool
    {
        return $project->status === ProjectStatus::ACTIVE;
    }
}
