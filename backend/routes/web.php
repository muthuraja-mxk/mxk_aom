<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'service' => 'Laravel 13 REST API',
        'version' => '1.0.0',
        'php_version' => PHP_VERSION,
        'status' => 'online',
        'docs' => [
            'health_check' => '/api/v1/health',
            'items_resource' => '/api/v1/items'
        ]
    ]);
});
