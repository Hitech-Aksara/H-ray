<?php

declare(strict_types=1);

namespace App\Modules\User\Domain\Contracts;

use Illuminate\Database\Eloquent\Builder;
use Spatie\Permission\Models\Permission;

interface PermissionRepositoryInterface
{
    public function all(): Builder;

    public function filter(Builder $applications, array $filters): Builder;

    public function store(array $data): Permission;

    public function update(int $id, array $data): Permission;

    public function delete(int $id): bool;
}
