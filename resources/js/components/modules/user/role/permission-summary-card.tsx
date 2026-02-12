import type { PermissionData } from '@/types/modules/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface PermissionSummaryCardProps {
    permissions: PermissionData[];
}

export default function PermissionSummaryCard({ permissions }: PermissionSummaryCardProps) {
    const total = permissions.length;
    const active = permissions.filter((p) => p.active).length;
    const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="h-4 w-4" />
                    Ringkasan Permission
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="text-sm">
                        {active} / {total} aktif
                    </Badge>
                    <div className="flex-1">
                        <div className="bg-muted h-2 rounded-full">
                            <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                </div>
            </CardContent>
        </Card>
    );
}
