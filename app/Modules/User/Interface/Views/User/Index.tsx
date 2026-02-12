import { ConfirmDialogItem, DropdownAction, DropdownActionSeparator, DropdownOptions } from '@/components/table';
import Paginate from '@/components/table/paginate';
import Search from '@/components/table/search';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePermission } from '@/hooks/use-permission';
import AppLayout from '@/layouts/app-layout';
import UserSettingsLayout from '@/layouts/settings/user-settings-layout';
import user from '@/routes/user';
import { type BreadcrumbItem } from '@/types';
import type { RoleData, UserData } from '@/types/modules/user';
import { type Pagination } from '@/types/pagination';
import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, Plus, TrashIcon, Users } from 'lucide-react';

type UserDataIndex = Omit<UserData, 'roles'> & {
    roles?: RoleData[];
};

const ROLE_COLORS: Record<string, string> = {
    'Super Admin': 'bg-destructive/10 text-destructive border-destructive/20',
    'Admin': 'bg-primary/10 text-primary border-primary/20',
    'HR Admin': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Manager': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Employee': 'bg-muted text-muted-foreground border-border',
};

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const Index = ({ users }: { users: Pagination<UserDataIndex> }) => {
    const { can } = usePermission();

    const canUserAction = can('user.user.action');
    const canUserDelete = can('user.user.delete');

    const { data, ...meta } = users;

    const handleDelete = (id: number) => {
        router.delete(user.delete(id).url, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            User Management
                        </CardTitle>
                        <CardDescription>Manage user accounts and system access roles</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        <Search />
                        {canUserAction && (
                            <Button asChild size="sm" className="gap-2">
                                <Link href={user.add.url()}>
                                    <Plus className="h-4 w-4" />
                                    <span className="hidden md:inline">Add User</span>
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
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    {(canUserAction || canUserDelete) && <TableHead className="w-20 text-right">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                )}
                                {data.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium text-muted-foreground">{meta.from + index}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                                                        {getInitials(item.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">{item.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.roles && item.roles.length > 0 ? (
                                                    item.roles.map((r: RoleData) => (
                                                        <Badge
                                                            key={r.id}
                                                            variant="outline"
                                                            className={ROLE_COLORS[r.name] ?? 'bg-muted text-muted-foreground border-border'}
                                                        >
                                                            {r.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">—</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        {(canUserAction || canUserDelete) && (
                                            <TableCell className="text-right">
                                                <DropdownOptions>
                                                    <DropdownAction
                                                        href={user.edit(item.id).url}
                                                        icon={<PencilIcon className="h-4 w-4" />}
                                                        label="Edit"
                                                        isShow={canUserAction}
                                                    />
                                                    <DropdownActionSeparator show={canUserAction && canUserDelete} />
                                                    <ConfirmDialogItem
                                                        title="Are you sure you want to delete?"
                                                        description={`User "${item.name}" will be permanently deleted.`}
                                                        onConfirm={() => handleDelete(item.id)}
                                                        icon={<TrashIcon className="h-4 w-4" />}
                                                        label="Delete"
                                                        isShow={canUserDelete}
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
        href: user.index.url(),
    },
    {
        title: 'User',
        href: '#',
    },
];

Index.layout = (page: React.ReactElement) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Users" />
        <UserSettingsLayout>{page}</UserSettingsLayout>
    </AppLayout>
);

export default Index;
