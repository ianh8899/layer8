import { IconRefresh, IconCheck, IconClock, IconX } from "@tabler/icons-react";
import { type I_Integration, type T_IntegrationStatus, STATUS } from "@/lib/db";
import { manualSync, updateStatus } from "@/lib/mock-api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
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

interface IntegrationCardsProps {
  integrations: I_Integration[];
  onDataChange: () => void;
  actionMessage: string;
  setActionMessage: (message: string) => void;
  syncing: string | null;
  setSyncing: (id: string | null) => void;
  updatingStatus: string | null;
  setUpdatingStatus: (id: string | null) => void;
}

export function IntegrationCards({
  integrations,
  onDataChange,
  actionMessage,
  setActionMessage,
  syncing,
  setSyncing,
  updatingStatus,
  setUpdatingStatus,
}: IntegrationCardsProps) {
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
      setActionMessage(result + " successfully");
      onDataChange();
    } catch (error) {
      setActionMessage("Status update failed: " + error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
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
                <span>{integration.recordsCount.toLocaleString()} records</span>
                {integration.errorCount > 0 && (
                  <span className="text-red-600">
                    {integration.errorCount} errors
                  </span>
                )}
              </div>
            </CardHeader>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Last sync: {new Date(integration.lastSync).toLocaleDateString()}
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
  );
}
