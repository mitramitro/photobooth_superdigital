<?php

namespace App\Enums;

enum ProjectType: string
{
    case RETAIL = 'retail';
    case EVENT = 'event';
    case SELF = 'self';
}