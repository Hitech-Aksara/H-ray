const MODULE_NAMES: Record<string, string> = {
    user: 'User',
    role: 'Role',
    permission: 'Permission',
    employee: 'Employee',
    attendance: 'Attendance',
    leave: 'Leave',
    report: 'Report',
    settings: 'Settings',
    dashboard: 'Dashboard',
    index: 'Lihat',
    action: 'Kelola',
    delete: 'Hapus',
    assign: 'Atur Perizinan',
    approve: 'Persetujuan',
    view: 'Lihat',
    manage: 'Kelola',
    create: 'Buat',
    edit: 'Ubah',
    export: 'Export',
    submit: 'Kirim',
};

export function useTranslation() {
    const getModuleName = (segment: string): string => {
        return MODULE_NAMES[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
    };

    const getActionName = (action: string): string => {
        return MODULE_NAMES[action] ?? action.charAt(0).toUpperCase() + action.slice(1);
    };

    const formatDefault = (text: string): string => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    return { getModuleName, getActionName, formatDefault };
}
