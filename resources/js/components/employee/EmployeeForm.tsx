import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Manager } from '@/types';

export interface EmployeeFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    employment_type: string;
    status: string;
    start_date: string;
    location: string;
    salary: string;
    manager_id: string;
}

interface EmployeeFormProps {
    data: EmployeeFormData;
    setData: (key: keyof EmployeeFormData, value: string) => void;
    errors: Partial<Record<keyof EmployeeFormData, string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    managers: Manager[];
    departments?: string[];
    submitLabel?: string;
    submitLoadingLabel?: string;
}

export default function EmployeeForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    onCancel,
    managers,
    departments = [],
    submitLabel = 'Save',
    submitLoadingLabel = 'Saving...',
}: EmployeeFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                        id="first_name"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                    />
                    {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                        id="last_name"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                    />
                    {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    {departments.length > 0 ? (
                        <Select value={data.department} onValueChange={(v) => setData('department', v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            id="department"
                            value={data.department}
                            onChange={(e) => setData('department', e.target.value)}
                        />
                    )}
                    {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                        id="position"
                        value={data.position}
                        onChange={(e) => setData('position', e.target.value)}
                    />
                    {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Select value={data.employment_type} onValueChange={(v) => setData('employment_type', v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Intern">Intern</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="On Leave">On Leave</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                        id="start_date"
                        type="date"
                        value={data.start_date}
                        onChange={(e) => setData('start_date', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="manager_id">Manager</Label>
                    <Select value={data.manager_id} onValueChange={(v) => setData('manager_id', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                        <SelectContent>
                            {managers.map((mgr) => (
                                <SelectItem key={mgr.id} value={String(mgr.id)}>
                                    {mgr.first_name} {mgr.last_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="salary">Salary</Label>
                    <Input
                        id="salary"
                        type="number"
                        value={data.salary}
                        onChange={(e) => setData('salary', e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? submitLoadingLabel : submitLabel}
                </Button>
            </div>
        </form>
    );
}
