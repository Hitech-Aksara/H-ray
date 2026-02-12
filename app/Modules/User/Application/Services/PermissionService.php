<?php

declare(strict_types=1);

namespace App\Modules\User\Application\Services;

use App\Modules\User\Application\Data\PermissionData;
use App\Modules\User\Domain\Contracts\PermissionRepositoryInterface;
use App\Shared\Constants\PaginationConstants;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    public function __construct(
        protected PermissionRepositoryInterface $permissionRepo,
    ) {}

    public function getApplications(array $filters): Builder
    {
        $applications = $this->permissionRepo->all();

        if (! empty($filters)) {
            $applications = $this->permissionRepo->filter($applications, $filters);
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

    public function action(PermissionData $permissionData): Permission
    {
        $data = $permissionData->toArray();

        if (! empty($data['id'])) {
            return $this->permissionRepo->update($data['id'], $data);
        } else {
            return $this->permissionRepo->store($data);
        }
    }

    public function delete(int $id): bool
    {
        return $this->permissionRepo->delete($id);
    }
}
