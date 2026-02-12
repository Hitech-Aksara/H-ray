<?php

declare(strict_types=1);

namespace App\Modules\User\Interface\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\Application\Data\PermissionData;
use App\Modules\User\Application\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function __construct(
        protected PermissionService $permissionService
    ) {}

    public function index(Request $request): Response
    {
        $filter = $request->all();
        $permissions = $this->permissionService->getPaginatedApplications($filter);

        return Inertia::render('User/Permission/Index', [
            'permissions' => $permissions,
        ]);
    }

    public function add(): Response
    {
        $permission = new Permission;

        return Inertia::render('User/Permission/Action', [
            'permission' => $permission,
        ]);
    }

    public function edit(Permission $permission): Response
    {
        return Inertia::render('User/Permission/Action', [
            'permission' => $permission,
        ]);
    }

    public function action(PermissionData $permissionData): RedirectResponse
    {
        $this->permissionService->action($permissionData);

        return redirect()->route('permission.index')->with([
            'type' => 'success',
            'messages' => 'Berhasil menyimpan data',
        ]);
    }

    public function delete(string $id): RedirectResponse
    {
        $this->permissionService->delete((int) $id);

        return redirect()->route('permission.index')->with([
            'type' => 'success',
            'messages' => 'Berhasil menghapus data',
        ]);
    }
}
