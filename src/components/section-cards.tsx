import { useState } from "react";
import { type I_Integration, STATUS } from "@/lib/db";

import { Card, CardHeader } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard-stats";
import { IntegrationCards } from "@/components/integration-cards";

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
  const [integrationSyncing, setIntegrationSyncing] = useState<string | null>(
    null
  );
  const [integrationUpdatingStatus, setIntegrationUpdatingStatus] = useState<
    string | null
  >(null);
  const [integrationActionMessage, setIntegrationActionMessage] =
    useState<string>("");

  // Calculate metrics for dashboard stats
  const totalIntegrations = integrations.length;
  const activeIntegrations = integrations.filter(
    (i) => i.status === STATUS.ACTIVE
  ).length;
  const totalRecords = integrations.reduce(
    (total, integration) => total + integration.recordsCount,
    0
  );
  const totalErrors = integrations.reduce(
    (total, integration) => total + integration.errorCount,
    0
  );
  const errorIntegrations = integrations.filter(
    (i) => i.status === STATUS.ERROR
  ).length;

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
    <div className="space-y-6">
      <DashboardStats
        totalIntegrations={totalIntegrations}
        activeIntegrations={activeIntegrations}
        totalRecords={totalRecords}
        totalErrors={totalErrors}
        errorIntegrations={errorIntegrations}
      />

      <IntegrationCards
        integrations={integrations}
        onDataChange={onDataChange}
        syncing={integrationSyncing}
        setSyncing={setIntegrationSyncing}
        updatingStatus={integrationUpdatingStatus}
        setUpdatingStatus={setIntegrationUpdatingStatus}
        actionMessage={integrationActionMessage}
        setActionMessage={setIntegrationActionMessage}
      />
    </div>
  );
}
