<?php

use App\Enums\UserRole;
use App\Http\Controllers\Admin\DeviceController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectExperienceController;
use App\Http\Controllers\ProfileController;
use App\Support\RoleHome;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Landing Page
Route::get('/', function () {
    if (auth()->check()) {
        return redirect(RoleHome::for(auth()->user()));
    }
    return Inertia::render('LandingPage/Index');
});

// Booth Station (device landing — role: booth)
Route::get('/booth', function () {
    return Inertia::render('Photobooth/Station');
})->middleware(['auth', 'role:booth'])->name('booth.station');

// Admin Core Routes
Route::middleware(['auth', 'verified', 'role:admin,super_admin'])->group(function () {
    // Dashboard
    Route::get('/dashboard', function (\Illuminate\Http\Request $request) {
        $projects = \App\Models\Project::query()
            ->when(
                $request->user()->role !== UserRole::SUPER_ADMIN,
                fn ($query) => $query->where('user_id', $request->user()->id),
            );

        return Inertia::render('Admin/Dashboard', [
            'totalProjects' => $projects->count(),
            'activeProjects' => (clone $projects)->where('status', 'active')->count(),
        ]);
    })->name('dashboard');

    // Admin Features
    Route::prefix('admin')->name('admin.')->group(function () {
        // Proyek (Project Domain)
        Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
        Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
        Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
        Route::patch('/projects/{project}/experience', [ProjectExperienceController::class, 'update'])->name('projects.experience.update');
        Route::get('/projects/{project}/experience', [ProjectExperienceController::class, 'show'])->name('projects.experience');
        Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
        Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');

        // Perangkat (Devices — real domain)
        Route::post('/devices', [DeviceController::class, 'store'])->name('devices.store');
        Route::put('/devices/{device}', [DeviceController::class, 'update'])->name('devices.update');
        Route::post('/devices/{device}/revoke', [DeviceController::class, 'revoke'])->name('devices.revoke');
        Route::get('/devices/{device}', [DeviceController::class, 'show'])->name('devices.show');
        Route::get('/devices', [DeviceController::class, 'index'])->name('devices.index');

        // Templates (Visual Asset Management)
        Route::get('/templates', function () {
            return Inertia::render('Admin/Templates/Index');
        })->name('templates');

        // Frames (Visual Asset Management)
        Route::get('/frames', function () {
            return Inertia::render('Admin/Frames/Index');
        })->name('frames');

        // Monitoring (Device Health & Alerts)
        Route::get('/monitoring', function () {
            return Inertia::render('Admin/Monitoring/Index');
        })->name('monitoring');

        // Users (User Management)
        Route::get('/users', function () {
            return Inertia::render('Admin/Users/Index');
        })->name('users');

        // Roles & Permissions
        Route::get('/roles', function () {
            return Inertia::render('Admin/Roles/Index');
        })->name('roles');

        // Settings
        Route::get('/settings', function () {
            return Inertia::render('Admin/Settings/Index');
        })->name('settings');

        // API Tokens (Sanctum Mobile Auth)
        Route::get('/api-tokens', function () {
            return Inertia::render('Admin/ApiTokens/Index');
        })->name('api-tokens');

        // Live Kiosk Simulator (linked to active device/project)
        Route::get('/kiosk', function () {
            return Inertia::render('Admin/Photobooth/Kiosk');
        })->name('kiosk');

        // Galery
        Route::get('/gallery', function () {
            return Inertia::render('Admin/Gallery/Index');
        })->name('gallery');

        // Transaksi (Replaces old Session Gallery)
        Route::get('/transactions', function () {
            return Inertia::render('Admin/Transactions/Index');
        })->name('transactions');

        // Langganan (Subscription)
        Route::get('/subscription', function () {
            return Inertia::render('Admin/Subscription/Index');
        })->name('subscription');

        // Dompet (Wallet)
        Route::get('/wallet', function () {
            return Inertia::render('Admin/Wallet/Index');
        })->name('wallet');

        // Voucher (Promo & Voucher Codes)
        Route::get('/vouchers', function () {
            return Inertia::render('Admin/Voucher/Index');
        })->name('vouchers');

        // Platform (Super Admin — Tenant Monitoring)
        Route::get('/platform', function () {
            return Inertia::render('Admin/Platform/Overview');
        })->name('platform.overview');

        Route::get('/platform/tenants', function () {
            return Inertia::render('Admin/Platform/Tenants');
        })->name('platform.tenants');
    });

    // Hidden Scalar API Documentation Route (Accessible via URL directly)
    Route::get('/docs', function () {
        return Inertia::render('Admin/ScalarDocs');
    })->name('docs');

    // Profile Settings
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
