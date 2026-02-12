import * as React from 'react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';

// Dropdown wrapper
export function DropdownOptions({ children }: { children: React.ReactNode }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Opsi</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{children}</DropdownMenuContent>
        </DropdownMenu>
    );
}

// Single menu action (link-based)
export function DropdownAction({
    href,
    icon,
    label,
    isShow = true,
}: {
    href: string;
    icon?: React.ReactNode;
    label: string;
    isShow?: boolean;
}) {
    if (!isShow) return null;
    return (
        <DropdownMenuItem asChild>
            <Link href={href} className="flex items-center gap-2">
                {icon}
                {label}
            </Link>
        </DropdownMenuItem>
    );
}

// Separator
export function DropdownActionSeparator({ show = true }: { show?: boolean }) {
    if (!show) return null;
    return <DropdownMenuSeparator />;
}

// Confirm dialog item inside dropdown
export function ConfirmDialogItem({
    title,
    description,
    onConfirm,
    icon,
    label,
    isShow = true,
}: {
    title: string;
    description: string;
    onConfirm: () => void;
    icon?: React.ReactNode;
    label: string;
    isShow?: boolean;
}) {
    const [open, setOpen] = useState(false);

    if (!isShow) return null;

    return (
        <>
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault();
                    setOpen(true);
                }}
                className="text-destructive focus:text-destructive flex items-center gap-2"
            >
                {icon}
                {label}
            </DropdownMenuItem>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                onConfirm();
                                setOpen(false);
                            }}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
