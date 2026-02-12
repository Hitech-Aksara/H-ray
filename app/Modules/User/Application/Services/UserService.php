<?php

declare(strict_types=1);

namespace App\Modules\User\Application\Services;

use App\Modules\User\Application\Data\UserData;
use App\Modules\User\Domain\Contracts\RoleRepositoryInterface;
use App\Modules\User\Domain\Contracts\UserRepositoryInterface;
use App\Modules\User\Infrastructure\Database\Models\User;
use App\Shared\Constants\PaginationConstants;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    use CanImpersonate;

    public function __construct(
        protected UserRepositoryInterface $userRepo,
        protected RoleRepositoryInterface $roleRepo
    ) {}

    public function getUsers(array $filters): Builder
    {
        $users = $this->userRepo->all();

        if (! empty($filters)) {
            $users = $this->userRepo->filter($users, $filters);
        }

        return $users;
    }

    public function getUsersWithRelations(array $relations): Builder
    {
        return $this->userRepo->allWithRelation($relations);
    }

    public function getFormData(?User $user = null): array
    {
        $user ??= new User;

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles?->pluck('id') ?? [],
            ],
            'roles' => $this->roleRepo->all()->select('id', 'name')->get(),
        ];
    }

    public function getPaginatedUsers(array $filters): LengthAwarePaginator
    {
        $data = $this->getUsers($filters)->paginate(
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

    public function find(int $id): User
    {
        return $this->userRepo->all()->find($id);
    }

    public function value(int $id, string $field): mixed
    {
        return $this->userRepo->findValue($id, $field);
    }

    public function action(UserData $userData): User
    {
        $data = $userData->toArray();

        if (! empty($data['id'])) {
            $user = $this->userRepo->update($data['id'], $data);
        } else {
            $user = $this->userRepo->store($data);
        }
        if (! empty($data['roles'])) {
            $this->roleRepo->syncRoles($user->id, $data['roles']);
        }

        return $user;
    }

    public function delete(int $id): bool
    {
        return $this->userRepo->delete($id);
    }

    public function getUsersByRole(?string $role): Collection
    {
        return $this->userRepo->all()
            ->select('id', 'name')
            ->when($role, function ($query) use ($role) {
                $query->role($role);
            })
            ->get();
    }
}
