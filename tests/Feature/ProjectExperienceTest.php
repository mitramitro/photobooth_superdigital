<?php

namespace Tests\Feature;

use App\Enums\ProjectFilter;
use App\Enums\ProjectFrame;
use App\Enums\ProjectLayout;
use App\Enums\ProjectTimer;
use App\Enums\UserRole;
use App\Models\Project;
use App\Models\ProjectExperienceSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectExperienceTest extends TestCase
{
    use RefreshDatabase;

    private const PATCH_VALID = [
        'timer_seconds' => 10,
        'layout' => 'grid_4',
        'frame' => 'wedding',
        'filter' => 'warm',
        'brightness' => 25,
    ];

    private function admin(): User
    {
        return User::factory()->create(['role' => UserRole::ADMIN]);
    }

    private function superAdmin(): User
    {
        return User::factory()->create(['role' => UserRole::SUPER_ADMIN]);
    }

    private function booth(): User
    {
        return User::factory()->create(['role' => UserRole::BOOTH]);
    }

    // ── Rendering & authorization ───────────────────────────────────────────

    public function test_admin_can_view_own_project_experience_page(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);
        $project->experienceSetting()->create(ProjectExperienceSetting::defaults());

        $this->actingAs($admin)
            ->get(route('admin.projects.experience', $project))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Projects/Show')
                ->where('project.name', $project->name)
                ->where('experience.timer_seconds', ProjectTimer::FIVE->value)
                ->where('experience.layout', ProjectLayout::SINGLE->value)
                ->where('experience.frame', ProjectFrame::NONE->value)
                ->where('experience.filter', ProjectFilter::ORIGINAL->value)
                ->where('experience.brightness', 0)
                ->where('can.update', true));
    }

    public function test_legacy_show_route_still_renders_experience_props(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->get(route('admin.projects.show', $project))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Projects/Show')
                ->where('experience.timer_seconds', ProjectTimer::FIVE->value)
                ->where('can.update', true));
    }

    public function test_guest_is_redirected_to_login_from_experience_page(): void
    {
        $project = Project::factory()->create();

        $this->get(route('admin.projects.experience', $project))->assertRedirect(route('login'));
    }

    public function test_admin_cannot_view_other_users_project_experience(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $this->admin()->id]);

        $this->actingAs($admin)
            ->get(route('admin.projects.experience', $project))
            ->assertStatus(403);
    }

    public function test_booth_cannot_access_experience_page(): void
    {
        $booth = $this->booth();
        $project = Project::factory()->create();

        $this->actingAs($booth)
            ->get(route('admin.projects.experience', $project))
            ->assertStatus(403);
    }

    // ── Defaults & backfill ─────────────────────────────────────────────────

    public function test_new_project_gets_default_experience_settings_on_create(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post(route('admin.projects.store'), [
            'name' => 'Mall Photobox Indramayu',
            'type' => 'retail',
            'orientation' => 'portrait',
        ]);

        $this->assertDatabaseHas('project_experience_settings', [
            'timer_seconds' => ProjectTimer::FIVE->value,
            'layout' => ProjectLayout::SINGLE->value,
            'frame' => ProjectFrame::NONE->value,
            'filter' => ProjectFilter::ORIGINAL->value,
            'brightness' => 0,
        ]);
    }

    public function test_viewing_project_without_settings_backfills_defaults(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);
        $this->assertDatabaseCount('project_experience_settings', 0);

        $this->actingAs($admin)->get(route('admin.projects.show', $project));

        $this->assertDatabaseHas('project_experience_settings', [
            'project_id' => $project->id,
            'timer_seconds' => ProjectTimer::FIVE->value,
            'layout' => ProjectLayout::SINGLE->value,
            'frame' => ProjectFrame::NONE->value,
            'filter' => ProjectFilter::ORIGINAL->value,
            'brightness' => 0,
        ]);
    }

    public function test_experience_route_backfills_defaults_for_project_without_settings(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)->get(route('admin.projects.experience', $project));

        $this->assertDatabaseCount('project_experience_settings', 1);
        $this->assertDatabaseHas('project_experience_settings', ['project_id' => $project->id]);
    }

    public function test_update_backfills_defaults_then_persists_values(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);
        $this->assertDatabaseCount('project_experience_settings', 0);

        $this->actingAs($admin)->patch(route('admin.projects.experience.update', $project), self::PATCH_VALID);

        $this->assertDatabaseHas('project_experience_settings', [
            'project_id' => $project->id,
            'timer_seconds' => 10,
            'layout' => 'grid_4',
            'frame' => 'wedding',
            'filter' => 'warm',
            'brightness' => 25,
        ]);
    }

    // ── Update persistence & authorization ──────────────────────────────────

    public function test_admin_can_update_own_project_experience(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);
        $project->experienceSetting()->create(ProjectExperienceSetting::defaults());

        $this->actingAs($admin)
            ->patch(route('admin.projects.experience.update', $project), self::PATCH_VALID)
            ->assertRedirect(route('admin.projects.experience', $project));

        $project->refresh();
        $settings = $project->experienceSetting->fresh();

        $this->assertSame(10, $settings->timer_seconds);
        $this->assertSame('grid_4', $settings->layout->value);
        $this->assertSame('wedding', $settings->frame->value);
        $this->assertSame('warm', $settings->filter->value);
        $this->assertSame(25, $settings->brightness);
    }

    public function test_super_admin_can_update_any_project_experience(): void
    {
        $super = $this->superAdmin();
        $project = Project::factory()->create(['user_id' => $this->admin()->id]);

        $this->actingAs($super)
            ->patch(route('admin.projects.experience.update', $project), self::PATCH_VALID)
            ->assertRedirect(route('admin.projects.experience', $project));

        $this->assertDatabaseHas('project_experience_settings', [
            'project_id' => $project->id,
            'timer_seconds' => 10,
        ]);
    }

    public function test_admin_cannot_update_other_users_project_experience(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $this->admin()->id]);

        $this->actingAs($admin)
            ->patch(route('admin.projects.experience.update', $project), self::PATCH_VALID)
            ->assertStatus(403);

        $this->assertDatabaseCount('project_experience_settings', 0);
    }

    public function test_booth_cannot_update_project_experience(): void
    {
        $booth = $this->booth();
        $project = Project::factory()->create();

        $this->actingAs($booth)
            ->patch(route('admin.projects.experience.update', $project), self::PATCH_VALID)
            ->assertStatus(403);

        $this->assertDatabaseCount('project_experience_settings', 0);
    }

    public function test_guest_is_redirected_to_login_when_updating_experience(): void
    {
        $project = Project::factory()->create();

        $this->patch(route('admin.projects.experience.update', $project), self::PATCH_VALID)
            ->assertRedirect(route('login'));

        $this->assertDatabaseCount('project_experience_settings', 0);
    }

    // ── Validation ──────────────────────────────────────────────────────────

    public function test_timer_seconds_must_be_in_3_5_10(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->patch(route('admin.projects.experience.update', $project), [...self::PATCH_VALID, 'timer_seconds' => 4])
            ->assertSessionHasErrors('timer_seconds');
    }

    public function test_timer_seconds_is_required(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->patch(route('admin.projects.experience.update', $project), [...self::PATCH_VALID, 'timer_seconds' => null])
            ->assertSessionHasErrors('timer_seconds');
    }

    public function test_layout_must_be_a_valid_option(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->patch(route('admin.projects.experience.update', $project), [...self::PATCH_VALID, 'layout' => 'diagonal'])
            ->assertSessionHasErrors('layout');

        $this->assertDatabaseCount('project_experience_settings', 0);
    }

    public function test_frame_must_be_a_valid_option(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->patch(route('admin.projects.experience.update', $project), [...self::PATCH_VALID, 'frame' => 'neon'])
            ->assertSessionHasErrors('frame');
    }

    public function test_filter_must_be_a_valid_option(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->patch(route('admin.projects.experience.update', $project), [...self::PATCH_VALID, 'filter' => 'sepia-heavy'])
            ->assertSessionHasErrors('filter');
    }

    public function test_every_valid_option_value_is_accepted(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        foreach (ProjectLayout::values() as $layout) {
            $this->patchOne($admin, $project, ['layout' => $layout])->assertSessionHasNoErrors();
        }

        foreach (ProjectFrame::values() as $frame) {
            $this->patchOne($admin, $project, ['frame' => $frame])->assertSessionHasNoErrors();
        }

        foreach (ProjectFilter::values() as $filter) {
            $this->patchOne($admin, $project, ['filter' => $filter])->assertSessionHasNoErrors();
        }

        $this->assertDatabaseCount('project_experience_settings', 1);
    }

    private function patchOne(User $user, Project $project, array $overrides): \Illuminate\Testing\TestResponse
    {
        return $this->actingAs($user)->patch(
            route('admin.projects.experience.update', $project),
            [...self::PATCH_VALID, ...$overrides]
        );
    }

    public function test_brightness_must_be_between_minus_100_and_100(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->patch(route('admin.projects.experience.update', $project), [...self::PATCH_VALID, 'brightness' => -101])
            ->assertSessionHasErrors('brightness');

        $this->actingAs($admin)
            ->patch(route('admin.projects.experience.update', $project), [...self::PATCH_VALID, 'brightness' => 101])
            ->assertSessionHasErrors('brightness');
    }

    public function test_brightness_accepts_boundary_values(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->patch(route('admin.projects.experience.update', $project), [
                ...self::PATCH_VALID,
                'brightness' => -100,
                'timer_seconds' => 5,
            ])
            ->assertSessionHasNoErrors();

        $this->actingAs($admin)
            ->patch(route('admin.projects.experience.update', $project), [
                ...self::PATCH_VALID,
                'brightness' => 100,
                'timer_seconds' => 5,
            ])
            ->assertSessionHasNoErrors();

        $this->assertDatabaseHas('project_experience_settings', ['project_id' => $project->id, 'brightness' => 100]);
    }

    // ── Lifecycle ───────────────────────────────────────────────────────────

    public function test_deleting_project_cascades_experience_settings(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);
        $project->experienceSetting()->create(ProjectExperienceSetting::defaults());

        $this->actingAs($admin)->delete(route('admin.projects.destroy', $project));

        $this->assertDatabaseMissing('project_experience_settings', ['project_id' => $project->id]);
    }
}