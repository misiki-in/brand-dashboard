"use client";

import { emailData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAction } from "@/lib/action-context";
import { ActionBar } from "./action-bar";
import { Plus, Download, Send } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const campaignConfig = {
  opens: { label: "Open Rate %", color: "oklch(0.65 0.18 65)" },
  conversions: { label: "Conversion Rate %", color: "oklch(0.55 0.12 200)" },
};

export function EmailSms() {
  const { executeAction } = useAction();

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "List Size", value: (emailData.listSize / 1000).toFixed(0) + "K", change: emailData.listGrowth },
          { label: "Avg Open Rate", value: `${emailData.avgOpenRate}%` },
          { label: "Avg Click Rate", value: `${emailData.avgClickRate}%` },
          { label: "Revenue Per Email", value: `$${emailData.revenuePerEmail}` },
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
        module="email"
        primary={{
          label: "Create Campaign",
          icon: Plus,
          onClick: () => executeAction({
            action: "Create Campaign",
            module: "email",
            detail: "Opening email campaign builder with AI-powered subject line suggestions",
            successMsg: "Campaign draft created",
            simulateDelay: 1000,
          }),
        }}
        actions={[
          {
            label: "Send Broadcast",
            icon: Send,
            onClick: () => executeAction({
              action: "Send Broadcast",
              module: "email",
              detail: "Sending SMS broadcast to 245K subscribers",
              successMsg: "Broadcast sent to 245K contacts",
              simulateDelay: 2000,
            }),
          },
          {
            label: "Export Report",
            icon: Download,
            onClick: () => executeAction({
              action: "Export Email Report",
              module: "email",
              detail: "Generating email & SMS performance report",
              successMsg: "Report exported",
              simulateDelay: 1000,
            }),
          },
        ]}
      />

      {/* Recent Campaigns */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Recent Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={campaignConfig} className="h-[180px] sm:h-[220px] lg:h-[260px] w-full">
            <BarChart data={emailData.campaigns}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="opens" fill="oklch(0.65 0.18 65)" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="conversions" fill="oklch(0.55 0.12 200)" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Campaigns Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Campaign Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emailData.campaigns.map((c) => (
                <div key={c.name} className="p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
                        <span className="text-[10px] text-muted-foreground">Sent: {(c.sent / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">${(c.revenue / 1000).toFixed(1)}K</p>
                      <p className="text-[10px] text-muted-foreground">revenue</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{c.opens}% open</span>
                    <span>{c.clicks}% click</span>
                    <span>{c.conversions}% conv</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automation Flows */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Automation Flows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emailData.automationFlows.map((f) => (
                <div key={f.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                  <Switch
                    checked={f.active}
                    onCheckedChange={() => executeAction({
                      action: `${f.active ? "Disable" : "Enable"} ${f.name}`,
                      module: "email",
                      detail: `${f.active ? "Disabling" : "Enabling"} automation flow: ${f.name}`,
                      successMsg: `${f.name} ${f.active ? "disabled" : "enabled"}`,
                      simulateDelay: 500,
                    })}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{f.name}</p>
                    <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span>{(f.subscribers / 1000).toFixed(1)}K subscribers</span>
                      <span>{f.conversion}% conv</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold tabular-nums">${(f.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
