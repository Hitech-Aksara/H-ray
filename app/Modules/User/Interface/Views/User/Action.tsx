import { Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import UserSettingsLayout from '@/layouts/settings/user-settings-layout';
import user from '@/routes/user';

import { type BreadcrumbItem } from '@/types';
import { type RoleData } from '@/types/modules/user';
import { ArrowLeft, UserCog } from 'lucide-react';

type ActionProps = {
    user: {
        id: number;
        name: string;
        email: string;
        roles: number[];
    };
    roles: RoleData[];
};

const Action = ({ user: userData, roles }: ActionProps) => {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        id: userData?.id ?? 0,
        name: userData?.name ?? '',
        email: userData?.email ?? '',
        password: '',
        roles: (userData?.roles || []) as number[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(user.action.url(), {
            preserveScroll: true,
        });
    };

    const handleRoleToggle = (roleId: number, checked: boolean) => {
        const currentRoles = (data.roles || []) as number[];
        const updatedRoles = checked ? [...currentRoles, roleId] : currentRoles.filter((id: number) => id !== roleId);
        setData('roles', updatedRoles);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <UserCog className="h-5 w-5 text-primary" />
                            {data.id ? 'Edit User' : 'Add User'}
                        </CardTitle>
                        <CardDescription>
                            {data.id ? 'Update user information' : 'Create a new user account'}
                        </CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={user.index.url()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name ?? ''}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />
                            <InputError className="mt-1" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email ?? ''}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="User email"
                            />
                            <InputError className="mt-1" message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password {!data.id && <span className="text-destructive">*</span>}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password ?? ''}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={data.id ? 'Leave empty to keep unchanged' : 'Password'}
                            />
                            <InputError className="mt-1" message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Roles</Label>
                            <div className="grid max-h-64 grid-cols-1 gap-4 overflow-y-auto rounded-lg border border-border/50 p-4 md:grid-cols-2 lg:grid-cols-3">
                                {roles && roles.length > 0 ? (
                                    roles.map((role) => (
                                        <div key={role.id} className="flex w-full items-center rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/50">
                                            <Switch
                                                className="mr-3"
                                                id={`role-${role.id}`}
                                                checked={((data.roles || []) as number[]).includes(role.id)}
                                                onCheckedChange={(checked: boolean) => handleRoleToggle(role.id, checked)}
                                            />
                                            <Label htmlFor={`role-${role.id}`} className="cursor-pointer font-medium">
                                                {role.name}
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-full text-muted-foreground">No roles available.</p>
                                )}
                            </div>
                            <InputError className="mt-1" message={errors.roles} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600">Saved</p>
                            </Transition>
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
        href: user.index.url(),
    },
    {
        title: 'Users',
        href: user.index.url(),
    },
    {
        title: 'Form User',
        href: '#',
    },
];

Action.layout = (page: React.ReactElement) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Form User" />
        <UserSettingsLayout>{page}</UserSettingsLayout>
    </AppLayout>
);

export default Action;
