"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Heart, ThumbsUp, DollarSign, TrendingUp, Users, Gem,
  Mail, RotateCcw, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, ThumbsUp, DollarSign, TrendingUp, Users, Gem, Mail, RotateCcw,
};

interface KpiCardProps {
  label: string;
  value: number;
  unit?: string;
  change?: number;
  icon?: string;
  className?: string;
  format?: "number" | "currency" | "percent";
}

function formatValue(value: number, unit?: string, format?: string): string {
  if (format === "currency" || unit === "$") {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  }
  if (format === "percent" || unit === "%") return `${value}%`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return `${value}${unit || ""}`;
}

export function KpiCard({ label, value, unit, change, icon, className }: KpiCardProps) {
  const Icon = icon ? iconMap[icon] : null;
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const isInvertedMetric = label.includes("Return Rate") || label.includes("Churn");

  return (
    <Card className={cn("relative overflow-hidden group hover:shadow-md transition-all duration-300 border-border/50", className)}>
      <CardContent className="p-4 lg:p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
            <p className="text-2xl lg:text-3xl font-bold tracking-tight tabular-nums">
              {formatValue(value, unit)}
            </p>
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {(isPositive && !isInvertedMetric) || (isNegative && isInvertedMetric) ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
                )}
                <span className={cn(
                  "text-xs font-medium",
                  (isPositive && !isInvertedMetric) || (isNegative && isInvertedMetric)
                    ? "text-emerald-500"
                    : "text-red-500"
                )}>
                  {Math.abs(change)}%
                </span>
                <span className="text-xs text-muted-foreground">vs prev</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-4.5 w-4.5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface GaugeProps {
  value: number;
  max?: number;
  size?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function Gauge({ value, max = 100, size = 120, label, showValue = true, className }: GaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = Math.PI * radius;
  const progress = (value / max) * circumference;
  const getColor = (v: number) => {
    if (v >= 80) return "text-emerald-500";
    if (v >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size / 2 + 16 }}>
        <svg width={size} height={size / 2 + 16} className="overflow-visible">
          <path
            d={`M 8 ${size / 2 + 8} A ${radius} ${radius} 0 0 1 ${size - 8} ${size / 2 + 8}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            className="text-muted/50"
          />
          <path
            d={`M 8 ${size / 2 + 8} A ${radius} ${radius} 0 0 1 ${size - 8} ${size / 2 + 8}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className={getColor(value)}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        {showValue && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <span className={cn("text-2xl font-bold tabular-nums", getColor(value))}>{value}</span>
          </div>
        )}
      </div>
      {label && <p className="text-xs text-muted-foreground text-center">{label}</p>}
    </div>
  );
}

interface ProgressMetricProps {
  label: string;
  value: number;
  max?: number;
  unit?: string;
  change?: number;
  className?: string;
}

export function ProgressMetric({ label, value, max = 100, unit = "%", change, className }: ProgressMetricProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground truncate">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          {change !== undefined && (
            <span className={cn("text-xs font-medium", change >= 0 ? "text-emerald-500" : "text-red-500")}>
              {change >= 0 ? "+" : ""}{change}
            </span>
          )}
          <span className="text-sm font-semibold tabular-nums">{value}{unit}</span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
