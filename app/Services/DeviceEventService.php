<?php

namespace App\Services;

use App\Enums\DeviceEventType;
use App\Models\Device;
use App\Models\DeviceEvent;

/**
 * Central helper for recording significant device lifecycle events.
 *
 * Heartbeats must NOT be persisted here — presence is derived from
 * `devices.last_seen_at` and the configured online threshold.
 */
class DeviceEventService
{
    /**
     * @param  array<string, mixed>  $metadata
     */
    public static function log(Device $device, DeviceEventType $event, array $metadata = []): DeviceEvent
    {
        return DeviceEvent::create([
            'device_id' => $device->id,
            'event' => $event,
            'metadata' => $metadata,
        ]);
    }

    public static function created(Device $device): void
    {
        self::log($device, DeviceEventType::CREATED);
    }

    public static function paired(Device $device): void
    {
        self::log($device, DeviceEventType::PAIRED);
    }

    public static function projectChanged(Device $device, ?int $projectId, ?string $projectName): void
    {
        self::log(
            $device,
            $projectId === null ? DeviceEventType::PROJECT_UNASSIGNED : DeviceEventType::PROJECT_ASSIGNED,
            ['project_id' => $projectId, 'project_name' => $projectName],
        );
    }

    public static function revoked(Device $device): void
    {
        self::log($device, DeviceEventType::REVOKED);
    }

    public static function appVersionChanged(Device $device, string $version): void
    {
        self::log($device, DeviceEventType::APP_VERSION_CHANGED, ['app_version' => $version]);
    }
}