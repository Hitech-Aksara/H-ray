import type { PermissionData } from '@/types/modules/user';

// Permission tree node
export interface PermissionTreeNode {
    name: string;
    children: Record<string, PermissionTreeNode>;
    permissions: PermissionData[];
}

// Build a hierarchical tree from a flat permission list
// e.g., "user.role.action" → { user: { role: { action: ... } } }
export function buildTree(permissions: PermissionData[]): Record<string, PermissionTreeNode> {
    const tree: Record<string, PermissionTreeNode> = {};

    permissions.forEach((permission) => {
        const parts = (permission.name ?? '').split('.');
        let current = tree;

        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = {
                    name: parts.slice(0, index + 1).join('.'),
                    children: {},
                    permissions: [],
                };
            }

            if (index === parts.length - 1) {
                current[part].permissions.push(permission);
            }

            current = current[part].children;
        });
    });

    return tree;
}
