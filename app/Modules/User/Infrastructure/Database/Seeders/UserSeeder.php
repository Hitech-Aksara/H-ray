<?php

declare(strict_types=1);

namespace App\Modules\User\Infrastructure\Database\Seeders;

use App\Modules\User\Infrastructure\Database\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'role' => 'Super Admin',
                'email' => 'super@admin.com',
            ],
        ];

        foreach ($users as $user) {
            $userCreated = User::updateOrCreate(
                [
                    'email' => $user['email'],
                ],
                [
                    'name' => $user['name'] ?? $user['role'],
                    'password' => bcrypt($user['email']),
                ]
            );

            $userCreated->assignRole($user['role']);
        }
    }
}
