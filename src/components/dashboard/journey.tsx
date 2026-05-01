"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, Download, BarChart3 } from "lucide-react";
import { useAction } from "@/lib/action-context";
import { ActionBar } from "./action-bar";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

const funnelStages = [
  { stage: "Reach",           count: 1_400_000, icon: "🌐" },
  { stage: "Site Visitors",   count: 182_000,   icon: "👁" },
  { stage: "Engaged Users",   count: 68_000,    icon: "💬" },
  { stage: "Leads Captured",  count: 12_400,    icon: "🎯" },
  { stage: "First Purchase",  count: 5_855,     icon: "💍" },
  { stage: "Repeat Buyers",   count: 2_460,     icon: "🔄" },
  { stage: "Loyal Customers", count: 1_040,     icon: "👑" },
  { stage: "Brand Advocates", count: 390,       icon: "⭐" },
] as const;

const maxCount = funnelStages[0].count;
const logMax = Math.log10(maxCount);

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 100_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

function funnelBarWidth(count: number): number {
  // Logarithmic scale so every stage stays visible
  return Math.max(10, (Math.log10(count) / logMax) * 100);
}

function dropOff(current: number, previous: number): number {
  return ((previous - current) / previous) * 100;
}

/* Gold / amber oklch gradient stops for each funnel stage */
const funnelColors: readonly string[] = [
  "oklch(0.82 0.14 85)",   // Reach — lightest gold
  "oklch(0.78 0.14 82)",
  "oklch(0.74 0.14 80)",
  "oklch(0.70 0.14 78)",
  "oklch(0.66 0.15 76)",
  "oklch(0.62 0.15 74)",
  "oklch(0.58 0.15 72)",
  "oklch(0.54 0.16 70)",   // Advocates — deepest gold
];

/* -------------------------------------------------------------------------- */
/*  CRM Automation Workflows                                                  */
/* -------------------------------------------------------------------------- */

type Workflow = {
  id: string;
  name: string;
  description: string;
  steps: string[];
  conversion: number;
  revenue: string;
  subscribers: number;
  defaultOn: boolean;
  badge: string;
};

const workflows: Workflow[] = [
  {
    id: "welcome",
    name: "Welcome Series",
    description: "Automated 3-email onboarding drip for new subscribers introducing brand heritage, best-sellers, and an exclusive first-purchase offer.",
    steps: ["Brand Story", "Curated Picks", "First-Purchase Offer"],
    conversion: 7.2,
    revenue: "$42K",
    subscribers: 18_400,
    defaultOn: true,
    badge: "Onboarding",
  },
  {
    id: "occasion",
    name: "Occasion Triggers",
    description: "Birthday & anniversary reminders with personalized gift recommendations sent 14 days and 3 days before each event.",
    steps: ["Profile Capture", "14-Day Reminder", "3-Day Reminder", "Post-Event Follow-Up"],
    conversion: 14.8,
    revenue: "$68K",
    subscribers: 9_620,
    defaultOn: true,
    badge: "Personalization",
  },
  {
    id: "abandon",
    name: "Abandon Recovery",
    description: "Cart and browse-abandonment sequences with dynamic product retargeting and time-sensitive incentive escalation.",
    steps: ["Browse Detect", "Cart Reminder", "Incentive Escalation", "Final Nudge"],
    conversion: 12.4,
    revenue: "$82K",
    subscribers: 14_200,
    defaultOn: true,
    badge: "Conversion",
  },
  {
    id: "nps",
    name: "Post-Purchase NPS",
    description: "Review solicitation and NPS survey after delivery, followed by personalized cross-sell recommendations based on purchase.",
    steps: ["Delivery Confirm", "NPS Survey", "Review Request", "Cross-Sell Upsell"],
    conversion: 38,
    revenue: "$24K",
    subscribers: 6_840,
    defaultOn: true,
    badge: "Retention",
  },
  {
    id: "winback",
    name: "Win-Back",
    description: "Re-engagement campaign targeting customers with no activity for 90+ days through exclusive offers and new collection previews.",
    steps: ["Dormant Detect", "We Miss You", "Exclusive Preview", "Final Offer"],
    conversion: 3.4,
    revenue: "$18K",
    subscribers: 4_120,
    defaultOn: false,
    badge: "Reactivation",
  },
];

/* -------------------------------------------------------------------------- */
/*  Channel Benchmarks                                                        */
/* -------------------------------------------------------------------------- */

const channelBenchmarks = [
  { channel: "Email",              rate: 34.2,  industry: 21.3, icon: "📧" },
  { channel: "SMS",                rate: 94,    industry: 82,   icon: "📱" },
  { channel: "WhatsApp",           rate: 78,    industry: 71,   icon: "💬" },
  { channel: "Push Notification",  rate: 6.8,   industry: 4.2,  icon: "🔔" },
  { channel: "WhatsApp Business",  rate: 68,    industry: 58,   icon: "🟢" },
];

