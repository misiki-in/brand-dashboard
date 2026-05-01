"use client";

import { creativeData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "./kpi-components";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { Palette, Eye, Lightbulb, AlertTriangle, Image, Video, LayoutGrid, Film } from "lucide-react";

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Image, Video, Carousel: LayoutGrid, Reel: Film,
};

export function CreativeBrandLayer() {
  const COLORS = ["oklch(0.65 0.18 65)", "oklch(0.6 0.15 340)", "oklch(0.55 0.12 200)", "oklch(0.7 0.1 140)", "oklch(0.6 0.2 30)", "oklch(0.5 0.15 260)"];

  const styleRadarData = creativeData.visualStyleAnalysis.map((s) => ({
    style: s.style.split(" ")[0],
    ctr: s.avgCTR,
    roas: s.avgROAS,
    usage: s.usage,
  }));

  const themeRadarData = creativeData.contentThemes.map((t) => ({
    theme: t.theme.split(" ")[0],
    engagement: t.avgEngagement,
    conversion: t.conversionAssist,
  }));

  const fatigueData = creativeData.audienceFatigue.map((a) => ({
    audience: a.audience.length > 25 ? a.audience.slice(0, 25) + "..." : a.audience,
    fatigue: a.fatigue,
    ctrTrend: a.ctrTrend,
  }));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="border-border/50 bg-gradient-to-br from-card via-card to-purple-500/5">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Palette className="h-7 w-7 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Creative & Brand Layer</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {creativeData.totalCreatives} creatives · {creativeData.activeTests} active tests · {creativeData.avgCTR}% avg CTR
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Creatives" value={creativeData.totalCreatives} unit="" change={18} icon="Image" />
        <KpiCard label="Active A/B Tests" value={creativeData.activeTests} unit="" change={4} icon="Lightbulb" />
        <KpiCard label="Avg CTR" value={creativeData.avgCTR} unit="%" change={0.6} icon="Eye" />
        <KpiCard label="Best CTR" value={6.4} unit="%" change={1.2} icon="TrendingUp" />
      </div>

      {/* Top Performing Creatives */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Top Performing Creatives</CardTitle>
          <p className="text-xs text-muted-foreground">Ranked by ROAS — what designs are driving the most revenue</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">#</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Creative</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Style</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">CTR</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Conv</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {creativeData.topPerformingCreatives
                  .sort((a, b) => b.roas - a.roas)
                  .map((c, i) => {
                    const TypeIcon = typeIcons[c.type] || Image;
                    return (
                      <tr key={c.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-2">
                          <span className="text-lg font-bold text-primary/30">{i + 1}</span>
                        </td>
                        <td className="py-2.5 px-2">
                          <p className="font-medium text-xs max-w-[180px] truncate">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground">{c.campaign}</p>
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1.5">
                            <TypeIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{c.type}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          <Badge variant="outline" className="text-[10px]">{c.style}</Badge>
                        </td>
                        <td className="py-2.5 px-2 text-right tabular-nums">{c.ctr}%</td>
                        <td className="py-2.5 px-2 text-right tabular-nums">{c.conversions}</td>
                        <td className="py-2.5 px-2 text-right">
                          <Badge variant={c.roas >= 7 ? "default" : c.roas >= 5 ? "secondary" : "outline"} className="text-[10px]">
                            {c.roas}x
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Visual Style Analysis */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Visual Style Performance</CardTitle>
            <p className="text-xs text-muted-foreground">Which visual styles drive the best CTR and ROAS</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {creativeData.visualStyleAnalysis
                .sort((a, b) => b.avgROAS - a.avgROAS)
                .map((style, i) => (
                <div key={style.style} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <span className="text-lg font-bold text-primary/30 w-5 text-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{style.style}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                      <span>{style.usage}% of creatives</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 space-y-0.5">
                    <p className="text-sm font-bold tabular-nums">{style.avgCTR}% CTR</p>
                    <p className="text-xs tabular-nums">{style.avgROAS}x ROAS</p>
                  </div>
                  <Badge
                    variant={style.recommendation === "Scale Up" ? "default" : style.recommendation === "Increase" ? "secondary" : "outline"}
                    className="text-[10px] shrink-0"
                  >
                    {style.recommendation}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Winning Design Patterns */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base font-semibold">Winning Design Patterns</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Data-backed creative patterns that outperform</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {creativeData.designPatterns.map((p, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <p className="text-sm font-medium">{p.pattern}</p>
                <div className="flex items-center gap-4 mt-1.5">
                  <span className="text-xs">
                    <span className="text-emerald-500 font-semibold">CTR {p.ctr}</span>
                    <span className="text-muted-foreground"> vs default</span>
                  </span>
                  <span className="text-xs">
                    <span className="text-blue-500 font-semibold">AOV {p.aov}</span>
                    <span className="text-muted-foreground"> lift</span>
                  </span>
                  <Badge variant="outline" className="text-[10px] ml-auto">
                    {p.frequency} use
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Audience Fatigue Detection */}
      <Card className="border-border/50 border-amber-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base font-semibold">Audience Fatigue Detection</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">Detect when audiences are seeing the same ads too often — rotate before CTR drops</p>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              fatigue: { label: "Fatigue Score", color: "oklch(0.7 0.15 75)" },
              ctrTrend: { label: "CTR Trend %", color: "oklch(0.55 0.15 150)" },
            }}
            className="h-[240px] w-full"
          >
            <BarChart data={fatigueData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="audience" tick={{ fontSize: 9 }} angle={-10} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="fatigue" radius={[4, 4, 0, 0]} barSize={36}>
                {fatigueData.map((d, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={d.fatigue > 75 ? "oklch(0.6 0.2 25)" : d.fatigue > 50 ? "oklch(0.7 0.15 75)" : "oklch(0.55 0.15 150)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
          <div className="mt-3 space-y-2">
            {creativeData.audienceFatigue.map((a) => (
              <div key={a.audience} className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/20">
                <span className="font-medium truncate max-w-[200px]">{a.audience}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">Freq: {a.frequency}x</span>
                  <span className={a.ctrTrend < 0 ? "text-red-500 font-medium" : "text-emerald-500 font-medium"}>
                    CTR {a.ctrTrend > 0 ? "+" : ""}{a.ctrTrend}%
                  </span>
                  <Badge variant="outline" className="text-[10px]">{a.recommendation}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
