<?php

namespace App\Http\Controllers\Api\Session;

use App\Http\Controllers\Api\Device\Concerns\ValidatesDeviceAccess;
use App\Http\Controllers\Controller;
use App\Http\Resources\BoothSessionResource;
use App\Services\BoothSessionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CancelController extends Controller
{
    use ValidatesDeviceAccess;

    /**
     * Cancel a running session owned by the calling device.
     *
     * Ownership is re-checked server-side against the device_id, never trusted
     * from the route id: another device gets a 404 so the existence of a
     * foreign session is never disclosed.
     *
     * Voucher usage is NOT refunded. The voucher already started a session, and
     * the refund/retry policy is a later decision.
     */
    public function __invoke(
        Request $request,
        BoothSessionService $sessions,
        int $session,
    ): JsonResponse {
        /** @var \App\Models\Device $device */
        $device = $this->deviceOrAbort($request);

        if (! $device->tokenCan('device:session')) {
            abort(403, 'Token tidak memiliki izin pengelolaan sesi.');
        }

        $boothSession = $sessions->findOwned($device, $session);

        if (! $boothSession) {
            abort(404, 'Sesi tidak ditemukan.');
        }

        $result = $sessions->cancel($boothSession);

        return response()->json([
            'valid' => true,
            'session' => BoothSessionResource::session($result['session']),
            'cancelled' => $result['changed'],
            'reason' => $result['reason'],
        ]);
    }
}
