<?php

declare(strict_types=1);

namespace App\Modules\User\Application\Data;

use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

/** @typescript */
class RoleData extends Data
{
    public function __construct(
        public ?int $id,
        #[Required, Min(3)]
        public string $name,

        #[Required, Min(3)]
        public string $guard_name,

        /** @var PermissionData[] */
        public ?array $permissions,
    ) {}
}
