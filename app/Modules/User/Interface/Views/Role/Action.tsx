import { Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import role from '@/routes/role';
import { type BreadcrumbItem } from '@/types';
import { type RoleData } from '@/types/modules/user';

import AppLayout from '@/layouts/app-layout';
import UserSettingsLayout from '@/layouts/settings/user-settings-layout';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield } from 'lucide-react';

const Action = ({ roleData }: { roleData: RoleData }) => {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        id: roleData?.id,
        name: roleData?.name,
        guard_name: roleData?.guard_name ?? 'web',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(role.action.url(), {
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
                            {data.id ? 'Edit Role' : 'Add Role'}
                        </CardTitle>
                        <CardDescription>
                            {data.id ? 'Update role information' : 'Create a new role for the system'}
                        </CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={role.index.url()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Role Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Role name"
                            />
                            <InputError className="mt-1" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="guard_name">
                                Guard Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="guard_name"
                                type="text"
                                value={data.guard_name}
                                onChange={(e) => setData('guard_name', e.target.value)}
                                required
                                placeholder="Guard name"
                            />
                            <InputError className="mt-1" message={errors.guard_name} />
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
        href: role.index.url(),
    },
    {
        title: 'Role',
        href: role.index.url(),
    },
    {
        title: 'Form Role',
        href: '#',
    },
];

Action.layout = (page: React.ReactElement) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Form Role" />
        <UserSettingsLayout>{page}</UserSettingsLayout>
    </AppLayout>
);

export default Action;
