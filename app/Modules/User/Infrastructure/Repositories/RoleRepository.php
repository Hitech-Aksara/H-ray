<?php

declare(strict_types=1);

namespace App\Modules\User\Infrastructure\Repositories;

use App\Modules\User\Domain\Contracts\RoleRepositoryInterface;
use App\Modules\User\Infrastructure\Database\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleRepository implements RoleRepositoryInterface
{
    public function __construct(
        protected Role $roleModel,
        protected Permission $permissionModel,
    ) {}

    public function all(): Builder
    {
        return $this->roleModel->orderby('name');
    }

    public function filter(Builder $applications, array $filters): Builder
    {
        if (isset($filters['s'])) {
            $applications->where('name', dbLikeOperator(), '%' . $filters['s'] . '%');
        }

        return $applications;
    }

    public function store(array $data): Role
    {
        return $this->roleModel->create($data);
    }

    public function update(int $id, array $data): Role
    {
        $role = $this->roleModel->find($id);
        $role->update($data);

        return $role;
    }

    public function delete(int $id): bool
    {
        return $this->roleModel->where('id', $id)->delete() > 0;
    }

    public function syncPermissions(int $id, array $permissions): bool
    {
        $role = $this->roleModel->find($id);

        $syncData = [];
        foreach ($permissions as $permission) {
            if (is_array($permission) && isset($permission['id'])) {
                $syncData[$permission['id']] = ['scope' => $permission['scope'] ?? null];
            } elseif (is_numeric($permission)) {
                $syncData[$permission] = ['scope' => null];
            }
        }

        $role->permissions()->sync($syncData);

        return true;
    }

    public function loadPermission(Role $role): Role
    {
        $rolePermissions = $role->permissions()->get()->keyBy('name');

        $allPermissions = $this->permissionModel->orderByDesc('name')->get();

        $role->permissions = $allPermissions->map(function ($permission) use ($rolePermissions) {
            $rolePermission = $rolePermissions->get($permission->name);

            $permission->setAttribute('active', $rolePermission !== null);
            $permission->setAttribute('scope', $rolePermission ? $rolePermission->pivot->scope : null);

            return $permission;
        });

        return $role;
    }

    public function syncRoles(int $id, array $roles): bool
    {
        $user = User::findOrFail($id);
        $user->syncRoles($roles);

        return true;
    }

    public function loadRoles(User $user): User
    {
        return $user->load('roles');
    }
}
