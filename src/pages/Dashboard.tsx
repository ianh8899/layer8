import { useState, useEffect } from "react";
import { getIntegrations } from "@/lib/mock-api";
import { type I_Integration } from "@/lib/db";
import { SectionCards } from "@/components/dashboard/dashboard-cards";
import { SiteHeader } from "@/components/shadcn-shared/site-header";

export function Dashboard() {
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

  return (
    <div>
      <SiteHeader headerName={"Dashboard"} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards
              integrations={integrations}
              loading={loading}
              onDataChange={fetchIntegrations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
