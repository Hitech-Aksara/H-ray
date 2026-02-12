import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Users, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EmployeeForm, { type EmployeeFormData } from '@/components/employee/employee-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { usePermission } from '@/hooks/use-permission';
import { formatCurrency, formatDate } from '@/lib/format';
import type { BreadcrumbItem, Employee, Manager } from '@/types';
import { getEmployeeStatusStyle } from '@/types/employee';

interface PageProps {
    employee: Employee;
    managers: Manager[];
    [key: string]: unknown;
}

export default function EmployeeDetail() {
    const { employee, managers } = usePage<PageProps>().props;
    const [isEditing, setIsEditing] = useState(false);
    const { can } = usePermission();
    const canEdit = can('employee.edit');
    const canDelete = can('employee.delete');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/' },
        { title: 'Employees', href: '/employee' },
        { title: `${employee.first_name} ${employee.last_name}`, href: `/employee/${employee.id}` },
    ];

    const { data, setData, put, processing, errors } = useForm<EmployeeFormData>({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone || '',
        department: employee.department,
        position: employee.position,
        employment_type: employee.employment_type,
        status: employee.status,
        start_date: employee.start_date || '',
        location: employee.location || '',
        salary: employee.salary ? String(employee.salary) : '',
        manager_id: employee.manager_id ? String(employee.manager_id) : '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/employee/${employee.id}`, {
            onSuccess: () => setIsEditing(false),
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this employee?')) {
            router.delete(`/employee/${employee.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${employee.first_name} ${employee.last_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="/employee"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Employees
                    </Link>
                    <div className="flex gap-2">
                        {canEdit && (
                            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Edit Employee</DialogTitle>
                                        <DialogDescription>
                                            Update employee information below.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <EmployeeForm
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        processing={processing}
                                        onSubmit={handleUpdate}
                                        onCancel={() => setIsEditing(false)}
                                        managers={managers}
                                        submitLabel="Save Changes"
                                        submitLoadingLabel="Saving..."
                                    />
                                </DialogContent>
                            </Dialog>
                        )}
                        {canDelete && (
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        )}
                    </div>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={employee.avatar_url || undefined} />
                                <AvatarFallback className="text-2xl">
                                    {employee.first_name[0]}
                                    {employee.last_name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-semibold">
                                        {employee.first_name} {employee.last_name}
                                    </h1>
                                    <Badge variant="outline" className={getEmployeeStatusStyle(employee.status)}>
                                        {employee.status}
                                    </Badge>
                                </div>
                                <p className="text-lg text-muted-foreground">{employee.position}</p>
                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Briefcase className="h-4 w-4" />
                                        {employee.department}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="h-4 w-4" />
                                        {employee.email}
                                    </span>
                                    {employee.phone && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="h-4 w-4" />
                                            {employee.phone}
                                        </span>
                                    )}
                                    {employee.location && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4" />
                                            {employee.location}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Employment Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Employment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Employment Type</span>
                                <span className="font-medium">{employee.employment_type}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Start Date</span>
                                <span className="font-medium">{formatDate(employee.start_date)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Salary</span>
                                <span className="font-medium">{formatCurrency(employee.salary)}</span>
                            </div>
                            {employee.manager && (
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Reports To</span>
                                    <Link
                                        href={`/employee/${employee.manager.id}`}
                                        className="font-medium text-blue-600 hover:underline"
                                    >
                                        {employee.manager.first_name} {employee.manager.last_name}
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Leave Balances */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Leave Balances</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Annual Leave</span>
                                <span className="font-medium">{employee.annual_leave_balance} days</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Sick Leave</span>
                                <span className="font-medium">{employee.sick_leave_balance} days</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Personal Leave</span>
                                <span className="font-medium">{employee.personal_leave_balance} days</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Direct Reports */}
                {employee.direct_reports && employee.direct_reports.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5" />
                                Direct Reports ({employee.direct_reports.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {employee.direct_reports.map((report) => (
                                    <Link
                                        key={report.id}
                                        href={`/employee/${report.id}`}
                                        className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={report.avatar_url || undefined} />
                                            <AvatarFallback>
                                                {report.first_name[0]}
                                                {report.last_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {report.first_name} {report.last_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{report.position}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
