import {
  IconTrendingDown,
  IconTrendingUp,
  IconRefresh,
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { type I_Integration, type T_IntegrationStatus, STATUS } from "@/lib/db";
import { manualSync, updateStatus } from "@/lib/mock-api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SectionCardsProps {
  integrations: I_Integration[];
  loading: boolean;
  onDataChange: () => void;
}

export function SectionCards({
  integrations,
  loading,
  onDataChange,
}: SectionCardsProps) {
  const [syncing, setSyncing] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string>("");

  // Function to get Error badge
  const getStatusBadge = (status: T_IntegrationStatus) => {
    if (status === STATUS.ERROR) {
      return (
        <Badge variant="destructive">
          <IconX className="size-3 mr-1" />
          Error
        </Badge>
      );
    }
    return null;
  };

  // Check if status can be changed
  const isUserControllable = (status: T_IntegrationStatus) => {
    return status === STATUS.ACTIVE || status === STATUS.INACTIVE;
  };

  // Calculate metrics from integrations
  const totalIntegrations = integrations.length;
  const activeIntegrations = integrations.filter(
    (i) => i.status === STATUS.ACTIVE
  ).length;
  const totalRecords = integrations.reduce((sum, i) => sum + i.recordsCount, 0);
  const totalErrors = integrations.reduce((sum, i) => sum + i.errorCount, 0);
  const errorIntegrations = integrations.filter(
    (i) => i.status === STATUS.ERROR
  ).length;

  const handleManualSync = async (integrationId: string) => {
    setSyncing(integrationId);
    setActionMessage("");
    try {
      const result = await manualSync(integrationId);
      setActionMessage(result);
      onDataChange();
    } catch (error) {
      setActionMessage("Sync failed: " + error);
    } finally {
      setSyncing(null);
    }
  };

  const handleStatusChange = async (
    integrationId: string,
    newStatus: T_IntegrationStatus
  ) => {
    setUpdatingStatus(integrationId);
    setActionMessage("");
    try {
      const result = await updateStatus(integrationId, newStatus);
      setActionMessage(result);
      onDataChange();
    } catch (error) {
      setActionMessage("Status update failed: " + error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Integrations</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalIntegrations}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                Active
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {activeIntegrations} active integrations
            </div>
            <div className="text-muted-foreground">
              {totalIntegrations - activeIntegrations} need attention
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Records Synced</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalRecords.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <IconTrendingUp />
                Synced
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Data synchronized across platforms
            </div>
            <div className="text-muted-foreground">Last 30 days</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Sync Errors</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalErrors}
            </CardTitle>
            <CardAction>
              <Badge variant={totalErrors > 0 ? "destructive" : "outline"}>
                {totalErrors > 0 ? <IconTrendingDown /> : <IconCheck />}
                {totalErrors > 0 ? "Errors" : "Clean"}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {errorIntegrations} integrations with errors
            </div>
            <div className="text-muted-foreground">Requires investigation</div>
          </CardFooter>
        </Card>

        <Card className="@container/card">
          <CardHeader>
            <CardDescription>System Health</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {Math.round((activeIntegrations / totalIntegrations) * 100)}%
            </CardTitle>
            <CardAction>
              <Badge
                variant={
                  activeIntegrations === totalIntegrations
                    ? "default"
                    : "secondary"
                }
              >
                {activeIntegrations === totalIntegrations ? (
                  <IconCheck />
                ) : (
                  <IconAlertTriangle />
                )}
                {activeIntegrations === totalIntegrations
                  ? "Healthy"
                  : "Issues"}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Overall system performance
            </div>
            <div className="text-muted-foreground">Integration uptime</div>
          </CardFooter>
        </Card>
      </div>

      {/* Individual Integration Cards */}
      <div className="px-4 lg:px-6">
        <h3 className="text-lg font-semibold mb-4">Current Integrations</h3>
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          {integrations.map((integration) => (
            <Card key={integration.id} className="@container/card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription>{integration.system}</CardDescription>
                  <div className="flex items-center gap-2">
                    {integration.status === STATUS.ERROR &&
                      getStatusBadge(integration.status)}
                    {isUserControllable(integration.status) && (
                      <Select
                        value={integration.status}
                        onValueChange={(value: T_IntegrationStatus) =>
                          handleStatusChange(integration.id, value)
                        }
                        disabled={updatingStatus === integration.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={STATUS.ACTIVE}>
                            <div className="flex items-center gap-2">
                              <IconCheck className="size-4 text-green-600" />
                              Active
                            </div>
                          </SelectItem>
                          <SelectItem value={STATUS.INACTIVE}>
                            <div className="flex items-center gap-2">
                              <IconClock className="size-4 text-gray-600" />
                              Inactive
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold">
                  {integration.name}
                </CardTitle>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>
                    {integration.recordsCount.toLocaleString()} records
                  </span>
                  {integration.errorCount > 0 && (
                    <span className="text-red-600">
                      {integration.errorCount} errors
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardFooter className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Last sync:{" "}
                  {new Date(integration.lastSync).toLocaleDateString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleManualSync(integration.id)}
                  disabled={
                    syncing === integration.id ||
                    updatingStatus === integration.id ||
                    integration.status === STATUS.INACTIVE
                  }
                >
                  {syncing === integration.id ? (
                    <IconRefresh className="size-4 animate-spin" />
                  ) : (
                    <IconRefresh className="size-4" />
                  )}
                  Sync
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {actionMessage && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              actionMessage.includes("successfully")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {actionMessage}
          </div>
        )}
      </div>
    </div>
  );
}
