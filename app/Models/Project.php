<?php

namespace App\Models;

use App\Enums\ProjectOrientation;
use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

#[Fillable(['user_id', 'name', 'type', 'orientation', 'welcome_image', 'status'])]
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    protected $appends = ['welcome_image_url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ProjectType::class,
            'orientation' => ProjectOrientation::class,
            'status' => ProjectStatus::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function experienceSetting(): HasOne
    {
        return $this->hasOne(ProjectExperienceSetting::class);
    }

    public function getWelcomeImageUrlAttribute(): ?string
    {
        if (! $this->welcome_image) {
            return null;
        }

        return Storage::disk('public')->url($this->welcome_image);
    }
}