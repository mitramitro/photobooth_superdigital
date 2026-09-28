<?php

namespace App\Http\Controllers\Api\Session;

use App\Http\Controllers\Api\Device\Concerns\ValidatesDeviceAccess;
use App\Http\Controllers\Controller;
use App\Http\Resources\BoothSessionResource;
use App\Services\BoothSessionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CurrentController extends Controller
{
    use ValidatesDeviceAccess;

    /**
     * The device's current session, for reload and crash recovery.
     *
     * Read-only and idempotent: safe for the booth to poll on every mount.
     */
    public function __invoke(Request $request, BoothSessionService $sessions): JsonResponse
    {
        /** @var \App\Models\Device $device */
        $device = $this->deviceOrAbort($request);

        if (! $device->tokenCan('device:session')) {
            abort(403, 'Token tidak memiliki izin pengelolaan sesi.');
        }

        $session = $sessions->currentFor($device);

        if (! $session) {
            return response()->json([
                'valid' => true,
                'session' => null,
                'project' => null,
                'experience' => null,
                'voucher' => null,
            ]);
        }

        $session->load('project.experienceSetting');

        return response()->json(BoothSessionResource::resolve($session));
    }
}
