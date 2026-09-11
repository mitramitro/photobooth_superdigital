<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_booth_user_is_redirected_to_booth_station_after_login(): void
    {
        $user = User::factory()->create(['role' => UserRole::BOOTH]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/booth');
    }

    public function test_admin_user_is_redirected_to_dashboard_after_login(): void
    {
        $user = User::factory()->create(['role' => UserRole::ADMIN]);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('dashboard'));
    }

    public function test_booth_user_cannot_access_admin_area(): void
    {
        $user = User::factory()->create(['role' => UserRole::BOOTH]);

        $response = $this->actingAs($user)->get('/admin/projects');

        $response->assertStatus(403);
    }

    public function test_super_admin_can_access_admin_area(): void
    {
        $user = User::factory()->create(['role' => UserRole::SUPER_ADMIN]);

        $response = $this->actingAs($user)->get('/admin/projects');

        $response->assertOk();
    }

    public function test_guests_are_redirected_to_login_from_admin_area(): void
    {
        $this->get('/admin/projects')->assertRedirect(route('login'));
    }

    public function test_booth_station_requires_booth_role(): void
    {
        $user = User::factory()->create(['role' => UserRole::ADMIN]);

        $this->actingAs($user)->get('/booth')->assertStatus(403);
    }

    public function test_booth_station_is_rendered_for_booth_user(): void
    {
        $user = User::factory()->create(['role' => UserRole::BOOTH]);

        $this->actingAs($user)->get('/booth')->assertOk();
    }
}