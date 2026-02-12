<?php

declare(strict_types=1);

namespace App\Modules\User\Infrastructure\Repositories;

use App\Modules\User\Domain\Contracts\PermissionRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Models\Permission;

class PermissionRepository implements PermissionRepositoryInterface
{
    public function __construct(
        protected Permission $permissionModel
    ) {}

    public function all(): Builder
    {
        return $this->permissionModel->orderby('name');
    }

    public function filter(Builder $applications, array $filters): Builder
    {
        if (isset($filters['s'])) {
            $applications->where('name', dbLikeOperator(), '%' . $filters['s'] . '%');
        }

        return $applications;
    }

    public function store(array $data): Permission
    {
        return $this->permissionModel->create($data);
    }

    public function update(int $id, array $data): Permission
    {
        $role = $this->permissionModel->find($id);
        $role->update($data);

        return $role;
    }

    public function delete(int $id): bool
    {
        return $this->permissionModel->where('id', $id)->delete() > 0;
    }
}
