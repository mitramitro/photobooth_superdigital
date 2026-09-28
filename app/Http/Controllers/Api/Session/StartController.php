<?php

namespace App\Http\Controllers\Api\Session;

use App\Enums\BoothSessionMode;
use App\Http\Controllers\Api\Device\Concerns\ValidatesDeviceAccess;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StartSessionRequest;
use App\Http\Resources\BoothSessionResource;
use App\Services\BoothSessionService;
use Illuminate\Http\JsonResponse;

class StartController extends Controller
{
    use ValidatesDeviceAccess;

    /**
     * Start a booth session and consume one voucher use atomically.
     *
     * This is the ONLY endpoint that consumes voucher usage. Validation itself
     * (POST /voucher/validate) stays a pure read, so a booth can check a code as
     * often as it likes without spending it.
     */
    public function __invoke(
        StartSessionRequest $request,
        BoothSessionService $sessions,
    ): JsonResponse {
        /** @var \App\Models\Device $device */
        $device = $this->deviceOrAbort($request);

        if (! $device->tokenCan('device:session')) {
            abort(403, 'Token tidak memiliki izin pengelolaan sesi.');
        }

        $result = $sessions->start(
            $device,
            (string) $request->validated('voucher_code'),
            $request->enum('mode', BoothSessionMode::class) ?? BoothSessionMode::SELF_SERVICE,
        );

        if (! $result['valid']) {
            return response()->json(
                BoothSessionResource::failure($result['reason'], $result['session'] ?? null),
            );
        }

        $session = $result['session'];
        $session->load('project.experienceSetting');

        return response()->json(
            BoothSessionResource::resolve($session, $result['voucher']),
            201,
        );
    }
}
