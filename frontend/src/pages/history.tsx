import { useState } from "react";
import { Clock, Search, Database, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  PageContainer,
  PageHeader,
  MetricCard,
  DataTable,
  StatusBadge,
} from "@/components/layout/page-components";

const history = [
  ["EVT-1001", "14 Nov 2026 08:15", "Port Scan", "192.168.10.15", "Critical"],
  ["EVT-1002", "14 Nov 2026 08:20", "DNS Activity", "192.168.10.22", "High"],
  ["EVT-1003", "14 Nov 2026 09:10", "Network Flow", "192.168.10.30", "Medium"],
  ["EVT-1004", "14 Nov 2026 09:30", "ICMP Request", "192.168.10.12", "Low"],
];

export function HistoryPage() {
  const [search, setSearch] = useState("");

  const filtered = history.filter((event) =>
    event.join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageContainer>
      <PageHeader
        title="Event History"
        description="Search and review previously recorded network security events."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Stored Events"
          value="12,840"
          description="Simulated event records"
          icon={<Database />}
        />
        <MetricCard
          title="Today's Events"
          value="1,284"
          description="Daily records"
          icon={<CalendarDays />}
        />
        <MetricCard
          title="Recent Activity"
          value="24"
          description="Recent event samples"
          icon={<Clock />}
        />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search event ID, IP or signature..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-4 font-semibold">Historical Event Records</h2>
        <DataTable
          columns={[
            "Event ID",
            "Timestamp",
            "Event Type",
            "Source IP",
            "Severity",
          ]}
          rows={filtered.map((e) => [
            <span className="font-mono">{e[0]}</span>,
            e[1],
            e[2],
            e[3],
            <StatusBadge status={e[4]} />,
          ])}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Displaying demonstration records. Historical search will use the
          backend database.
        </p>
      </div>
    </PageContainer>
  );
}