/* -------------------------------------------------------------------------- */
/*  Journey Stage Insights                                                    */
/* -------------------------------------------------------------------------- */

const insights = [
  {
    title: "Engagement Drop-Off Alert",
    description:
      "The largest conversion loss (87%) occurs between Reach and Site Visitors. Consider optimizing top-of-funnel creative assets and ad targeting to improve click-through rates.",
    metric: "87%",
    metricLabel: "Reach → Visitor Loss",
    trend: "warning" as const,
  },
  {
    title: "Lead-to-Purchase Strength",
    description:
      "Converting 47.2% of captured leads to first purchase is exceptional — 3.2× above luxury retail benchmark. Maintain quality lead nurturing and personalized follow-ups.",
    metric: "47.2%",
    metricLabel: "Lead → Purchase Rate",
    trend: "positive" as const,
  },
  {
    title: "Loyalty Pipeline Health",
    description:
      "The Loyal-to-Advocate ratio of 3.8:1 indicates strong brand affinity. Invest in referral incentives and VIP community features to accelerate organic advocacy.",
    metric: "390",
    metricLabel: "Active Brand Advocates",
    trend: "positive" as const,
  },
  {
    title: "Repeat Purchase Opportunity",
    description:
      "Only 42% of first-time buyers become repeat purchasers. Post-purchase nurture window of 60 days shows the highest re-engagement — expand this program.",
    metric: "42%",
    metricLabel: "First → Repeat Rate",
    trend: "warning" as const,
  },
];

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                            */
/* -------------------------------------------------------------------------- */

