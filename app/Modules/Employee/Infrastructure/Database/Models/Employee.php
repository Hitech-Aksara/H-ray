<?php

declare(strict_types=1);

namespace App\Modules\Employee\Infrastructure\Database\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'employees';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'avatar_url',
        'department',
        'position',
        'employment_type',
        'status',
        'start_date',
        'location',
        'salary',
        'manager_id',
        'annual_leave_balance',
        'sick_leave_balance',
        'personal_leave_balance',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'salary' => 'decimal:2',
            'annual_leave_balance' => 'integer',
            'sick_leave_balance' => 'integer',
            'personal_leave_balance' => 'integer',
        ];
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function directReports(): HasMany
    {
        return $this->hasMany(Employee::class, 'manager_id');
    }

    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'Active');
    }

    public function scopeInDepartment($query, string $department)
    {
        return $query->where('department', $department);
    }
}
