import { NavLink, useLocation } from "react-router";
import {
  Activity,
  Ban,
  ChartNoAxesCombined,
  ChartPie,
  ClipboardList,
  FileClock,
  LayoutDashboard,
  ListChecks,
  Radar,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigation = [
  {
    label: "MAIN",
    items: [
      { title: "Overview", url: "/", icon: LayoutDashboard },
      { title: "Live Monitoring", url: "/monitoring", icon: Activity },
      { title: "Network Traffic", url: "/traffic", icon: ChartNoAxesCombined },
    ],
  },
  {
    label: "THREAT MANAGEMENT",
    items: [
      { title: "Security Alerts", url: "/alerts", icon: ShieldAlert },
      { title: "Threat Intelligence", url: "/intelligence", icon: Radar },
      { title: "Detection Rules", url: "/detection-rules", icon: ListChecks },
    ],
  },
  {
    label: "DEFENSE MANAGEMENT",
    items: [
      { title: "Prevention Policies", url: "/prevention", icon: ShieldCheck },
      { title: "Blocked Events", url: "/blocked-events", icon: Ban },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { title: "Reports & Analytics", url: "/reports", icon: ChartPie },
      { title: "Event History", url: "/history", icon: FileClock },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { title: "User Management", url: "/users", icon: Users },
      { title: "Audit Logs", url: "/audit", icon: ClipboardList },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-bold tracking-wide">
              DEFENSE PLATFORM
            </p>
            <p className="text-[10px] text-muted-foreground">
              NETWORK SECURITY SYSTEM
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-2 px-2 py-3">
        {navigation.map((group) => (
          <SidebarGroup key={group.label} className="py-1">
            <SidebarGroupLabel className="text-[10px] font-semibold tracking-widest text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>

            <SidebarMenu>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname === item.url ||
                      pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      className="h-9"
                      render={<NavLink to={item.url} end={item.url === "/"} />}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-xs font-semibold">System Administrator</p>
            <p className="text-[10px] text-muted-foreground">
              Platform Operator
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
