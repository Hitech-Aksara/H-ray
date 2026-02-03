<?php

declare(strict_types=1);

namespace App\Modules\Employee\Interface\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Employee\Application\Services\EmployeeService;
use App\Modules\Employee\Infrastructure\Database\Models\Employee;
use App\Modules\Employee\Interface\Requests\StoreEmployeeRequest;
use App\Modules\Employee\Interface\Requests\UpdateEmployeeRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function __construct(
        protected EmployeeService $employeeService
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only(['s', 'department', 'status', 'limit']);

        return $this->employeeService->renderIndex($filters);
    }

    public function show(Employee $employee): Response
    {
        return $this->employeeService->renderDetail($employee);
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {

        $this->employeeService->createEmployee($request->validated());

        return redirect()
            ->route('employee.index')
            ->with('success', 'Employee created successfully.');
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $this->employeeService->updateEmployee($employee, $request->validated());

        return redirect()
            ->back()
            ->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $this->employeeService->deleteEmployee($employee);

        return redirect()
            ->route('employee.index')
            ->with('success', 'Employee deleted successfully.');
    }

    public function managers(Request $request): JsonResponse
    {
        $excludeId = $request->get('exclude');
        $managers = $this->employeeService->getManagerOptions($excludeId ? (int) $excludeId : null);

        return response()->json($managers);
    }
}
