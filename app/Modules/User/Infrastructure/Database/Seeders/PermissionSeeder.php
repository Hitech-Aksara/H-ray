<?php

declare(strict_types=1);

namespace App\Modules\User\Infrastructure\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Dashboard
            'dashboard.index',

            // Employee Management
            'employee.index',
            'employee.create',
            'employee.edit',
            'employee.delete',

            // User Management
            'user.user.index',
            'user.user.action',
            'user.user.delete',

            // Role Management
            'user.role.index',
            'user.role.action',
            'user.role.assign',
            'user.role.delete',

            // Permission Management
            'user.permission.index',
            'user.permission.action',
            'user.permission.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission], [
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
    }
}
