<?php

declare(strict_types=1);

namespace App\Modules\User\Application\Data;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/** @typescript */
class UserData extends Data
{
    public function __construct(
        public ?int $id,

        public ?string $name,

        public ?string $email,

        #[Min(6)]
        public ?string $password = null,

        /** @var int[]|null */
        public ?array $roles = null

    ) {}

    public static function rules(): array
    {
        $userId = request('user.id') ?? request('id');
        $isEdit = ! empty($userId);

        $userSelectionMode = request('user_selection_mode', 'new');
        $isExistingUser = $userSelectionMode === 'existing';

        if ($isExistingUser) {
            return [
                'id' => [
                    'required',
                ],
            ];
        }

        return [
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'name' => [
                'required',
                'string',
            ],
            'password' => [
                $isEdit ? 'nullable' : 'required',
                'min:6',
            ],
        ];
    }
}
