import { Link } from '@inertiajs/react';
import { LayoutDashboard, Settings, Users } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePermission } from '@/hooks/use-permission';
import { dashboard } from '@/routes';
import user from '@/routes/user';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
        permission: 'dashboard',
    },
    {
        title: 'Employees',
        href: '/employee',
        icon: Users,
        permission: 'employee',
    },
    {
        title: 'Menu Setting',
        href: user.index.url(),
        icon: Settings,
        permission: 'user',
    },
];

export function AppSidebar() {
    const { canAny } = usePermission();

    const filteredItems = mainNavItems.filter(
        (item) => !item.permission || canAny(item.permission),
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredItems} />
            </SidebarContent>

            <SidebarFooter />
        </Sidebar>
    );
}
