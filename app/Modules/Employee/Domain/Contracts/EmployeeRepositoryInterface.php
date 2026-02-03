<?php

declare(strict_types=1);

namespace App\Modules\Employee\Domain\Contracts;

use App\Modules\Employee\Infrastructure\Database\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface EmployeeRepositoryInterface
{
    public function getAll(array $filters = []): Collection;

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Employee;

    public function create(array $data): Employee;

    public function update(int $id, array $data): ?Employee;

    public function delete(int $id): bool;

    public function getDepartments(): array;

    public function getManagerOptions(?int $excludeId = null): Collection;
}
