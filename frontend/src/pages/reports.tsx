import { useState } from "react";
import { Download, FileText, ShieldAlert, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PageContainer,
  PageHeader,
  MetricCard,
  DataTable,
} from "@/components/layout/page-components";

const trend = [
  { day: "Mon", alerts: 18 },
  { day: "Tue", alerts: 25 },
  { day: "Wed", alerts: 14 },
  { day: "Thu", alerts: 32 },
  { day: "Fri", alerts: 28 },
  { day: "Sat", alerts: 12 },
  { day: "Sun", alerts: 20 },
];

const reportList = [
  ["RPT-001", "Daily Security Summary", "14 Nov 2026", "Completed"],
  ["RPT-002", "Network Traffic Analysis", "13 Nov 2026", "Completed"],
  ["RPT-003", "Threat Detection Report", "12 Nov 2026", "Pending"],
];

export function ReportsPage() {
  const [period, setPeriod] = useState("7");

  return (
    <PageContainer>
      <PageHeader
        title="Reports & Analytics"
        description="Security statistics, detection trends and reporting."
        action={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Generated Reports"
          value="48"
          description="Report records"
          icon={<FileText />}
        />
        <MetricCard
          title="Security Events"
          value="1,284"
          description="Simulated events"
          icon={<ShieldAlert />}
        />
        <MetricCard
          title="Threat Trend"
          value="+12%"
          description="Illustrative comparison"
          icon={<TrendingUp />}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Alert Trends</CardTitle>
            <p className="text-sm text-muted-foreground">
              Demo alert count by day
            </p>
          </div>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="7">7 Days</option>
            <option value="30">30 Days</option>
            <option value="90">90 Days</option>
          </select>
        </CardHeader>
        <CardContent>
          <div className="h-70">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="alerts" fill="#3b82f6" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border p-4">
        <h2 className="mb-4 font-semibold">Report History</h2>
        <DataTable
          columns={["Report ID", "Report Name", "Date", "Status"]}
          rows={reportList.map((r) => [r[0], r[1], r[2], r[3]])}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Export functionality and report generation will be connected to the
        backend later.
      </p>
    </PageContainer>
  );
}
