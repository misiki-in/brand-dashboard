"use client";

import { influencerData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressMetric } from "./kpi-components";

export function InfluencerPartnerships() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Partnerships", value: influencerData.activePartnerships },
          { label: "Total Reach", value: (influencerData.totalReach / 1000000).toFixed(1) + "M" },
          { label: "Avg Engagement", value: `${influencerData.avgEngagement}%` },
          { label: "Influencer ROI", value: `${influencerData.roi}x` },
        ].map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl lg:text-3xl font-bold tabular-nums">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Partnerships */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Active Partnerships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Partner</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Platform</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Followers</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Reach</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Eng</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Revenue</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {influencerData.partnerships.map((p) => (
                  <tr key={p.name} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-2 font-medium">{p.name}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">{p.platform}</td>
                    <td className="py-2.5 px-2 text-center">
                      <Badge variant={p.type === "Mega" || p.type === "Macro" ? "default" : "outline"} className="text-[10px]">
                        {p.type}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2 text-center tabular-nums">{p.followers}</td>
                    <td className="py-2.5 px-2 text-center tabular-nums">{(p.reach / 1000000).toFixed(1)}M</td>
                    <td className="py-2.5 px-2 text-center tabular-nums">{p.engagement}%</td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-medium">${(p.revenue / 1000).toFixed(0)}K</td>
                    <td className="py-2.5 px-2 text-center">
                      <Badge variant={p.status === "Active" ? "default" : "secondary"} className="text-[10px]">
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Collaborations */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Upcoming Collaborations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {influencerData.upcomingCollaborations.map((c) => (
            <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span>{c.partners} partners</span>
                  <span>Budget: ${(c.budget / 1000).toFixed(0)}K</span>
                </div>
              </div>
              <Badge
                variant={c.status === "Confirmed" ? "default" : c.status === "Planning" ? "secondary" : "outline"}
                className="text-[10px]"
              >
                {c.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Influencer Strategy Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-1">TikTok Outperforming Instagram</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              TikTok creator partnerships are generating 9.8% engagement vs 7.2% on Instagram. Consider reallocating 15% of Instagram budget to TikTok for Q2 campaigns, especially for product launch reveal content.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-1">Micro-Influencers Drive Highest ROI</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Micro-influencer tier (100K-500K) delivers the best engagement-to-cost ratio at 8.4% engagement with $18K-$22K per partnership. Expand the micro-influencer program with a structured application pipeline.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
