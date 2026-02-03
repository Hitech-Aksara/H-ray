// Employee Status Enum
export enum EmployeeStatus {
    Active = 'Active',
    Inactive = 'Inactive',
    OnLeave = 'On Leave',
}

// Employee Status Styles
export const employeeStatusStyles: Record<EmployeeStatus, string> = {
    [EmployeeStatus.Active]: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    [EmployeeStatus.Inactive]: 'bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400',
    [EmployeeStatus.OnLeave]: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
};

// Helper function to get status style
export function getEmployeeStatusStyle(status: string): string {
    return employeeStatusStyles[status as EmployeeStatus] || '';
}

// Employment Type Enum
export enum EmploymentType {
    FullTime = 'Full-time',
    PartTime = 'Part-time',
    Contract = 'Contract',
    Intern = 'Intern',
}

export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    department: string;
    position: string;
    employment_type: string;
    status: string;
    start_date: string | null;
    location: string | null;
    salary: number | null;
    manager_id: number | null;
    annual_leave_balance: number;
    sick_leave_balance: number;
    personal_leave_balance: number;
    manager?: Employee | null;
    direct_reports?: Employee[];
}

export interface Manager {
    id: number;
    first_name: string;
    last_name: string;
    position: string;
}

export interface EmployeeStatistics {
    total: number;
    active: number;
    on_leave: number;
    inactive: number;
}

export interface EmployeeFilters {
    search: string | null;
    department: string | null;
    status: string | null;
}

export interface EmployeeIndexProps {
    employees: Employee[];
    departments: string[];
    statistics: EmployeeStatistics;
    managers: Manager[];
    filters: EmployeeFilters;
}

export interface EmployeeDetailProps {
    employee: Employee;
    managers: Manager[];
}
