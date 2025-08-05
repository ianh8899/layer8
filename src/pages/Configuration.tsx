import { SiteHeader } from "@/components/shadcn-shared/site-header";
import { ConfigurationForm } from "@/components/configuration/configuration-form";
import type { I_Integration } from "@/lib/db";
import { useLocation } from "react-router-dom";

export function Configuration() {
  const location = useLocation();
  const integration = location.state?.integration as I_Integration | undefined;

  return (
    <div>
      <SiteHeader
        headerName={
          integration ? "Update Integration" : "Integration Configuration"
        }
      />
      <ConfigurationForm
        integration={integration}
        submitType={integration ? "updateIntegration" : "addIntegration"}
      />
    </div>
  );
}
