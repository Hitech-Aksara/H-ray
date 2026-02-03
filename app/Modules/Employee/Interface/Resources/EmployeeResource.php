<?php

declare(strict_types=1);

namespace App\Modules\Employee\Interface\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar_url' => $this->avatar_url,
            'department' => $this->department,
            'position' => $this->position,
            'employment_type' => $this->employment_type,
            'status' => $this->status,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'location' => $this->location,
            'salary' => $this->salary,
            'manager_id' => $this->manager_id,
            'annual_leave_balance' => $this->annual_leave_balance,
            'sick_leave_balance' => $this->sick_leave_balance,
            'personal_leave_balance' => $this->personal_leave_balance,
            'manager' => $this->whenLoaded('manager', fn() => new EmployeeResource($this->manager)),
            'direct_reports' => EmployeeResource::collection($this->whenLoaded('directReports')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
