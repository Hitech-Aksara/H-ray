<?php

use App\Modules\Employee\Interface\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::prefix('employee')->name('employee.')->group(function () {
    Route::get('/', [EmployeeController::class, 'index'])
        ->middleware(['permission:employee.index'])
        ->name('index');
    Route::get('/managers', [EmployeeController::class, 'managers'])
        ->middleware(['permission:employee.index'])
        ->name('managers');
    Route::get('/{employee}', [EmployeeController::class, 'show'])
        ->middleware(['permission:employee.index'])
        ->name('show');
    Route::post('/', [EmployeeController::class, 'store'])
        ->middleware(['permission:employee.create'])
        ->name('store');
    Route::put('/{employee}', [EmployeeController::class, 'update'])
        ->middleware(['permission:employee.edit'])
        ->name('update');
    Route::delete('/{employee}', [EmployeeController::class, 'destroy'])
        ->middleware(['permission:employee.delete'])
        ->name('destroy');
});
