import {
  Activity,
  AlertTriangle,
  RadioTower,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const trafficData = [
  { time: "08:00", incoming: 18, outgoing: 12 },
  { time: "09:00", incoming: 32, outgoing: 21 },
  { time: "10:00", incoming: 25, outgoing: 18 },
  { time: "11:00", incoming: 48, outgoing: 30 },
  { time: "12:00", incoming: 38, outgoing: 24 },
  { time: "13:00", incoming: 55, outgoing: 35 },
  { time: "14:00", incoming: 42, outgoing: 28 },
];

const stats = [
  {
    title: "Total Alerts",
    value: "128",
    description: "Security events recorded",
    icon: ShieldAlert,
  },
  {
    title: "Critical Threats",
    value: "04",
    description: "Require investigation",
    icon: AlertTriangle,
  },
  {
    title: "Active Sensors",
    value: "03",
    description: "Monitoring sensors",
    icon: RadioTower,
  },
  {
    title: "Blocked Traffic",
    value: "24",
    description: "Prevention events",
    icon: ShieldCheck,
  },
];

const alerts = [
  {
    name: "Possible Port Scan",
    source: "192.168.10.15",
    severity: "Critical",
  },
  {
    name: "Suspicious DNS Activity",
    source: "192.168.10.22",
    severity: "High",
  },
  {
    name: "Unusual Network Flow",
    source: "192.168.10.30",
    severity: "Medium",
  },
];

export function OverviewPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Network security monitoring dashboard.
          </p>
        </div>

        <Badge variant="outline" className="gap-2 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Lab Environment
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold tabular-nums">
                  {stat.value}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Network Traffic Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Incoming and outgoing traffic · Mbps
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="incoming" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outgoing" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.2}
                  />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="incoming"
                    stroke="#3b82f6"
                    fill="url(#incoming)"
                    strokeWidth={2}
                  />

                  <Area
                    type="monotone"
                    dataKey="outgoing"
                    stroke="#10b981"
                    fill="url(#outgoing)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engine Status</CardTitle>
            <p className="text-sm text-muted-foreground">
              Security infrastructure health
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            {[
              ["IDS Engine", "Running"],
              ["IPS Engine", "Running"],
              ["Backend API", "Connected"],
              ["Database", "Connected"],
            ].map(([name, status]) => (
              <div key={name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{name}</span>
                <Badge variant="outline" className="text-emerald-600">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Security Alerts</CardTitle>
            <p className="text-sm text-muted-foreground">
              Latest detection events
            </p>
          </div>
          <Activity className="h-5 w-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.name}
                className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium">{alert.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Source: {alert.source}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={
                    alert.severity === "Critical"
                      ? "border-red-500 text-red-500"
                      : alert.severity === "High"
                        ? "border-orange-500 text-orange-500"
                        : "border-blue-500 text-blue-500"
                  }
                >
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
