<?php

declare(strict_types=1);

namespace App\Modules\Employee\Application\Services;

use App\Modules\Employee\Domain\Contracts\EmployeeRepositoryInterface;
use App\Modules\Employee\Infrastructure\Database\Models\Employee;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeService
{
    public function __construct(
        protected EmployeeRepositoryInterface $employeeRepository
    ) {}

    public function getAllEmployees(array $filters = []): Collection
    {
        return $this->employeeRepository->getAll($filters);
    }

    public function getPaginatedEmployees(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $data = $this->employeeRepository->getPaginated($filters, $perPage);

        $data->appends(array_merge(
            request()->query(),
            $filters
        ));

        return $data;
    }

    public function getEmployeeById(int $id): ?Employee
    {
        return $this->employeeRepository->findById($id);
    }

    public function createEmployee(array $data): Employee
    {
        return $this->employeeRepository->create($data);
    }


    public function updateEmployee(Employee $employee, array $data): Employee
    {
        $this->employeeRepository->update($employee->id, $data);

        return $employee->fresh();
    }

    public function deleteEmployee(Employee $employee): bool
    {
        return $this->employeeRepository->delete($employee->id);
    }

    public function getDepartments(): array
    {
        return $this->employeeRepository->getDepartments();
    }

    public function getStatistics(): array
    {
        $employees = $this->employeeRepository->getAll();

        return [
            'total' => $employees->count(),
            'active' => $employees->where('status', 'Active')->count(),
            'on_leave' => $employees->where('status', 'On Leave')->count(),
            'inactive' => $employees->where('status', 'Inactive')->count(),
        ];
    }

    public function getManagerOptions(?int $excludeId = null): Collection
    {
        return $this->employeeRepository->getManagerOptions($excludeId);
    }

    public function renderIndex(array $filters): Response
    {
        $perPage = (int) ($filters['limit'] ?? 10);

        return Inertia::render('Employee/Index', [
            'employees' => $this->getPaginatedEmployees($filters, $perPage),
            'departments' => $this->getDepartments(),
            'statistics' => $this->getStatistics(),
            'managers' => $this->getManagerOptions(),
            'filters' => $filters,
        ]);
    }

    public function renderDetail(Employee $employee): Response
    {
        $employee->load(['manager', 'directReports']);

        return Inertia::render('Employee/Detail', [
            'employee' => $employee,
            'managers' => $this->getManagerOptions($employee->id),
        ]);
    }
}
