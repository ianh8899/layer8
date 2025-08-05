import {
  IconTrendingDown,
  IconTrendingUp,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardStatsProps {
  totalIntegrations: number;
  activeIntegrations: number;
  totalRecords: number;
  totalErrors: number;
  errorIntegrations: number;
}

export function DashboardStats({
  totalIntegrations,
  activeIntegrations,
  totalRecords,
  totalErrors,
  errorIntegrations,
}: DashboardStatsProps) {
  return (
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
              {activeIntegrations === totalIntegrations ? "Healthy" : "Issues"}
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
  );
}
