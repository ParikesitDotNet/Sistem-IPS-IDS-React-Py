import { Activity, RadioTower, ShieldAlert, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  PageContainer,
  MetricCard,
  DataTable,
  StatusBadge,
} from "@/components/layout/page-components";

const events = [
  ["EVT-001", "192.168.10.15", "192.168.10.1", "TCP", "Port Scan", "Critical"],
  ["EVT-002", "192.168.10.22", "192.168.10.5", "UDP", "DNS Query", "Medium"],
  ["EVT-003", "192.168.10.30", "192.168.10.8", "TCP", "Unusual Flow", "High"],
  ["EVT-004", "192.168.10.12", "192.168.10.2", "ICMP", "Ping Request", "Low"],
];

export function MonitoringPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Live Monitoring"
        description="Real-time network activity and detection events."
        action={
          <Button variant="outline">
            <Activity className="mr-2 h-4 w-4" /> Refresh View
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Events Today"
          value="1,284"
          description="Simulated event count"
          icon={<Activity />}
        />
        <MetricCard
          title="Active Sensors"
          value="03"
          description="Configured lab sensors"
          icon={<RadioTower />}
        />
        <MetricCard
          title="Critical Events"
          value="04"
          description="Require investigation"
          icon={<ShieldAlert />}
        />
        <MetricCard
          title="Network Status"
          value="Online"
          description="Demo environment"
          icon={<Wifi />}
        />
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Network Event Stream</h2>
          <StatusBadge status="Active" />
        </div>
        <DataTable
          columns={[
            "Event ID",
            "Source IP",
            "Destination IP",
            "Protocol",
            "Event",
            "Severity",
          ]}
          rows={events.map((event) => [
            <span className="font-mono">{event[0]}</span>,
            event[1],
            event[2],
            event[3],
            event[4],
            <StatusBadge status={event[5]} />,
          ])}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Demonstration data. Live events require a connected backend event
          stream.
        </p>
      </div>
    </PageContainer>
  );
}
