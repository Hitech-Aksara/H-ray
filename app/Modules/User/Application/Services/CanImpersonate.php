<?php

declare(strict_types=1);

namespace App\Modules\User\Application\Services;

use Illuminate\Support\Facades\Session;

trait CanImpersonate
{
    public function impersonate($user)
    {
        $originalUserId = auth()->id();

        Session::put('impersonator_id', $originalUserId);

        auth()->login($user);

        return true;
    }

    public function leaveImpersonation()
    {
        if (Session::has('impersonator_id')) {
            $originalUserId = Session::get('impersonator_id');
            Session::forget('impersonator_id');

            auth()->loginUsingId($originalUserId);

            return true;
        }

        return false;
    }

    public function isImpersonating()
    {
        return Session::has('impersonator_id');
    }
}
