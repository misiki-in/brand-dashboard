"use client";

import { revenueData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { Play, Download, BarChart3 } from "lucide-react";
import { useAction } from "@/lib/action-context";
import { ActionBar } from "./action-bar";

const revenueConfig = {
  revenue: { label: "Revenue", color: "oklch(0.65 0.18 65)" },
  orders: { label: "Orders", color: "oklch(0.55 0.12 200)" },
};

const COLORS = ["oklch(0.65 0.18 65)", "oklch(0.55 0.12 200)", "oklch(0.6 0.15 340)", "oklch(0.7 0.1 140)", "oklch(0.6 0.2 30)", "#888"];

export function RevenueConversions() {
  const { executeAction, automations } = useAction();
  const channelPieData = revenueData.revenueByChannel.map((c, i) => ({
    name: c.channel,
    value: c.share,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `$${(revenueData.totalRevenue / 1000000).toFixed(1)}M`, change: revenueData.revenueGrowth },
          { label: "Total Orders", value: revenueData.totalOrders.toLocaleString() },
          { label: "Conversion Rate", value: `${revenueData.conversionRate}%` },
          { label: "Avg Order Value", value: `$${revenueData.avgOrderValue}` },
        ].map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl lg:text-3xl font-bold tabular-nums">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              {m.change && <p className="text-xs font-medium text-emerald-500 mt-1">+{m.change}% growth</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <ActionBar
        module="revenue"
        primary={{
          label: "Create Funnel",
          icon: Play,
          onClick: () => executeAction({
            action: "Create Funnel",
            module: "revenue",
            detail: "Creating new conversion funnel analysis",
            successMsg: "Conversion funnel created",
            simulateDelay: 800,
          }),
        }}
        actions={[
          {
            label: "Export Report",
            icon: Download,
            onClick: () => executeAction({
              action: "Export Report",
              module: "revenue",
              detail: "Generating revenue & conversion report",
              successMsg: "Revenue & conversion report exported",
              simulateDelay: 800,
            }),
          },
          {
            label: "Run Analysis",
            icon: BarChart3,
            onClick: () => executeAction({
              action: "Run Analysis",
              module: "revenue",
              detail: "Running deep-dive revenue analysis by channel",
              successMsg: "Revenue analysis complete",
              simulateDelay: 800,
            }),
          },
        ]}
        relevantAutomations={automations.filter(a => a.module === "revenue")}
      />

      {/* Revenue Trend */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueConfig} className="h-[200px] sm:h-[260px] lg:h-[300px] w-full">
            <AreaChart data={revenueData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fill="var(--color-revenue)" fillOpacity={0.15} strokeWidth={2.5} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Revenue by Channel */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Revenue by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="mx-auto aspect-square max-h-[180px] sm:max-h-[220px] lg:max-h-[240px]">
              <PieChart>
                <Pie data={channelPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {channelPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {revenueData.revenueByChannel.map((c, i) => (
                <div key={c.channel} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-muted-foreground truncate">{c.channel}</span>
                  <span className="text-xs font-semibold ml-auto">${(c.revenue / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Conversion Funnel</CardTitle>
            <p className="text-xs text-muted-foreground">Cart abandonment rate: {revenueData.cartAbandonmentRate}%</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueData.funnelData.map((f, i) => {
                const widthPct = (f.count / revenueData.funnelData[0].count) * 100;
                const dropOff = i > 0 ? ((1 - f.count / revenueData.funnelData[i - 1].count) * 100).toFixed(1) : null;
                return (
                  <div key={f.stage}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{f.stage}</span>
                      <div className="flex items-center gap-2">
                        {dropOff && (
                          <span className="text-red-400">-{dropOff}%</span>
                        )}
                        <span className="font-semibold tabular-nums">{f.count.toLocaleString()}</span>
                        <span className="text-muted-foreground">({f.rate}%)</span>
                      </div>
                    </div>
                    <div className="h-8 rounded-lg bg-muted/50 overflow-hidden">
                      <div
                        className="h-full rounded-lg bg-gradient-to-r from-primary/80 to-primary transition-all duration-700 flex items-center pl-3"
                        style={{ width: `${widthPct}%` }}
                      >
                        {widthPct > 15 && <span className="text-[10px] font-medium text-white">{f.rate}%</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
