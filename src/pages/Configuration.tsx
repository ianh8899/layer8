import { SiteHeader } from "@/components/site-header";
import { ConfigurationForm } from "@/components/configuration-form";

export function Configuration() {
  return (
    <div>
      <SiteHeader headerName={"Integration Configuration"} />
      <ConfigurationForm />
    </div>
  );
}
