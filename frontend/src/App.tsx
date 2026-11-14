import { Outlet } from "react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <AppHeader />

        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function App() {
  return <MainLayout />;
}
