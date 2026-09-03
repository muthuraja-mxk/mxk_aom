<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function check(): JsonResponse
    {
        $dbStatus = 'disconnected';
        $dbDriver = null;
        $mysqlVersion = null;

        try {
            $pdo = DB::connection()->getPdo();
            $dbStatus = 'connected';
            $dbDriver = DB::connection()->getDriverName();
            $versionQuery = DB::select('SELECT VERSION() as version');
            $mysqlVersion = $versionQuery[0]->version ?? 'unknown';
        } catch (\Throwable $e) {
            $dbStatus = 'error: ' . $e->getMessage();
        }

        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
            'environment' => config('app.env'),
            'runtime' => [
                'framework' => 'Laravel 13',
                'php_version' => PHP_VERSION,
                'sapi' => php_sapi_name(),
            ],
            'database' => [
                'status' => $dbStatus,
                'driver' => $dbDriver,
                'version' => $mysqlVersion,
                'target' => 'MySQL 9.7',
            ],
        ]);
    }
}
