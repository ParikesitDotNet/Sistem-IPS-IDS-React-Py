import { useState } from "react";
import { Users, UserPlus, ShieldCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PageContainer,
  PageHeader,
  MetricCard,
  DataTable,
  StatusBadge,
} from "@/components/layout/page-components";

const userData = [
  [
    "USR-001",
    "Administrator",
    "admin@localhost",
    "Super Administrator",
    "Active",
  ],
  [
    "USR-002",
    "Security Analyst",
    "analyst@localhost",
    "Security Analyst",
    "Active",
  ],
  ["USR-003", "Network Operator", "operator@localhost", "Viewer", "Active"],
  [
    "USR-004",
    "Lab Account",
    "lab@localhost",
    "Security Administrator",
    "Disabled",
  ],
];

export function UsersPage() {
  const [search, setSearch] = useState("");

  const filtered = userData.filter((u) =>
    u.join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageContainer>
      <PageHeader
        title="User Management"
        description="Manage application accounts and access roles."
        action={
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          title="Total Users"
          value="24"
          description="Registered accounts"
          icon={<Users />}
        />
        <MetricCard
          title="Active Users"
          value="21"
          description="Enabled accounts"
          icon={<ShieldCheck />}
        />
        <MetricCard
          title="Access Roles"
          value="04"
          description="Configured role types"
          icon={<ShieldCheck />}
        />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-4 font-semibold">Registered Accounts</h2>
        <DataTable
          columns={["User ID", "Name", "Email", "Role", "Status"]}
          rows={filtered.map((u) => [
            u[0],
            u[1],
            u[2],
            u[3],
            <StatusBadge status={u[4]} />,
          ])}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Account creation, authentication and permissions must be enforced by the
        backend.
      </p>
    </PageContainer>
  );
}
