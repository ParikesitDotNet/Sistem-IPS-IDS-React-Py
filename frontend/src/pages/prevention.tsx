import { ShieldCheck, ShieldAlert, Settings2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PageContainer,
  PageHeader,
  MetricCard,
  DataTable,
  StatusBadge,
} from "@/components/layout/page-components";

const policies = [
  ["POL-001", "Port Scan Detection", "Alert", "Enabled"],
  ["POL-002", "Suspicious DNS Traffic", "Alert", "Enabled"],
  ["POL-003", "Unauthorized Connection", "Block", "Enabled"],
  ["POL-004", "ICMP Anomaly", "Log", "Disabled"],
];

export function PreventionPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Prevention Policies"
        description="Review IPS prevention policies and enforcement configuration."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Total Policies"
          value="24"
          description="Configured policies"
          icon={<Settings2 />}
        />
        <MetricCard
          title="Active Policies"
          value="20"
          description="Enabled policies"
          icon={<ShieldCheck />}
        />
        <MetricCard
          title="Prevention Events"
          value="156"
          description="Simulated records"
          icon={<ShieldAlert />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engine Operating Mode</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">IDS Mode</h3>
              <Badge variant="outline">Detection</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Monitors traffic and generates alerts without inline blocking.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex justify-between">
              <h3 className="font-semibold">IPS Mode</h3>
              <Badge variant="outline">Prevention</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Inspects traffic and applies configured prevention actions.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border p-4">
        <h2 className="mb-4 font-semibold">Policy Repository</h2>
        <DataTable
          columns={["Policy ID", "Policy Name", "Action", "Status"]}
          rows={policies.map((p) => [
            p[0],
            p[1],
            p[2],
            <StatusBadge status={p[3]} />,
          ])}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        This page is read-only demo UI. Actual enforcement must be controlled by
        an authorized backend.
      </p>
    </PageContainer>
  );
}
