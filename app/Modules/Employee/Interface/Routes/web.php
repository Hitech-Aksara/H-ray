<?php

use App\Modules\Employee\Interface\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::prefix('employee')->name('employee.')->group(function () {
    Route::get('/', [EmployeeController::class, 'index'])->name('index');
    Route::get('/managers', [EmployeeController::class, 'managers'])->name('managers');
    Route::get('/{employee}', [EmployeeController::class, 'show'])->name('show');
    Route::post('/', [EmployeeController::class, 'store'])->name('store');
    Route::put('/{employee}', [EmployeeController::class, 'update'])->name('update');
    Route::delete('/{employee}', [EmployeeController::class, 'destroy'])->name('destroy');
});
