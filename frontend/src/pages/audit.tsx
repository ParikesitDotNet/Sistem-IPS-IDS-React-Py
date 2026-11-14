import { ClipboardList, LogIn, ShieldCheck, Settings } from "lucide-react";
import {
  PageContainer,
  PageHeader,
  MetricCard,
  DataTable,
  StatusBadge,
} from "@/components/layout/page-components";

const auditData = [
  ["AUD-001", "Administrator", "User Login", "14 Nov 2026 08:00", "Success"],
  [
    "AUD-002",
    "Security Analyst",
    "View Alerts",
    "14 Nov 2026 08:15",
    "Success",
  ],
  [
    "AUD-003",
    "Administrator",
    "Update Settings",
    "14 Nov 2026 09:00",
    "Success",
  ],
  ["AUD-004", "Lab Account", "Failed Login", "14 Nov 2026 09:20", "Failed"],
];

export function AuditPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Audit Logs"
        description="Track administrative actions and application security events."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Total Activities"
          value="2,840"
          description="Recorded audit entries"
          icon={<ClipboardList />}
        />
        <MetricCard
          title="Login Activities"
          value="482"
          description="Authentication events"
          icon={<LogIn />}
        />
        <MetricCard
          title="Configuration Changes"
          value="36"
          description="Administrative changes"
          icon={<Settings />}
        />
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          <h2 className="font-semibold">Administrative Activity Log</h2>
        </div>

        <DataTable
          columns={["Audit ID", "User", "Activity", "Timestamp", "Result"]}
          rows={auditData.map((a) => [
            <span className="font-mono">{a[0]}</span>,
            a[1],
            a[2],
            a[3],
            <StatusBadge status={a[4]} />,
          ])}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Audit records should be generated server-side and protected against
        unauthorized modification.
      </p>
    </PageContainer>
  );
}
