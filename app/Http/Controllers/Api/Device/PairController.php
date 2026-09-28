<?php

namespace App\Http\Controllers\Api\Device;

use App\Enums\DevicePlatform;
use App\Enums\DeviceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\PairDeviceRequest;
use App\Http\Resources\DeviceResource;
use App\Models\Device;
use App\Services\DeviceEventService;
use Illuminate\Http\JsonResponse;

class PairController extends Controller
{
    /**
     * Pair a registered device via its pairing code and issue a device token.
     */
    public function __invoke(PairDeviceRequest $request): JsonResponse
    {
        $device = Device::where('device_code', $request->input('device_code'))->first();

        if (! $device) {
            return $this->fail(
                'Kode perangkat tidak valid atau belum terdaftar.',
                'device_code',
            );
        }

        if ($device->isRevoked()) {
            return $this->fail(
                'Perangkat ini telah dicabut dan tidak dapat dipakai ulang.',
                'device_code',
                403,
            );
        }

        if ($device->paired_at !== null) {
            return $this->fail(
                'Perangkat ini sudah dipairing. Putuskan perangkat untuk memulai pairing ulang.',
                'device_code',
                409,
            );
        }

        if ($device->platform !== $request->enum('platform', DevicePlatform::class)) {
            return $this->fail(
                'Platform tidak cocok dengan pendaftaran perangkat.',
                'platform',
            );
        }

        $device->update([
            'paired_at' => now(),
            'status' => DeviceStatus::ONLINE->value,
            'last_seen_at' => now(),
            'app_version' => $request->filled('app_version') ? $request->input('app_version') : $device->app_version,
            'device_identifier' => $request->filled('device_identifier') ? $request->input('device_identifier') : $device->device_identifier,
        ]);

        DeviceEventService::paired($device);

        $token = $device->createToken('device-pair', ['device:heartbeat', 'device:config', 'device:voucher']);

        return response()->json([
            'message' => 'Pairing berhasil.',
            'token' => $token->plainTextToken,
            'token_type' => 'Bearer',
            'device' => DeviceResource::make($device->load('project:id,name')),
        ]);
    }

    private function fail(string $message, string $field, int $status = 422): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'errors' => [$field => [$message]],
        ], $status);
    }
}