<?php

namespace App\Models;

use App\Enums\ProjectFilter;
use App\Enums\ProjectFrame;
use App\Enums\ProjectLayout;
use Database\Factories\ProjectExperienceSettingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['project_id', 'timer_seconds', 'layout', 'frame', 'filter', 'brightness'])]
class ProjectExperienceSetting extends Model
{
    /** @use HasFactory<ProjectExperienceSettingFactory> */
    use HasFactory;

    public const DEFAULT_TIMER = 5;
    public const DEFAULT_LAYOUT = 'single';
    public const DEFAULT_FRAME = 'none';
    public const DEFAULT_FILTER = 'original';
    public const DEFAULT_BRIGHTNESS = 0;

    /**
     * Default configuration used when a project has no settings yet.
     *
     * @return array<string, int|string>
     */
    public static function defaults(): array
    {
        return [
            'timer_seconds' => self::DEFAULT_TIMER,
            'layout' => self::DEFAULT_LAYOUT,
            'frame' => self::DEFAULT_FRAME,
            'filter' => self::DEFAULT_FILTER,
            'brightness' => self::DEFAULT_BRIGHTNESS,
        ];
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'timer_seconds' => 'integer',
            'layout' => ProjectLayout::class,
            'frame' => ProjectFrame::class,
            'filter' => ProjectFilter::class,
            'brightness' => 'integer',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}