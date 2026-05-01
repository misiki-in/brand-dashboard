"use client";

import { sentimentData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Gauge } from "./kpi-components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAction } from "@/lib/action-context";
import { ActionBar } from "./action-bar";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, Cell, PieChart, Pie,
} from "recharts";
import { Plus, Download, Bell } from "lucide-react";

const sentimentConfig = {
  positive: { label: "Positive", color: "oklch(0.6 0.18 145)" },
  neutral: { label: "Neutral", color: "oklch(0.7 0.05 80)" },
  negative: { label: "Negative", color: "oklch(0.6 0.2 25)" },
};

const sourceConfig = {
  mentions: { label: "Mentions", color: "oklch(0.65 0.18 65)" },
  growth: { label: "Growth %", color: "oklch(0.55 0.12 200)" },
};

export function SentimentListening() {
  const { executeAction, automations } = useAction();
  const relevantAutomations = automations.filter(a => a.module === "sentiment");
  const pieData = [
    { name: "Positive", value: sentimentData.positiveMentions, fill: "oklch(0.6 0.18 145)" },
    { name: "Neutral", value: sentimentData.neutralMentions, fill: "oklch(0.7 0.05 80)" },
    { name: "Negative", value: sentimentData.negativeMentions, fill: "oklch(0.6 0.2 25)" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Net Sentiment Score", value: sentimentData.netSentimentScore, suffix: "/100" },
          { label: "Positive Mentions", value: sentimentData.positiveMentions.toLocaleString(), suffix: "" },
          { label: "Neutral Mentions", value: sentimentData.neutralMentions.toLocaleString(), suffix: "" },
          { label: "Negative Mentions", value: sentimentData.negativeMentions.toLocaleString(), suffix: "" },
          { label: "Total Buzz Volume", value: (sentimentData.totalMentions / 1000).toFixed(0) + "K", suffix: "" },
        ].map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl lg:text-3xl font-bold tabular-nums">{m.value}</p>
              <p className="text-[10px] lg:text-xs text-muted-foreground mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ActionBar
        module="sentiment"
        primary={{
          label: "Create Topic Tracker",
          icon: Plus,
          onClick: () => executeAction({
            action: "Create Topic Tracker",
            module: "sentiment",
            detail: "Creating new sentiment topic tracker with keyword monitoring",
          }),
        }}
        actions={[
          {
            label: "Export Report",
            icon: Download,
            onClick: () => executeAction({
              action: "Export Report",
              module: "sentiment",
              detail: "Generating sentiment analysis report",
              successMsg: "Sentiment report exported",
            }),
          },
          {
            label: "Set Alert Threshold",
            icon: Bell,
            onClick: () => executeAction({
              action: "Set Alert Threshold",
              module: "sentiment",
              detail: "Configuring negative sentiment spike alerts",
              successMsg: "Alert threshold configured",
            }),
          },
        ]}
        relevantAutomations={relevantAutomations}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Sentiment Trend */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Sentiment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sentimentConfig} className="h-[200px] sm:h-[260px] lg:h-[300px] w-full">
              <AreaChart data={sentimentData.sentimentTrend}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="positive" stackId="1" stroke="var(--color-positive)" fill="var(--color-positive)" fillOpacity={0.6} />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke="var(--color-neutral)" fill="var(--color-neutral)" fillOpacity={0.6} />
                <Area type="monotone" dataKey="negative" stackId="1" stroke="var(--color-negative)" fill="var(--color-negative)" fillOpacity={0.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pie */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Sentiment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sentimentConfig} className="mx-auto aspect-square max-h-[160px] sm:max-h-[200px] lg:max-h-[220px]">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieData[index].fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-xs text-muted-foreground">{d.name} {((d.value / sentimentData.totalMentions) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Buzz Sources */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Buzz by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sourceConfig} className="h-[180px] sm:h-[220px] lg:h-[250px] w-full">
              <BarChart data={sentimentData.buzzSources} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="source" type="category" tick={{ fontSize: 11 }} width={90} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="mentions" fill="oklch(0.65 0.18 65)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Topics */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Trending Topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sentimentData.topTopics.map((t) => (
              <div key={t.topic} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-sm font-medium">{t.topic}</p>
                  <p className="text-[10px] text-muted-foreground">{t.mentions.toLocaleString()} mentions</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={t.sentiment >= 90 ? "default" : t.sentiment >= 80 ? "secondary" : "outline"} className="text-xs">
                    {t.sentiment}% positive
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] px-2"
                    onClick={() => executeAction({
                      action: `Track: ${t.topic}`,
                      module: "sentiment",
                      detail: `Adding "${t.topic}" to active sentiment tracking`,
                      successMsg: `Now tracking "${t.topic}"`,
                    })}
                  >
                    Track
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
