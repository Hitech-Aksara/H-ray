import { Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import permission from '@/routes/permission';
import { type BreadcrumbItem } from '@/types';
import { type PermissionData } from '@/types/modules/user';

import AppLayout from '@/layouts/app-layout';
import UserSettingsLayout from '@/layouts/settings/user-settings-layout';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, KeyRound } from 'lucide-react';

const Action = ({ permissionData }: { permissionData: PermissionData }) => {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        id: permissionData.id,
        name: permissionData.name,
        guard_name: permissionData.guard_name,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(permission.action.url(), {
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
                            {data.id ? 'Edit Permission' : 'Add Permission'}
                        </CardTitle>
                        <CardDescription>
                            {data.id ? 'Update permission information' : 'Create a new permission for the system'}
                        </CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={permission.index.url()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Permission Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="off"
                                placeholder="Permission name"
                            />
                            <Badge variant="secondary" className="w-fit">format: modules.controller.action</Badge>
                            <InputError className="mt-1" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="guard_name">
                                Guard <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="guard_name"
                                type="text"
                                value={data.guard_name}
                                onChange={(e) => setData('guard_name', e.target.value)}
                                required
                                placeholder="Guard"
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
        href: permission.index.url(),
    },
    {
        title: 'Permissions',
        href: permission.index.url(),
    },
    {
        title: 'Form Permission',
        href: '#',
    },
];

Action.layout = (page: React.ReactElement) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Form Permission" />
        <UserSettingsLayout>{page}</UserSettingsLayout>
    </AppLayout>
);

export default Action;
