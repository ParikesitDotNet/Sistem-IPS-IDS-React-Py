import { BrowserRouter, Routes, Route } from "react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { OverviewPage } from "@/pages/overview";

const pages = [
  ["monitoring", "Live Monitoring"],
  ["traffic", "Network Traffic"],
  ["alerts", "Security Alerts"],
  ["intelligence", "Threat Intelligence"],
  ["detection-rules", "Detection Rules"],
  ["prevention", "Prevention Policies"],
  ["blocked-events", "Blocked Events"],
  ["devices", "Devices & Assets"],
  ["sensors", "Sensors & Engines"],
  ["reports", "Reports & Analytics"],
  ["history", "Event History"],
  ["users", "User Management"],
  ["audit", "Audit Logs"],
  ["settings", "Settings"],
];

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This module is currently under development.
      </p>
    </div>
  );
}

function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <AppHeader />

        <main className="min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<OverviewPage />} />

            {pages.map(([path, title]) => (
              <Route
                key={path}
                path={`/${path}`}
                element={<Placeholder title={title} />}
              />
            ))}
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout />
    </BrowserRouter>
  );
}
