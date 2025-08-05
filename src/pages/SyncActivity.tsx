import { DataTable } from "@/components/shadcn-shared/data-table";
import { useState, useEffect } from "react";
import { getIntegrations } from "@/lib/mock-api";
import { type I_Integration } from "@/lib/db";
import { SiteHeader } from "@/components/shadcn-shared/site-header";
import { SyncActivitySkeleton } from "@/components/sync-activity/sync-activity-skeleton";

export function SyncActivity() {
  const [integrations, setIntegrations] = useState<I_Integration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const data = await getIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error("Failed to fetch integrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  // Transform integration data to match the data table schema
  const tableData = integrations.map((integration) => ({
    id: integration.id,
    name: integration.name,
    lastSync: integration.lastSync,
    status: integration.status,
    recordsCount: integration.recordsCount,
    errorCount: integration.errorCount,
  }));

  return (
    <div>
      <SiteHeader headerName={"Sync Activity"} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {loading ? (
              <SyncActivitySkeleton />
            ) : (
              <DataTable data={tableData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
