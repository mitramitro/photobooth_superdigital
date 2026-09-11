<?php

namespace Database\Seeders;

use App\Enums\UserRole;
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
            ['email' => 'superadmin@photobooth.com'],
            [
                'name' => 'Super Admin Photobooth',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::SUPER_ADMIN,
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@photobooth.com'],
            [
                'name' => 'Admin Photobooth Studio',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::ADMIN,
            ]
        );

        User::updateOrCreate(
            ['email' => 'booth@photobooth.com'],
            [
                'name' => 'Booth Photobooth',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'role' => UserRole::BOOTH,
            ]
        );

        // Remove obsolete placeholder accounts from the pre-role era.
        // Their names deliberately were "Operator"/"Staff" which collided
        // with the future operator mode concept.
        User::whereIn('email', ['operator@photobooth.com', 'staff@photobooth.com'])->delete();
    }
}