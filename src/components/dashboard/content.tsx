"use client";

import { contentData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

const contentTypeConfig = {
  engagement: { label: "Engagement %", color: "oklch(0.65 0.18 65)" },
  reach: { label: "Reach", color: "oklch(0.55 0.12 200)" },
};

export function ContentStrategy() {
  return (
    <div className="space-y-6">
      {/* Content Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Content Pieces", value: contentData.totalContent, sub: "This quarter" },
          { label: "Avg Engagement Rate", value: `${contentData.avgEngagement}%`, sub: "Across all platforms" },
          { label: "Top Content Reach", value: "420K", sub: "Bridal Collection Reel" },
        ].map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl lg:text-3xl font-bold tabular-nums">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              {m.sub && <p className="text-[10px] text-muted-foreground">{m.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Performing Content */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Top Performing Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contentData.topPerforming.map((c, i) => (
              <div key={c.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <span className="text-lg font-bold text-primary/40 w-6 shrink-0 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{c.title}</p>
                    <Badge variant="outline" className="text-[10px] shrink-0">{c.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                    <span>{(c.views / 1000).toFixed(0)}K views</span>
                    <span>{c.engagement}% engagement</span>
                    <span>{(c.shares / 1000).toFixed(1)}K shares</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Content Type Performance */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Content Type Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={contentTypeConfig} className="h-[280px] w-full">
              <BarChart data={contentData.contentTypePerformance}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="engagement" fill="oklch(0.65 0.18 65)" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Content Calendar */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Weekly Content Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Week</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Posts</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Stories</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Reels</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Blogs</th>
                    <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {contentData.contentCalendar.map((w) => (
                    <tr key={w.week} className="border-b border-border/30">
                      <td className="py-2 px-2 font-medium">{w.week}</td>
                      <td className="py-2 px-2 text-center tabular-nums">{w.posts}</td>
                      <td className="py-2 px-2 text-center tabular-nums">{w.stories}</td>
                      <td className="py-2 px-2 text-center tabular-nums">{w.reels}</td>
                      <td className="py-2 px-2 text-center tabular-nums">{w.blogs}</td>
                      <td className="py-2 px-2 text-center tabular-nums font-bold">{w.posts + w.stories + w.reels + w.blogs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
