<?php

declare(strict_types=1);

namespace App\Modules\User\Interface\Resources;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use JsonSerializable;

class RolePermissionResources extends JsonResource
{
    public function toArray(Request $request): array|Arrayable|JsonSerializable
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'guard_name' => $this->guard_name,
            'permissions' => $this->permissions,
        ];
    }
}
