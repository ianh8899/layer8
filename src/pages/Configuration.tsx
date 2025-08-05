import { SiteHeader } from "@/components/site-header";
import { ConfigurationForm } from "@/components/configuration-form";
import type { I_Integration } from "@/lib/db";

const example: I_Integration = {
  id: "int-001",
  name: "Salesforce CRM",
  type: "crm",
  system: "Salesforce",
  status: "active",
  lastSync: "2024-01-15T10:30:00Z",
  syncFrequency: "hourly",
  syncDirection: "bidirectional",
  recordsCount: 1250,
  errorCount: 0,
  configuration: {
    endpoint: "https://company.salesforce.com",
    authType: "oauth",
    dataMapping: {
      customers: "Account",
      tenancies: "Opportunity",
    },
  },
};

export function Configuration() {
  return (
    <div>
      <SiteHeader headerName={"Integration Configuration"} />
      <ConfigurationForm integration={example} submitType="updateIntegration" />
    </div>
  );
}
