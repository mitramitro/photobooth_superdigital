<?php

namespace App\Enums;

enum DeviceEventType: string
{
    case CREATED = 'created';
    case PAIRED = 'paired';
    case PROJECT_ASSIGNED = 'project_assigned';
    case PROJECT_UNASSIGNED = 'project_unassigned';
    case REVOKED = 'revoked';
    case APP_VERSION_CHANGED = 'app_version_changed';

    /**
     * All allowed event keys.
     *
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}