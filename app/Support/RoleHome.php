<?php

namespace App\Support;

use App\Enums\UserRole;
use App\Models\User;

class RoleHome
{
    /**
     * Resolve the landing page for a user based on their role.
     */
    public static function for(User $user): string
    {
        return $user->role === UserRole::BOOTH
            ? '/booth'
            : route('dashboard', absolute: false);
    }
}