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
import permission from '@/routes/permission';
import { type BreadcrumbItem } from '@/types';
import { type PermissionData } from '@/types/modules/user';
import { type Pagination } from '@/types/pagination';
import { Head, Link, router } from '@inertiajs/react';
import { KeyRound, PencilIcon, Plus, TrashIcon } from 'lucide-react';

const Index = ({ permissions }: { permissions: Pagination<PermissionData> }) => {
    const { can } = usePermission();

    const canAction = can('user.permission.action');
    const canDelete = can('user.permission.delete');

    const { data, ...meta } = permissions;

    const handleDelete = (id: number) => {
        router.delete(permission.delete(id).url, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound className="h-5 w-5 text-primary" />
                            Permission Management
                        </CardTitle>
                        <CardDescription>Manage system feature access rights</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        <Search />
                        {canAction && (
                            <Button asChild size="sm" className="gap-2">
                                <Link href={permission.add.url()}>
                                    <Plus className="h-4 w-4" />
                                    <span className="hidden md:inline">Add Permission</span>
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
                                    <TableHead>Permission Name</TableHead>
                                    <TableHead>Guard</TableHead>
                                    {(canAction || canDelete) && <TableHead className="w-20 text-right">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                            No permissions found
                                        </TableCell>
                                    </TableRow>
                                )}
                                {data.map((permissionData, index) => (
                                    <TableRow key={permissionData.id}>
                                        <TableCell className="font-medium text-muted-foreground">{meta.from + index}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {permissionData.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{permissionData.guard_name}</TableCell>
                                        {(canAction || canDelete) && (
                                            <TableCell className="text-right">
                                                <DropdownOptions>
                                                    <DropdownAction
                                                        href={permission.edit(permissionData.id).url}
                                                        icon={<PencilIcon className="h-4 w-4" />}
                                                        label="Edit"
                                                        isShow={canAction}
                                                    />
                                                    <DropdownActionSeparator show={canAction && canDelete} />
                                                    <ConfirmDialogItem
                                                        title="Are you sure you want to delete?"
                                                        description={`Permission "${permissionData.name}" will be permanently deleted.`}
                                                        onConfirm={() => handleDelete(permissionData.id)}
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
        href: permission.index.url(),
    },
    {
        title: 'Permissions',
        href: '#',
    },
];

Index.layout = (page: React.ReactElement) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Permissions" />
        <UserSettingsLayout>{page}</UserSettingsLayout>
    </AppLayout>
);

export default Index;
