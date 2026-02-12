<?php

declare(strict_types=1);

namespace App\Modules\User\Domain\Contracts;

use App\Modules\User\Infrastructure\Database\Models\User;
use Illuminate\Database\Eloquent\Builder;

interface UserRepositoryInterface
{
    public function all(): Builder;

    public function allWithRelation(array $relations): Builder;

    public function filter(Builder $query, array $filters): Builder;

    public function store(array $data): User;

    public function update(int $id, array $data): User;

    public function delete(int $id): bool;

    public function findValue(int $id, string $field): mixed;
}
