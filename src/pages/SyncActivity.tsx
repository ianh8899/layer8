import { DataTable } from "@/components/shadcn-shared/data-table";

import data from "../app/dashboard/data.json";
import { SiteHeader } from "@/components/shadcn-shared/site-header";

export function SyncActivity() {
  return (
    <div>
      <SiteHeader headerName={"Sync Activity"} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
