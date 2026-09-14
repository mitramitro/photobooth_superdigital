<?php

namespace Tests\Feature;

use App\Enums\ProjectOrientation;
use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use App\Enums\UserRole;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    private const STORE_VALID = [
        'name' => 'Mall Photobox Indramayu',
        'type' => 'retail',
        'orientation' => 'portrait',
        'status' => 'active',
    ];

    private function admin(): User
    {
        return User::factory()->create(['role' => UserRole::ADMIN]);
    }

    private function superAdmin(): User
    {
        return User::factory()->create(['role' => UserRole::SUPER_ADMIN]);
    }

    public function test_admin_can_view_project_index(): void
    {
        $admin = $this->admin();
        Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->get(route('admin.projects.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Projects/Index')
                ->has('projects.data', 1));
    }

    public function test_admin_only_sees_own_projects_in_index(): void
    {
        $admin = $this->admin();
        $other = $this->admin();

        Project::factory()->create(['user_id' => $admin->id, 'name' => 'Milik Admin']);
        Project::factory()->create(['user_id' => $other->id, 'name' => 'Milik Admin Lain']);

        $this->actingAs($admin)
            ->get(route('admin.projects.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('projects.total', 1)
                ->has('projects.data', 1, fn (Assert $item) => $item
                    ->where('name', 'Milik Admin')
                    ->etc()));
    }

    public function test_super_admin_sees_all_projects_in_index(): void
    {
        $super = $this->superAdmin();
        $admin = $this->admin();

        Project::factory()->create(['user_id' => $admin->id]);
        Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($super)
            ->get(route('admin.projects.index'))
            ->assertInertia(fn (Assert $page) => $page->where('projects.total', 2));
    }

    public function test_index_can_filter_projects_by_status(): void
    {
        $admin = $this->admin();

        Project::factory()->create(['user_id' => $admin->id, 'name' => 'Proyek Aktif', 'status' => ProjectStatus::ACTIVE]);
        Project::factory()->create(['user_id' => $admin->id, 'name' => 'Proyek Draf', 'status' => ProjectStatus::DRAFT]);

        $this->actingAs($admin)
            ->get(route('admin.projects.index', ['status' => 'active']))
            ->assertInertia(fn (Assert $page) => $page
                ->where('projects.total', 1)
                ->where('filters.status', 'active')
                ->has('projects.data', 1, fn (Assert $item) => $item
                    ->where('name', 'Proyek Aktif')
                    ->etc()));
    }

    public function test_booth_cannot_access_project_area(): void
    {
        $booth = User::factory()->create(['role' => UserRole::BOOTH]);

        $this->actingAs($booth)->get(route('admin.projects.index'))->assertStatus(403);
    }

    public function test_guest_is_redirected_to_login_from_project_area(): void
    {
        $this->get(route('admin.projects.index'))->assertRedirect(route('login'));
    }

    public function test_admin_can_create_project(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post(route('admin.projects.store'), self::STORE_VALID)
            ->assertRedirect(route('admin.projects.index'));

        $this->assertDatabaseHas('projects', [
            'user_id' => $admin->id,
            'name' => 'Mall Photobox Indramayu',
            'type' => ProjectType::RETAIL->value,
            'orientation' => ProjectOrientation::PORTRAIT->value,
            'status' => ProjectStatus::ACTIVE->value,
        ]);
    }

    public function test_new_project_defaults_to_draft_status(): void
    {
        $admin = $this->admin();

        $data = array_diff_key(self::STORE_VALID, ['status' => true]);

        $this->actingAs($admin)->post(route('admin.projects.store'), $data);

        $this->assertDatabaseHas('projects', [
            'user_id' => $admin->id,
            'name' => 'Mall Photobox Indramayu',
            'status' => ProjectStatus::DRAFT->value,
        ]);
    }

    public function test_admin_cannot_create_project_with_invalid_type(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post(route('admin.projects.store'), [...self::STORE_VALID, 'type' => 'kiosk'])
            ->assertSessionHasErrors('type');

        $this->assertDatabaseCount('projects', 0);
    }

    public function test_project_name_is_required(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post(route('admin.projects.store'), [...self::STORE_VALID, 'name' => ''])
            ->assertSessionHasErrors('name');

        $this->assertDatabaseCount('projects', 0);
    }

    public function test_admin_cannot_create_project_with_invalid_orientation(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post(route('admin.projects.store'), [...self::STORE_VALID, 'orientation' => 'square'])
            ->assertSessionHasErrors('orientation');

        $this->assertDatabaseCount('projects', 0);
    }

    public function test_welcome_image_is_stored_on_project_create(): void
    {
        Storage::fake('public');

        $admin = $this->admin();

        $this->actingAs($admin)->post(route('admin.projects.store'), [
            ...self::STORE_VALID,
            'welcome_image' => UploadedFile::fake()->image('welcome.png')->size(100),
        ]);

        $this->assertDatabaseHas('projects', ['name' => 'Mall Photobox Indramayu']);

        $project = Project::where('user_id', $admin->id)->firstOrFail();
        Storage::disk('public')->assertExists($project->welcome_image);
    }

    public function test_project_rejects_non_image_welcome_file(): void
    {
        Storage::fake('public');

        $admin = $this->admin();

        $this->actingAs($admin)->post(route('admin.projects.store'), [
            ...self::STORE_VALID,
            'welcome_image' => UploadedFile::fake()->create('notes.txt', 10),
        ])->assertSessionHasErrors('welcome_image');

        $this->assertDatabaseCount('projects', 0);
    }

    public function test_admin_can_view_own_project(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->get(route('admin.projects.show', $project))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Projects/Show')
                ->where('project.name', $project->name)
                ->where('can.update', true));
    }

    public function test_admin_cannot_view_other_users_project(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $this->admin()->id]);

        $this->actingAs($admin)->get(route('admin.projects.show', $project))->assertStatus(403);
    }

    public function test_admin_cannot_edit_other_users_project(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $this->admin()->id]);

        $this->actingAs($admin)->get(route('admin.projects.edit', $project))->assertStatus(403);
    }

    public function test_admin_cannot_update_other_users_project(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $this->admin()->id]);

        $this->actingAs($admin)->put(route('admin.projects.update', $project), [
            'name' => 'Nama Baru',
            'orientation' => ProjectOrientation::LANDSCAPE->value,
        ])->assertStatus(403);

        $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => $project->name]);
    }

    public function test_admin_cannot_delete_other_users_project(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $this->admin()->id]);

        $this->actingAs($admin)->delete(route('admin.projects.destroy', $project))->assertStatus(403);

        $this->assertDatabaseHas('projects', ['id' => $project->id]);
    }

    public function test_admin_can_update_own_project(): void
    {
        $admin = $this->admin();
        $project = Project::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)->put(route('admin.projects.update', $project), [
            'name' => 'Nama Diperbarui',
            'orientation' => ProjectOrientation::LANDSCAPE->value,
            'status' => ProjectStatus::INACTIVE->value,
        ])->assertRedirect(route('admin.projects.index'));

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Nama Diperbarui',
            'orientation' => ProjectOrientation::LANDSCAPE->value,
            'status' => ProjectStatus::INACTIVE->value,
        ]);
    }

    public function test_super_admin_can_update_any_project(): void
    {
        $super = $this->superAdmin();
        $project = Project::factory()->create(['user_id' => $this->admin()->id]);

        $this->actingAs($super)->put(route('admin.projects.update', $project), [
            'name' => 'Diubah Super Admin',
            'orientation' => 'portrait',
        ])->assertRedirect(route('admin.projects.index'));

        $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Diubah Super Admin']);
    }

    public function test_super_admin_can_delete_any_project(): void
    {
        $super = $this->superAdmin();
        $project = Project::factory()->create(['user_id' => $this->admin()->id]);

        $this->actingAs($super)
            ->delete(route('admin.projects.destroy', $project))
            ->assertRedirect(route('admin.projects.index'));

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_replacing_welcome_image_deletes_previous_file(): void
    {
        Storage::fake('public');

        $admin = $this->admin();
        $old = UploadedFile::fake()->image('old.png')->size(100);
        $project = Project::factory()->create([
            'user_id' => $admin->id,
            'welcome_image' => $old->store('projects/welcome', 'public'),
        ]);
        $oldPath = $project->welcome_image;

        $new = UploadedFile::fake()->image('new.png')->size(100);

        $response = $this->actingAs($admin)->put(route('admin.projects.update', $project), [
            'name' => $project->name,
            'orientation' => $project->orientation->value,
            'welcome_image' => $new,
        ]);

        $response->assertRedirect(route('admin.projects.index'));
        $response->assertSessionHasNoErrors();

        $project->refresh();

        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($project->welcome_image);
    }

    public function test_deleting_project_deletes_its_welcome_image(): void
    {
        Storage::fake('public');

        $admin = $this->admin();
        $project = Project::factory()->create([
            'user_id' => $admin->id,
            'welcome_image' => UploadedFile::fake()->image('welcome.png')->size(100)->store('projects/welcome', 'public'),
        ]);

        $this->actingAs($admin)->delete(route('admin.projects.destroy', $project));

        Storage::disk('public')->assertMissing($project->welcome_image);
    }
}