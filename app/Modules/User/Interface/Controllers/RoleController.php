<?php

declare(strict_types=1);

namespace App\Modules\User\Interface\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\Application\Data\RoleData;
use App\Modules\User\Application\Services\RoleService;
use App\Modules\User\Interface\Resources\RolePermissionResources;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(
        protected RoleService $roleService,
    ) {}

    public function index(Request $request): Response
    {
        $filter = $request->all();
        $roles = $this->roleService->getPaginatedApplications($filter);

        return Inertia::render('User/Role/Index', [
            'roles' => $roles,
        ]);
    }

    public function add(): Response
    {
        $role = new Role;

        return Inertia::render('User/Role/Action', [
            'role' => $role,
        ]);
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('User/Role/Action', [
            'role' => $role,
        ]);
    }

    public function assign(Role $role): Response
    {
        $role = $this->roleService->loadPermission($role);

        return Inertia::render('User/Role/Assign', [
            'role' => new RolePermissionResources($role),
        ]);
    }

    public function assignPost(Request $request): RedirectResponse
    {
        $permissions = $request->input('permissions');
        $roleId = (int) $request->input('role_id');

        $this->roleService->syncPermissions($roleId, $permissions);

        return redirect()->back()->with([
            'type' => 'success',
            'messages' => 'Berhasil menyimpan data permission',
        ]);
    }

    public function action(RoleData $roleData): RedirectResponse
    {
        $this->roleService->action($roleData);

        return redirect()->route('role.index')->with([
            'type' => 'success',
            'messages' => 'Berhasil menyimpan data role',
        ]);
    }

    public function delete(string $id): RedirectResponse
    {
        $this->roleService->delete((int) $id);

        return redirect()->route('role.index')->with([
            'type' => 'success',
            'messages' => 'Berhasil menghapus data',
        ]);
    }
}
