<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Landing Page
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('LandingPage/Index');
});

// Admin Core Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Admin Features
    Route::prefix('admin')->name('admin.')->group(function () {
        // Proyek (Project Management)
        Route::get('/projects', function () {
            return Inertia::render('Admin/Projects/Index');
        })->name('projects');

        // Perangkat (Devices & Kiosk Monitoring)
        Route::get('/devices', function () {
            return Inertia::render('Admin/Devices/Index');
        })->name('devices');

        // Templates (Visual Asset Management)
        Route::get('/templates', function () {
            return Inertia::render('Admin/Templates/Index');
        })->name('templates');

        // Frames (Visual Asset Management)
        Route::get('/frames', function () {
            return Inertia::render('Admin/Frames/Index');
        })->name('frames');

        // Sessions (Photo Session Records)
        Route::get('/sessions', function () {
            return Inertia::render('Admin/Sessions/Index');
        })->name('sessions');

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
