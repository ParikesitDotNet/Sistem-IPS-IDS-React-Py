import { Globe, Fingerprint, ShieldAlert, Database } from "lucide-react";
import {
  PageContainer,
  PageHeader,
  MetricCard,
  DataTable,
  StatusBadge,
} from "@/components/layout/page-components";

const indicators = [
  ["IOC-001", "IP Address", "198.51.100.25", "Suspicious", "Lab Feed"],
  ["IOC-002", "Domain", "example-threat.test", "Malicious", "Local Feed"],
  ["IOC-003", "SHA256", "a1b2c3d4...e5f6", "Unknown", "Manual Entry"],
  ["IOC-004", "IP Address", "203.0.113.10", "Suspicious", "Lab Feed"],
];

export function IntelligencePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Threat Intelligence"
        description="Manage indicators of compromise and threat context."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Indicators"
          value="248"
          description="Stored IOC records"
          icon={<Database />}
        />
        <MetricCard
          title="IP Indicators"
          value="124"
          description="IP-based indicators"
          icon={<Globe />}
        />
        <MetricCard
          title="File Hashes"
          value="86"
          description="Hash-based indicators"
          icon={<Fingerprint />}
        />
        <MetricCard
          title="Flagged Indicators"
          value="38"
          description="Require review"
          icon={<ShieldAlert />}
        />
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-4 font-semibold">Indicator Repository</h2>
        <DataTable
          columns={["IOC ID", "Type", "Indicator", "Reputation", "Source"]}
          rows={indicators.map((i) => [
            i[0],
            i[1],
            <span className="font-mono">{i[2]}</span>,
            <StatusBadge status={i[3]} />,
            i[4],
          ])}
        />
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Intelligence Sources</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Local laboratory feed and manually imported indicators. External
          intelligence feeds can be connected in a future integration.
        </p>
      </div>
    </PageContainer>
  );
}
