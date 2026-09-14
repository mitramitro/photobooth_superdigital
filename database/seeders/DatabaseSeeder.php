<?php

namespace Database\Seeders;

use App\Enums\DevicePlatform;
use App\Enums\DeviceStatus;
use App\Enums\ProjectOrientation;
use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use App\Enums\UserRole;
use App\Models\Device;
use App\Models\ProjectExperienceSetting;
use App\Models\User;
use App\Support\DeviceCode;
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

        $this->seedSampleProjects();
        $this->seedSampleDevices();
    }

    /**
     * Sample projects for development only (owned by the admin account).
     */
    private function seedSampleProjects(): void
    {
        $admin = User::where('email', 'admin@photobooth.com')->first();

        if (! $admin) {
            return;
        }

        $sampleProjects = [
            'Mall Photobox' => [
                'info' => [
                    'type' => ProjectType::RETAIL,
                    'orientation' => ProjectOrientation::PORTRAIT,
                    'status' => ProjectStatus::ACTIVE,
                ],
                'experience' => [
                    'timer_seconds' => 5,
                    'layout' => 'strip_4',
                    'frame' => 'film_strip',
                    'filter' => 'original',
                    'brightness' => 0,
                ],
            ],
            'Wedding Booth' => [
                'info' => [
                    'type' => ProjectType::EVENT,
                    'orientation' => ProjectOrientation::LANDSCAPE,
                    'status' => ProjectStatus::ACTIVE,
                ],
                'experience' => [
                    'timer_seconds' => 3,
                    'layout' => 'grid_4',
                    'frame' => 'wedding',
                    'filter' => 'warm',
                    'brightness' => 5,
                ],
            ],
            'Self Booth Demo' => [
                'info' => [
                    'type' => ProjectType::SELF,
                    'orientation' => ProjectOrientation::PORTRAIT,
                    'status' => ProjectStatus::DRAFT,
                ],
                'experience' => [
                    'timer_seconds' => 10,
                    'layout' => 'single',
                    'frame' => 'none',
                    'filter' => 'original',
                    'brightness' => 0,
                ],
            ],
        ];

        foreach ($sampleProjects as $name => $sample) {
            $project = $admin->projects()->updateOrCreate(
                ['name' => $name],
                $sample['info'],
            );

            $project->experienceSetting()->updateOrCreate(
                [],
                array_merge(ProjectExperienceSetting::defaults(), $sample['experience']),
            );
        }
    }

    /**
     * Sample devices for development only. One paired/online style device and
     * one waiting-for-pairing device. No fake tokens are created.
     */
    private function seedSampleDevices(): void
    {
        $admin = User::where('email', 'admin@photobooth.com')->first();

        if (! $admin) {
            return;
        }

        $mall = $admin->projects()->where('name', 'Mall Photobox')->first();
        $wedding = $admin->projects()->where('name', 'Wedding Booth')->first();

        $samples = [
            [
                'name' => 'Mall Android Booth',
                'platform' => DevicePlatform::ANDROID->value,
                'project_id' => $mall->id ?? null,
                'paired_at' => now()->subDay(),
                'last_seen_at' => now()->subSeconds(30),
                'status' => DeviceStatus::ONLINE->value,
            ],
            [
                'name' => 'Wedding Windows Booth',
                'platform' => DevicePlatform::WINDOWS->value,
                'project_id' => $wedding->id ?? null,
                'paired_at' => null,
                'last_seen_at' => null,
                'status' => DeviceStatus::OFFLINE->value,
            ],
        ];

        foreach ($samples as $sample) {
            $name = $sample['name'];

            $device = $admin->devices()->firstOrCreate(
                ['name' => $name],
                array_merge($sample, [
                    'device_code' => DeviceCode::generateUnique(Device::pluck('device_code')),
                ]),
            );

            $device->update($sample);

            $device->events()->firstOrCreate(['event' => 'created']);
            $device->events()->firstOrCreate(['event' => 'project_assigned'], [
                'metadata' => ['project_name' => $device->project?->name],
            ]);

            if ($device->paired_at) {
                $device->events()->firstOrCreate(['event' => 'paired']);
            }
        }
    }
}