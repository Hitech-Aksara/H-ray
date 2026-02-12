import { ConfirmDialogItem, DropdownAction, DropdownActionSeparator, DropdownOptions } from '@/components/table';
import Paginate from '@/components/table/paginate';
import Search from '@/components/table/search';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePermission } from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import UserSettingsLayout from '@/layouts/settings/user-settings-layout';
import role from '@/routes/role';
import { type BreadcrumbItem } from '@/types';
import { type RoleData } from '@/types/modules/user';
import { type Pagination } from '@/types/pagination';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, Plus, Shield, TrashIcon, UserCog2Icon } from 'lucide-react';

const ROLE_COLORS: Record<string, string> = {
    'Super Admin': 'bg-destructive/10 text-destructive border-destructive/20',
    'Admin': 'bg-primary/10 text-primary border-primary/20',
    'HR Admin': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Manager': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Employee': 'bg-muted text-muted-foreground border-border',
};

const Index = ({ roles }: { roles: Pagination<RoleData> }) => {
    const { can } = usePermission();

    const canAction = can('user.role.action');
    const canDelete = can('user.role.delete');
    const canAssign = can('user.role.assign');

    const { data, ...meta } = roles;

    const handleDelete = (id: number) => {
        router.delete(role.delete(id).url, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Role Management
                        </CardTitle>
                        <CardDescription>Manage system user access roles</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        <Search />
                        {canAction && (
                            <Button asChild size="sm" className="gap-2">
                                <Link href={role.add.url()}>
                                    <Plus className="h-4 w-4" />
                                    <span className="hidden md:inline">Add Role</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-12">#</TableHead>
                                    <TableHead>Role Name</TableHead>
                                    <TableHead>Guard</TableHead>
                                    {(canAction || canAssign || canDelete) && (
                                        <TableHead className="w-20 text-right">Actions</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                            No roles found
                                        </TableCell>
                                    </TableRow>
                                )}
                                {data.map((roleData, index) => (
                                    <TableRow key={roleData.id}>
                                        <TableCell className="font-medium text-muted-foreground">{meta.from + index}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                                    <Shield className="h-4 w-4 text-primary" />
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={ROLE_COLORS[roleData.name] ?? 'bg-muted text-muted-foreground border-border'}
                                                >
                                                    {roleData.name}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{roleData.guard_name}</TableCell>
                                        {(canAction || canAssign || canDelete) && (
                                            <TableCell className="text-right">
                                                <DropdownOptions>
                                                    <DropdownAction
                                                        href={role.edit(roleData.id).url}
                                                        icon={<PencilIcon className="h-4 w-4" />}
                                                        label="Edit"
                                                        isShow={canAction}
                                                    />
                                                    <DropdownAction
                                                        href={role.assign(roleData.id).url}
                                                        icon={<UserCog2Icon className="h-4 w-4" />}
                                                        label="Assign Permissions"
                                                        isShow={canAssign}
                                                    />
                                                    <DropdownActionSeparator show={(canAction || canAssign) && canDelete} />
                                                    <ConfirmDialogItem
                                                        title="Are you sure you want to delete?"
                                                        description={`Role "${roleData.name}" will be permanently deleted.`}
                                                        onConfirm={() => handleDelete(roleData.id)}
                                                        icon={<TrashIcon className="h-4 w-4" />}
                                                        label="Delete"
                                                        isShow={canDelete}
                                                    />
                                                </DropdownOptions>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4">
                        <Paginate meta={meta} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: role.index.url(),
    },
    {
        title: 'Role',
        href: '#',
    },
];

Index.layout = (page: React.ReactElement) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Role" />
        <UserSettingsLayout>{page}</UserSettingsLayout>
    </AppLayout>
);

export default Index;
