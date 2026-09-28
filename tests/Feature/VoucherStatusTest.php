<?php

namespace Tests\Feature;

use App\Enums\ProjectStatus;
use App\Models\Voucher;
use App\Services\VoucherService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VoucherStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_fresh_voucher_is_active_and_usable(): void
    {
        $voucher = Voucher::factory()->active()->create();

        $this->assertSame('active', $voucher->effectiveStatus());
        $this->assertTrue($voucher->isUsable());
    }

    public function test_revoked_voucher_has_revoked_effective_status(): void
    {
        $voucher = Voucher::factory()->revoked()->create();

        $this->assertSame('revoked', $voucher->effectiveStatus());
        $this->assertFalse($voucher->isUsable());
    }

    public function test_future_valid_from_stays_active_but_reports_not_started(): void
    {
        $voucher = Voucher::factory()->active()->create([
            'valid_from' => now()->addDay()->toDateString(),
        ]);

        $this->assertSame('active', $voucher->effectiveStatus());
        $this->assertFalse($voucher->isUsable(), 'Not yet started vouchers must not be usable');

        $result = app(VoucherService::class)->validate($voucher, null);

        $this->assertSame(['valid' => false, 'reason' => 'not_started'], $result);
    }

    public function test_expired_voucher_has_expired_effective_status(): void
    {
        $voucher = Voucher::factory()->expired()->create();

        $this->assertSame('expired', $voucher->effectiveStatus());
        $this->assertFalse($voucher->isUsable());
    }

    public function test_voucher_with_used_count_reaching_max_uses_is_used(): void
    {
        $voucher = Voucher::factory()->create([
            'max_uses' => 3,
            'used_count' => 3,
        ]);

        $this->assertSame(3, $voucher->used_count);
        $this->assertSame('used', $voucher->effectiveStatus());
        $this->assertFalse($voucher->isUsable());
        $this->assertSame(0, $voucher->remainingUses());
    }

    public function test_remaining_usage_calculation_is_correct(): void
    {
        $voucher = Voucher::factory()->active()->create([
            'max_uses' => 10,
            'used_count' => 4,
        ]);

        $this->assertSame(6, $voucher->remainingUses());
        $this->assertSame('active', $voucher->effectiveStatus());
        $this->assertTrue($voucher->isUsable());
    }

    public function test_full_usage_with_future_start_date_still_reports_used(): void
    {
        $voucher = Voucher::factory()->active()->create([
            'max_uses' => 2,
            'used_count' => 2,
            'valid_from' => now()->addDay()->toDateString(),
        ]);

        $this->assertSame('used', $voucher->effectiveStatus());
    }

    public function test_revoked_wins_over_usage_and_expiry(): void
    {
        $voucher = Voucher::factory()->create([
            'max_uses' => 1,
            'used_count' => 1,
            'expires_at' => now()->subDay()->toDateString(),
            'revoked_at' => now()->subHour(),
        ]);

        $this->assertSame('revoked', $voucher->effectiveStatus());
    }

    public function test_expired_wins_over_used_count(): void
    {
        $voucher = Voucher::factory()->create([
            'max_uses' => 1,
            'used_count' => 1,
            'expires_at' => now()->subDay()->toDateString(),
            'revoked_at' => null,
        ]);

        $this->assertSame('expired', $voucher->effectiveStatus());
    }

    public function test_inactive_project_blocks_service_validation(): void
    {
        $voucher = Voucher::factory()->active()->create();
        $voucher->project()->update(['status' => ProjectStatus::DRAFT->value]);

        $device = \App\Models\Device::factory()->create(['project_id' => $voucher->project_id]);

        $result = app(VoucherService::class)->validate($voucher, $device);

        $this->assertSame(['valid' => false, 'reason' => 'project_inactive'], $result);
    }

    public function test_project_mismatch_blocks_service_validation(): void
    {
        $voucher = Voucher::factory()->active()->create([
            'project_id' => \App\Models\Project::factory()->create(['status' => ProjectStatus::ACTIVE->value])->id,
        ]);

        $device = \App\Models\Device::factory()->create([
            'project_id' => \App\Models\Project::factory()->create(['status' => ProjectStatus::ACTIVE->value])->id,
        ]);

        $result = app(VoucherService::class)->validate($voucher, $device);

        $this->assertSame(['valid' => false, 'reason' => 'project_mismatch'], $result);
    }
}