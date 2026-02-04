<?php

declare(strict_types=1);

namespace App\Modules\Employee\Interface\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'min:2', 'max:100'],
            'last_name' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'email', 'unique:employees,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'avatar_url' => ['nullable', 'string'],
            'department' => ['required', 'string', 'max:100'],
            'position' => ['required', 'string', 'max:100'],
            'employment_type' => ['nullable', 'string', 'in:Full-time,Part-time,Contract,Intern'],
            'status' => ['nullable', 'string', 'in:Active,Inactive,On Leave'],
            'start_date' => ['nullable', 'date'],
            'location' => ['nullable', 'string', 'max:255'],
            'salary' => ['nullable', 'numeric', 'min:0'],
            'manager_id' => ['nullable', 'exists:employees,id'],
            'annual_leave_balance' => ['nullable', 'integer', 'min:0'],
            'sick_leave_balance' => ['nullable', 'integer', 'min:0'],
            'personal_leave_balance' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
