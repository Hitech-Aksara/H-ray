import type { PermissionData } from '@/types/modules/user';
import type { PermissionTreeNode } from './index';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface PermissionTreeRootProps {
    tree: Record<string, PermissionTreeNode>;
    permissions: PermissionData[];
    openAccordions: Record<string, boolean>;
    handleAccordionChange: (path: string, isOpen: boolean) => void;
    countGroup: (prefix: string) => { active: number; total: number };
    toggleGroup: (prefix: string, checked: boolean) => void;
    handlePermissionToggle: (permissionId: number, checked: boolean) => void;
    handlePermissionScope: (permissionId: number, scope: string | null) => void;
    formatSegment: (segment: string) => string;
    formatActionLabel: (name: string) => string;
}

function TreeNode({
    node,
    segment,
    depth,
    openAccordions,
    handleAccordionChange,
    countGroup,
    toggleGroup,
    handlePermissionToggle,
    handlePermissionScope,
    formatSegment,
    formatActionLabel,
}: {
    node: PermissionTreeNode;
    segment: string;
    depth: number;
} & Omit<PermissionTreeRootProps, 'tree' | 'permissions'>) {
    const isOpen = openAccordions[node.name] ?? false;
    const { active, total } = countGroup(node.name);
    const hasChildren = Object.keys(node.children).length > 0;
    const hasPermissions = node.permissions.length > 0;
    const isAllActive = active === total && total > 0;

    if (!hasChildren && hasPermissions) {
        // Leaf node: render as a permission toggle
        const permission = node.permissions[0];
        return (
            <div className="flex items-center justify-between rounded-lg border border-border/50 p-3" style={{ marginLeft: depth * 16 }}>
                <div className="flex items-center gap-3">
                    <Switch
                        id={`perm-${permission.id}`}
                        checked={permission.active ?? false}
                        onCheckedChange={(checked: boolean) => handlePermissionToggle(permission.id, checked)}
                    />
                    <Label htmlFor={`perm-${permission.id}`} className="cursor-pointer">
                        {formatActionLabel(permission.name ?? '')}
                    </Label>
                </div>
                {permission.scope && (
                    <Badge variant="outline" className="text-xs">
                        {permission.scope}
                    </Badge>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2" style={{ marginLeft: depth > 0 ? 16 : 0 }}>
            {/* Group header */}
            <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                <button
                    type="button"
                    onClick={() => handleAccordionChange(node.name, !isOpen)}
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    {formatSegment(segment)}
                </button>
                <Badge variant="secondary" className="text-xs">
                    {active}/{total}
                </Badge>
                <div className="ml-auto">
                    <Switch
                        id={`group-${node.name}`}
                        checked={isAllActive}
                        onCheckedChange={(checked: boolean) => toggleGroup(node.name, checked)}
                    />
                </div>
            </div>

            {/* Children */}
            {isOpen && (
                <div className="space-y-2">
                    {Object.entries(node.children).map(([childSegment, childNode]) => (
                        <TreeNode
                            key={childNode.name}
                            node={childNode}
                            segment={childSegment}
                            depth={depth + 1}
                            openAccordions={openAccordions}
                            handleAccordionChange={handleAccordionChange}
                            countGroup={countGroup}
                            toggleGroup={toggleGroup}
                            handlePermissionToggle={handlePermissionToggle}
                            handlePermissionScope={handlePermissionScope}
                            formatSegment={formatSegment}
                            formatActionLabel={formatActionLabel}
                        />
                    ))}
                    {/* Direct permissions at this level */}
                    {node.permissions.map((permission) => (
                        <div
                            key={permission.id}
                            className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                            style={{ marginLeft: (depth + 1) * 16 }}
                        >
                            <div className="flex items-center gap-3">
                                <Switch
                                    id={`perm-${permission.id}`}
                                    checked={permission.active ?? false}
                                    onCheckedChange={(checked: boolean) => handlePermissionToggle(permission.id, checked)}
                                />
                                <Label htmlFor={`perm-${permission.id}`} className="cursor-pointer">
                                    {formatActionLabel(permission.name ?? '')}
                                </Label>
                            </div>
                            {permission.scope && (
                                <Badge variant="outline" className="text-xs">
                                    {permission.scope}
                                </Badge>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function PermissionTreeRoot(props: PermissionTreeRootProps) {
    const { tree, ...rest } = props;

    return (
        <div className="space-y-3">
            {Object.entries(tree).map(([segment, node]) => (
                <TreeNode key={node.name} node={node} segment={segment} depth={0} {...rest} />
            ))}
        </div>
    );
}
