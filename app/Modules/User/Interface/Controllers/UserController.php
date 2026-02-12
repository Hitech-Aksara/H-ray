<?php

declare(strict_types=1);

namespace App\Modules\User\Interface\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\Application\Data\UserData;
use App\Modules\User\Application\Services\UserService;
use App\Modules\User\Infrastructure\Database\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService,
    ) {}

    public function index(Request $request): Response
    {
        $filter = $request->all();
        $users = $this->userService->getPaginatedUsers($filter);

        return Inertia::render('User/User/Index', [
            'users' => $users,
        ]);
    }

    public function add(): Response
    {
        $formData = $this->userService->getFormData();

        return Inertia::render('User/User/Action', $formData);
    }

    public function edit(User $user): Response
    {
        $formData = $this->userService->getFormData($user);

        return Inertia::render('User/User/Action', $formData);
    }

    public function action(UserData $userData): RedirectResponse
    {
        $this->userService->action($userData);

        return redirect()->route('user.index')->with([
            'type' => 'success',
            'messages' => 'Berhasil menyimpan data',
        ]);
    }

    public function delete(string $id): RedirectResponse
    {
        $this->userService->delete((int) $id);

        return redirect()->route('user.index')->with([
            'type' => 'success',
            'messages' => 'Berhasil menghapus data',
        ]);
    }

    public function select(?string $role = null): JsonResponse
    {
        $users = $this->userService->getUsersByRole($role);

        return response()->json($users);
    }
}
