import { usePage } from '@inertiajs/react';

interface PageWithPermissions {
    auth: {
        permissions?: string[] | string;
    };
    [key: string]: unknown;
}

export function usePermission() {
    const { auth } = usePage<PageWithPermissions>().props;

    const can = (permission: string): boolean => {
        if (!auth?.permissions) return false;
        if (auth.permissions === 'Super Admin') return true;
        if (Array.isArray(auth.permissions)) {
            return auth.permissions.includes(permission);
        }
        return false;
    };

    const canAny = (prefix: string): boolean => {
        if (!auth?.permissions) return false;
        if (auth.permissions === 'Super Admin') return true;
        if (Array.isArray(auth.permissions)) {
            return auth.permissions.some((p) => p === prefix || p.startsWith(prefix + '.'));
        }
        return false;
    };

    return { can, canAny };
}
