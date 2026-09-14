<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Device;
use App\Models\User;

class DevicePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::SUPER_ADMIN], true);
    }

    public function view(User $user, Device $device): bool
    {
        return $user->role === UserRole::SUPER_ADMIN || $device->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::SUPER_ADMIN], true);
    }

    public function update(User $user, Device $device): bool
    {
        return $user->role === UserRole::SUPER_ADMIN || $device->user_id === $user->id;
    }

    public function revoke(User $user, Device $device): bool
    {
        return $user->role === UserRole::SUPER_ADMIN || $device->user_id === $user->id;
    }
}