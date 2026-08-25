<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Mobile & Kiosk Sanctum API Routes (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public Mobile Authentication Endpoint
    Route::post('/auth/login', function (Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'nullable|string',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Sanctum bearer token generated successfully',
            'token' => '1|sanctum_bearer_token_' . md5(uniqid()),
            'user' => [
                'name' => 'Mobile Developer User',
                'email' => $request->email,
                'role' => 'mobile_client',
            ]
        ]);
    });

    // Active Photobooth Devices
    Route::get('/booths', function () {
        return response()->json([
            'status' => 'success',
            'data' => [
                ['id' => 'BOOTH-01', 'name' => 'Main Hall Booth', 'status' => 'online', 'location' => 'Zone A'],
                ['id' => 'BOOTH-02', 'name' => 'VIP Stage Booth', 'status' => 'online', 'location' => 'Zone B'],
                ['id' => 'BOOTH-03', 'name' => 'Lounge Bar Booth', 'status' => 'printing', 'location' => 'Zone C'],
            ]
        ]);
    });

    // Create Photo Session via Mobile App QR
    Route::post('/sessions/create', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'message' => 'Photobooth session triggered via Sanctum API',
            'session_id' => 'SESH-' . rand(1000, 9999),
            'qr_code_url' => 'https://photobooth.studio/share/qr/' . uniqid(),
        ]);
    });

    // Authenticated Sanctum User Route
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'user' => $request->user(),
        ]);
    });
});
