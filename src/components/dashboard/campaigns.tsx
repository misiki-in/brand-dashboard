"use client";

import { campaignData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus, CalendarDays, Copy } from "lucide-react";
import { useState } from "react";
import { CreateCampaignModal, ExportModal } from "./action-modals";
import { exportToCSV } from "@/lib/real-actions";
import { toast } from "sonner";
import { useAction } from "@/lib/action-context";
import { ActionBar } from "./action-bar";

export function CampaignCalendar() {
  const { executeAction, automations } = useAction();
  const [createOpen, setCreateOpen] = useState(false);

  const statusColor: Record<string, string> = {
    Active: "bg-emerald-500",
    Upcoming: "bg-amber-500",
    Planning: "bg-primary/50",
  };
  const statusBadge: Record<string, "default" | "secondary" | "outline"> = {
    Active: "default",
    Upcoming: "secondary",
    Planning: "outline",
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Campaigns", value: campaignData.activeCampaigns },
          { label: "Upcoming Campaigns", value: campaignData.upcomingCampaigns },
          { label: "Total Annual Budget", value: `$${(campaignData.campaigns.reduce((a, c) => a + c.budget, 0) / 1000).toFixed(0)}K` },
          { label: "Projected Revenue", value: `$${(campaignData.campaigns.reduce((a, c) => a + c.kpis.revenue, 0) / 1000000).toFixed(1)}M` },
        ].map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-2xl lg:text-3xl font-bold tabular-nums">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ActionBar
        module="campaigns"
        primary={{
          label: "Create Campaign",
          icon: Plus,
          onClick: () => setCreateOpen(true),
        }}
        actions={[
          {
            label: "Export Calendar",
            icon: CalendarDays,
            onClick: () => {
              exportToCSV(campaignData.campaigns.map(c => ({
                Campaign: c.name,
                Status: c.status,
                'Start Date': c.startDate,
                'End Date': c.endDate,
                Budget: '$' + c.budget,
                Spent: '$' + c.spent,
                Channels: c.channels.join(', '),
                Audience: c.targetAudience,
                'Revenue Target': '$' + c.kpis.revenue,
                'Order Target': c.kpis.orders,
                Progress: c.progress + '%',
              })), "campaign-calendar-2026.csv");
              toast.success("Calendar exported", { description: "campaign-calendar-2026.csv downloaded" });
            },
          },
          {
            label: "Duplicate",
            icon: Copy,
            onClick: () => {
              executeAction({
                action: "Duplicate",
                module: "campaigns",
                detail: "Duplicating top-performing campaign template",
                successMsg: "Top campaign template duplicated — Valentine's Day campaign cloned",
              });
            },
          },
        ]}
        relevantAutomations={automations.filter(a => a.module === "campaigns")}
      />

      {/* Campaign Timeline */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Jewelry Marketing Calendar 2026</CardTitle>
          <p className="text-xs text-muted-foreground">Seasonal campaigns tailored for jewelry commerce</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {campaignData.campaigns.map((c) => (
            <div key={c.name} className="relative pl-6 pb-2">
              {/* Timeline dot */}
              <div className={`absolute left-0 top-1 w-3 h-3 rounded-full ${statusColor[c.status]}`} />
              {/* Line */}
              {campaignData.campaigns.indexOf(c) < campaignData.campaigns.length - 1 && (
                <div className="absolute left-[5px] top-4 w-0.5 h-full bg-border/50" />
              )}

              <div className="p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold">{c.name}</h3>
                    <Badge variant={statusBadge[c.status]} className="text-[10px]">{c.status}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{c.startDate} — {c.endDate}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-2">
                  <div>
                    <span className="text-muted-foreground">Budget: </span>
                    <span className="font-medium">${(c.budget / 1000).toFixed(0)}K</span>
                    {c.spent > 0 && (
                      <span className="text-muted-foreground"> (spent ${(c.spent / 1000).toFixed(0)}K)</span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Audience: </span>
                    <span className="font-medium">{c.targetAudience}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenue Target: </span>
                    <span className="font-medium">${(c.kpis.revenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Order Target: </span>
                    <span className="font-medium">{c.kpis.orders}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {c.channels.map((ch) => (
                    <Badge key={ch} variant="outline" className="text-[10px]">{ch}</Badge>
                  ))}
                </div>

                {c.progress > 0 && (
                  <div className="flex items-center gap-2">
                    <Progress value={c.progress} className="h-2 flex-1" />
                    <span className="text-xs font-medium tabular-nums">{c.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Jewelry-Specific Calendar Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-2">Key Jewelry Commerce Moments</p>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p><strong className="text-foreground">Valentine&apos;s Day (Feb 14):</strong> Largest gifting occasion for jewelry. Engagement rings and heart-themed pieces see 3-4x normal demand. Start campaigns by mid-January.</p>
              <p><strong className="text-foreground">Wedding Season (Apr-Jun):</strong> Bridal jewelry peaks. Coordinate with wedding planner partnerships and bridal show sponsorships.</p>
              <p><strong className="text-foreground">Diwali (Oct):</strong> Gold purchase festival. South Asian markets see massive gold jewelry demand. Prepare gold-focused collections.</p>
              <p><strong className="text-foreground">Holiday (Nov-Dec):</strong> Highest revenue window. Black Friday + Christmas gift shopping. Budget should be 30%+ of annual spend.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-2">Campaign Optimization Notes</p>
            <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <p><strong className="text-foreground">Personalization is Key:</strong> Jewelry purchases are emotionally driven. Use customer data to segment by purchase occasion (engagement, anniversary, self-gifting) and tailor creative accordingly.</p>
              <p><strong className="text-foreground">UGC & Social Proof:</strong> Customer photos wearing your jewelry convert 2.5x better than product-only shots. Integrate UGC galleries into all campaigns.</p>
              <p><strong className="text-foreground">Retargeting Window:</strong> Jewelry has a longer consideration cycle (avg 14 days). Implement 30-day retargeting sequences with progressive discounting.</p>
              <p><strong className="text-foreground">Tiered Offers:</strong> High-value bridal customers should receive VIP early access, while self-gifting audiences respond to &quot;treat yourself&quot; messaging.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateCampaignModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          setCreateOpen(false);
          toast.success("Campaign created successfully", { description: "New campaign added to the calendar" });
        }}
      />
    </div>
  );
}
