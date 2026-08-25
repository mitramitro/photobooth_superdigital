<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Scalar Domain & Path
    |--------------------------------------------------------------------------
    */
    'domain' => null,
    'path' => '/scalar',

    /*
    |--------------------------------------------------------------------------
    | Scalar Route Middleware
    |--------------------------------------------------------------------------
    */
    'middleware' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Scalar OpenAPI Document File & URL
    |--------------------------------------------------------------------------
    */
    'url' => '/openapi.json',
    'content' => null,
    'file' => public_path('openapi.json'),

    'sources' => [],

    'cdn' => 'https://cdn.jsdelivr.net/npm/@scalar/api-reference',

    /*
    |--------------------------------------------------------------------------
    | Scalar Configuration (Theme & Features)
    |--------------------------------------------------------------------------
    */
    'configuration' => [
        'theme' => 'deepSpace',
        'layout' => 'modern',
        'proxyUrl' => 'https://proxy.scalar.com',
        'showSidebar' => true,
        'hideModels' => false,
        'documentDownloadType' => 'both',
        'hideTestRequestButton' => false,
        'hideSearch' => false,
        'darkMode' => true,
        'forceDarkModeState' => 'dark',
        'hideDarkModeToggle' => false,
        'searchHotKey' => 'k',
        'metaData' => [
            'title' => 'Photobooth Studio Sanctum API - Scalar Galaxy Reference',
        ],
        'favicon' => '',
        'hiddenClients' => [],
        'defaultHttpClient' => [
            'targetKey' => 'shell',
            'clientKey' => 'curl',
        ],
        'withDefaultFonts' => true,
        'defaultOpenAllTags' => true,
        'defaultOpenFirstTag' => true,
        'showOperationId' => false,
        'hideClientButton' => false,
        'expandAllModelSections' => false,
        'expandAllResponses' => true,
        'expandAllSchemaProperties' => true,
        'modelsSectionLabel' => 'Schemas',
        'operationTitleSource' => 'summary',
        'orderRequiredPropertiesFirst' => true,
        'orderSchemaPropertiesBy' => 'alpha',
        'operationsSorter' => 'alpha',
        'persistAuth' => true,
        'telemetry' => false,
        'showDeveloperTools' => 'always',
    ],
];
