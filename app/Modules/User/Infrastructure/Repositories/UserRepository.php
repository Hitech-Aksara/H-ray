<?php

declare(strict_types=1);

namespace App\Modules\User\Infrastructure\Repositories;

use App\Modules\User\Domain\Contracts\UserRepositoryInterface;
use App\Modules\User\Infrastructure\Database\Models\User;
use Illuminate\Database\Eloquent\Builder;

class UserRepository implements UserRepositoryInterface
{
    public function __construct(
        protected User $userModel,
    ) {}

    public function all(): Builder
    {
        return $this->userModel->orderBy('name')->with('roles');
    }

    public function allWithRelation(array $relations): Builder
    {
        return $this->userModel->orderBy('name')->with($relations);
    }

    public function findValue(int $id, string $field): mixed
    {
        return $this->userModel->where('id', $id)->value($field);
    }

    public function filter(Builder $query, array $filters): Builder
    {
        if (isset($filters['s'])) {
            $query->where('name', dbLikeOperator(), '%' . $filters['s'] . '%')
                ->orWhere('email', dbLikeOperator(), '%' . $filters['s'] . '%')
                ->orWhereHas('roles', function ($query) use ($filters) {
                    $query->where('name', dbLikeOperator(), '%' . $filters['s'] . '%');
                });
        }

        return $query;
    }

    public function store(array $data): User
    {
        return $this->userModel->create($data);
    }

    public function update(int $id, array $data): User
    {
        $user = $this->userModel->findOrFail($id);

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = bcrypt($data['password']);
        }

        $user->update($data);

        return $user;
    }

    public function delete(int $id): bool
    {
        $user = $this->userModel->findOrFail($id);

        return $user->delete();
    }
}
