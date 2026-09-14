<?php

namespace App\Http\Controllers\Api\Device;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\Device\Concerns\ValidatesDeviceAccess;
use App\Http\Resources\DeviceConfigResource;
use App\Models\Device;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
    use ValidatesDeviceAccess;

    /**
     * Return the full runtime configuration for the paired device.
     */
    public function __invoke(Request $request): JsonResponse
    {
        /** @var Device $device */
        $device = $this->deviceOrAbort($request);

        if (! $device->tokenCan('device:config')) {
            abort(403, 'Token tidak memiliki izin konfigurasi.');
        }

        $device->load(['project:id,name,type,orientation,welcome_image,status', 'project.experienceSetting']);

        return response()->json(DeviceConfigResource::resolve($device, $device->project));
    }
}