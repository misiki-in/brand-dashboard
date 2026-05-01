"use client";

import { seoData, seoContentDecayData, keywordGapData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAction } from "@/lib/action-context";
import { ActionBar } from "./action-bar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie,
} from "recharts";
import { TrendingDown, Sparkles, Search, Target, RefreshCw, Download } from "lucide-react";

const trafficConfig = seoData.trafficSources.reduce((acc, s, i) => {
  acc[s.source] = { label: s.source, color: s.color };
  return acc;
}, {} as Record<string, { label: string; color: string }>);

function getDifficultyColor(d: string) {
  switch (d) {
    case "Low": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
    case "Medium": return "bg-amber-500/10 text-amber-600 border-amber-500/30";
    case "Hard": return "bg-red-500/10 text-red-500 border-red-500/30";
    default: return "";
  }
}

export function SeoDigital() {
  const { executeAction, automations } = useAction();
  const relevantAutomations = automations.filter(a => a.module === "seo");
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Organic Traffic", value: (seoData.organicTraffic / 1000).toFixed(0) + "K", change: seoData.organicTrafficChange },
          { label: "Domain Authority", value: seoData.domainAuthority },
          { label: "Page One Rankings", value: seoData.pageOneRankings, sub: `of ${seoData.keywordRankings} tracked keywords` },
          { label: "Backlinks", value: (seoData.backlinks / 1000).toFixed(1) + "K" },
        ].map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl lg:text-3xl font-bold tabular-nums">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              {m.sub && <p className="text-[10px] text-muted-foreground">{m.sub}</p>}
              {m.change && (
                <p className="text-xs font-medium text-emerald-500 mt-1">+{m.change}% MoM</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <ActionBar
        module="seo"
        primary={{
          label: "Run SEO Audit",
          icon: Search,
          onClick: () => executeAction({
            action: "Run SEO Audit",
            module: "seo",
            detail: "Running full SEO audit across 156 content pages",
            successMsg: "SEO audit initiated",
          }),
        }}
        actions={[
          {
            label: "Fix All Decay",
            icon: RefreshCw,
            onClick: () => executeAction({
              action: "Fix All Decay",
              module: "seo",
              detail: "Creating fix tasks for 6 decaying content pages",
              successMsg: "Fix tasks created for all decaying pages",
            }),
          },
          {
            label: "Export Keywords",
            icon: Download,
            onClick: () => executeAction({
              action: "Export Keywords",
              module: "seo",
              detail: "Exporting keyword positions and gap opportunities",
              successMsg: "Keywords exported",
            }),
          },
        ]}
        relevantAutomations={relevantAutomations}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Traffic Sources Pie */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Traffic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trafficConfig} className="mx-auto aspect-square max-h-[200px] sm:max-h-[240px] lg:max-h-[260px]">
              <PieChart>
                <Pie data={seoData.trafficSources} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {seoData.trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {seoData.trafficSources.map((s) => (
                <div key={s.source} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-muted-foreground truncate">{s.source}</span>
                  <span className="text-xs font-semibold ml-auto">{s.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Core Web Vitals */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Core Web Vitals</CardTitle>
            <p className="text-xs text-muted-foreground">Performance metrics impacting SEO ranking</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: "Largest Contentful Paint (LCP)", value: seoData.coreWebVitals.lcp, unit: "s", target: "< 2.5s", status: seoData.coreWebVitals.lcp <= 2.5 ? "Good" : "Needs Improvement" },
                { metric: "First Input Delay (FID)", value: seoData.coreWebVitals.fid, unit: "ms", target: "< 100ms", status: seoData.coreWebVitals.fid <= 100 ? "Good" : "Needs Improvement" },
                { metric: "Cumulative Layout Shift (CLS)", value: seoData.coreWebVitals.cls, unit: "", target: "< 0.1", status: seoData.coreWebVitals.cls <= 0.1 ? "Good" : "Needs Improvement" },
              ].map((v) => (
                <div key={v.metric} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">{v.metric}</p>
                    <p className="text-[10px] text-muted-foreground">Target: {v.target}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold tabular-nums">{v.value}{v.unit}</p>
                    <Badge variant={v.status === "Good" ? "default" : "secondary"} className="text-[10px]">
                      {v.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs text-emerald-600 font-medium">All Core Web Vitals passing — Excellent page experience signal for Google ranking.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Rankings */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Top Keyword Positions</CardTitle>
          <p className="text-xs text-muted-foreground">Organic search ranking for priority keywords</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Keyword</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Position</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Volume</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                {seoData.keywordPositions.map((kw) => (
                  <tr key={kw.keyword} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-3 font-medium">{kw.keyword}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        kw.position <= 3 ? "bg-emerald-500/10 text-emerald-600" :
                        kw.position <= 10 ? "bg-amber-500/10 text-amber-600" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        #{kw.position}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center tabular-nums text-muted-foreground">{kw.volume.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-center">
                      {kw.change > 0 && <span className="text-emerald-500 font-medium text-xs">+{kw.change}</span>}
                      {kw.change === 0 && <span className="text-muted-foreground text-xs">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ========== CLICKFLOW: Content Decay Monitoring ========== */}
      <Card className="border-border/50 border-red-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <CardTitle className="text-base font-semibold">Content Decay Monitoring</CardTitle>
            <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-500">{seoContentDecayData.length} pages declining</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Pages losing organic traffic — AI-suggested fixes to recover rankings</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Page</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Previous</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Current</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Traffic</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">AI Fix Suggestion</th>
                </tr>
              </thead>
              <tbody>
                {seoContentDecayData.map((item) => (
                  <tr key={item.page} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-3">
                      <p className="text-xs font-medium text-primary max-w-[180px] truncate">{item.page}</p>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600">
                        #{item.previousPosition}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-red-500/10 text-red-500">
                        #{item.currentPosition}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-xs font-medium text-red-500">{item.trafficChange}%</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-start gap-1.5">
                        <Sparkles className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        <span className="text-[10px] text-muted-foreground leading-relaxed">{item.fix}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] gap-1 ml-2"
                          onClick={() => executeAction({
                            action: `Fix Decay: ${item.page}`,
                            module: "seo",
                            detail: `Applying fix to "${item.page}": ${item.fix}`,
                            successMsg: `Fix task created for ${item.page}`,
                          })}
                        >
                          Fix
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ========== CLICKFLOW: Keyword Gap Opportunities ========== */}
      <Card className="border-border/50 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Keyword Gap Opportunities</CardTitle>
            <Badge variant="outline" className="text-[10px]">ClickFlow</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Keywords competitors rank for that Varni doesn't — prioritized by volume and difficulty</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Keyword</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Competitor Avg Pos</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Search Volume</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {keywordGapData.map((item) => (
                  <tr key={item.keyword} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-3 font-medium">{item.keyword}</td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge variant="secondary" className="text-[10px]">
                        #{item.competitorAvgPosition.toFixed(1)}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-center tabular-nums text-muted-foreground">
                      {item.volume >= 1000 ? `${(item.volume / 1000).toFixed(0)}K` : item.volume}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge variant="outline" className={`text-[10px] ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-primary font-medium">
              <Search className="h-3 w-3 inline mr-1" />
              Total addressable search volume: {keywordGapData.reduce((s, k) => s + k.volume, 0).toLocaleString()}/mo — {keywordGapData.filter(k => k.difficulty === "Low").length} keywords rated Low difficulty
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
