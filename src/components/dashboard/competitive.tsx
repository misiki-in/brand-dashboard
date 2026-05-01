"use client";

import { competitiveData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

export function CompetitiveIntel() {
  const sovData = competitiveData.competitors.map((c, i) => ({
    name: c.name,
    sov: c.sov,
    fill: i === 0 ? "oklch(0.65 0.18 65)" : "oklch(0.7 0.05 80)",
  }));

  const sentimentRadar = competitiveData.competitors.map((c) => ({
    name: c.name.replace(" ", "\n"),
    sov: c.sov,
    sentiment: c.sentiment,
  }));

  return (
    <div className="space-y-6">
      {/* Market Position */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Market Share", value: `${competitiveData.marketShare}%` },
          { label: "Share of Voice", value: `${competitiveData.shareOfVoice}%` },
          { label: "Competitive Set", value: competitiveData.competitors.length.toString() },
        ].map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold tabular-nums">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Share of Voice Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Share of Voice Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ sov: { label: "SOV %", color: "oklch(0.65 0.18 65)" } }} className="h-[300px] w-full">
            <BarChart data={sovData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="sov" radius={[4, 4, 0, 0]} barSize={36}>
                {sovData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Competitor Cards */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Competitor Landscape</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Brand</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">SOV</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Sentiment</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Pricing</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Strength</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Weakness</th>
                </tr>
              </thead>
              <tbody>
                {competitiveData.competitors.map((c) => (
                  <tr key={c.name} className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${c.name === "Lumière Jewels" ? "bg-primary/5" : ""}`}>
                    <td className="py-2.5 px-2 font-medium">
                      {c.name}
                      {c.name === "Lumière Jewels" && <Badge className="ml-1 text-[10px]">You</Badge>}
                    </td>
                    <td className="py-2.5 px-2 text-center tabular-nums font-medium">{c.sov}%</td>
                    <td className="py-2.5 px-2 text-center">
                      <Badge variant={c.sentiment >= 75 ? "default" : c.sentiment >= 65 ? "secondary" : "outline"} className="text-[10px]">
                        {c.sentiment}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2 text-center text-xs text-muted-foreground">{c.pricing}</td>
                    <td className="py-2.5 px-2 text-xs text-emerald-600">{c.strength}</td>
                    <td className="py-2.5 px-2 text-xs text-red-400">{c.weakness}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Benchmark */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Pricing Benchmark</CardTitle>
          <p className="text-xs text-muted-foreground">Our prices vs market average</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {competitiveData.pricingBenchmark.map((p) => {
              const isBelow = p.us < p.market;
              return (
                <div key={p.category} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20">
                  <span className="text-sm font-medium w-36 shrink-0">{p.category}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex gap-2 items-center">
                      <div className="flex-1 h-6 rounded bg-muted overflow-hidden relative">
                        <div className="h-full rounded bg-primary/30 flex items-center justify-center" style={{ width: `${(p.market / p.us) * 80}%` }}>
                          <span className="text-[10px] font-medium tabular-nums">${p.market}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary tabular-nums">${p.us}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-muted-foreground">Market avg</span>
                      <span className="text-muted-foreground">Our price</span>
                    </div>
                  </div>
                  <Badge variant={isBelow ? "default" : "secondary"} className="text-[10px] shrink-0">
                    {p.position}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
