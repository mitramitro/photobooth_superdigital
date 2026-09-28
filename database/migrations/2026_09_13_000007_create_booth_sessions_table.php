<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booth_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_code', 16)->unique();
            // History preservation: a session row is an audit record and must
            // not disappear when a device, project or voucher changes.
            $table->foreignId('device_id')->constrained()->restrictOnDelete();
            $table->foreignId('project_id')->constrained()->restrictOnDelete();
            $table->foreignId('voucher_id')->nullable()->constrained()->nullOnDelete();
            $table->string('mode', 16)->default('self_service');
            $table->string('status', 16)->default('active');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            // Serves the "one active session per device" lookup.
            $table->index(['device_id', 'status']);
            $table->index(['project_id', 'status']);
            $table->index('voucher_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booth_sessions');
    }
};
