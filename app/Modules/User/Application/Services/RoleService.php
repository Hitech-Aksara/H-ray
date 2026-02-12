<?php

declare(strict_types=1);

namespace App\Modules\User\Application\Services;

use App\Modules\User\Application\Data\RoleData;
use App\Modules\User\Domain\Contracts\RoleRepositoryInterface;
use App\Shared\Constants\PaginationConstants;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function __construct(
        protected RoleRepositoryInterface $roleRepo
    ) {}

    public function getApplications(array $filters): Builder
    {
        $applications = $this->roleRepo->all();

        if (! empty($filters)) {
            $applications = $this->roleRepo->filter($applications, $filters);
        }

        return $applications;
    }

    public function getPaginatedApplications(array $filters): LengthAwarePaginator
    {
        $data = $this->getApplications($filters)->paginate(
            request()->filled('limit') ?
            request()->get('limit') :
            PaginationConstants::PAGINATION_LIMIT
        );

        $data->appends(array_merge(
            request()->query(),
            $filters
        ));

        return $data;
    }

    public function action(RoleData $roleData): Role
    {
        $data = $roleData->toArray();

        if (! empty($data['id'])) {
            return $this->roleRepo->update($data['id'], $data);
        } else {
            return $this->roleRepo->store($data);
        }
    }

    public function delete(int $id): bool
    {
        return $this->roleRepo->delete($id);
    }

    public function syncPermissions(int $id, array $permission): bool
    {
        return $this->roleRepo->syncPermissions($id, $permission);
    }

    public function loadPermission(Role $role): Role
    {
        return $this->roleRepo->loadPermission($role);
    }
}
