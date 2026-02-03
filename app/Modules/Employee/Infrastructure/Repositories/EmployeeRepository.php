<?php

declare(strict_types=1);

namespace App\Modules\Employee\Infrastructure\Repositories;

use App\Modules\Employee\Domain\Contracts\EmployeeRepositoryInterface;
use App\Modules\Employee\Infrastructure\Database\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class EmployeeRepository implements EmployeeRepositoryInterface
{
    public function __construct(
        protected Employee $employeeModel
    ) {}

    public function getAll(array $filters = []): Collection
    {
        $query = $this->employeeModel->query()->with('manager');

        $this->applyFilters($query, $filters);

        return $query->orderBy('last_name')->get();
    }

    public function getPaginated(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->employeeModel->query()->with('manager');

        $this->applyFilters($query, $filters);

        return $query->orderBy('last_name')->paginate($perPage);
    }

    public function findById(int $id): ?Employee
    {
        return $this->employeeModel
            ->with(['manager', 'directReports'])
            ->find($id);
    }

    public function create(array $data): Employee
    {
        return $this->employeeModel->create($data);
    }

    public function update(int $id, array $data): ?Employee
    {
        $employee = $this->employeeModel->find($id);

        if (! $employee) {
            return null;
        }

        $employee->update($data);

        return $employee->fresh();
    }

    public function delete(int $id): bool
    {
        $employee = $this->employeeModel->find($id);

        if (! $employee) {
            return false;
        }

        return $employee->delete();
    }

    public function getDepartments(): array
    {
        return $this->employeeModel
            ->distinct()
            ->pluck('department')
            ->sort()
            ->values()
            ->toArray();
    }

    public function getManagerOptions(?int $excludeId = null): Collection
    {
        $query = $this->employeeModel->query()
            ->select(['id', 'first_name', 'last_name', 'position'])
            ->orderBy('last_name');

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->get();
    }
    protected function applyFilters($query, array $filters): void
    {
        if (! empty($filters['s'])) {
            $search = $filters['s'];
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['department'])) {
            $query->where('department', $filters['department']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
    }
}
