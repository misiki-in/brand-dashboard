"use client";

import { useState } from "react";
import { loyaltyData } from "@/lib/mock-data";
import { exportToCSV } from "@/lib/real-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Download, RefreshCw } from "lucide-react";
import { useAction } from "@/lib/action-context";
import { ActionBar } from "./action-bar";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar,
} from "recharts";

const retentionConfig = {
  new: { label: "New Members", color: "oklch(0.65 0.18 65)" },
  active: { label: "Active", color: "oklch(0.55 0.12 200)" },
  churned: { label: "Churned", color: "oklch(0.6 0.2 25)" },
  reactivated: { label: "Reactivated", color: "oklch(0.7 0.1 140)" },
};

const tierColors: Record<string, string> = {
  Crystal: "oklch(0.7 0.05 260)",
  Gold: "oklch(0.75 0.15 85)",
  Diamond: "oklch(0.8 0.08 200)",
  Heritage: "oklch(0.65 0.18 65)",
};

export function LoyaltyRetention() {
  const { executeAction, automations } = useAction();
  const [tiersUpdating, setTiersUpdating] = useState(false);

  const handleUpdateTiers = () => {
    if (tiersUpdating) return;
    setTiersUpdating(true);
    executeAction({
      action: "Update Tiers",
      module: "loyalty",
      detail: "Running tier qualification update for all members",
      loadingMsg: "Updating tier qualifications...",
      simulateDelay: 1500,
      successMsg: "Tier qualification updated — 342 members promoted, 89 demoted",
    });
    setTimeout(() => setTiersUpdating(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Loyalty Members", value: (loyaltyData.loyaltyMembers / 1000).toFixed(0) + "K", change: loyaltyData.loyaltyGrowth },
          { label: "Repeat Purchase Rate", value: `${loyaltyData.repeatPurchaseRate}%` },
          { label: "Avg Orders/Customer", value: loyaltyData.avgOrdersPerCustomer.toString() },
          { label: "Referral Rate", value: `${loyaltyData.referralRate}%` },
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
        module="loyalty"
        primary={{
          label: "Create Reward",
          icon: Star,
          onClick: () => executeAction({
            action: "Create Reward",
            module: "loyalty",
            detail: "Creating new loyalty reward tier benefit",
            successMsg: "Reward tier configured",
          }),
        }}
        actions={[
          {
            label: "Export Members",
            icon: Download,
            onClick: () => {
              exportToCSV(loyaltyData.clvByTier.map(t => ({
                Tier: t.tier,
                Customers: t.customers,
                'Avg CLV': '$' + t.avgCLV,
                'Avg Orders': t.avgOrders,
                Retention: t.retention + '%',
              })), "loyalty-members.csv");
              executeAction({
                action: "Export Members",
                module: "loyalty",
                detail: "Exporting 68K loyalty member data",
                successMsg: "Loyalty members exported to CSV",
              });
            },
          },
          {
            label: "Update Tiers",
            icon: RefreshCw,
            onClick: handleUpdateTiers,
          },
        ]}
        relevantAutomations={automations.filter(a => a.module === "loyalty")}
      />

      {/* Retention Trend */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Member Lifecycle Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={retentionConfig} className="h-[200px] sm:h-[260px] lg:h-[300px] w-full">
            <AreaChart data={loyaltyData.retentionTrend}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="active" stroke="var(--color-active)" fill="var(--color-active)" fillOpacity={0.2} strokeWidth={2.5} />
              <Area type="monotone" dataKey="new" stroke="var(--color-new)" fill="var(--color-new)" fillOpacity={0.4} strokeWidth={2} />
              <Area type="monotone" dataKey="churned" stroke="var(--color-churned)" fill="var(--color-churned)" fillOpacity={0.3} strokeWidth={2} />
              <Area type="monotone" dataKey="reactivated" stroke="var(--color-reactivated)" fill="var(--color-reactivated)" fillOpacity={0.4} strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tier Performance */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Loyalty Tier Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loyaltyData.clvByTier.map((t) => (
              <Card key={t.tier} className="border-border/30 bg-muted/20 hover:bg-muted/40 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tierColors[t.tier] }} />
                    <h3 className="font-semibold text-sm">{t.tier}</h3>
                    <Badge variant="outline" className="text-[10px] ml-auto">{t.customers.toLocaleString()}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Avg CLV</span>
                      <span className="text-sm font-bold tabular-nums">${t.avgCLV.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Avg Orders</span>
                      <span className="text-sm font-medium tabular-nums">{t.avgOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Retention</span>
                      <span className="text-sm font-medium tabular-nums">{t.retention}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${t.retention}%`,
                          backgroundColor: tierColors[t.tier],
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
