import { Head, Link, router, usePage } from '@inertiajs/react';
import { Filter, MoreHorizontal, Mail, Phone, Users, UserCheck, Clock, UserX } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Paginate from '@/components/ui/paginate';
import Search from '@/components/ui/search';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useFilter } from '@/hooks/use-filter';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Employee, EmployeeStatistics, Manager } from '@/types';
import { getEmployeeStatusStyle } from '@/types/employee';
import type { Pagination } from '@/types/pagination';
import AddEmployeeDialog from '@/components/employee/add-employee-dialog';

interface PageProps {
    employees: Pagination<Employee>;
    departments: string[];
    statistics: EmployeeStatistics;
    managers: Manager[];
    filters: {
        search: string | null;
        department: string | null;
        status: string | null;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/' },
    { title: 'Employees', href: '/employee' },
];

export default function EmployeeIndex() {
    const { employees, departments, statistics, managers, filters: initialFilters } = usePage<PageProps>().props;

    const { filters, handleFilterChange } = useFilter<{ department: string; status: string }>({
        baseUrl: '/employee',
        initialFilters: {
            department: initialFilters.department,
            status: initialFilters.status,
        },
    });

    const statCards = [
        { title: 'Total Employees', value: statistics.total, icon: Users, color: 'text-blue-600' },
        { title: 'Active', value: statistics.active, icon: UserCheck, color: 'text-green-600' },
        { title: 'On Leave', value: statistics.on_leave, icon: Clock, color: 'text-yellow-600' },
        { title: 'Inactive', value: statistics.inactive, icon: UserX, color: 'text-neutral-500' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Employees</h1>
                        <p className="text-muted-foreground">Manage your team members</p>
                    </div>
                    <AddEmployeeDialog departments={departments} managers={managers} />
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <Card key={stat.title}>
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className={`rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Search & Filter */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <Search
                                placeholder="Search by name, email, or position..."
                                className="flex-1"
                            />
                            <div className="flex gap-3">
                                <Select value={filters.department} onValueChange={(v: string) => handleFilterChange('department', v)}>
                                    <SelectTrigger className="w-48">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Departments</SelectItem>
                                        {departments.map((dept: string) => (
                                            <SelectItem key={dept} value={dept}>
                                                {dept}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={filters.status} onValueChange={(v: string) => handleFilterChange('status', v)}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                        <SelectItem value="On Leave">On Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Employee Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {employees.data.map((employee: Employee) => (
                        <Card
                            key={employee.id}
                            className="group hover-lift overflow-hidden"
                        >
                            <CardContent className="p-0">
                                <div className="h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />

                                <div className="-mt-8 px-6">
                                    <Avatar className="h-16 w-16 border-4 border-card">
                                        <AvatarImage src={employee.avatar_url || undefined} />
                                        <AvatarFallback className="text-lg">
                                            {employee.first_name[0]}
                                            {employee.last_name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="p-6 pt-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Link
                                                href={`/employee/${employee.id}`}
                                                className="font-semibold hover:text-blue-600 transition-colors"
                                            >
                                                {employee.first_name} {employee.last_name}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/employee/${employee.id}`}>View Profile</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className={employee.status === 'Active' ? 'text-red-600' : 'text-green-600'}
                                                    onClick={() => {
                                                        router.put(`/employee/${employee.id}`, {
                                                            first_name: employee.first_name,
                                                            last_name: employee.last_name,
                                                            email: employee.email,
                                                            department: employee.department,
                                                            position: employee.position,
                                                            status: employee.status === 'Active' ? 'Inactive' : 'Active',
                                                        }, { preserveScroll: true });
                                                    }}
                                                >
                                                    {employee.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="mt-4 flex items-center gap-2">
                                        <Badge variant="outline" className="font-normal">
                                            {employee.department}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className={`font-normal ${getEmployeeStatusStyle(employee.status)}`}
                                        >
                                            {employee.status}
                                        </Badge>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4 border-t pt-4">
                                        <a
                                            href={`mailto:${employee.email}`}
                                            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
                                        >
                                            <Mail className="h-4 w-4" />
                                            <span className="max-w-[120px] truncate">{employee.email.split('@')[0]}</span>
                                        </a>
                                        {employee.phone && (
                                            <a
                                                href={`tel:${employee.phone}`}
                                                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-600 transition-colors"
                                            >
                                                <Phone className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {employees.data.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">No employees found matching your criteria.</p>
                    </div>
                )}

                {employees.last_page > 1 && (
                    <Paginate pagination={employees} />
                )}
            </div>
        </AppLayout>
    );
}
