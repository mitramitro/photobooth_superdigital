<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Project;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class VoucherWebTest extends TestCase
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

    public function test_admin_can_view_voucher_index(): void
    {
        $admin = $this->admin();
        Voucher::factory()->active()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->get(route('admin.vouchers.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Voucher/Index')
                ->has('vouchers.data', 1)
                ->has('projects'));
    }

    public function test_admin_only_sees_own_vouchers_in_index(): void
    {
        $admin = $this->admin();
        $other = $this->admin();

        Voucher::factory()->create(['user_id' => $admin->id, 'code' => 'VCR-AAAA-1111']);
        Voucher::factory()->create(['user_id' => $other->id, 'code' => 'VCR-BBBB-2222']);

        $this->actingAs($admin)
            ->get(route('admin.vouchers.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('vouchers.data', 1, fn (Assert $item) => $item
                    ->where('code', 'VCR-AAAA-1111')
                    ->where('remaining_uses', 1)
                    ->etc()));
    }

    public function test_super_admin_sees_all_vouchers_in_index(): void
    {
        $super = $this->superAdmin();
        $admin = $this->admin();

        Voucher::factory()->count(3)->create(['user_id' => $admin->id]);

        $this->actingAs($super)
            ->get(route('admin.vouchers.index'))
            ->assertInertia(fn (Assert $page) => $page->has('vouchers.data', 3));
    }

    public function test_index_returns_computed_effective_status_and_project(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id, 'name' => 'Mall Photobox']);
        $voucher = Voucher::factory()->active()->create([
            'user_id' => $admin->id,
            'project_id' => $project->id,
            'max_uses' => 5,
            'used_count' => 2,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.vouchers.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('vouchers.data', 1, fn (Assert $item) => $item
                    ->where('status', 'active')
                    ->where('remaining_uses', 3)
                    ->where('project.name', 'Mall Photobox')
                    ->etc()));
    }

    public function test_admin_can_create_voucher_for_own_project_and_code_is_generated_server_side(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id, 'name' => 'Proyek A']);

        $this->actingAs($admin)
            ->post(route('admin.vouchers.store'), [
                'project_id' => $project->id,
                'max_uses' => 3,
                'valid_from' => null,
                'expires_at' => '2026-12-31',
            ])
            ->assertRedirect(route('admin.vouchers.index'));

        $voucher = Voucher::where('project_id', $project->id)->firstOrFail();

        $this->assertMatchesRegularExpression('/^VCR-[ABCDFGHJKLMNPRSTVWXYZ23456789]{4}-[ABCDFGHJKLMNPRSTVWXYZ23456789]{4}$/', $voucher->code);
        $this->assertSame($admin->id, $voucher->user_id);
        $this->assertSame($project->id, $voucher->project_id);
        $this->assertSame('active', $voucher->effectiveStatus());
        $this->assertSame(3, $voucher->max_uses);
        $this->assertSame(0, $voucher->used_count);
        $this->assertNull($voucher->valid_from);
        $this->assertSame('2026-12-31', $voucher->expires_at->toDateString());
        $this->assertSame($voucher->code, session('created_voucher')['code'], 'Code must be surfaced for reveal');
    }

    public function test_admin_cannot_create_voucher_for_project_of_another_admin(): void
    {
        $admin = $this->admin();
        $other = $this->admin();
        $otherProject = Project::factory()->create(['user_id' => $other->id]);

        $this->actingAs($admin)
            ->post(route('admin.vouchers.store'), [
                'project_id' => $otherProject->id,
                'max_uses' => 1,
            ])
            ->assertSessionHasErrors('project_id');

        $this->assertDatabaseMissing('vouchers', ['project_id' => $otherProject->id]);
    }

    public function test_generates_unique_voucher_codes(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);
        Voucher::factory()->count(2)->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->post(route('admin.vouchers.store'), [
                'project_id' => $project->id,
                'max_uses' => 1,
            ])
            ->assertRedirect();

        $codes = Voucher::pluck('code')->all();

        $this->assertSame($codes, array_values(array_unique($codes)), 'Voucher codes must be unique');
    }

    public function test_max_uses_is_required_and_minimum_one(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->post(route('admin.vouchers.store'), [
                'project_id' => $project->id,
                'max_uses' => 0,
            ])
            ->assertSessionHasErrors('max_uses');
    }

    public function test_max_uses_cannot_exceed_reasonable_cap(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->post(route('admin.vouchers.store'), [
                'project_id' => $project->id,
                'max_uses' => 10000,
            ])
            ->assertSessionHasErrors('max_uses');
    }

    public function test_expires_at_must_be_after_valid_from(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->post(route('admin.vouchers.store'), [
                'project_id' => $project->id,
                'max_uses' => 1,
                'valid_from' => '2026-12-31',
                'expires_at' => '2026-12-30',
            ])
            ->assertSessionHasErrors('expires_at');
    }

    public function test_admin_can_view_own_voucher(): void
    {
        $admin = $this->admin();
        $voucher = Voucher::factory()->active()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->get(route('admin.vouchers.show', $voucher))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Voucher/Show')
                ->where('voucher.code', $voucher->code)
                ->where('voucher.remaining_uses', 1)
                ->where('can.update', true)
                ->where('can.revoke', true));
    }

    public function test_admin_cannot_view_voucher_of_another_admin(): void
    {
        $admin = $this->admin();
        $other = $this->admin();
        $voucher = Voucher::factory()->create(['user_id' => $other->id]);

        $this->actingAs($admin)->get(route('admin.vouchers.show', $voucher))->assertStatus(403);
    }

    public function test_admin_can_update_valid_voucher(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id, 'name' => 'Proyek A']);
        $voucher = Voucher::factory()->active()->create([
            'user_id' => $admin->id,
            'project_id' => $project->id,
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.vouchers.update', $voucher), [
                'project_id' => $voucher->project_id,
                'max_uses' => 7,
                'valid_from' => '2026-10-01',
                'expires_at' => '2026-12-31',
            ])
            ->assertRedirect(route('admin.vouchers.show', $voucher));

        $voucher->refresh();

        $this->assertSame(7, $voucher->max_uses);
        $this->assertSame('2026-10-01', $voucher->valid_from->toDateString());
        $this->assertSame('2026-12-31', $voucher->expires_at->toDateString());
    }

    public function test_cannot_lower_max_uses_below_used_count(): void
    {
        $admin = $this->admin();
        $voucher = Voucher::factory()->active()->create([
            'user_id' => $admin->id,
            'max_uses' => 5,
            'used_count' => 4,
        ]);

        $this->actingAs($admin)
            ->patch(route('admin.vouchers.update', $voucher), [
                'max_uses' => 3,
            ])
            ->assertSessionHasErrors('max_uses');
    }

    public function test_cannot_change_project_after_usage(): void
    {
        $admin = $this->admin();
        $voucher = Voucher::factory()->create([
            'user_id' => $admin->id,
            'used_count' => 1,
            'max_uses' => 2,
        ]);
        $otherProject = Project::factory()->create(['user_id' => $admin->id, 'name' => 'Proyek Lain']);

        $this->actingAs($admin)
            ->patch(route('admin.vouchers.update', $voucher), [
                'project_id' => $otherProject->id,
                'max_uses' => 2,
            ])
            ->assertSessionHasErrors('project_id');

        $this->assertSame($voucher->project_id, $voucher->refresh()->project_id);
    }

    public function test_revoke_marks_revoked_at_instead_of_deleting(): void
    {
        $admin = $this->admin();
        $voucher = Voucher::factory()->active()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->post(route('admin.vouchers.revoke', $voucher))
            ->assertRedirect(route('admin.vouchers.show', $voucher));

        $voucher->refresh();

        $this->assertNotNull($voucher->revoked_at);
        $this->assertSame('revoked', $voucher->effectiveStatus());
        $this->assertDatabaseHas('vouchers', ['id' => $voucher->id]);
    }

    public function test_revoked_voucher_cannot_be_updated(): void
    {
        $admin = $this->admin();
        $voucher = Voucher::factory()->revoked()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->patch(route('admin.vouchers.update', $voucher), [
                'max_uses' => 5,
            ])
            ->assertSessionHasErrors('voucher');
    }

    public function test_admin_cannot_revoke_voucher_of_another_admin(): void
    {
        $admin = $this->admin();
        $other = $this->admin();
        $voucher = Voucher::factory()->create(['user_id' => $other->id]);

        $this->actingAs($admin)
            ->post(route('admin.vouchers.revoke', $voucher))
            ->assertStatus(403);
    }

    public function test_super_admin_can_view_update_and_revoke_any_voucher(): void
    {
        $super = $this->superAdmin();
        $admin = $this->admin();
        $voucher = Voucher::factory()->active()->create(['user_id' => $admin->id]);

        $this->actingAs($super)->get(route('admin.vouchers.show', $voucher))->assertOk();

        $this->actingAs($super)
            ->patch(route('admin.vouchers.update', $voucher), [
                'max_uses' => 4,
            ])
            ->assertRedirect();

        $this->actingAs($super)
            ->post(route('admin.vouchers.revoke', $voucher))
            ->assertRedirect();

        $this->assertNotNull($voucher->refresh()->revoked_at);
    }

    public function test_booth_cannot_access_voucher_area(): void
    {
        $booth = User::factory()->create(['role' => UserRole::BOOTH]);

        $this->actingAs($booth)->get(route('admin.vouchers.index'))->assertStatus(403);
        $this->actingAs($booth)->post(route('admin.vouchers.store'), [])->assertStatus(403);
    }

    public function test_guest_is_redirected_to_login_from_voucher_area(): void
    {
        $this->get(route('admin.vouchers.index'))->assertRedirect(route('login'));
    }
}