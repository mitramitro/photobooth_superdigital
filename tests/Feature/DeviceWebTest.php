<?php

namespace Tests\Feature;

use App\Enums\DevicePlatform;
use App\Enums\DeviceStatus;
use App\Enums\ProjectStatus;
use App\Enums\UserRole;
use App\Models\Device;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class DeviceWebTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => UserRole::ADMIN]);
    }

    private function superAdmin(): User
    {
        return User::factory()->create(['role' => UserRole::SUPER_ADMIN]);
    }

    public function test_admin_can_view_device_index(): void
    {
        $admin = $this->admin();
        Device::factory()->waitingForPair()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->get(route('admin.devices.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Devices/Index')
                ->has('devices', 1)
                ->has('projects')
                ->has('downloads'));
    }

    public function test_admin_only_sees_own_devices_in_index(): void
    {
        $admin = $this->admin();
        $other = $this->admin();

        Device::factory()->create(['user_id' => $admin->id, 'name' => 'Booth Milik Admin']);
        Device::factory()->create(['user_id' => $other->id, 'name' => 'Booth Milik Lain']);

        $this->actingAs($admin)
            ->get(route('admin.devices.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('devices', 1, fn (Assert $item) => $item
                    ->where('name', 'Booth Milik Admin')
                    ->where('pair_status', 'waiting')
                    ->etc()));
    }

    public function test_super_admin_sees_all_devices_in_index(): void
    {
        $super = $this->superAdmin();
        $admin = $this->admin();

        Device::factory()->create(['user_id' => $admin->id]);
        Device::factory()->create(['user_id' => $admin->id]);
        Device::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($super)
            ->get(route('admin.devices.index'))
            ->assertInertia(fn (Assert $page) => $page->has('devices', 3));
    }

    public function test_booth_cannot_access_device_area(): void
    {
        $booth = User::factory()->create(['role' => UserRole::BOOTH]);

        $this->actingAs($booth)->get(route('admin.devices.index'))->assertStatus(403);
    }

    public function test_guest_is_redirected_to_login_from_device_area(): void
    {
        $this->get(route('admin.devices.index'))->assertRedirect(route('login'));
    }

    public function test_admin_can_create_device_and_gets_pairing_code(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id, 'name' => 'Proyek A']);

        $this->actingAs($admin)
            ->post(route('admin.devices.store'), [
                'name' => 'Booth Baru',
                'platform' => DevicePlatform::ANDROID->value,
                'project_id' => $project->id,
            ])
            ->assertRedirect();

        $device = Device::where('name', 'Booth Baru')->firstOrFail();

        $this->assertMatchesRegularExpression('/^PB-[ABCDFGHJKLMNPRSTVWXYZ23456789]{4}-[ABCDFGHJKLMNPRSTVWXYZ23456789]{4}$/', $device->device_code);
        $this->assertSame($admin->id, $device->user_id);
        $this->assertSame($project->id, $device->project_id);
        $this->assertSame(DeviceStatus::OFFLINE, $device->status);
        $this->assertDatabaseHas('device_events', [
            'device_id' => $device->id,
            'event' => 'created',
        ]);
    }

    public function test_generates_unique_pairing_codes_across_devices(): void
    {
        $admin = $this->admin();
        Device::factory()->count(2)->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->post(route('admin.devices.store'), [
                'name' => 'Booth Tiga',
                'platform' => DevicePlatform::ANDROID->value,
            ])
            ->assertRedirect();

        $codes = Device::pluck('device_code')->all();

        $this->assertSame($codes, array_values(array_unique($codes)), 'Pairing codes must be unique');
    }

    public function test_admin_cannot_assign_project_of_another_admin_on_create(): void
    {
        $admin = $this->admin();
        $other = $this->admin();
        $otherProject = Project::factory()->create(['user_id' => $other->id]);

        $this->actingAs($admin)
            ->post(route('admin.devices.store'), [
                'name' => 'Booth Curang',
                'platform' => DevicePlatform::ANDROID->value,
                'project_id' => $otherProject->id,
            ])
            ->assertSessionHasErrors('project_id');

        $this->assertDatabaseMissing('devices', ['name' => 'Booth Curang']);
    }

    public function test_admin_can_view_own_device(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id, 'name' => 'Proyek A']);
        $device = Device::factory()->paired()->assignedTo($project)->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->get(route('admin.devices.show', $device))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Devices/Show')
                ->where('device.name', $device->name)
                ->where('device.pair_status', 'paired')
                ->where('can.update', true)
                ->where('can.revoke', true)
                ->where('device.project.id', $project->id)
                ->has('events'));
    }

    public function test_admin_cannot_view_device_of_another_admin(): void
    {
        $admin = $this->admin();
        $other = $this->admin();
        $device = Device::factory()->create(['user_id' => $other->id]);

        $this->actingAs($admin)->get(route('admin.devices.show', $device))->assertStatus(403);
    }

    public function test_admin_can_update_own_device_and_record_assignment_event(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id, 'name' => 'Proyek A']);
        $device = Device::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->put(route('admin.devices.update', $device), [
                'name' => 'Booth Diubah',
                'platform' => DevicePlatform::WINDOWS->value,
                'project_id' => $project->id,
            ])
            ->assertRedirect(route('admin.devices.show', $device));

        $this->assertDatabaseHas('devices', [
            'id' => $device->id,
            'name' => 'Booth Diubah',
            'project_id' => $project->id,
        ]);

        $this->assertSame(DevicePlatform::WINDOWS, $device->fresh()->platform);

        $this->assertDatabaseHas('device_events', [
            'device_id' => $device->id,
            'event' => 'project_assigned',
        ]);
    }

    public function test_admin_cannot_update_device_of_another_admin(): void
    {
        $admin = $this->admin();
        $other = $this->admin();
        $device = Device::factory()->create(['user_id' => $other->id]);

        $this->actingAs($admin)
            ->put(route('admin.devices.update', $device), [
                'name' => 'Hack',
                'platform' => DevicePlatform::ANDROID->value,
            ])
            ->assertStatus(403);
    }

    public function test_admin_can_revoke_own_device_and_tokens_are_deleted(): void
    {
        $admin = $this->admin();
        $device = Device::factory()->paired()->create(['user_id' => $admin->id]);
        $device->createToken('device-pair', ['device:heartbeat', 'device:config']);
        $this->assertDatabaseCount('personal_access_tokens', 1);

        $this->actingAs($admin)
            ->post(route('admin.devices.revoke', $device))
            ->assertRedirect(route('admin.devices.show', $device));

        $device->refresh();

        $this->assertNotNull($device->revoked_at);
        $this->assertSame(DeviceStatus::OFFLINE, $device->status);
        $this->assertSame('revoked', $device->pairStatus());
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->assertDatabaseHas('device_events', [
            'device_id' => $device->id,
            'event' => 'revoked',
        ]);
    }

    public function test_admin_cannot_revoke_device_of_another_admin(): void
    {
        $admin = $this->admin();
        $other = $this->admin();
        $device = Device::factory()->paired()->create(['user_id' => $other->id]);

        $this->actingAs($admin)
            ->post(route('admin.devices.revoke', $device))
            ->assertStatus(403);
    }

    public function test_device_online_status_follows_last_seen_threshold(): void
    {
        $admin = $this->admin();

        $online = Device::factory()->paired()->seenRecently()->create(['user_id' => $admin->id]);
        $offline = Device::factory()->paired()->seenLongAgo()->create(['user_id' => $admin->id]);
        $waiting = Device::factory()->waitingForPair()->create(['user_id' => $admin->id]);
        $revoked = Device::factory()->revoked()->create(['user_id' => $admin->id]);

        $this->assertTrue($online->isOnline());
        $this->assertFalse($offline->isOnline());
        $this->assertFalse($waiting->isOnline());
        $this->assertFalse($revoked->isOnline());

        $this->assertSame('online', $online->displayStatus()->value);
        $this->assertSame('offline', $offline->displayStatus()->value);
        $this->assertSame('waiting', $waiting->pairStatus());
        $this->assertSame('revoked', $revoked->pairStatus());

        $this->assertTrue($waiting->isWaitingForPair());
        $this->assertTrue($waiting->isPaired() === false);
        $this->assertTrue($revoked->isRevoked());
    }

    public function test_super_admin_can_view_update_and_revoke_any_device(): void
    {
        $super = $this->superAdmin();
        $admin = $this->admin();
        $device = Device::factory()->paired()->create(['user_id' => $admin->id]);

        $this->actingAs($super)->get(route('admin.devices.show', $device))->assertOk();
        $this->actingAs($super)
            ->put(route('admin.devices.update', $device), [
                'name' => 'Diubah Super Admin',
                'platform' => $device->platform->value,
            ])
            ->assertRedirect();
        $this->actingAs($super)->post(route('admin.devices.revoke', $device))->assertRedirect();

        $this->assertNotNull($device->refresh()->revoked_at);
    }
}