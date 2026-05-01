"use client";

import { adsData, wastedSpendData, budgetPacingData, budgetPacingTotal, conversionFunnelData, adAuditScores, topRegionsData, topRegionsAvg, aiAdSuggestions } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter, ZAxis, Cell,
} from "recharts";
import { AlertTriangle, Sparkles, MapPin, Zap, Target, ArrowRight, Check, X } from "lucide-react";

const channelConfig = {
  spend: { label: "Spend", color: "oklch(0.55 0.12 200)" },
  revenue: { label: "Revenue", color: "oklch(0.65 0.18 65)" },
};

function getScoreColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 65) return "bg-amber-500";
  return "bg-red-500";
}

function getPacingColor(spent: number, budget: number) {
  const pct = spent / budget;
  if (pct >= 0.85 && pct <= 1.0) return "#22c55e";
  if (pct >= 0.7) return "#eab308";
  return "#ef4444";
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(0)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
}

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

      {/* ========== RYZE AI: Wasted Spend Detection ========== */}
      <Card className="border-border/50 border-red-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <CardTitle className="text-base font-semibold">Wasted Spend Detection</CardTitle>
            <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-500">AI Powered</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Breakdown of wasted ad spend this month — total ${wastedSpendData.reduce((s, w) => s + w.amount, 0).toLocaleString()}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {wastedSpendData.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{item.category}</span>
                <span className="text-xs font-semibold tabular-nums">${item.amount.toLocaleString()}</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ========== RYZE AI: Monthly Budget Pacing ========== */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Monthly Budget Pacing</CardTitle>
            <Badge variant="outline" className="text-[10px]">AI Powered</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {budgetPacingData.map((item) => {
            const pct = Math.round((item.spent / item.budget) * 100);
            const paceColor = getPacingColor(item.spent, item.budget);
            const status = pct >= 85 && pct <= 100 ? "On Pace" : pct >= 70 ? "Behind" : "Critical";
            return (
              <div key={item.channel} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.channel}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground tabular-nums">${(item.spent / 1000).toFixed(1)}K / ${(item.budget / 1000).toFixed(0)}K</span>
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={{ borderColor: paceColor, color: paceColor }}
                    >
                      {status}
                    </Badge>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: paceColor }}
                  />
                </div>
              </div>
            );
          })}
          <div className="pt-3 mt-2 border-t border-border/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Total</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold tabular-nums">${(budgetPacingTotal.spent / 1000).toFixed(1)}K / ${(budgetPacingTotal.budget / 1000).toFixed(0)}K</span>
                <span className="text-xs text-muted-foreground">({Math.round((budgetPacingTotal.spent / budgetPacingTotal.budget) * 100)}%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========== RYZE AI: Conversion Funnel ========== */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Conversion Funnel</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">Ad impression-to-conversion flow across all channels</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {conversionFunnelData.map((step, i) => {
              const widths = ["100%", "75%", "50%", "32%"];
              const colors = ["bg-primary/80", "bg-primary/60", "bg-primary/40", "bg-emerald-500/70"];
              return (
                <div key={step.stage} className="flex items-center gap-4">
                  <div className="w-28 sm:w-32 shrink-0 text-right">
                    <p className="text-sm font-semibold">{step.stage}</p>
                    <p className="text-[10px] text-muted-foreground">{formatCount(step.count)}</p>
                  </div>
                  <div className="flex-1">
                    <div
                      className={`h-10 rounded-lg ${colors[i]} flex items-center justify-center transition-all duration-700`}
                      style={{ width: widths[i] }}
                    >
                      {i > 0 && (
                        <span className="text-xs font-bold text-white">
                          {step.rate}% from prev
                        </span>
                      )}
                    </div>
                  </div>
                  {i < conversionFunnelData.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40 shrink-0 hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/20 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>Overall CVR: <span className="font-semibold text-foreground">0.06%</span> (Impression → Conversion)</span>
            <span>Click-to-Lead: <span className="font-semibold text-foreground">12.9%</span></span>
            <span>Lead-to-Conversion: <span className="font-semibold text-foreground">28.2%</span></span>
          </div>
        </CardContent>
      </Card>

      {/* ========== RYZE AI: Ad Account Audit Score ========== */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Ad Account Audit Score</CardTitle>
            <Badge variant="outline" className="text-[10px]">AI Powered</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Multi-dimensional health check across 8 key areas</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {adAuditScores.map((item) => (
              <div key={item.dimension} className="p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{item.dimension}</span>
                  <span className={`text-sm font-bold tabular-nums ${item.score >= 80 ? "text-emerald-500" : item.score >= 65 ? "text-amber-500" : "text-red-500"}`}>
                    {item.score}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getScoreColor(item.score)} transition-all duration-700`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{item.suggestion}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-primary font-medium">
              Overall Account Health: {Math.round(adAuditScores.reduce((s, a) => s + a.score, 0) / adAuditScores.length)}% — 
              {Math.round(adAuditScores.reduce((s, a) => s + a.score, 0) / adAuditScores.length) >= 80 ? " Good standing" : " Needs attention"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ========== RYZE AI: Top Regions by ROAS ========== */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Top Regions by ROAS</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">Geographic performance — avg {topRegionsAvg.roas}x ROAS across {topRegionsAvg.states} states</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {topRegionsData.map((region) => (
            <div key={region.region} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{region.region}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">${region.spend.toLocaleString()}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                      style={{ borderColor: region.color, color: region.color }}
                    >
                      {region.roas}x ROAS
                    </Badge>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden mt-1.5">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(region.roas / 6) * 100}%`, backgroundColor: region.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ========== RYZE AI: AI Suggestions Panel ========== */}
      <Card className="border-border/50 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">AI Suggestions</CardTitle>
            <Badge variant="outline" className="text-[10px]">5 actions pending</Badge>
          </div>
          <p className="text-xs text-muted-foreground">AI-driven optimization recommendations — review and approve</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiAdSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border border-border/30">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{suggestion.issue}</Badge>
                    <span className="text-[10px] text-muted-foreground">{suggestion.id}</span>
                  </div>
                  <p className="text-sm font-medium">{suggestion.action}</p>
                  <p className="text-xs text-emerald-600">{suggestion.impact}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30">
                    <X className="h-3 w-3" />
                    Deny
                  </Button>
                  <Button size="sm" className="h-8 text-xs gap-1">
                    <Check className="h-3 w-3" />
                    OK
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
