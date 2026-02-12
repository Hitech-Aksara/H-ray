<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $permissions = [];
        if ($request->user()) {
            if ($request->user()->hasRole('Super Admin')) {
                $permissions = 'Super Admin';
            } else {
                $permissions = $request->user()->getPermissionsViaRoles()->pluck('name')->toArray();
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
                'permissions' => $permissions,
                'is_impersonating' => $request->session()->has('impersonator_id'),
            ],
            'flash' => [
                'type' => fn() => $request->session()->get('type'),
                'messages' => fn() => $request->session()->get('messages'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
