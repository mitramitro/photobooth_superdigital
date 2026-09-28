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
            'project' => $project ? ProjectContextResource::project($project) : null,
            'experience' => $project && $projectAvailable && $project->experienceSetting
                ? ProjectContextResource::experience($project)
                : null,
            'runnable' => $projectAvailable,
            'server_time' => now()->toIso8601String(),
        ];
    }
}
