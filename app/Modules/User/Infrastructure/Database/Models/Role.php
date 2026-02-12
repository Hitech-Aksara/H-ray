<?php

declare(strict_types=1);

namespace App\Modules\User\Infrastructure\Database\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            config('permission.models.permission'),
            config('permission.table_names.role_has_permissions'),
            config('permission.column_names.role_pivot_key') ?: 'role_id',
            config('permission.column_names.permission_pivot_key') ?: 'permission_id'
        )->withPivot('scope');
    }
}
