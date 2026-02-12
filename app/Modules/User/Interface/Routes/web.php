<?php

use App\Modules\User\Interface\Controllers\PermissionController;
use App\Modules\User\Interface\Controllers\RoleController;
use App\Modules\User\Interface\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('settings')->group(function () {
    Route::prefix('role')->name('role.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])
            ->middleware(['permission:user.role.index'])
            ->name('index');
        Route::get('add', [RoleController::class, 'add'])
            ->middleware(['permission:user.role.action'])
            ->name('add');
        Route::get('edit/{role}', [RoleController::class, 'edit'])
            ->middleware(['permission:user.role.action'])
            ->name('edit');
        Route::post('action', [RoleController::class, 'action'])
            ->middleware(['permission:user.role.action'])
            ->name('action');
        Route::get('assign/{role}', [RoleController::class, 'assign'])
            ->middleware(['permission:user.role.assign'])
            ->name('assign');
        Route::post('assignPost', [RoleController::class, 'assignPost'])
            ->middleware(['permission:user.role.assign'])
            ->name('assignPost');
        Route::delete('delete/{role}', [RoleController::class, 'delete'])
            ->middleware(['permission:user.role.delete'])
            ->name('delete');
    });
    Route::prefix('permission')->name('permission.')->group(function () {
        Route::get('/', [PermissionController::class, 'index'])
            ->middleware(['permission:user.permission.index'])
            ->name('index');
        Route::get('add', [PermissionController::class, 'add'])
            ->middleware(['permission:user.permission.action'])
            ->name('add');
        Route::get('edit/{permission}', [PermissionController::class, 'edit'])
            ->middleware(['permission:user.permission.action'])
            ->name('edit');
        Route::post('action', [PermissionController::class, 'action'])
            ->middleware(['permission:user.permission.action'])
            ->name('action');
        Route::delete('delete/{permission}', [PermissionController::class, 'delete'])
            ->middleware(['permission:user.permission.delete'])
            ->name('delete');
    });
    Route::prefix('user')->name('user.')->group(function () {
        Route::get('/', [UserController::class, 'index'])
            ->middleware(['permission:user.user.index'])
            ->name('index');
        Route::get('/add', [UserController::class, 'add'])
            ->middleware(['permission:user.user.action'])
            ->name('add');
        Route::get('/edit/{user}', [UserController::class, 'edit'])
            ->middleware(['permission:user.user.action'])
            ->name('edit');
        Route::post('/action', [UserController::class, 'action'])
            ->middleware(['permission:user.user.action'])
            ->name('action');

        Route::delete('/delete/{id}', [UserController::class, 'delete'])
            ->middleware(['permission:user.user.delete'])
            ->name('delete');
    });
});

Route::get('select/users/{role?}', [UserController::class, 'select'])
    ->name('select.users');
Route::get('select/users-not-employee', [UserController::class, 'selectUserNotEmployee'])
    ->name('select.select-not-employee');
Route::get('select/team-leaders', [UserController::class, 'selectTeamLeaders'])
    ->name('select.team-leaders');
Route::get('select/team-members', [UserController::class, 'selectTeamMembers'])
    ->name('select.team-members');
