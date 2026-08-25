<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Landing / Redirect to Login
Route::get('/', function () {
    return redirect()->route('login');
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
