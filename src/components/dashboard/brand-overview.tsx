"use client";

import { brandHealth, kpiSummary, inventoryData, aiEngineData } from "@/lib/mock-data";
import { KpiCard, Gauge } from "./kpi-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Package, DollarSign } from "lucide-react";

const radarConfig = {
  score: { label: "Brand Score", color: "oklch(0.65 0.18 65)" },
};

export function BrandOverview() {
  const radarData = [
    { metric: "Awareness", score: brandHealth.components.awareness },
    { metric: "Consideration", score: brandHealth.components.consideration },
    { metric: "Preference", score: brandHealth.components.preference },
    { metric: "Loyalty", score: brandHealth.components.loyalty },
    { metric: "Advocacy", score: brandHealth.components.advocacy },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Brand Health Score */}
      <Card className="border-border/50 bg-gradient-to-br from-card via-card to-primary/5">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <Gauge value={brandHealth.score} size={180} label="Brand Health Score" />
            <div className="flex-1 space-y-4 w-full">
              <div>
                <h2 className="text-xl font-bold">Lumière Jewels — Brand Pulse</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Overall brand health has improved by <span className="text-emerald-500 font-semibold">+{brandHealth.trend} points</span> compared to the previous quarter, driven by strong awareness gains and loyalty improvements.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(brandHealth.components).map(([key, value]) => (
                  <div key={key} className="text-center p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold tabular-nums">{value}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{key}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Grid — CEO View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        {kpiSummary.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
        <KpiCard label="CLV:CAC Ratio" value={81} unit=":1" change={12} icon="TrendingUp" />
        <KpiCard label="Contribution Margin" value={62} unit="%" change={2} icon="DollarSign" />
        <KpiCard label="Inventory Value" value={4200000} unit="$" change={5} icon="Package" />
        <KpiCard label="Dead Stock Value" value={420000} unit="$" change={-18} icon="AlertTriangle" />
        <KpiCard label="Brand Momentum" value={aiEngineData.momentumScore} unit="/100" change={aiEngineData.momentumTrend} icon="TrendingUp" />
      </div>

      {/* CEO Alerts Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-red-600">Dead Stock Alert</p>
            <p className="text-[10px] text-muted-foreground">$420K capital trapped in {inventoryData.deadStockSKUs} slow-moving SKUs</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
          <Package className="h-4 w-4 text-amber-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-amber-600">Reorder Urgent</p>
            <p className="text-[10px] text-muted-foreground">4 bestsellers below reorder point — est. $96K revenue at risk</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
          <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-emerald-600">Momentum Strong</p>
            <p className="text-[10px] text-muted-foreground">AI momentum score {aiEngineData.momentumScore}/100 — +{aiEngineData.momentumTrend} pts this week</p>
          </div>
        </div>
      </div>

      {/* Brand Equity Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Brand Equity Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={radarConfig} className="mx-auto aspect-square max-h-[320px]">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid strokeDasharray="3 3" className="opacity-30" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="oklch(0.65 0.18 65)" fill="oklch(0.65 0.18 65)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Strongest Pillar: Awareness", desc: "Brand awareness reached 82%, significantly outpacing the luxury jewelry category average of 61%. Our social-first strategy and influencer partnerships are driving top-of-mind recall among 25-40 demographic.", tag: "Strength" },
                { title: "Growth Opportunity: Advocacy", desc: "While loyalty is solid at 71%, advocacy (NPS-driven referral intent) lags at 65%. Deploying a structured referral program and post-purchase UGC campaigns could close this gap by Q3.", tag: "Opportunity" },
                { title: "Consideration Gap", desc: "Consideration score of 68% indicates that while people know the brand, converting awareness to active purchase consideration requires stronger mid-funnel content and retargeting strategies.", tag: "Action Item" },
                { title: "Loyalty Momentum", desc: "Loyalty increased 4 points this quarter, driven by the new Heritage tier launch and exclusive VIP experiences. Tier upgrades are up 32% month-over-month.", tag: "Positive" },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                    item.tag === "Strength" || item.tag === "Positive" ? "bg-emerald-500/10 text-emerald-600" :
                    item.tag === "Opportunity" ? "bg-amber-500/10 text-amber-600" :
                    "bg-primary/10 text-primary"
                  }`}>
                    {item.tag}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
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
