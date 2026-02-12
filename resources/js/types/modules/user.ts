export interface UserData {
    id: number;
    name: string;
    email: string;
    password?: string;
    roles?: number[] | RoleData[];
}

export interface RoleData {
    id: number;
    name: string;
    guard_name?: string;
    permissions?: PermissionData[];
}

export interface PermissionData {
    id: number;
    name: string;
    guard_name?: string;
    active?: boolean;
    scope?: string | null;
}
