<?php

namespace Tests\Feature;

use App\Enums\BoothSessionMode;
use App\Enums\BoothSessionStatus;
use App\Enums\DevicePlatform;
use App\Enums\ProjectStatus;
use App\Models\BoothSession;
use App\Models\Device;
use App\Models\Project;
use App\Models\User;
use App\Models\Voucher;
use App\Services\BoothSessionService;
use App\Services\VoucherService;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Laravel\Sanctum\PersonalAccessToken;
use RuntimeException;
use Tests\TestCase;

class SessionApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Pair a device through the real endpoint so the token carries the
     * production ability set, then bind it to the project.
     *
     * @return array{device: Device, token: string}
     */
    private function pairedDevice(?Project $project = null): array
    {
        $device = Device::factory()->waitingForPair()->create([
            'platform' => DevicePlatform::ANDROID->value,
        ]);

        $token = $this->postJson('/api/v1/device/pair', [
            'device_code' => $device->device_code,
            'platform' => $device->platform->value,
        ])->json('token');

        $device->update(['project_id' => $project?->id]);

        return ['device' => $device->refresh(), 'token' => $token];
    }

    private function activeProject(): Project
    {
        return Project::factory()->create(['status' => ProjectStatus::ACTIVE->value]);
    }

    /**
     * Issue a request as the given device token.
     *
     * Laravel caches the resolved auth user for the lifetime of a test, so a
     * second device in the same test would otherwise keep acting as the first
     * one. Guards are forgotten on every call to make multi-device tests
     * meaningful.
     */
    private function asDevice(string $token): self
    {
        $this->app['auth']->forgetGuards();

        return $this->withToken($token);
    }

    // ── 25. Start session ──────────────────────────────────────────────

    public function test_valid_voucher_starts_session(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-AAAA-0001']);
        $project = $voucher->project;

        ['device' => $device, 'token' => $token] = $this->pairedDevice($project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-AAAA-0001'])
            ->assertCreated()
            ->assertJsonPath('valid', true)
            ->assertJsonPath('session.status', 'active')
            ->assertJsonPath('session.mode', 'self_service')
            ->assertJsonPath('project.id', $project->id)
            ->assertJsonPath('project.name', $project->name)
            ->assertJsonPath('voucher.remaining_uses', 0);

        $this->assertDatabaseCount('booth_sessions', 1);
    }

    public function test_session_code_uses_the_expected_external_format(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-AAAA-0002']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $response = $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-AAAA-0002'])
            ->assertCreated();

        $this->assertMatchesRegularExpression(
            '/^SES-[A-Z2-9]{4}-[A-Z2-9]{4}$/',
            $response->json('session.code'),
        );
    }

    public function test_session_belongs_to_correct_device_project_and_voucher(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-AAAA-0003']);
        $project = $voucher->project;

        ['device' => $device, 'token' => $token] = $this->pairedDevice($project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-AAAA-0003'])
            ->assertCreated();

        $session = BoothSession::firstOrFail();

        $this->assertSame($device->id, $session->device_id);
        $this->assertSame($project->id, $session->project_id);
        $this->assertSame($voucher->id, $session->voucher_id);
        $this->assertTrue($session->isActive());
        $this->assertSame(BoothSessionMode::SELF_SERVICE, $session->mode);
        $this->assertNotNull($session->started_at);
        $this->assertNull($session->cancelled_at);
        $this->assertNull($session->completed_at);
    }

    public function test_start_consumes_exactly_one_use(): void
    {
        $voucher = Voucher::factory()->active()->create([
            'code' => 'VCR-AAAA-0004',
            'max_uses' => 3,
            'used_count' => 0,
        ]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-AAAA-0004'])
            ->assertCreated()
            ->assertJsonPath('voucher.remaining_uses', 2);

        $voucher->refresh();

        $this->assertSame(1, $voucher->used_count, 'used_count must increase by exactly 1');
        $this->assertNotNull($voucher->last_used_at);
        $this->assertSame(2, $voucher->remainingUses());
        $this->assertSame('active', $voucher->effectiveStatus());
    }

    public function test_start_normalizes_voucher_code(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-BBBB-0005']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => '  vcr-bbbb-0005  '])
            ->assertCreated();

        $this->assertDatabaseCount('booth_sessions', 1);
    }

    public function test_start_returns_project_experience(): void
    {
        $project = $this->activeProject();
        $voucher = Voucher::factory()->active()->create([
            'code' => 'VCR-CCCC-0006',
            'project_id' => $project->id,
            'user_id' => $project->user_id,
        ]);
        $project->experienceSetting()->updateOrCreate([], [
            'timer_seconds' => 10,
            'layout' => 'grid_4',
            'frame' => 'wedding',
            'filter' => 'warm',
            'brightness' => 15,
        ]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-CCCC-0006'])
            ->assertCreated()
            ->assertJsonPath('experience.timer_seconds', 10)
            ->assertJsonPath('experience.layout', 'grid_4')
            ->assertJsonPath('experience.frame', 'wedding')
            ->assertJsonPath('experience.filter', 'warm')
            ->assertJsonPath('experience.brightness', 15);
    }

    public function test_start_does_not_expose_internal_fields(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-DDDD-0007']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $response = $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-DDDD-0007']);

        $response->assertJsonStructure([
            'valid',
            'session' => ['id', 'code', 'status', 'mode', 'started_at'],
            'project' => ['id', 'name'],
            'experience',
            'voucher' => ['remaining_uses'],
        ]);

        $response->assertJsonMissingPath('session.user_id');
        $response->assertJsonMissingPath('session.device_id');
        $response->assertJsonMissingPath('session.voucher_id');
        $response->assertJsonMissingPath('session.project_id');
        $response->assertJsonMissingPath('session.token');
        $response->assertJsonMissingPath('voucher.code');
        $response->assertJsonMissingPath('voucher.user_id');
        $response->assertJsonMissingPath('voucher.revoked_at');
        $response->assertJsonMissingPath('voucher.used_count');
    }

    // ── 6. Request contract ────────────────────────────────────────────

    public function test_start_requires_voucher_code_for_self_service(): void
    {
        ['device' => $device, 'token' => $token] = $this->pairedDevice($this->activeProject());

        $this->withToken($token)
            ->postJson('/api/v1/session/start', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('voucher_code');

        $this->assertDatabaseCount('booth_sessions', 0);
    }

    public function test_operator_mode_is_rejected_as_unsupported(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-EEEE-0008']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', [
                'voucher_code' => 'VCR-EEEE-0008',
                'mode' => 'operator',
            ])
            ->assertOk()
            ->assertJsonPath('valid', false)
            ->assertJsonPath('reason', 'unsupported_mode');

        // No voucher-free operator session may slip through.
        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['mode' => 'operator'])
            ->assertOk()
            ->assertJsonPath('reason', 'unsupported_mode');

        $voucher->refresh();
        $this->assertSame(0, $voucher->used_count);
        $this->assertDatabaseCount('booth_sessions', 0);
    }

    public function test_unknown_mode_is_rejected_by_validation(): void
    {
        ['device' => $device, 'token' => $token] = $this->pairedDevice($this->activeProject());

        $this->withToken($token)
            ->postJson('/api/v1/session/start', [
                'voucher_code' => 'VCR-FFFF-0009',
                'mode' => 'nonsense',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('mode');
    }

    // ── 27 + A. Duplicate active session ───────────────────────────────

    public function test_second_start_returns_active_session_exists(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-GGGG-0010']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-GGGG-0010'])
            ->assertCreated();

        $voucher->refresh();
        $this->assertSame(1, $voucher->used_count);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-GGGG-0010'])
            ->assertOk()
            ->assertJsonPath('valid', false)
            ->assertJsonPath('reason', 'active_session_exists')
            ->assertJsonPath('session.status', 'active');

        $voucher->refresh();

        $this->assertDatabaseCount('booth_sessions', 1);
        $this->assertSame(1, $voucher->used_count, 'Voucher must not be consumed twice');
    }

    public function test_active_session_does_not_consume_a_different_voucher(): void
    {
        $first = Voucher::factory()->active()->create(['code' => 'VCR-HHHH-0011']);
        $second = Voucher::factory()->active()->create([
            'code' => 'VCR-HHHH-0012',
            'user_id' => $first->user_id,
            'project_id' => $first->project_id,
        ]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($first->project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-HHHH-0011'])
            ->assertCreated();

        // A different, perfectly valid voucher must stay untouched.
        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-HHHH-0012'])
            ->assertOk()
            ->assertJsonPath('reason', 'active_session_exists');

        $second->refresh();

        $this->assertSame(0, $second->used_count, 'A new voucher must not be consumed while a session runs');
        $this->assertNull($second->last_used_at);
        $this->assertDatabaseCount('booth_sessions', 1);
    }

    // ── 28. Invalid vouchers ───────────────────────────────────────────

    /**
     * Each failure reason must leave both the database and the voucher intact.
     */
    public static function failingVoucherProvider(): array
    {
        return [
            'not found' => ['not_found'],
            'revoked' => ['revoked'],
            'not started' => ['not_started'],
            'expired' => ['expired'],
            'used' => ['used'],
            'project inactive' => ['project_inactive'],
            'device unassigned' => ['device_unassigned'],
            'project mismatch' => ['project_mismatch'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('failingVoucherProvider')]
    public function test_invalid_voucher_never_creates_session_or_consumes_usage(string $reason): void
    {
        $voucher = Voucher::factory()->active()->create([
            'code' => 'VCR-0000-0000',
            'max_uses' => 5,
        ]);
        $project = $voucher->project;

        ['device' => $device, 'token' => $token] = $this->pairedDevice($project);

        $code = 'VCR-0000-0000';

        match ($reason) {
            'not_found' => $code = 'VCR-ZZZZ-9999',
            'revoked' => $voucher->update(['revoked_at' => now()]),
            'not_started' => $voucher->update(['valid_from' => now()->addDay()->toDateString()]),
            'expired' => $voucher->update(['expires_at' => now()->subDay()->toDateString()]),
            'used' => $voucher->update(['used_count' => 5]),
            'project_inactive' => $project->update(['status' => ProjectStatus::DRAFT->value]),
            'device_unassigned' => $device->update(['project_id' => null]),
            'project_mismatch' => $device->update([
                'project_id' => $this->activeProjectFor($voucher)->id,
            ]),
        };

        $before = $voucher->refresh();

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => $code])
            ->assertOk()
            ->assertJsonPath('valid', false)
            ->assertJsonPath('reason', $reason);

        $voucher->refresh();

        $this->assertDatabaseCount('booth_sessions', 0);
        $this->assertSame($before->used_count, $voucher->used_count, 'used_count must be unchanged');
        $this->assertSame(
            $before->last_used_at?->toIso8601String(),
            $voucher->last_used_at?->toIso8601String(),
            'last_used_at must be unchanged',
        );
    }

    private function activeProjectFor(Voucher $voucher): Project
    {
        return Project::factory()->create([
            'user_id' => $voucher->user_id,
            'status' => ProjectStatus::ACTIVE->value,
        ]);
    }

    // ── 29. Auth ───────────────────────────────────────────────────────

    public function test_start_requires_authentication(): void
    {
        $this->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-0000-0000'])
            ->assertStatus(401);
    }

    public function test_current_requires_authentication(): void
    {
        $this->getJson('/api/v1/session/current')->assertStatus(401);
    }

    public function test_cancel_requires_authentication(): void
    {
        $this->postJson('/api/v1/session/1/cancel')->assertStatus(401);
    }

    public function test_start_requires_session_ability(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-IIII-0013']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $restricted = $device->createToken('device-test', ['device:heartbeat', 'device:config'])->plainTextToken;

        $this->withToken($restricted)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-IIII-0013'])
            ->assertStatus(403);

        $voucher->refresh();
        $this->assertSame(0, $voucher->used_count);
        $this->assertDatabaseCount('booth_sessions', 0);
    }

    public function test_current_and_cancel_require_session_ability(): void
    {
        ['device' => $device, 'token' => $token] = $this->pairedDevice($this->activeProject());

        $session = BoothSession::factory()->active()->create([
            'device_id' => $device->id,
            'project_id' => $device->project_id,
        ]);

        $restricted = $device->createToken('device-test', ['device:heartbeat'])->plainTextToken;

        $this->withToken($restricted)
            ->getJson('/api/v1/session/current')
            ->assertStatus(403);

        $this->withToken($restricted)
            ->postJson("/api/v1/session/{$session->id}/cancel")
            ->assertStatus(403);

        $this->assertSame(BoothSessionStatus::ACTIVE, $session->refresh()->status);
    }

    public function test_regular_user_token_cannot_act_as_device(): void
    {
        $user = User::factory()->create();
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-JJJJ-0014']);

        // A real user session token, not a device pairing token. The user model
        // does not use HasApiTokens, so the token row is written directly.
        $userToken = PersonalAccessToken::forceCreate([
            'tokenable_type' => (new User)->getMorphClass(),
            'tokenable_id' => $user->id,
            'name' => 'user-session',
            'token' => hash('sha256', 'user-session-token'),
            'abilities' => ['*'],
        ])->token;

        $this->withToken($userToken)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-JJJJ-0014'])
            ->assertStatus(401);

        $this->withToken($userToken)
            ->getJson('/api/v1/session/current')
            ->assertStatus(401);

        $voucher->refresh();
        $this->assertSame(0, $voucher->used_count);
        $this->assertDatabaseCount('booth_sessions', 0);
    }

    public function test_revoked_device_cannot_start_current_or_cancel(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-KKKK-0015']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $session = BoothSession::factory()->active()->create([
            'device_id' => $device->id,
            'project_id' => $device->project_id,
        ]);

        // Keep the token alive so the request reaches the device guard.
        $device->update(['revoked_at' => now()]);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-KKKK-0015'])
            ->assertStatus(403);

        $this->withToken($token)
            ->getJson('/api/v1/session/current')
            ->assertStatus(403);

        $this->withToken($token)
            ->postJson("/api/v1/session/{$session->id}/cancel")
            ->assertStatus(403);

        $voucher->refresh();
        $this->assertSame(0, $voucher->used_count);
        $this->assertSame(BoothSessionStatus::ACTIVE, $session->refresh()->status);
    }

    // ── 30. Current session ────────────────────────────────────────────

    public function test_current_returns_the_active_session(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-LLLL-0016']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-LLLL-0016'])
            ->assertCreated();

        $created = BoothSession::firstOrFail();

        $this->withToken($token)
            ->getJson('/api/v1/session/current')
            ->assertOk()
            ->assertJsonPath('valid', true)
            ->assertJsonPath('session.id', $created->id)
            ->assertJsonPath('session.code', $created->session_code)
            ->assertJsonPath('session.status', 'active')
            ->assertJsonPath('project.id', $voucher->project_id);
    }

    public function test_current_is_idempotent_and_has_no_side_effects(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-MMMM-0017', 'max_uses' => 4]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-MMMM-0017'])
            ->assertCreated();

        $voucher->refresh();
        $usedCount = $voucher->used_count;
        $lastUsed = $voucher->last_used_at?->toIso8601String();
        $code = BoothSession::firstOrFail()->session_code;

        for ($i = 0; $i < 3; $i++) {
            $this->withToken($token)
                ->getJson('/api/v1/session/current')
                ->assertOk()
                ->assertJsonPath('session.code', $code);
        }

        $voucher->refresh();

        $this->assertSame($usedCount, $voucher->used_count);
        $this->assertSame($lastUsed, $voucher->last_used_at?->toIso8601String());
        $this->assertDatabaseCount('booth_sessions', 1);
        $this->assertSame(1, PersonalAccessToken::count());
    }

    public function test_current_returns_null_when_no_session_exists(): void
    {
        ['device' => $device, 'token' => $token] = $this->pairedDevice($this->activeProject());

        $this->withToken($token)
            ->getJson('/api/v1/session/current')
            ->assertOk()
            ->assertExactJson([
                'valid' => true,
                'session' => null,
                'project' => null,
                'experience' => null,
                'voucher' => null,
            ]);
    }

    public function test_current_ignores_cancelled_and_completed_sessions(): void
    {
        ['device' => $device, 'token' => $token] = $this->pairedDevice($this->activeProject());

        BoothSession::factory()->cancelled()->create([
            'device_id' => $device->id,
            'project_id' => $device->project_id,
        ]);

        BoothSession::factory()->completed()->create([
            'device_id' => $device->id,
            'project_id' => $device->project_id,
        ]);

        $this->withToken($token)
            ->getJson('/api/v1/session/current')
            ->assertOk()
            ->assertJsonPath('session', null);
    }

    public function test_current_never_returns_another_devices_session(): void
    {
        $otherProject = $this->activeProject();
        $otherVoucher = Voucher::factory()->active()->create([
            'code' => 'VCR-NNNN-0018',
            'user_id' => $otherProject->user_id,
            'project_id' => $otherProject->id,
        ]);

        ['device' => $otherDevice, 'token' => $otherToken] = $this->pairedDevice($otherProject);

        $this->withToken($otherToken)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-NNNN-0018'])
            ->assertCreated();

        $foreignSession = BoothSession::firstOrFail();

        ['device' => $device, 'token' => $token] = $this->pairedDevice($this->activeProject());

        $this->asDevice($token)
            ->getJson('/api/v1/session/current')
            ->assertOk()
            ->assertJsonPath('session', null);

        // Guessing the id must not reveal or touch a foreign session.
        $this->asDevice($token)
            ->postJson("/api/v1/session/{$foreignSession->id}/cancel")
            ->assertStatus(404);

        $this->assertSame(BoothSessionStatus::ACTIVE, $foreignSession->refresh()->status);
        $otherVoucher->refresh();
        $this->assertSame(1, $otherVoucher->used_count);
    }

    // ── 31. Cancel ─────────────────────────────────────────────────────

    public function test_owner_device_can_cancel(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-PPPP-0019']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-PPPP-0019'])
            ->assertCreated();

        $session = BoothSession::firstOrFail();

        $this->withToken($token)
            ->postJson("/api/v1/session/{$session->id}/cancel")
            ->assertOk()
            ->assertJsonPath('valid', true)
            ->assertJsonPath('session.status', 'cancelled')
            ->assertJsonPath('cancelled', true)
            ->assertJsonPath('reason', null);

        $session->refresh();

        $this->assertSame(BoothSessionStatus::CANCELLED, $session->status);
        $this->assertNotNull($session->cancelled_at);
    }

    public function test_cancel_does_not_refund_the_voucher(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-QQQQ-0020', 'max_uses' => 2]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-QQQQ-0020'])
            ->assertCreated();

        $session = BoothSession::firstOrFail();
        $consumed = $voucher->refresh()->last_used_at?->toIso8601String();

        $this->withToken($token)
            ->postJson("/api/v1/session/{$session->id}/cancel")
            ->assertOk();

        $voucher->refresh();

        $this->assertSame(1, $voucher->used_count, 'Cancel must not refund used_count');
        $this->assertSame($consumed, $voucher->last_used_at?->toIso8601String());
        $this->assertSame(1, $voucher->remainingUses());
    }

    public function test_cancelling_twice_is_safe(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-RRRR-0021']);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($voucher->project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-RRRR-0021'])
            ->assertCreated();

        $session = BoothSession::firstOrFail();

        $this->withToken($token)
            ->postJson("/api/v1/session/{$session->id}/cancel")
            ->assertOk()
            ->assertJsonPath('cancelled', true);

        $firstCancelledAt = $session->refresh()->cancelled_at?->toIso8601String();

        $this->withToken($token)
            ->postJson("/api/v1/session/{$session->id}/cancel")
            ->assertOk()
            ->assertJsonPath('valid', true)
            ->assertJsonPath('session.status', 'cancelled')
            ->assertJsonPath('cancelled', false)
            ->assertJsonPath('reason', 'already_cancelled');

        $this->assertSame(
            $firstCancelledAt,
            $session->refresh()->cancelled_at?->toIso8601String(),
            'cancelled_at must not be rewritten',
        );

        $voucher->refresh();
        $this->assertSame(1, $voucher->used_count);
    }

    public function test_completed_session_is_not_converted_back_to_cancelled(): void
    {
        ['device' => $device, 'token' => $token] = $this->pairedDevice($this->activeProject());

        $session = BoothSession::factory()->completed()->create([
            'device_id' => $device->id,
            'project_id' => $device->project_id,
        ]);

        $this->withToken($token)
            ->postJson("/api/v1/session/{$session->id}/cancel")
            ->assertOk()
            ->assertJsonPath('valid', true)
            ->assertJsonPath('session.status', 'completed')
            ->assertJsonPath('cancelled', false)
            ->assertJsonPath('reason', 'session_not_cancellable');

        $session->refresh();

        $this->assertSame(BoothSessionStatus::COMPLETED, $session->status);
        $this->assertNull($session->cancelled_at);
    }

    public function test_cancel_unknown_session_returns_404(): void
    {
        ['device' => $device, 'token' => $token] = $this->pairedDevice($this->activeProject());

        $this->withToken($token)
            ->postJson('/api/v1/session/999999/cancel')
            ->assertStatus(404);
    }

    // ── 6-B. New session is allowed after cancelling ───────────────────

    public function test_new_session_can_start_after_cancelling(): void
    {
        $project = $this->activeProject();
        $first = Voucher::factory()->active()->create([
            'code' => 'VCR-SSSS-0022',
            'user_id' => $project->user_id,
            'project_id' => $project->id,
        ]);
        $second = Voucher::factory()->active()->create([
            'code' => 'VCR-SSSS-0023',
            'user_id' => $project->user_id,
            'project_id' => $project->id,
        ]);

        ['device' => $device, 'token' => $token] = $this->pairedDevice($project);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-SSSS-0022'])
            ->assertCreated();

        $session = BoothSession::firstOrFail();

        $this->withToken($token)
            ->postJson("/api/v1/session/{$session->id}/cancel")
            ->assertOk();

        $this->withToken($token)
            ->getJson('/api/v1/session/current')
            ->assertOk()
            ->assertJsonPath('session', null);

        $this->withToken($token)
            ->postJson('/api/v1/session/start', ['voucher_code' => 'VCR-SSSS-0023'])
            ->assertCreated()
            ->assertJsonPath('session.status', 'active');

        $this->assertDatabaseCount('booth_sessions', 2);

        $first->refresh();
        $second->refresh();

        $this->assertSame(1, $first->used_count, 'First voucher stays consumed');
        $this->assertSame(1, $second->used_count, 'Second voucher consumed by the new session');
    }

    // ── 6-D. Transaction rollback ──────────────────────────────────────

    public function test_session_creation_failure_rolls_back_the_voucher(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-TTTT-0024', 'max_uses' => 2]);

        ['device' => $device] = $this->pairedDevice($voucher->project);

        // Fail the insert while the transaction is still open.
        Event::listen('eloquent.creating: '.BoothSession::class, function (): void {
            throw new RuntimeException('simulated session insert failure');
        });

        try {
            app(BoothSessionService::class)->start(
                $device,
                'VCR-TTTT-0024',
                BoothSessionMode::SELF_SERVICE,
            );

            $this->fail('Expected the session insert to throw.');
        } catch (RuntimeException $e) {
            $this->assertSame('simulated session insert failure', $e->getMessage());
        }

        $voucher->refresh();

        $this->assertSame(0, $voucher->used_count, 'Voucher increment must be rolled back');
        $this->assertNull($voucher->last_used_at, 'last_used_at must be rolled back');
        $this->assertDatabaseCount('booth_sessions', 0);
    }

    // ── 19. Token ability ──────────────────────────────────────────────

    public function test_pairing_token_includes_session_ability(): void
    {
        $device = Device::factory()->waitingForPair()->create([
            'platform' => DevicePlatform::ANDROID->value,
        ]);

        $this->postJson('/api/v1/device/pair', [
            'device_code' => $device->device_code,
            'platform' => $device->platform->value,
        ])->assertOk();

        $stored = PersonalAccessToken::firstOrFail();

        $this->assertSame(
            ['device:heartbeat', 'device:config', 'device:voucher', 'device:session'],
            $stored->abilities,
        );
    }

    // ── 20. Device revoked between check and commit ────────────────────

    public function test_service_rejects_a_device_revoked_before_the_transaction(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-UUUU-0025']);

        ['device' => $device] = $this->pairedDevice($voucher->project);

        // The token may still be valid while the device itself is revoked; the
        // service re-reads the device under lock and must not consume a voucher.
        Device::whereKey($device->id)->update(['revoked_at' => now()]);

        $result = app(BoothSessionService::class)->start(
            $device,
            'VCR-UUUU-0025',
            BoothSessionMode::SELF_SERVICE,
        );

        $this->assertFalse($result['valid']);
        $this->assertSame('device_revoked', $result['reason']);

        $voucher->refresh();

        $this->assertSame(0, $voucher->used_count, 'a revoked device must not consume a voucher');
        $this->assertNull($voucher->last_used_at);
        $this->assertDatabaseCount('booth_sessions', 0);
    }

    public function test_device_reassigned_to_another_project_after_lock_cannot_redeem(): void
    {
        $voucher = Voucher::factory()->active()->create(['code' => 'VCR-VVVV-0026']);
        $originalProject = $voucher->project;

        ['device' => $device] = $this->pairedDevice($originalProject);

        // The booth is moved to a different project after pairing. The voucher
        // now belongs to another project, so redemption must be refused.
        $device->update(['project_id' => $this->activeProjectFor($voucher)->id]);

        $result = app(BoothSessionService::class)->start(
            $device,
            'VCR-VVVV-0026',
            BoothSessionMode::SELF_SERVICE,
        );

        $this->assertFalse($result['valid']);
        $this->assertSame('project_mismatch', $result['reason']);

        $voucher->refresh();

        $this->assertSame(0, $voucher->used_count);
        $this->assertDatabaseCount('booth_sessions', 0);
    }

    // ── Voucher service unit behaviour ─────────────────────────────────

    public function test_redeem_locked_returns_not_found_for_unknown_code(): void
    {
        $voucher = Voucher::factory()->active()->create();

        ['device' => $device] = $this->pairedDevice($voucher->project);

        $result = DB::transaction(fn (): array => app(VoucherService::class)->redeemLockedForDevice(
            $device,
            'VCR-XXXX-9999',
        ));

        $this->assertFalse($result['valid']);
        $this->assertSame('not_found', $result['reason']);
    }
}
