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
        protected EmployeeRepositoryInterface $employeeRepository,
        protected Employee $employeeModel
    ) {}

    public function getAllEmployees(): Collection
    {
        return $this->employeeRepository->getAll();
    }

    public function getPaginatedEmployees(array $filters = []): LengthAwarePaginator
    {
        $query = $this->employeeModel->query()->with('manager');

        $query->when(! empty($filters['s']), function ($q) use ($filters) {
            $search = $filters['s'];
            $q->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%");
            });
        });

        $query->when(! empty($filters['department']), function ($q) use ($filters) {
            $q->where('department', $filters['department']);
        });

        $query->when(! empty($filters['status']), function ($q) use ($filters) {
            $q->where('status', $filters['status']);
        });

        $data = $query->orderBy('last_name')->paginate($filters['limit'] ?? 10);

        $data->appends(request()->query());

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
        return Inertia::render('Employee/Index', [
            'employees' => $this->getPaginatedEmployees($filters),
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
