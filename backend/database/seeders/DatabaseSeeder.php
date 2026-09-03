<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Item;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Item::firstOrCreate(
            ['title' => 'Docker Monorepo Setup'],
            [
                'description' => 'Containerized environment running Laravel 13 (PHP 8.4), Next.js 16.3 (Node 26), and MySQL 9.7.',
                'status' => 'completed',
                'priority' => 'high',
                'metadata' => [
                    'stack' => ['PHP 8.4', 'Laravel 13', 'Next.js 16.3', 'Node 26', 'MySQL 9.7'],
                    'architecture' => 'REST API Monorepo',
                ],
            ]
        );

        Item::firstOrCreate(
            ['title' => 'REST API Health Check Endpoint'],
            [
                'description' => 'Provides database diagnostic status, PHP runtime parameters, and server details.',
                'status' => 'completed',
                'priority' => 'medium',
                'metadata' => ['endpoint' => '/api/v1/health'],
            ]
        );

        Item::firstOrCreate(
            ['title' => 'Next.js 16 Dashboard Interface'],
            [
                'description' => 'Modern interactive frontend with real-time API monitoring and resource CRUD management.',
                'status' => 'in_progress',
                'priority' => 'high',
                'metadata' => ['node_version' => '26.x'],
            ]
        );
    }
}
