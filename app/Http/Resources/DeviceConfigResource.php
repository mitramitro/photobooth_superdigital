<?php

namespace App\Http\Resources;

use App\Enums\ProjectStatus;
use App\Models\Device;
use App\Models\Project;

/**
 * Resolves the runtime payload served to a paired device.
 */
class DeviceConfigResource
{
    /**
     * Build the config response for a device and its assigned project.
     */
    public static function resolve(Device $device, ?Project $project): array
    {
        $projectAvailable = $project !== null && $project->status === ProjectStatus::ACTIVE;

        return [
            'device' => [
                'id' => $device->id,
                'name' => $device->name,
                'platform' => $device->platform->value,
            ],
            'project' => $project ? [
                'id' => $project->id,
                'name' => $project->name,
                'type' => $project->type->value,
                'orientation' => $project->orientation->value,
                'welcome_image_url' => $project->welcome_image_url,
                'status' => $project->status->value,
                'available' => $projectAvailable,
            ] : null,
            'experience' => $projectAvailable && $project->experienceSetting
                ? [
                    'timer_seconds' => $project->experienceSetting->timer_seconds,
                    'layout' => $project->experienceSetting->layout->value,
                    'frame' => $project->experienceSetting->frame->value,
                    'filter' => $project->experienceSetting->filter->value,
                    'brightness' => $project->experienceSetting->brightness,
                ]
                : null,
            'runnable' => $projectAvailable,
            'server_time' => now()->toIso8601String(),
        ];
    }
}