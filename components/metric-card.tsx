import React from "react";
import Card from "./ui/card";
import { cn } from "./ui/utils";
import { Activity } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  subtitle?: string;
  accentClass?: string; // e.g. "bg-primary", "bg-accent"
  icon?: React.ReactNode;
};

export default function MetricCard({ title, value, subtitle, accentClass, icon }: Props) {
  return (
    <Card className="metric-compact">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xxs text-muted-foreground">{title}</div>
          <div className="font-xxl mt-1">{value}</div>
          {subtitle && <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>}
        </div>
        <div className={cn("icon-box", accentClass ?? "bg-primary")}>
          {icon ?? <Activity size={18} color="white" />}
        </div>
      </div>
    </Card>
  );
}
