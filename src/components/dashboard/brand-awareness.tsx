"use client";

import { awarenessData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ProgressMetric } from "./kpi-components";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer, Cell,
} from "recharts";

const trendConfig = {
  tom: { label: "Top of Mind", color: "oklch(0.65 0.18 65)" },
  aided: { label: "Aided Recall", color: "oklch(0.6 0.15 340)" },
  unaided: { label: "Unaided Recall", color: "oklch(0.55 0.12 200)" },
  sov: { label: "Share of Voice", color: "oklch(0.7 0.1 140)" },
};

const sovConfig = {
  sov: { label: "Share of Voice %", color: "oklch(0.65 0.18 65)" },
};

export function BrandAwareness() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Top of Mind Awareness", value: awarenessData.topOfMind, unit: "%" },
          { label: "Aided Brand Recall", value: awarenessData.aidedRecall, unit: "%" },
          { label: "Unaided Brand Recall", value: awarenessData.unaidedRecall, unit: "%" },
          { label: "Share of Voice", value: awarenessData.shareOfVoice, unit: "%" },
        ].map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold tabular-nums">{m.value}{m.unit}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Awareness Trend (Quarterly)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={trendConfig} className="h-[300px] w-full">
            <LineChart data={awarenessData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="tom" stroke="var(--color-tom)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="aided" stroke="var(--color-aided)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="unaided" stroke="var(--color-unaided)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="sov" stroke="var(--color-sov)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Brand Associations */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Brand Associations</CardTitle>
            <p className="text-xs text-muted-foreground">What consumers associate with Varni Jewels</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {awarenessData.brandAssociations.map((a) => (
                <div key={a.word} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <p className="text-sm font-medium truncate">{a.word}</p>
                    <p className="text-[10px] text-muted-foreground">{a.mentions.toLocaleString()} mentions</p>
                  </div>
                  <div className="flex-1 h-6 rounded-full bg-muted/50 overflow-hidden relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-700"
                      style={{ width: `${(a.sentiment / 100) * 100}%` }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold tabular-nums">{a.sentiment}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search & Direct Traffic */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Digital Presence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 text-center">
                <p className="text-2xl font-bold tabular-nums">{(awarenessData.searchVolume / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">Monthly Search Volume</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 text-center">
                <p className="text-2xl font-bold tabular-nums">{awarenessData.directTraffic}%</p>
                <p className="text-xs text-muted-foreground">Direct Traffic Share</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category Benchmarks</p>
              {[
                { metric: "Industry Avg. TOM", value: 15, benchmark: awarenessData.topOfMind },
                { metric: "Industry Avg. Aided Recall", value: 52, benchmark: awarenessData.aidedRecall },
                { metric: "Industry Avg. SOV", value: 12, benchmark: awarenessData.shareOfVoice },
              ].map((b) => (
                <div key={b.metric} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{b.metric}</span>
                    <span className="font-medium">{b.benchmark}% vs {b.value}% industry</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-muted-foreground/30" style={{ width: `${b.value}%` }} />
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${b.benchmark}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Industry</span>
                    <span>Varni</span>
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
