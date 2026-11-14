import {
  Activity,
  ArrowDownToLine,
  ArrowUpFromLine,
  Network,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PageContainer,
  PageHeader,
  MetricCard,
  DataTable,
} from "@/components/layout/page-components";

const traffic = [
  { time: "08:00", incoming: 20, outgoing: 12 },
  { time: "09:00", incoming: 32, outgoing: 21 },
  { time: "10:00", incoming: 28, outgoing: 18 },
  { time: "11:00", incoming: 48, outgoing: 30 },
  { time: "12:00", incoming: 38, outgoing: 24 },
  { time: "13:00", incoming: 55, outgoing: 35 },
];

const protocols = [
  { name: "TCP", value: 55 },
  { name: "UDP", value: 25 },
  { name: "ICMP", value: 12 },
  { name: "Other", value: 8 },
];

const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

export function TrafficPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Network Traffic"
        description="Network bandwidth, protocol distribution and traffic analysis."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Incoming Traffic"
          value="55 Mbps"
          description="Demo peak throughput"
          icon={<ArrowDownToLine />}
        />
        <MetricCard
          title="Outgoing Traffic"
          value="35 Mbps"
          description="Demo peak throughput"
          icon={<ArrowUpFromLine />}
        />
        <MetricCard
          title="Total Connections"
          value="2,481"
          description="Simulated connections"
          icon={<Network />}
        />
        <MetricCard
          title="Traffic Events"
          value="8,420"
          description="Simulated records"
          icon={<Activity />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bandwidth Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={traffic}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  dataKey="incoming"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.12}
                />
                <Area
                  dataKey="outgoing"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.12}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Protocol Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid items-center gap-4 md:grid-cols-2">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={protocols}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={85}
                  >
                    {protocols.map((item, i) => (
                      <Cell key={item.name} fill={colors[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <DataTable
              columns={["Protocol", "Distribution"]}
              rows={protocols.map((p) => [p.name, `${p.value}%`])}
            />
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
