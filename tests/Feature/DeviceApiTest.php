<?php

namespace Tests\Feature;

use App\Enums\DevicePlatform;
use App\Enums\ProjectStatus;
use App\Models\Device;
use App\Models\Project;
use App\Models\User;
use App\Services\DeviceEventService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class DeviceApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Create a waiting device for the given platform.
     */
    private function waitingDevice(DevicePlatform $platform = DevicePlatform::ANDROID): Device
    {
        return Device::factory()->waitingForPair()->create([
            'user_id' => User::factory()->create()->id,
            'platform' => $platform->value,
        ]);
    }

    /**
     * Pair a waiting device and return the raw JSON response.
     */
    private function pair(Device $device, array $extra = []): \Illuminate\Testing\TestResponse
    {
        return $this->postJson('/api/v1/device/pair', array_merge([
            'device_code' => $device->device_code,
            'platform' => $device->platform->value,
        ], $extra));
    }

    public function test_valid_pair_returns_a_real_device_token(): void
    {
        $device = $this->waitingDevice();

        $response = $this->pair($device, ['app_version' => '1.2.0', 'device_identifier' => 'SN-001']);

        $response->assertOk()
            ->assertJsonPath('message', 'Pairing berhasil.')
            ->assertJsonPath('token_type', 'Bearer')
            ->assertJsonPath('device.pair_status', 'paired')
            ->assertJsonPath('device.status', 'online');

        $token = $response->json('token');
        $this->assertIsString($token);
        $this->assertStringContainsString('|', $token);

        $stored = PersonalAccessToken::firstOrFail();
        $this->assertSame(Device::class, $stored->tokenable_type);
        $this->assertSame($device->id, $stored->tokenable_id);
        $this->assertSame(['device:heartbeat', 'device:config', 'device:voucher'], $stored->abilities);
        $this->assertSame('device-pair', $stored->name);

        $device->refresh();
        $this->assertNotNull($device->paired_at);
        $this->assertSame('1.2.0', $device->app_version);
        $this->assertSame('SN-001', $device->device_identifier);
        $this->assertNotNull($device->last_seen_at);

        $this->assertDatabaseHas('device_events', [
            'device_id' => $device->id,
            'event' => 'paired',
        ]);
    }

    public function test_pair_rejects_unknown_code(): void
    {
        $this->postJson('/api/v1/device/pair', [
            'device_code' => 'PB-AAAA-BBBB',
            'platform' => DevicePlatform::ANDROID->value,
        ])->assertStatus(422);
    }

    public function test_pair_rejects_malformed_code(): void
    {
        $this->postJson('/api/v1/device/pair', [
            'device_code' => 'bukan-kode',
            'platform' => DevicePlatform::ANDROID->value,
        ])->assertStatus(422);
    }

    public function test_pair_rejects_revoked_device(): void
    {
        $admin = User::factory()->create();
        $device = Device::factory()->revoked()->create(['user_id' => $admin->id]);

        $this->pair($device)->assertStatus(403);
    }

    public function test_pair_rejects_already_paired_device(): void
    {
        $device = Device::factory()->paired()->create(['user_id' => User::factory()->create()->id]);

        $this->pair($device)->assertStatus(409);
    }

    public function test_pair_rejects_platform_mismatch(): void
    {
        $device = $this->waitingDevice(DevicePlatform::ANDROID);

        $this->postJson('/api/v1/device/pair', [
            'device_code' => $device->device_code,
            'platform' => DevicePlatform::WINDOWS->value,
        ])->assertStatus(422);
    }

    public function test_pair_response_does_not_leak_internal_device_fields(): void
    {
        $device = $this->waitingDevice();
        $response = $this->pair($device);

        $response->assertJsonStructure([
            'message',
            'token',
            'token_type',
            'device' => [
                'id',
                'name',
                'platform',
                'pair_status',
                'status',
                'project',
            ],
        ]);

        $response->assertJsonMissingPath('device.device_code');
        $response->assertJsonMissingPath('device.device_identifier');
        $response->assertJsonMissingPath('device.user_id');
        $response->assertJsonMissingPath('device.paired_at');
        $response->assertJsonMissingPath('device.revoked_at');
    }

    public function test_heartbeat_updates_presence_and_app_version(): void
    {
        $device = $this->waitingDevice();
        $token = $this->pair($device)->json('token');

        $this->withToken($token)
            ->postJson('/api/v1/device/heartbeat', [
                'app_version' => '1.3.1',
                'device_identifier' => 'SN-ABC',
            ])
            ->assertOk()
            ->assertJsonPath('project', null)
            ->assertJsonPath('device.pair_status', 'paired')
            ->assertJsonStructure(['server_time']);

        $device->refresh();
        $this->assertSame('1.3.1', $device->app_version);
        $this->assertSame('SN-ABC', $device->device_identifier);
        $this->assertNotNull($device->last_seen_at);
    }

    public function test_heartbeat_requires_device_token(): void
    {
        $this->postJson('/api/v1/device/heartbeat', [])->assertStatus(401);
    }

    public function test_revoked_device_can_no_longer_heartbeat(): void
    {
        $admin = User::factory()->create();
        $device = $this->waitingDevice();
        $token = $this->pair($device)->json('token');

        $device->update(['revoked_at' => now()]);
        $device->tokens()->delete();

        $this->withToken($token)
            ->postJson('/api/v1/device/heartbeat', [])
            ->assertStatus(401);
    }

    public function test_heartbeat_does_not_grow_event_log(): void
    {
        $device = $this->waitingDevice();
        $token = $this->pair($device)->json('token');

        $this->withToken($token)->postJson('/api/v1/device/heartbeat', [])->assertOk();
        $this->withToken($token)->postJson('/api/v1/device/heartbeat', [])->assertOk();

        $this->assertSame(1, $device->events()->where('event', 'paired')->count());
        $this->assertSame(0, $device->events()->where('event', 'heartbeat')->count());
    }

    public function test_config_returns_active_project_experience(): void
    {
        $admin = User::factory()->create();
        $device = $this->waitingDevice();

        $project = Project::factory()->create([
            'user_id' => $admin->id,
            'name' => 'Mall Photobox',
            'type' => 'retail',
            'orientation' => 'portrait',
            'status' => ProjectStatus::ACTIVE,
            'welcome_image' => 'welcome/mall.jpg',
        ]);
        $project->experienceSetting()->updateOrCreate([], [
            'timer_seconds' => 12,
            'layout' => 'grid_4',
            'frame' => 'classic',
            'filter' => 'bw',
            'brightness' => 15,
        ]);
        $device->update(['project_id' => $project->id]);

        $token = $this->pair($device)->json('token');

        $this->withToken($token)
            ->getJson('/api/v1/device/config')
            ->assertOk()
            ->assertJsonPath('project.id', $project->id)
            ->assertJsonPath('project.name', 'Mall Photobox')
            ->assertJsonPath('project.available', true)
            ->assertJsonPath('runnable', true)
            ->assertJsonPath('experience.timer_seconds', 12)
            ->assertJsonPath('experience.layout', 'grid_4')
            ->assertJsonPath('experience.frame', 'classic')
            ->assertJsonPath('experience.filter', 'bw')
            ->assertJsonPath('experience.brightness', 15);
    }

    public function test_config_returns_null_project_for_unassigned_device(): void
    {
        $device = $this->waitingDevice();
        $token = $this->pair($device)->json('token');

        $this->withToken($token)
            ->getJson('/api/v1/device/config')
            ->assertOk()
            ->assertJsonPath('project', null)
            ->assertJsonPath('experience', null)
            ->assertJsonPath('runnable', false);
    }

    public function test_config_draft_project_is_not_runnable_and_hides_experience(): void
    {
        $admin = User::factory()->create();
        $device = $this->waitingDevice();

        $project = Project::factory()->create([
            'user_id' => $admin->id,
            'status' => ProjectStatus::DRAFT,
        ]);
        $device->update(['project_id' => $project->id]);

        $token = $this->pair($device)->json('token');

        $this->withToken($token)
            ->getJson('/api/v1/device/config')
            ->assertOk()
            ->assertJsonPath('project.available', false)
            ->assertJsonPath('project.status', 'draft')
            ->assertJsonPath('runnable', false)
            ->assertJsonPath('experience', null);
    }

    public function test_config_requires_device_token(): void
    {
        $this->getJson('/api/v1/device/config')->assertStatus(401);
    }

    public function test_revoked_device_can_no_longer_fetch_config(): void
    {
        $device = $this->waitingDevice();
        $token = $this->pair($device)->json('token');

        $device->update(['revoked_at' => now()]);
        $device->tokens()->delete();

        $this->withToken($token)->getJson('/api/v1/device/config')->assertStatus(401);
    }

    public function test_full_lifecycle_records_events(): void
    {
        $admin = User::factory()->create();
        $device = Device::factory()->waitingForPair()->create([
            'user_id' => $admin->id,
            'platform' => DevicePlatform::ANDROID->value,
        ]);

        DeviceEventService::created($device);

        $this->assertDatabaseHas('device_events', ['device_id' => $device->id, 'event' => 'created']);

        $this->pair($device)->assertOk();
        $this->assertDatabaseHas('device_events', ['device_id' => $device->id, 'event' => 'paired']);

        $project = Project::factory()->create(['user_id' => $admin->id]);
        $device->update(['project_id' => $project->id]);
        DeviceEventService::projectChanged($device, $project->id, $project->name);
        $this->assertDatabaseHas('device_events', ['device_id' => $device->id, 'event' => 'project_assigned']);

        $device->update(['project_id' => null]);
        DeviceEventService::projectChanged($device, null, null);
        $this->assertDatabaseHas('device_events', ['device_id' => $device->id, 'event' => 'project_unassigned']);

        $device->update(['revoked_at' => now()]);
        $device->tokens()->delete();
        DeviceEventService::revoked($device);
        $this->assertDatabaseHas('device_events', ['device_id' => $device->id, 'event' => 'revoked']);
    }

    public function test_app_version_change_is_recorded_once(): void
    {
        $device = $this->waitingDevice();
        $token = $this->pair($device)->json('token');

        $this->withToken($token)
            ->postJson('/api/v1/device/heartbeat', ['app_version' => '2.0.0'])
            ->assertOk();

        $this->assertDatabaseHas('device_events', [
            'device_id' => $device->id,
            'event' => 'app_version_changed',
        ]);
        $this->assertSame(1, $device->events()->where('event', 'app_version_changed')->count());

        $this->withToken($token)
            ->postJson('/api/v1/device/heartbeat', ['app_version' => '2.0.0'])
            ->assertOk();

        $this->assertSame(1, $device->events()->where('event', 'app_version_changed')->count());
    }
}