<?php

namespace App\Http\Controllers\Api\Device\Concerns;

use App\Models\Device;
use Illuminate\Http\Request;

trait ValidatesDeviceAccess
{
    /**
     * Resolve the authenticated device, rejecting anything that is not a
     * valid pairing: non-device tokens, or revoked devices.
     */
    protected function deviceOrAbort(Request $request): Device
    {
        $device = $request->user();

        if (! $device instanceof Device) {
            abort(401, 'Token perangkat tidak valid.');
        }

        if (! $device->canCommunicate()) {
            abort(403, 'Perangkat telah dicabut dan tidak dapat berkomunikasi.');
        }

        return $device;
    }
}