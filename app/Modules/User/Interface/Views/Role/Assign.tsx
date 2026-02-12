import { Head, Link, useForm } from '@inertiajs/react';

import roleRoutes from '@/routes/role';
import type { BreadcrumbItem } from '@/types';
import type { PermissionData, RoleData } from '@/types/modules/user';

import AppLayout from '@/layouts/app-layout';
import UserSettingsLayout from '@/layouts/settings/user-settings-layout';

import PermissionSummaryCard from '@/components/modules/user/role/permission-summary-card';
import PermissionTreeRoot from '@/components/modules/user/role/permission-tree-root';
import { buildTree } from '@/components/modules/user/role';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const EMPTY_OVERRIDES: Record<number, { active?: boolean; scope?: string | null }> = {};

const Assign = ({ role }: { role: { data: RoleData } }) => {
    const { data } = role;
    const currentRoleId = data?.id ?? 0;

    const basePermissions = useMemo(() => {
        const seen = new Set<number>();
        const dedupedPermissions: PermissionData[] = [];

        (data?.permissions ?? []).forEach((permission) => {
            if (permission.id && !seen.has(permission.id)) {
                seen.add(permission.id);
                dedupedPermissions.push({ ...permission });
            }
        });

        return dedupedPermissions;
    }, [data?.permissions]);

    const basePermissionMap = useMemo(() => {
        const map = new Map<number, PermissionData>();

        basePermissions.forEach((permission) => {
            if (permission.id) {
                map.set(permission.id, permission);
            }
        });

        return map;
    }, [basePermissions]);

    const [overrideState, setOverrideState] = useState(() => ({
        roleId: currentRoleId,
        overrides: {} as Record<number, { active?: boolean; scope?: string | null }>,
    }));

    const setOverrides = useCallback(
        (
            updater: (
                previous: Record<number, { active?: boolean; scope?: string | null }>,
            ) => Record<number, { active?: boolean; scope?: string | null }>,
        ) => {
            setOverrideState((prev) => {
                const previousOverrides = prev.roleId === currentRoleId ? prev.overrides : {};
                const nextOverrides = updater(previousOverrides);

                if (prev.roleId === currentRoleId && previousOverrides === nextOverrides) {
                    return prev;
                }

                return {
                    roleId: currentRoleId,
                    overrides: nextOverrides,
                };
            });
        },
        [currentRoleId],
    );

    const overrides = overrideState.roleId === currentRoleId ? overrideState.overrides : EMPTY_OVERRIDES;

    const permissions = useMemo(() => {
        if (!basePermissions.length) {
            return basePermissions;
        }

        return basePermissions.map((permission) => {
            if (!permission.id) {
                return permission;
            }

            const override = overrides[permission.id];

            if (override === undefined) {
                return permission;
            }

            return {
                ...permission,
                active: override.active !== undefined ? override.active : permission.active,
                scope: override.scope !== undefined ? override.scope : (permission.scope ?? null),
            };
        });
    }, [basePermissions, overrides]);

    const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

    const { setData, post, processing } = useForm({
        role_id: currentRoleId,
        permissions: permissions.filter((p) => p.active).map((p) => ({ id: p.id!, scope: p.scope ?? null })),
    });

    useEffect(() => {
        setData(
            'permissions',
            permissions.filter((p) => p.active).map((p) => ({ id: p.id!, scope: p.scope ?? null })),
        );
    }, [permissions, setData]);

    const handlePermissionToggle = (permissionId: number, checked: boolean) => {
        setOverrides((prev) => {
            const permission = basePermissionMap.get(permissionId);
            const baseActive = permission?.active ?? false;

            if (checked === baseActive) {
                const currentScopeOverride = prev[permissionId]?.scope;
                const baseScope = permission?.scope ?? null;

                if (currentScopeOverride === undefined || currentScopeOverride === baseScope) {
                    if (!(permissionId in prev)) {
                        return prev;
                    }

                    const next = { ...prev };
                    delete next[permissionId];
                    return next;
                }
            }

            const existingOverride = prev[permissionId] || {};

            return {
                ...prev,
                [permissionId]: { ...existingOverride, active: checked },
            };
        });
    };

    const handlePermissionScope = (permissionId: number, scope: string | null) => {
        setOverrides((prev) => {
            const existingOverride = prev[permissionId] || {};
            return {
                ...prev,
                [permissionId]: { ...existingOverride, scope },
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(roleRoutes.assignPost().url);
    };

    const tree = buildTree(permissions);

    const countGroup = (prefix: string) => {
        const groupPermissions = permissions.filter((p) => p.name === prefix || p.name?.startsWith(prefix + '.'));
        const total = groupPermissions.length;
        const active = groupPermissions.filter((p) => p.active).length;
        return { active, total };
    };

    const toggleGroup = useCallback(
        (prefix: string, checked: boolean) => {
            const idsToToggle = basePermissions
                .filter((permission) => permission.name === prefix || permission.name?.startsWith(prefix + '.'))
                .map((permission) => permission.id)
                .filter((id): id is number => typeof id === 'number');

            if (idsToToggle.length === 0) {
                return;
            }

            setOverrides((prev) => {
                let changed = false;
                const next = { ...prev };

                idsToToggle.forEach((id) => {
                    const baseActive = basePermissionMap.get(id)?.active ?? false;

                    if (checked === baseActive) {
                        const currentScopeOverride = next[id]?.scope;
                        const baseScope = basePermissionMap.get(id)?.scope ?? null;

                        if (currentScopeOverride === undefined || currentScopeOverride === baseScope) {
                            if (id in next) {
                                delete next[id];
                                changed = true;
                            }
                        } else {
                            if (next[id]?.active !== checked) {
                                next[id] = { ...next[id], active: checked };
                                changed = true;
                            }
                        }
                        return;
                    }

                    const currentActive = next[id]?.active ?? baseActive;

                    if (currentActive !== checked) {
                        next[id] = { ...(next[id] || {}), active: checked };
                        changed = true;
                    }
                });

                return changed ? next : prev;
            });

            setOpenAccordions((prev) => ({
                ...prev,
                [prefix]: true,
            }));
        },
        [basePermissionMap, basePermissions, setOverrides],
    );

    const getModuleName = (segment: string) => {
        return segment;
    };

    const formatSegment = (segment: string) => {
        return getModuleName(segment);
    };

    const formatActionLabel = (name: string) => {
        const parts = name.split('.');
        const action = parts[parts.length - 1];
        return formatSegment(action);
    };

    const handleAccordionChange = useCallback((path: string, isOpen: boolean) => {
        setOpenAccordions((prev) => ({
            ...prev,
            [path]: isOpen,
        }));
    }, []);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Permissions: {data?.name ?? ''}
                        </CardTitle>
                        <CardDescription>Manage permissions assigned to this role</CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={roleRoutes.index.url()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {data?.name == 'Super Admin' ? (
                                <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
                                    <Shield className="mx-auto mb-2 h-8 w-8 text-primary" />
                                    <p className="font-medium text-primary">Super Admin</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Super Admin tidak perlu menambahkan permission, karena telah dapat mengakses semuanya!
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <PermissionSummaryCard permissions={permissions} />

                                    <div className="grid gap-4">
                                        {permissions && permissions.length > 0 ? (
                                            <PermissionTreeRoot
                                                tree={tree}
                                                permissions={permissions}
                                                openAccordions={openAccordions}
                                                handleAccordionChange={handleAccordionChange}
                                                countGroup={countGroup}
                                                toggleGroup={toggleGroup}
                                                handlePermissionToggle={handlePermissionToggle}
                                                handlePermissionScope={handlePermissionScope}
                                                formatSegment={formatSegment}
                                                formatActionLabel={formatActionLabel}
                                            />
                                        ) : (
                                            <p className="py-8 text-center text-muted-foreground">No permissions available.</p>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={processing}>
                                            Save
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: roleRoutes.index.url(),
    },
    {
        title: 'Roles',
        href: roleRoutes.index.url(),
    },
    {
        title: 'Assign Permissions',
        href: '#',
    },
];

Assign.layout = (page: React.ReactElement) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Assign Role Permissions" />
        <UserSettingsLayout>{page}</UserSettingsLayout>
    </AppLayout>
);

export default Assign;
