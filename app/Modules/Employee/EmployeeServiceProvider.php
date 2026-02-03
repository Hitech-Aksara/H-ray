<?php

declare(strict_types=1);

namespace App\Modules\Employee;

use App\Modules\Employee\Domain\Contracts\EmployeeRepositoryInterface;
use App\Modules\Employee\Infrastructure\Repositories\EmployeeRepository;
use Illuminate\Support\ServiceProvider;

class EmployeeServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            EmployeeRepositoryInterface::class,
            EmployeeRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}
