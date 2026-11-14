import { useState } from "react";
import { Settings, Bell, Palette, Network, Server, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageContainer, PageHeader } from "@/components/layout/page-components";

export function SettingsPage() {
  const [systemName, setSystemName] = useState("Defense Platform");
  const [interfaceName, setInterfaceName] = useState("ens33");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage application preferences and system configuration."
        action={
          <Button onClick={() => setSaved(true)}>
            <Save className="mr-2 h-4 w-4" /> Save Preferences
          </Button>
        }
      />

      {saved && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">
          Demo preferences saved in the current page state.
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">System Name</label>
              <Input
                value={systemName}
                onChange={(e) => {
                  setSystemName(e.target.value);
                  setSaved(false);
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">System Description</label>
              <Input defaultValue="Network Security Monitoring System" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" /> Network Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Monitoring Interface
              </label>
              <Input
                value={interfaceName}
                onChange={(e) => {
                  setInterfaceName(e.target.value);
                  setSaved(false);
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Environment</label>
              <div>
                <Badge variant="outline">Ubuntu Server Lab</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Security Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Enable application notification preferences.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => {
                  setNotifications(e.target.checked);
                  setSaved(false);
                }}
                className="h-4 w-4 accent-blue-600"
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" /> Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Theme configuration</p>
            <p className="text-xs text-muted-foreground">
              Use the theme toggle in the header to switch between dark and
              light mode.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" /> System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Application</p>
              <p className="text-sm font-medium">{systemName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Network Interface</p>
              <p className="text-sm font-medium">{interfaceName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Environment</p>
              <p className="text-sm font-medium">Ubuntu Server Lab</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        These settings are frontend preferences only. Network and engine
        configuration must be handled by a validated backend.
      </p>
    </PageContainer>
  );
}
