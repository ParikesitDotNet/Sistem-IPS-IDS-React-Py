import { Ban, ShieldCheck, Network } from "lucide-react";
import {
  PageContainer,
  PageHeader,
  MetricCard,
  DataTable,
  StatusBadge,
} from "@/components/layout/page-components";

const blocked = [
  ["BLK-001", "192.168.10.15", "192.168.10.1", "TCP", "Port Scan"],
  ["BLK-002", "192.168.10.22", "192.168.10.5", "UDP", "Policy Violation"],
  ["BLK-003", "192.168.10.30", "192.168.10.8", "TCP", "Unauthorized Flow"],
];

export function BlockedEventsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Blocked Events"
        description="Review traffic blocked by the IPS prevention engine."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Total Blocked"
          value="156"
          description="Simulated blocked events"
          icon={<Ban />}
        />
        <MetricCard
          title="Blocked Today"
          value="24"
          description="Today's demo records"
          icon={<ShieldCheck />}
        />
        <MetricCard
          title="Affected Connections"
          value="18"
          description="Unique connection records"
          icon={<Network />}
        />
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-4 font-semibold">Prevention Event Log</h2>
        <DataTable
          columns={[
            "Event ID",
            "Source IP",
            "Destination IP",
            "Protocol",
            "Reason",
            "Action",
          ]}
          rows={blocked.map((e) => [
            e[0],
            e[1],
            e[2],
            e[3],
            e[4],
            <StatusBadge status="Blocked" />,
          ])}
        />
      </div>
    </PageContainer>
  );
}
