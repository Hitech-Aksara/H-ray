<?php

declare(strict_types=1);

namespace App\Modules\User\Infrastructure\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'Super Admin',
            'Admin',
            'HR Admin',
            'Manager',
            'Employee',
        ];

        foreach ($roles as $roleName) {
            $role = Role::updateOrCreate(
                ['name' => $roleName],
                [
                    'name' => $roleName,
                    'guard_name' => 'web',
                ]
            );

            if ($roleName === 'Super Admin') {
                $role->syncPermissions(Permission::all());
            }
        }
    }
}
