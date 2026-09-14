<?php

namespace App\Http\Controllers\Api\Device;

use App\Enums\DeviceStatus;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Device\Concerns\ValidatesDeviceAccess;
use App\Http\Requests\Api\HeartbeatRequest;
use App\Http\Resources\DeviceResource;
use App\Models\Device;
use App\Services\DeviceEventService;
use Illuminate\Http\JsonResponse;

class HeartbeatController extends Controller
{
    use ValidatesDeviceAccess;

    /**
     * Touch the device presence and report a minimal status summary.
     */
    public function __invoke(HeartbeatRequest $request): JsonResponse
    {
        /** @var Device $device */
        $device = $this->deviceOrAbort($request);

        if (! $device->tokenCan('device:heartbeat')) {
            abort(403, 'Token tidak memiliki izin heartbeat.');
        }

        $versionChanged = $request->filled('app_version') && $request->input('app_version') !== $device->app_version;

        $device->update([
            'last_seen_at' => now(),
            'status' => DeviceStatus::ONLINE->value,
            'app_version' => $request->filled('app_version') ? $request->input('app_version') : $device->app_version,
            'device_identifier' => $request->filled('device_identifier') ? $request->input('device_identifier') : $device->device_identifier,
        ]);

        if ($versionChanged && $request->filled('app_version')) {
            DeviceEventService::appVersionChanged($device, $request->input('app_version'));
        }

        return response()->json([
            'device' => DeviceResource::make($device->load('project:id,name')),
            'project' => $device->project ? [
                'id' => $device->project->id,
                'name' => $device->project->name,
            ] : null,
            'server_time' => now()->toIso8601String(),
        ]);
    }
}