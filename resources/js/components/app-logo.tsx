import { Building2 } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    H-Ray
                </span>
            </div>
        </>
    );
}
