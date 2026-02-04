import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { Manager } from '@/types';
import EmployeeForm, { type EmployeeFormData } from './employee-form';

interface AddEmployeeDialogProps {
    departments: string[];
    managers: Manager[];
}

export default function AddEmployeeDialog({ departments, managers }: AddEmployeeDialogProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<EmployeeFormData>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        employment_type: 'Full-time',
        status: 'Active',
        start_date: '',
        location: '',
        salary: '',
        manager_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/employee', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Employee
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to add a new team member.
                    </DialogDescription>
                </DialogHeader>
                <EmployeeForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                    managers={managers}
                    departments={departments}
                    submitLabel="Add Employee"
                    submitLoadingLabel="Adding..."
                />
            </DialogContent>
        </Dialog>
    );
}
