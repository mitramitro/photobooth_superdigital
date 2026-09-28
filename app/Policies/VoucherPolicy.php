<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Voucher;

class VoucherPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::SUPER_ADMIN], true);
    }

    public function view(User $user, Voucher $voucher): bool
    {
        return $user->role === UserRole::SUPER_ADMIN || $voucher->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [UserRole::ADMIN, UserRole::SUPER_ADMIN], true);
    }

    public function update(User $user, Voucher $voucher): bool
    {
        return $user->role === UserRole::SUPER_ADMIN || $voucher->user_id === $user->id;
    }

    public function revoke(User $user, Voucher $voucher): bool
    {
        return $user->role === UserRole::SUPER_ADMIN || $voucher->user_id === $user->id;
    }
}