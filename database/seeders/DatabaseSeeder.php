<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@photobooth.com'],
            [
                'name' => 'Admin Photobooth Studio',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'operator@photobooth.com'],
            [
                'name' => 'Kiosk Station Operator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'staff@photobooth.com'],
            [
                'name' => 'Event Support Staff',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
