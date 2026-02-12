<?php

declare(strict_types=1);

namespace App\Modules\User\Domain\Contracts;

use App\Modules\User\Infrastructure\Database\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Models\Role;

interface RoleRepositoryInterface
{
    public function all(): Builder;

    public function filter(Builder $applications, array $filters): Builder;

    public function store(array $data): Role;

    public function update(int $id, array $data): Role;

    public function delete(int $id): bool;

    public function syncPermissions(int $id, array $permission): bool;

    public function loadPermission(Role $role): Role;

    public function syncRoles(int $id, array $roles): bool;

    public function loadRoles(User $user): User;
}
