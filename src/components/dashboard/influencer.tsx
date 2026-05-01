"use client";

import { influencerData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { ProgressMetric } from "./kpi-components";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";
import { AlertTriangle, Shield, Ticket, Send, Tag, Download, Plus } from "lucide-react";
import { useAction } from "@/lib/action-context";
import { ActionBar } from "./action-bar";
import { Button } from "@/components/ui/button";

// Nano/Micro vs Macro analysis data
const tierAnalysis = [
  { tier: "Nano (1K-10K)", partners: 42, avgEngagement: 9.2, avgCost: 800, roas: 8.4, cpe: 0.12, share: 35 },
  { tier: "Micro (10K-100K)", partners: 24, avgEngagement: 7.8, avgCost: 3200, roas: 6.8, cpe: 0.18, share: 28 },
  { tier: "Mid (100K-500K)", partners: 12, avgEngagement: 5.4, avgCost: 18000, roas: 4.2, cpe: 0.42, share: 22 },
  { tier: "Macro (500K-1M)", partners: 6, avgEngagement: 3.8, avgCost: 42000, roas: 2.8, cpe: 0.86, share: 10 },
  { tier: "Mega (1M+)", partners: 2, avgEngagement: 2.4, avgCost: 85000, roas: 1.8, cpe: 1.42, share: 5 },
];

const tierConfig = {
  roas: { label: "ROAS", color: "oklch(0.65 0.18 65)" },
  avgEngagement: { label: "Engagement %", color: "oklch(0.55 0.12 200)" },
};

// PR Strategy data
const prStrategy = {
  editorial: [
    { publication: "Vogue India", type: "Feature", status: "Published", date: "Dec 2025", impact: "2.4M impressions", tier: "Tier 1" },
    { publication: "Elle India", type: "Collection Review", status: "Published", date: "Jan 2026", impact: "1.2M impressions", tier: "Tier 1" },
    { publication: "Harper's Bazaar", type: "Brand Profile", status: "Confirmed", date: "Mar 2026", impact: "1.8M est.", tier: "Tier 1" },
    { publication: "GQ India", type: "Men's Gift Guide", status: "Pitched", date: "Feb 2026", impact: "800K est.", tier: "Tier 2" },
    { publication: "The Voice of Fashion", type: "Sustainability Feature", status: "In Progress", date: "Apr 2026", impact: "400K est.", tier: "Tier 2" },
  ],
  celebritySeeding: [
    { celebrity: "Priyanka Sharma (Actor)", event: "Film Premiere", pieces: "Eternal Hope Ring", reach: "18M", status: "Confirmed" },
    { celebrity: "Ananya Mehta (Fashion Icon)", event: "Met Gala After-Party", pieces: "Celestial Necklace", reach: "12M", status: "Gifting Sent" },
    { celebrity: "Rohan Kapoor (Cricketer)", event: "Award Ceremony", pieces: "Whisper Bracelet", reach: "8M", status: "Outreach" },
    { celebrity: "Dia Mirza (Activist)", event: "Sustainability Summit", pieces: "Ethical Diamond Studs", reach: "6M", status: "Confirmed" },
  ],
  awardEntries: [
    { award: "India Jewellery Design Awards", category: "Sustainable Luxury Brand", status: "Shortlisted", date: "Feb 2026" },
    { award: "E-Commerce Awards India", category: "Best Customer Experience", status: "Nominated", date: "Mar 2026" },
    { award: "Luxe Digital Awards", category: "Digital Innovation in Jewelry", status: "Submitted", date: "Apr 2026" },
  ],
};

export function InfluencerPartnerships() {
  const { executeAction, automations } = useAction();

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Active Partnerships", value: influencerData.activePartnerships },
          { label: "Total Reach", value: (influencerData.totalReach / 1000000).toFixed(1) + "M" },
          { label: "Avg Engagement", value: `${influencerData.avgEngagement}%` },
          { label: "Influencer ROI", value: `${influencerData.roi}x` },
          { label: "PR Placements (YTD)", value: "12" },
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
        module="influencer"
        primary={{
          label: "Send Outreach",
          icon: Send,
          onClick: () => executeAction({
            action: "Send Outreach",
            module: "influencer",
            detail: "Opening influencer outreach with AI-personalized message templates",
            successMsg: "Outreach campaign initiated",
          }),
        }}
        actions={[
          {
            label: "Track Codes",
            icon: Tag,
            onClick: () => executeAction({
              action: "Track Codes",
              module: "influencer",
              detail: "Generating influencer coupon code performance report",
              successMsg: "Coupon report generated",
            }),
          },
          {
            label: "Export Report",
            icon: Download,
            onClick: () => executeAction({
              action: "Export Report",
              module: "influencer",
              detail: "Exporting influencer & PR performance report",
              successMsg: "Report exported",
            }),
          },
          {
            label: "Create Partnership",
            icon: Plus,
            onClick: () => executeAction({
              action: "Create Partnership",
              module: "influencer",
              detail: "Creating new influencer partnership brief",
              successMsg: "Partnership brief created",
            }),
          },
        ]}
      />

      {/* Tier Analysis: Nano/Micro vs Macro */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Influencer Tier Analysis — Nano/Micro Outperform Macro</CardTitle>
          <CardDescription className="text-xs">In jewelry commerce, trust and authenticity drive conversions more than raw reach. Nano and micro creators generate 8.4x and 6.8x ROAS respectively, compared to 1.8x for mega influencers.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={tierConfig} className="h-[200px] sm:h-[240px] lg:h-[280px] w-full">
            <BarChart data={tierAnalysis}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="tier" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="roas" fill="oklch(0.65 0.18 65)" radius={[4, 4, 0, 0]} barSize={28} />
              <Bar dataKey="avgEngagement" fill="oklch(0.55 0.12 200)" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tier Detail Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {tierAnalysis.map((t, i) => (
          <Card key={t.tier} className={`border-border/50 ${i < 2 ? "ring-1 ring-emerald-500/30" : ""}`}>
            <CardContent className="p-3">
              <p className="text-xs font-semibold mb-2">{t.tier}</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Partners</span>
                  <span className="font-medium tabular-nums">{t.partners}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Engagement</span>
                  <span className="font-medium tabular-nums">{t.avgEngagement}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Avg Cost</span>
                  <span className="font-medium tabular-nums">${t.avgCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">ROAS</span>
                  <span className={`font-bold tabular-nums ${t.roas >= 5 ? "text-emerald-500" : t.roas >= 3 ? "text-amber-500" : "text-muted-foreground"}`}>
                    {t.roas}x
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">CPE</span>
                  <span className="font-medium tabular-nums">${t.cpe}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${t.share}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">{t.share}% of program</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Partnerships */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Active Partnerships</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Partner</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Platform</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Followers</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Reach</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Eng</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Revenue</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {influencerData.partnerships.map((p) => (
                  <tr key={p.name} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-2 font-medium">{p.name}</td>
                    <td className="py-2.5 px-2 text-muted-foreground">{p.platform}</td>
                    <td className="py-2.5 px-2 text-center">
                      <Badge variant={p.type === "Mega" || p.type === "Macro" ? "default" : "outline"} className="text-[10px]">
                        {p.type}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2 text-center tabular-nums">{p.followers}</td>
                    <td className="py-2.5 px-2 text-center tabular-nums">{(p.reach / 1000000).toFixed(1)}M</td>
                    <td className="py-2.5 px-2 text-center tabular-nums">{p.engagement}%</td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-medium">${(p.revenue / 1000).toFixed(0)}K</td>
                    <td className="py-2.5 px-2 text-center">
                      <Badge variant={p.status === "Active" ? "default" : "secondary"} className="text-[10px]">
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* PR Strategy Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Editorial Placements */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">PR — Editorial Placements</CardTitle>
            <CardDescription className="text-xs">Earned media coverage in tier-1 and tier-2 publications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {prStrategy.editorial.map((e) => (
              <div key={e.publication} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{e.publication}</p>
                    <Badge variant="outline" className="text-[10px]">{e.tier}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{e.type} · {e.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge
                    variant={e.status === "Published" ? "default" : e.status === "Confirmed" ? "secondary" : "outline"}
                    className="text-[10px]"
                  >
                    {e.status}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{e.impact}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Celebrity Seeding & Awards */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">PR — Celebrity Seeding</CardTitle>
              <CardDescription className="text-xs">Strategic gifting for red carpet and high-visibility events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {prStrategy.celebritySeeding.map((c) => (
                <div key={c.celebrity} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{c.celebrity}</p>
                    <p className="text-[10px] text-muted-foreground">{c.event} · {c.pieces}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge
                      variant={c.status === "Confirmed" ? "default" : c.status === "Gifting Sent" ? "secondary" : "outline"}
                      className="text-[10px]"
                    >
                      {c.status}
                    </Badge>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{c.reach} reach</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">PR — Award Entries</CardTitle>
              <CardDescription className="text-xs">Industry recognition and credibility building</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {prStrategy.awardEntries.map((a) => (
                <div key={a.award} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20">
                  <div>
                    <p className="text-sm font-medium">{a.award}</p>
                    <p className="text-[10px] text-muted-foreground">{a.category}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={a.status === "Shortlisted" ? "default" : "outline"} className="text-[10px]">{a.status}</Badge>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Collaborations */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Upcoming Collaborations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {influencerData.upcomingCollaborations.map((c) => (
            <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span>{c.partners} partners</span>
                  <span>Budget: ${(c.budget / 1000).toFixed(0)}K</span>
                </div>
              </div>
              <Badge
                variant={c.status === "Confirmed" ? "default" : c.status === "Planning" ? "secondary" : "outline"}
                className="text-[10px]"
              >
                {c.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Coupon Tracking */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Coupon & Code Tracking</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">Revenue attributed to influencer-specific promo codes</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Influencer</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Code</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Uses</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Avg Discount</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Sophia Chen", code: "SOPHIA15", uses: 342, revenue: 48600, discount: "15%", roas: 7.2 },
                  { name: "JewelryByMaya", code: "MAYA20", uses: 520, revenue: 52400, discount: "20%", roas: 8.8 },
                  { name: "The Ring Edit", code: "RING10", uses: 186, revenue: 31200, discount: "10%", roas: 6.4 },
                  { name: "BridalDreams", code: "BRIDE25", uses: 128, revenue: 28400, discount: "25%", roas: 5.2 },
                  { name: "StyleWithRia", code: "RIA10", uses: 412, revenue: 38600, discount: "10%", roas: 3.8 },
                ].map((c) => (
                  <tr key={c.code} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-2 font-medium text-xs">{c.name}</td>
                    <td className="py-2.5 px-2">
                      <Badge variant="outline" className="text-[10px] font-mono">{c.code}</Badge>
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums">{c.uses}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-medium">${(c.revenue / 1000).toFixed(1)}K</td>
                    <td className="py-2.5 px-2 text-right tabular-nums">{c.discount}</td>
                    <td className="py-2.5 px-2 text-right">
                      <Badge variant={c.roas >= 7 ? "default" : "secondary"} className="text-[10px]">{c.roas}x</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Fake Engagement Detection */}
      <Card className="border-border/50 border-red-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            <CardTitle className="text-base font-semibold">Engagement Authenticity Check</CardTitle>
            </div>
          <p className="text-xs text-muted-foreground">AI-powered detection of suspicious engagement patterns across partners</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Sophia Chen", platform: "Instagram", score: 92, flag: "Clean", details: "Organic engagement patterns. High save-to-like ratio confirms genuine interest." },
            { name: "JewelryByMaya", platform: "TikTok", score: 88, flag: "Clean", details: "Strong comment quality. Audience demographics match target segment." },
            { name: "Elegant Living Blog", platform: "Blog", score: 95, flag: "Verified", details: "Direct traffic patterns confirm real readership. Low bounce rate on referral links." },
            { name: "StyleWithRia", platform: "Instagram", score: 62, flag: "Watch", details: "Spike in likes from bot-prone regions (28% from SE Asia). Comment sentiment analysis mixed." },
            { name: "BridalDreams", platform: "Pinterest", score: 78, flag: "Minor", details: "Higher-than-average repin velocity but engagement quality is acceptable." },
          ].map((check) => (
            <div key={check.name} className={`flex items-start gap-3 p-3 rounded-lg ${
              check.flag === "Watch" ? "bg-red-500/5 border border-red-500/10" : "bg-muted/20"
            }`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                check.score >= 85 ? "bg-emerald-500/10 text-emerald-600" :
                check.score >= 70 ? "bg-amber-500/10 text-amber-600" :
                "bg-red-500/10 text-red-600"
              }`}>
                {check.score}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{check.name}</p>
                  <Badge variant="outline" className="text-[10px]">{check.platform}</Badge>
                  {check.flag === "Watch" && <AlertTriangle className="h-3 w-3 text-red-500" />}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{check.details}</p>
              </div>
              <Badge
                variant={check.flag === "Clean" || check.flag === "Verified" ? "default" : check.flag === "Watch" ? "destructive" : "secondary"}
                className="text-[10px] shrink-0"
              >
                {check.flag}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strategy Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-1">TikTok Outperforming Instagram</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              TikTok creator partnerships are generating 9.8% engagement vs 7.2% on Instagram. Consider reallocating 15% of Instagram budget to TikTok for Q2 campaigns, especially for product launch reveal content.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-1">Shift Budget to Nano/Micro Tiers</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our data shows 63% of influencer program revenue comes from nano and micro creators who represent just 35% + 28% of the partner count. The recommended budget allocation should shift from the current 40/30/20/8/2 to 30/30/20/12/8 to invest more in mid-tier while maintaining the nano/micro base.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
