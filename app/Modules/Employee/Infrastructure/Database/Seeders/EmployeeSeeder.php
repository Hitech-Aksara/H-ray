<?php

declare(strict_types=1);

namespace App\Modules\Employee\Infrastructure\Database\Seeders;

use App\Modules\Employee\Infrastructure\Database\Models\Employee;
use App\Modules\User\Infrastructure\Database\Models\User;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // Create CEO (no manager)
        $ceo = $this->createEmployee([
            'first_name' => 'John',
            'last_name' => 'Smith',
            'email' => 'john.smith@company.com',
            'phone' => '+1234567890',
            'department' => 'Executive',
            'position' => 'CEO',
            'employment_type' => 'Full-time',
            'status' => 'Active',
            'start_date' => '2020-01-15',
            'location' => 'Head Office',
            'salary' => 250000,
            'annual_leave_balance' => 20,
            'sick_leave_balance' => 15,
            'personal_leave_balance' => 10,
        ]);

        // Create Department Heads
        $hrHead = $this->createEmployee([
            'first_name' => 'Sarah',
            'last_name' => 'Johnson',
            'email' => 'sarah.johnson@company.com',
            'phone' => '+1234567891',
            'department' => 'Human Resources',
            'position' => 'HR Director',
            'employment_type' => 'Full-time',
            'status' => 'Active',
            'start_date' => '2020-03-01',
            'location' => 'Head Office',
            'salary' => 120000,
            'manager_id' => $ceo->id,
            'annual_leave_balance' => 15,
            'sick_leave_balance' => 12,
            'personal_leave_balance' => 7,
        ]);

        $engHead = $this->createEmployee([
            'first_name' => 'Michael',
            'last_name' => 'Chen',
            'email' => 'michael.chen@company.com',
            'phone' => '+1234567892',
            'department' => 'Engineering',
            'position' => 'Engineering Manager',
            'employment_type' => 'Full-time',
            'status' => 'Active',
            'start_date' => '2020-02-15',
            'location' => 'Tech Hub',
            'salary' => 150000,
            'manager_id' => $ceo->id,
            'annual_leave_balance' => 15,
            'sick_leave_balance' => 12,
            'personal_leave_balance' => 7,
        ]);

        $finHead = $this->createEmployee([
            'first_name' => 'Emily',
            'last_name' => 'Williams',
            'email' => 'emily.williams@company.com',
            'phone' => '+1234567893',
            'department' => 'Finance',
            'position' => 'Finance Director',
            'employment_type' => 'Full-time',
            'status' => 'Active',
            'start_date' => '2020-04-01',
            'location' => 'Head Office',
            'salary' => 130000,
            'manager_id' => $ceo->id,
            'annual_leave_balance' => 15,
            'sick_leave_balance' => 12,
            'personal_leave_balance' => 7,
        ]);

        // Create team members
        $employees = [
            [
                'first_name' => 'David',
                'last_name' => 'Brown',
                'email' => 'david.brown@company.com',
                'department' => 'Engineering',
                'position' => 'Senior Developer',
                'manager_id' => $engHead->id,
                'salary' => 95000,
            ],
            [
                'first_name' => 'Lisa',
                'last_name' => 'Garcia',
                'email' => 'lisa.garcia@company.com',
                'department' => 'Engineering',
                'position' => 'Frontend Developer',
                'manager_id' => $engHead->id,
                'salary' => 85000,
            ],
            [
                'first_name' => 'James',
                'last_name' => 'Wilson',
                'email' => 'james.wilson@company.com',
                'department' => 'Engineering',
                'position' => 'Backend Developer',
                'manager_id' => $engHead->id,
                'salary' => 88000,
            ],
            [
                'first_name' => 'Amanda',
                'last_name' => 'Martinez',
                'email' => 'amanda.martinez@company.com',
                'department' => 'Human Resources',
                'position' => 'HR Specialist',
                'manager_id' => $hrHead->id,
                'salary' => 65000,
            ],
            [
                'first_name' => 'Robert',
                'last_name' => 'Taylor',
                'email' => 'robert.taylor@company.com',
                'department' => 'Human Resources',
                'position' => 'Recruiter',
                'manager_id' => $hrHead->id,
                'salary' => 60000,
                'status' => 'On Leave',
            ],
            [
                'first_name' => 'Jennifer',
                'last_name' => 'Anderson',
                'email' => 'jennifer.anderson@company.com',
                'department' => 'Finance',
                'position' => 'Accountant',
                'manager_id' => $finHead->id,
                'salary' => 70000,
            ],
            [
                'first_name' => 'Daniel',
                'last_name' => 'Thomas',
                'email' => 'daniel.thomas@company.com',
                'department' => 'Finance',
                'position' => 'Financial Analyst',
                'manager_id' => $finHead->id,
                'salary' => 75000,
            ],
            [
                'first_name' => 'Michelle',
                'last_name' => 'Jackson',
                'email' => 'michelle.jackson@company.com',
                'department' => 'Marketing',
                'position' => 'Marketing Manager',
                'manager_id' => $ceo->id,
                'salary' => 90000,
            ],
            [
                'first_name' => 'Kevin',
                'last_name' => 'White',
                'email' => 'kevin.white@company.com',
                'department' => 'Marketing',
                'position' => 'Digital Marketing Specialist',
                'manager_id' => $ceo->id,
                'salary' => 65000,
                'status' => 'Inactive',
            ],
        ];

        foreach ($employees as $empData) {
            $this->createEmployee(array_merge([
                'phone' => '+1234567' . rand(100, 999),
                'employment_type' => 'Full-time',
                'status' => 'Active',
                'start_date' => fake()->dateTimeBetween('-3 years', '-6 months')->format('Y-m-d'),
                'location' => fake()->randomElement(['Head Office', 'Tech Hub', 'Remote']),
                'annual_leave_balance' => rand(8, 15),
                'sick_leave_balance' => rand(5, 12),
                'personal_leave_balance' => rand(3, 7),
            ], $empData));
        }
    }

    /**
     * Create an employee and link to matching user account if exists.
     */
    private function createEmployee(array $data): Employee
    {
        $employee = Employee::create($data);

        // Link to user account with same email
        $user = User::where('email', $data['email'])->first();
        if ($user) {
            $employee->update(['user_id' => $user->id]);
        }

        return $employee;
    }
}
