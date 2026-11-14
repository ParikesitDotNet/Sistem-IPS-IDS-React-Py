import { useState } from "react";
import { FileCode, ShieldCheck, ShieldAlert, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  PageContainer,
  PageHeader,
  MetricCard,
  DataTable,
  StatusBadge,
} from "@/components/layout/page-components";

const initialRules = [
  ["100001", "ET SCAN Potential Port Scan", "Reconnaissance", "TCP", "Enabled"],
  ["100002", "Suspicious DNS Query", "DNS", "UDP", "Enabled"],
  ["100003", "Possible SSH Brute Force", "Authentication", "TCP", "Disabled"],
  ["100004", "ICMP Network Sweep", "Reconnaissance", "ICMP", "Enabled"],
];

export function DetectionRulesPage() {
  const [search, setSearch] = useState("");

  const filtered = initialRules.filter((r) =>
    r.join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageContainer>
      <PageHeader
        title="Detection Rules"
        description="Review and manage IDS detection signatures."
        action={
          <Button variant="outline">
            <FileCode className="mr-2 h-4 w-4" /> Import Rules
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Total Rules"
          value="1,240"
          description="Configured rule records"
          icon={<FileCode />}
        />
        <MetricCard
          title="Enabled Rules"
          value="1,180"
          description="Active detection rules"
          icon={<ShieldCheck />}
        />
        <MetricCard
          title="Disabled Rules"
          value="60"
          description="Inactive rules"
          icon={<ShieldAlert />}
        />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search rule ID or signature..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-4 font-semibold">Detection Signature Repository</h2>
        <DataTable
          columns={["SID", "Signature", "Category", "Protocol", "Status"]}
          rows={filtered.map((r) => [
            <span className="font-mono">{r[0]}</span>,
            r[1],
            r[2],
            r[3],
            <StatusBadge status={r[4]} />,
          ])}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Rule changes should be validated and tested in the isolated Ubuntu lab
        before deployment.
      </p>
    </PageContainer>
  );
}