function FunnelChart() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Full Lifecycle Funnel</CardTitle>
        <CardDescription>
          Customer journey from initial reach to brand advocacy across all channels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {funnelStages.map((s, i) => {
            const pct = ((s.count / maxCount) * 100).toFixed(s.count < 1000 ? 3 : 1);
            const barW = funnelBarWidth(s.count);
            const color = funnelColors[i];
            const drop = i > 0 ? dropOff(s.count, funnelStages[i - 1].count) : null;

            return (
              <div key={s.stage} className="group">
                {/* Row header */}
                <div className="flex items-center justify-between mb-0.5 px-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm" role="img" aria-hidden>
                      {s.icon}
                    </span>
                    <span className="text-sm font-medium truncate">{s.stage}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold tabular-nums">
                      {formatCount(s.count)}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums w-14 text-right">
                      {pct}%
                    </span>
                    {drop !== null && (
                      <span className="text-xs text-rose-400 tabular-nums w-14 text-right">
                        -{drop.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                {/* Bar */}
                <div className="h-7 w-full rounded-md bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-md transition-all duration-700 ease-out flex items-center px-2"
                    style={{ width: `${barW}%`, backgroundColor: color }}
                  >
                    {barW > 20 && (
                      <span className="text-[11px] font-semibold text-white/90 tabular-nums truncate">
                        {formatCount(s.count)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border/40">
          <span className="text-xs text-muted-foreground">Bar width uses log scale for readability</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: funnelColors[0] }} />
            Widest
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: funnelColors[7] }} />
            Narrowest
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkflowCard({ wf }: { wf: Workflow }) {
  const [enabled, setEnabled] = useState(wf.defaultOn);

  return (
    <Card className="border-border/50 hover:border-border transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <CardTitle className="text-sm font-semibold leading-tight">
              {wf.name}
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-medium">
              {wf.badge}
            </Badge>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            aria-label={`Toggle ${wf.name} workflow`}
          />
        </div>
        <CardDescription className="text-xs leading-relaxed">
          {wf.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Flow steps */}
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
            Flow Steps
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {wf.steps.map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                    enabled
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
                {i < wf.steps.length - 1 && (
                  <span className="text-muted-foreground text-[10px]">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 border-t border-border/40">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Conversion
            </p>
            <p className="text-sm font-bold tabular-nums text-emerald-500">
              {wf.conversion}%
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Revenue
            </p>
            <p className="text-sm font-bold tabular-nums">{wf.revenue}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Subscribers
            </p>
            <p className="text-sm font-bold tabular-nums">
              {wf.subscribers.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Conversion bar */}
        <div className="space-y-1">
          <Progress value={wf.conversion} className="h-1.5" />
          <p className="text-[10px] text-right text-muted-foreground tabular-nums">
            {wf.conversion}% conversion
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ChannelBenchmarksTable() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Channel Open-Rate Benchmarks
        </CardTitle>
        <CardDescription>
          Your performance vs. luxury retail industry averages
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2.5 pr-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Channel
                </th>
                <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Your Rate
                </th>
                <th className="text-right py-2.5 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Industry Avg
                </th>
                <th className="text-left py-2.5 pl-4 text-xs font-medium text-muted-foreground uppercase tracking-wider w-40">
                  Comparison
                </th>
                <th className="text-right py-2.5 pl-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Delta
                </th>
              </tr>
            </thead>
            <tbody>
              {channelBenchmarks.map((ch) => {
                const delta = ch.rate - ch.industry;
                const isPositive = delta > 0;
                return (
                  <tr
                    key={ch.channel}
                    className="border-b border-border/30 last:border-0"
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span role="img" aria-hidden>
                          {ch.icon}
                        </span>
                        <span className="font-medium">{ch.channel}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 font-bold tabular-nums">
                      {ch.rate}%
                    </td>
                    <td className="text-right py-3 px-4 text-muted-foreground tabular-nums">
                      {ch.industry}%
                    </td>
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((ch.rate / 100) * 100, 100)}%`,
                              backgroundColor: isPositive
                                ? "oklch(0.65 0.18 145)"
                                : "oklch(0.65 0.2 25)",
                            }}
                          />
                        </div>
                        <div className="w-16 h-2 rounded-full bg-muted/40 overflow-hidden shrink-0">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((ch.industry / 100) * 100, 100)}%`,
                              backgroundColor: "oklch(0.6 0 0 / 0.25)",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 pl-4">
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums ${
                          isPositive
                            ? "text-emerald-500"
                            : "text-rose-400"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {delta.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden space-y-3">
          {channelBenchmarks.map((ch) => {
            const delta = ch.rate - ch.industry;
            const isPositive = delta > 0;
            return (
              <div
                key={ch.channel}
                className="rounded-lg border border-border/40 p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium text-sm">
                    <span role="img" aria-hidden>{ch.icon}</span>
                    {ch.channel}
                  </span>
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      isPositive ? "text-emerald-500" : "text-rose-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {delta.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Yours </span>
                    <span className="font-bold tabular-nums">{ch.rate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Industry </span>
                    <span className="tabular-nums text-muted-foreground">{ch.industry}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((ch.rate / 100) * 100, 100)}%`,
                      backgroundColor: isPositive
                        ? "oklch(0.65 0.18 145)"
                        : "oklch(0.65 0.2 25)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({
  insight,
}: {
  insight: (typeof insights)[number];
}) {
  const borderColor =
    insight.trend === "positive"
      ? "border-l-emerald-500"
      : "border-l-amber-500";

  return (
    <Card className={`border-border/50 border-l-4 ${borderColor}`}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-sm font-semibold leading-tight">{insight.title}</h4>
          <Badge
            variant={insight.trend === "positive" ? "default" : "outline"}
            className={`shrink-0 text-[10px] ${
              insight.trend === "positive"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}
          >
            {insight.trend === "positive" ? "Strong" : "Watch"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {insight.description}
        </p>
        <div className="pt-2 border-t border-border/30">
          <p className="text-xl font-bold tabular-nums">{insight.metric}</p>
          <p className="text-[11px] text-muted-foreground">{insight.metricLabel}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export function CustomerJourney() {
  const { executeAction, automations } = useAction();

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reach", value: "1.4M", sub: "All channels" },
          { label: "Conversion Rate", value: "0.42%", sub: "Reach → Purchase" },
          { label: "Active Workflows", value: "5", sub: "CRM automations" },
          { label: "Journey Revenue", value: "$234K", sub: "Pipeline total" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl lg:text-3xl font-bold tabular-nums">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ActionBar
        module="journey"
        primary={{
          label: "Create Workflow",
          icon: Plus,
          onClick: () => executeAction({ action: "Create Workflow", module: "journey", detail: "Creating new CRM automation workflow" }),
        }}
        actions={[
          {
            label: "Export Journey Data",
            icon: Download,
            onClick: () => executeAction({ action: "Export Journey Data", module: "journey", detail: "Exporting customer journey funnel data" }),
          },
          {
            label: "Run Analysis",
            icon: BarChart3,
            onClick: () => executeAction({ action: "Run Analysis", module: "journey", detail: "Running journey drop-off analysis" }),
          },
        ]}
        relevantAutomations={automations.filter(a => a.module === "journey")}
      />

      {/* Full Lifecycle Funnel */}
      <FunnelChart />

      {/* CRM Automation Workflows */}
      <div>
        <h3 className="text-sm font-semibold mb-4">CRM Automation Workflows</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {workflows.map((wf) => (
            <WorkflowCard key={wf.id} wf={wf} />
          ))}
        </div>
      </div>

      {/* Channel Benchmarks */}
      <ChannelBenchmarksTable />

      {/* Journey Stage Insights */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Journey Stage Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <InsightCard key={insight.title} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  );
}
