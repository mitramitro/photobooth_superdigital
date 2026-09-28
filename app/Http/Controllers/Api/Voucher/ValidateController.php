<?php

namespace App\Http\Controllers\Api\Voucher;

use App\Http\Controllers\Api\Device\Concerns\ValidatesDeviceAccess;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ValidateVoucherRequest;
use App\Models\Voucher;
use App\Services\VoucherService;
use Illuminate\Http\JsonResponse;

class ValidateController extends Controller
{
    use ValidatesDeviceAccess;

    /**
     * Validate a voucher against the calling device and its assigned project.
     *
     * This endpoint only checks the rules and never mutates the voucher:
     * no used_count increment, no last_used_at update and no booth session.
     */
    public function __invoke(ValidateVoucherRequest $request, VoucherService $service): JsonResponse
    {
        /** @var \App\Models\Device $device */
        $device = $this->deviceOrAbort($request);

        if (! $device->tokenCan('device:voucher')) {
            abort(403, 'Token tidak memiliki izin validasi voucher.');
        }

        $voucher = Voucher::query()
            ->with('project:id,name,status')
            ->where('code', $request->validated('code'))
            ->first();

        if (! $voucher) {
            return response()->json([
                'valid' => false,
                'reason' => 'not_found',
            ]);
        }

        return response()->json($service->validate($voucher, $device));
    }
}