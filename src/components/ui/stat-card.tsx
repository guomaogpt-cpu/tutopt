import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type StatCardProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: React.ReactNode;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
};

const trendClasses: Record<NonNullable<StatCardProps["trend"]>["direction"], string> = {
  up: "text-green-600",
  down: "text-destructive",
  neutral: "text-muted-foreground",
};

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, description, icon: Icon, trend, ...props }, ref) => (
    <Card ref={ref} className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {Icon ? (
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="size-4" aria-hidden="true" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {description || trend ? (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {trend ? (
              <span className={cn("font-medium", trendClasses[trend.direction])}>{trend.value}</span>
            ) : null}
            {description ? <span className="text-muted-foreground">{description}</span> : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  ),
);
StatCard.displayName = "StatCard";

export { StatCard };
