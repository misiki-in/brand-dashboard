"use client";

import { socialData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts";

const followerConfig = {
  instagram: { label: "Instagram", color: "oklch(0.6 0.18 340)" },
  tiktok: { label: "TikTok", color: "oklch(0.55 0.12 200)" },
  pinterest: { label: "Pinterest", color: "oklch(0.65 0.2 25)" },
  facebook: { label: "Facebook", color: "oklch(0.55 0.15 260)" },
};

export function SocialMedia() {
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Followers", value: (socialData.totalFollowers / 1000).toFixed(0) + "K", change: socialData.followerGrowth },
          { label: "Monthly Impressions", value: (socialData.impressions / 1000000).toFixed(1) + "M" },
          { label: "Total Reach", value: (socialData.reach / 1000000).toFixed(1) + "M" },
          { label: "Avg Engagement Rate", value: `${socialData.avgEngagementRate}%` },
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

      {/* Follower Growth Trend */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Follower Growth Trend (in thousands)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={followerConfig} className="h-[300px] w-full">
            <AreaChart data={socialData.followerGrowthTrend}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="instagram" stackId="1" stroke="var(--color-instagram)" fill="var(--color-instagram)" fillOpacity={0.4} />
              <Area type="monotone" dataKey="tiktok" stackId="1" stroke="var(--color-tiktok)" fill="var(--color-tiktok)" fillOpacity={0.4} />
              <Area type="monotone" dataKey="pinterest" stackId="1" stroke="var(--color-pinterest)" fill="var(--color-pinterest)" fillOpacity={0.4} />
              <Area type="monotone" dataKey="facebook" stackId="1" stroke="var(--color-facebook)" fill="var(--color-facebook)" fillOpacity={0.4} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socialData.platforms.map((p) => (
          <Card key={p.name} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">{p.name}</h3>
                <Badge variant={p.growth > 0 ? "default" : "secondary"} className="text-[10px]">
                  {p.growth > 0 ? "+" : ""}{p.growth}%
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xl font-bold tabular-nums">{(p.followers / 1000).toFixed(0)}K</p>
                  <p className="text-[10px] text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="text-xl font-bold tabular-nums">{p.engagement}%</p>
                  <p className="text-[10px] text-muted-foreground">Engagement</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 flex gap-4 text-xs text-muted-foreground">
                {p.posts > 0 && <span>{p.posts} posts</span>}
                {p.stories > 0 && <span>{p.stories} stories</span>}
                {p.reels > 0 && <span>{p.reels} reels</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
