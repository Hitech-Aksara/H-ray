<?php

declare(strict_types=1);

namespace App\Modules\User\Infrastructure\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $superAdminRole = Role::where('name', 'Super Admin')->first();
        if ($superAdminRole) {
            $allPermissions = Permission::where('guard_name', 'web')->pluck('name')->toArray();
            $superAdminRole->syncPermissions($allPermissions);
        }

        $adminRole = Role::where('name', 'Admin')->first();
        if ($adminRole) {
            $adminPermissions = [
                'dashboard.index',
                'employee.index',
                'employee.create',
                'employee.edit',
                'employee.delete',
                'user.user.index',
                'user.user.action',
                'user.user.delete',
                'user.role.index',
                'user.role.action',
                'user.role.assign',
                'user.role.delete',
                'user.permission.index',
                'user.permission.action',
                'user.permission.delete',
            ];
            $this->assignPermissionsToRole($adminRole, $adminPermissions);
        }

        $hrAdminRole = Role::where('name', 'HR Admin')->first();
        if ($hrAdminRole) {
            $hrAdminPermissions = [
                'dashboard.index',
                'employee.index',
                'employee.create',
                'employee.edit',
                'employee.delete',
                'user.user.index',
                'user.user.action',
            ];
            $this->assignPermissionsToRole($hrAdminRole, $hrAdminPermissions);
        }

        $managerRole = Role::where('name', 'Manager')->first();
        if ($managerRole) {
            $managerPermissions = [
                'dashboard.index',
                'employee.index',
                'user.user.index',
            ];
            $this->assignPermissionsToRole($managerRole, $managerPermissions);
        }

        $employeeRole = Role::where('name', 'Employee')->first();
        if ($employeeRole) {
            $employeePermissions = [
                'dashboard.index',
            ];
            $this->assignPermissionsToRole($employeeRole, $employeePermissions);
        }
    }

    private function assignPermissionsToRole(Role $role, array $permissions): void
    {
        $existingPermissions = [];

        foreach ($permissions as $permission) {
            $permissionModel = Permission::where('name', $permission)
                ->where('guard_name', 'web')
                ->first();

            if ($permissionModel) {
                $existingPermissions[] = $permission;
            }
        }

        if (! empty($existingPermissions)) {
            $role->syncPermissions($existingPermissions);
        }
    }
}
