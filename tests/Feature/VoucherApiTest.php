<?php

namespace Tests\Feature;

use App\Enums\DevicePlatform;
use App\Enums\ProjectStatus;
use App\Models\Device;
use App\Models\Project;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\PersonalAccessToken;
use Tests\TestCase;

class VoucherApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Create a paired device bound to the given project and return its token.
     *
     * @return array{device: Device, token: string}
     */
    private function pairedDevice(Project $project): array
    {
        $device = Device::factory()->waitingForPair()->create([
            'platform' => DevicePlatform::ANDROID->value,
        ]);

        $token = $this->postJson('/api/v1/device/pair', [
            'device_code' => $device->device_code,
            'platform' => $device->platform->value,
        ])->json('token');

        $device->update(['project_id' => $project->id]);

        return ['device' => $device, 'token' => $token];
    }

    private function pairedWithoutProject(): array
    {
        $device = Device::factory()->waitingForPair()->create([
            'platform' => DevicePlatform::ANDROID->value,
        ]);

        $token = $this->postJson('/api/v1/device/pair', [
            'device_code' => $device->device_code,
            'platform' => $device->platform->value,
        ])->json('token');

        return ['device' => $device, 'token' => $token];
    }

    public function test_matching_active_voucher_is_valid(): void
    {
        $voucher = Voucher::factory()->active()->create([
            'code' => 'VCR-AAAA-1111',
            'max_uses' => 3,
            'expires_at' => now()->addDays(5)->toDateString(),
        ]);
        $project = $voucher->project;

        ['device' => $device, 'token' => $token] = $this->pairedDevice($project);

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-AAAA-1111'])
            ->assertOk()
            ->assertJsonPath('valid', true)
            ->assertJsonPath('voucher.code', 'VCR-AAAA-1111')
            ->assertJsonPath('voucher.remaining_uses', 3)
            ->assertJsonPath('voucher.expires_at', $voucher->expires_at->toDateString())
            ->assertJsonPath('voucher.project_id', $project->id)
            ->assertJsonPath('project.id', $project->id)
            ->assertJsonPath('project.name', $project->name);
    }

    public function test_code_is_normalized_trim_and_uppercase(): void
    {
        $voucher = Voucher::factory()->active()->create([
            'code' => 'VCR-BBBB-2222',
        ]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => '  vcr-bbbb-2222  '])
            ->assertOk()
            ->assertJsonPath('valid', true);
    }

    public function test_invalid_code_returns_not_found(): void
    {
        ['device' => $device, 'token' => $token] = $this->pairedWithoutProject();

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-XXXX-0000'])
            ->assertOk()
            ->assertExactJson(['valid' => false, 'reason' => 'not_found']);
    }

    public function test_revoked_voucher_returns_revoked(): void
    {
        $voucher = Voucher::factory()->revoked()->create(['code' => 'VCR-CCCC-3333']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-CCCC-3333'])
            ->assertOk()
            ->assertJsonPath('valid', false)
            ->assertJsonPath('reason', 'revoked');
    }

    public function test_future_valid_from_returns_not_started(): void
    {
        $voucher = Voucher::factory()->active()->create([
            'code' => 'VCR-DDDD-4444',
            'valid_from' => now()->addDay()->toDateString(),
        ]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-DDDD-4444'])
            ->assertOk()
            ->assertJsonPath('reason', 'not_started');
    }

    public function test_expired_voucher_returns_expired(): void
    {
        $voucher = Voucher::factory()->expired()->create(['code' => 'VCR-EEEE-5555']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-EEEE-5555'])
            ->assertOk()
            ->assertJsonPath('reason', 'expired');
    }

    public function test_used_voucher_returns_used(): void
    {
        $voucher = Voucher::factory()->used()->create(['code' => 'VCR-FFFF-6666']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-FFFF-6666'])
            ->assertOk()
            ->assertJsonPath('reason', 'used');
    }

    public function test_inactive_project_returns_project_inactive(): void
    {
        $project = Project::factory()->create(['status' => ProjectStatus::DRAFT->value]);
        $voucher = Voucher::factory()->create([
            'code' => 'VCR-GGGG-7777',
            'user_id' => $project->user_id,
            'project_id' => $project->id,
        ]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($project);

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-GGGG-7777'])
            ->assertOk()
            ->assertJsonPath('reason', 'project_inactive');
    }

    public function test_device_without_project_returns_device_unassigned(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-HHHH-8888']);

        ['device' => $device, 'token' => $token] = $this->pairedWithoutProject();

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-HHHH-8888'])
            ->assertOk()
            ->assertJsonPath('reason', 'device_unassigned');
    }

    public function test_project_mismatch_returns_project_mismatch(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-IIII-9999']);
        $otherProject = Project::factory()->create(['status' => ProjectStatus::ACTIVE->value]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($otherProject);

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-IIII-9999'])
            ->assertOk()
            ->assertJsonPath('reason', 'project_mismatch');
    }

    public function test_unauthenticated_request_returns_401(): void
    {
        $this->postJson('/api/v1/voucher/validate', ['code' => 'VCR-AAAA-1111'])->assertStatus(401);
    }

    public function test_token_without_voucher_ability_returns_403(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-JJJJ-0001']);
        $device = Device::factory()->waitingForPair()->create([
            'platform' => DevicePlatform::ANDROID->value,
        ]);

        $token = $this->postJson('/api/v1/device/pair', [
            'device_code' => $device->device_code,
            'platform' => $device->platform->value,
        ])->json('token');

        $restricted = $device->createToken('device-test', ['device:heartbeat'])->plainTextToken;

        $device->update(['project_id' => $voucher->project_id]);

        $this->withToken($restricted)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-JJJJ-0001'])
            ->assertStatus(403);
    }

    public function test_revoked_device_can_no_longer_validate(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-KKKK-0002']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $device->update(['revoked_at' => now()]);
        $device->tokens()->delete();

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-KKKK-0002'])
            ->assertStatus(401);
    }

    public function test_pairing_token_includes_voucher_ability(): void
    {
        $device = Device::factory()->waitingForPair()->create([
            'platform' => DevicePlatform::ANDROID->value,
        ]);

        $this->postJson('/api/v1/device/pair', [
            'device_code' => $device->device_code,
            'platform' => $device->platform->value,
        ])->assertOk();

        $stored = PersonalAccessToken::firstOrFail();

        $this->assertSame(['device:heartbeat', 'device:config', 'device:voucher', 'device:session'], $stored->abilities);
    }

    public function test_valid_response_does_not_leak_internal_fields(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-LLLL-0003']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $response = $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-LLLL-0003']);

        $response->assertJsonStructure([
            'valid',
            'voucher' => ['code', 'remaining_uses', 'expires_at', 'project_id'],
            'project' => ['id', 'name'],
        ]);

        $response->assertJsonMissingPath('voucher.user_id');
        $response->assertJsonMissingPath('voucher.status');
        $response->assertJsonMissingPath('voucher.revoked_at');
        $response->assertJsonMissingPath('voucher.last_used_at');
    }

    public function test_validate_has_no_side_effects(): void
    {
        $voucher = Voucher::factory()->active()->create([
            'code' => 'VCR-MMMM-0004',
            'max_uses' => 1,
        ]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-MMMM-0004'])
            ->assertOk()
            ->assertJsonPath('valid', true);

        for ($i = 0; $i < 5; $i++) {
            $this->withToken($token)
                ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-MMMM-0004'])
                ->assertOk()
                ->assertJsonPath('valid', true)
                ->assertJsonPath('voucher.remaining_uses', 1);
        }

        $voucher->refresh();

        $this->assertSame(0, $voucher->used_count, 'used_count must never be incremented by validate');
        $this->assertNull($voucher->last_used_at, 'last_used_at must never be set by validate');
        $this->assertSame(1, $voucher->remainingUses());

        $this->assertSame(1, PersonalAccessToken::count(), 'No extra tokens may be created');
        $this->assertSame(0, $device->events()->count() - 1, 'No events may be written beyond pairing');
        $this->assertDatabaseMissing('device_events', [
            'device_id' => $device->id,
            'event' => 'voucher_validated',
        ]);

        // Phase 6 regression: validation must not start a booth session.
        $this->assertDatabaseCount('booth_sessions', 0);
    }

    public function test_validate_never_creates_a_booth_session(): void
    {
        $voucher = Voucher::factory()->active()->create([
            'code' => 'VCR-NNNN-0005',
            'max_uses' => 2,
        ]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        for ($i = 0; $i < 5; $i++) {
            $this->withToken($token)
                ->postJson('/api/v1/voucher/validate', ['code' => 'VCR-NNNN-0005'])
                ->assertOk()
                ->assertJsonPath('valid', true);
        }

        $voucher->refresh();

        $this->assertSame(0, $voucher->used_count);
        $this->assertNull($voucher->last_used_at);
        $this->assertSame(2, $voucher->remainingUses());
        $this->assertDatabaseCount('booth_sessions', 0);
    }
}
