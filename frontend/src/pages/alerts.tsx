import { useState } from "react";
import { Search, ShieldAlert, AlertTriangle, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PageContainer,
  PageHeader,
  MetricCard,
  DataTable,
  StatusBadge,
} from "@/components/layout/page-components";

const alertData = [
  [
    "ALT-001",
    "ET SCAN Potential Port Scan",
    "192.168.10.15",
    "Critical",
    "Investigating",
  ],
  ["ALT-002", "Suspicious DNS Query", "192.168.10.22", "High", "Pending"],
  ["ALT-003", "Unusual Network Flow", "192.168.10.30", "Medium", "Resolved"],
  ["ALT-004", "ICMP Network Activity", "192.168.10.12", "Low", "Resolved"],
];

export function AlertsPage() {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = alertData.filter(
    (a) =>
      (filter === "" || a[3] === filter) &&
      a.join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageContainer>
      <PageHeader
        title="Security Alerts"
        description="Detect, investigate and manage security alerts."
        action={
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" /> Alert Center
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Alerts"
          value="128"
          description="Simulated records"
          icon={<ShieldAlert />}
        />
        <MetricCard
          title="Critical"
          value="04"
          description="Highest priority"
          icon={<AlertTriangle />}
        />
        <MetricCard
          title="Investigating"
          value="12"
          description="Under review"
          icon={<Search />}
        />
        <MetricCard
          title="Resolved"
          value="89"
          description="Closed alerts"
          icon={<Bell />}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search alert or source IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="h-10 rounded-md border bg-background px-3 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Severity</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-4 font-semibold">Alert Records</h2>
        <DataTable
          columns={["Alert ID", "Signature", "Source IP", "Severity", "Status"]}
          rows={filtered.map((a) => [
            <span className="font-mono">{a[0]}</span>,
            a[1],
            a[2],
            <StatusBadge status={a[3]} />,
            <StatusBadge status={a[4]} />,
          ])}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {filtered.length} of {alertData.length} demo alerts.
        </p>
      </div>
    </PageContainer>
  );
}
