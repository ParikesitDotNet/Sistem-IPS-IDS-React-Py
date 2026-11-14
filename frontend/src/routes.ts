import { createBrowserRouter } from "react-router";

import App from "./App";

import { OverviewPage } from "@/pages/overview";
import { MonitoringPage } from "@/pages/monitoring";
import { TrafficPage } from "@/pages/traffic";
import { AlertsPage } from "@/pages/alerts";
import { IntelligencePage } from "@/pages/intelligence";
import { DetectionRulesPage } from "@/pages/detection-rules";
import { PreventionPage } from "@/pages/prevention";
import { BlockedEventsPage } from "@/pages/blocked-events";
import { ReportsPage } from "@/pages/reports";
import { HistoryPage } from "@/pages/history";
import { UsersPage } from "@/pages/users";
import { AuditPage } from "@/pages/audit";
import { SettingsPage } from "@/pages/settings";

// All dashboard child pages
const childPages = [
  { path: "monitoring", Component: MonitoringPage },
  { path: "traffic", Component: TrafficPage },
  { path: "alerts", Component: AlertsPage },
  { path: "intelligence", Component: IntelligencePage },
  { path: "detection-rules", Component: DetectionRulesPage },
  { path: "prevention", Component: PreventionPage },
  { path: "blocked-events", Component: BlockedEventsPage },
  { path: "reports", Component: ReportsPage },
  { path: "history", Component: HistoryPage },
  { path: "users", Component: UsersPage },
  { path: "audit", Component: AuditPage },
  { path: "settings", Component: SettingsPage },
];

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: OverviewPage,
      },
      ...childPages,
    ],
  },
]);
