"use client";

import { adsData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter, ZAxis, Cell,
} from "recharts";

const channelConfig = {
  spend: { label: "Spend", color: "oklch(0.55 0.12 200)" },
  revenue: { label: "Revenue", color: "oklch(0.65 0.18 65)" },
};

export function PaidMedia() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Ad Spend", value: `$${(adsData.totalSpend / 1000).toFixed(0)}K` },
          { label: "Total Ad Revenue", value: `$${(adsData.totalRevenue / 1000).toFixed(0)}K` },
          { label: "ROAS", value: `${adsData.roas}x` },
          { label: "Avg CAC", value: `$${adsData.avgCAC}` },
        ].map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl lg:text-3xl font-bold tabular-nums">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Channel Performance */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Spend vs Revenue by Channel</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={channelConfig} className="h-[300px] w-full">
            <BarChart data={adsData.channels}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="channel" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
              <Bar dataKey="spend" fill="oklch(0.55 0.12 200)" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="revenue" fill="oklch(0.65 0.18 65)" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Channel Details Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Channel Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Channel</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">ROAS</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">CAC</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Conv</th>
                  </tr>
                </thead>
                <tbody>
                  {adsData.channels.map((c) => (
                    <tr key={c.channel} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="py-2 px-2 font-medium">{c.channel}</td>
                      <td className="py-2 px-2 text-right">
                        <Badge variant={c.roas >= 4 ? "default" : c.roas >= 3 ? "secondary" : "outline"} className="text-[10px]">
                          {c.roas}x
                        </Badge>
                      </td>
                      <td className="py-2 px-2 text-right tabular-nums">${c.cac}</td>
                      <td className="py-2 px-2 text-right tabular-nums">{c.conversions.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Campaigns by ROAS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {adsData.campaignPerformance
              .sort((a, b) => b.roas - a.roas)
              .map((c, i) => (
                <div key={c.campaign} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <span className="text-lg font-bold text-primary/30 w-5 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.campaign}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Spend: ${(c.spend / 1000).toFixed(0)}K · {c.conversions} conversions
                    </p>
                  </div>
                  <Badge variant={c.roas >= 5 ? "default" : "secondary"} className="text-xs shrink-0">
                    {c.roas}x ROAS
                  </Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
