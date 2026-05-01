"use client";

import { competitiveData, auctionInsightsData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ScatterChart, Scatter, ZAxis, ResponsiveContainer,
} from "recharts";
import { Gavel, FileText, Bell, Plus, Download } from "lucide-react";
import { useAction } from "@/lib/action-context";
import { ActionBar } from "./action-bar";
import { Button } from "@/components/ui/button";

// Positioning map data: price tier (x) vs digital brand strength (y)
const positioningData = [
  { name: "Varni Jewels", priceTier: 72, digitalStrength: 82, size: 400, isYou: true },
  { name: "Tanishq", priceTier: 55, digitalStrength: 68, size: 600, isYou: false },
  { name: "BlueStone", priceTier: 65, digitalStrength: 78, size: 380, isYou: false },
  { name: "CaratLane", priceTier: 45, digitalStrength: 74, size: 450, isYou: false },
  { name: "Kalyan", priceTier: 40, digitalStrength: 42, size: 520, isYou: false },
  { name: "Malabar", priceTier: 38, digitalStrength: 38, size: 480, isYou: false },
  { name: "Senco", priceTier: 35, digitalStrength: 35, size: 300, isYou: false },
  { name: "PC Jeweller", priceTier: 32, digitalStrength: 45, size: 400, isYou: false },
];

// Documented moats
const moats = [
  {
    title: "89ms Page Load Speed",
    category: "Performance",
    description: "Our site loads in 89ms — 4x faster than the industry average of 360ms. This directly impacts conversion: every 100ms improvement drives a 7% increase in jewelry e-commerce conversions.",
    metric: "89ms",
    benchmark: "Industry: 360ms",
    impact: "+7% conversion per 100ms improvement",
    color: "emerald",
  },
  {
    title: "AI-Powered Search & Recommendations",
    category: "Technology",
    description: "Our proprietary AI search understands natural language queries like 'gold necklace under 500 for anniversary' and returns relevant results with visual similarity matching. Search-to-purchase conversion is 2.4x higher than category average.",
    metric: "2.4x",
    benchmark: "Industry avg: 1.0x",
    impact: "28% of revenue comes through AI search",
    color: "primary",
  },
  {
    title: "NPS Score of 62",
    category: "Customer Loyalty",
    description: "Our Net Promoter Score of 62 is among the highest in jewelry e-commerce (industry avg: 38). This translates to organic word-of-mouth, 14% referral rate, and significantly lower CAC for repeat customers.",
    metric: "62",
    benchmark: "Industry avg: 38",
    impact: "14% referral rate, 42% repeat purchase rate",
    color: "amber",
  },
  {
    title: "Ethical Sourcing Full Transparency",
    category: "Brand Trust",
    description: "Blockchain-verified supply chain with full provenance tracking from mine to customer. 94% of customers cite ethical sourcing as a top-3 purchase driver. This is our strongest differentiation vs traditional jewelers.",
    metric: "94%",
    benchmark: "Competitors: ~60% sourcing transparency",
    impact: "Strongest brand differentiator in surveys",
    color: "primary",
  },
  {
    title: "First-Party Data Asset (245K profiles)",
    category: "Data & Personalization",
    description: "Rich first-party data including purchase history, occasion dates, preference profiles, and engagement signals. Powers 1:1 personalization across email, WhatsApp, site, and ads — reducing CAC by 32% vs cold audiences.",
    metric: "245K",
    benchmark: "Typical competitor: 80-120K",
    impact: "32% lower CAC vs cold audiences",
    color: "emerald",
  },
];

const quadrantLabels = [
  { x: 20, y: 85, text: "Digital Challenger" },
  { x: 75, y: 85, text: "Digital Leader" },
  { x: 20, y: 15, text: "Traditional Value" },
  { x: 75, y: 15, text: "Premium Heritage" },
];

export function CompetitiveIntel() {
  const { executeAction, automations } = useAction();

  const sovData = competitiveData.competitors.map((c, i) => ({
    name: c.name,
    sov: c.sov,
    fill: i === 0 ? "oklch(0.65 0.18 65)" : "oklch(0.7 0.05 80)",
  }));

  return (
    <div className="space-y-6">
      {/* Market Position */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Market Share", value: `${competitiveData.marketShare}%` },
          { label: "Share of Voice", value: `${competitiveData.shareOfVoice}%` },
          { label: "Competitive Set", value: "8 brands tracked" },
          { label: "Price Position", value: "Accessible Luxury" },
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
        module="competitive"
        primary={{
          label: "Generate Intel Report",
          icon: FileText,
          onClick: () => executeAction({
            action: "Generate Intel Report",
            module: "competitive",
            detail: "Generating competitive intelligence report with market positioning analysis",
            successMsg: "Intel report generated",
          }),
        }}
        actions={[
          {
            label: "Set Price Alert",
            icon: Bell,
            onClick: () => executeAction({
              action: "Set Price Alert",
              module: "competitive",
              detail: "Configuring competitor price change alerts",
              successMsg: "Price alerts configured",
            }),
          },
          {
            label: "Add Competitor",
            icon: Plus,
            onClick: () => executeAction({
              action: "Add Competitor",
              module: "competitive",
              detail: "Adding new competitor to tracking set",
              successMsg: "Competitor added",
            }),
          },
          {
            label: "Export Data",
            icon: Download,
            onClick: () => executeAction({
              action: "Export Data",
              module: "competitive",
              detail: "Exporting competitive landscape data",
              successMsg: "Data exported",
            }),
          },
        ]}
      />

      {/* Positioning Map: Price Tier vs Digital Brand Strength */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Competitive Positioning Map</CardTitle>
          <p className="text-xs text-muted-foreground">Price Tier (x-axis) vs Digital Brand Strength (y-axis). Bubble size = estimated market presence.</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[280px] sm:h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis type="number" dataKey="priceTier" name="Price Tier" domain={[20, 90]} tick={{ fontSize: 10 }} label={{ value: "Price Tier (Higher = More Premium)", position: "bottom", fontSize: 10, offset: 0 }} />
                <YAxis type="number" dataKey="digitalStrength" name="Digital Strength" domain={[20, 95]} tick={{ fontSize: 10 }} label={{ value: "Digital Brand Strength", angle: -90, position: "insideLeft", fontSize: 10, offset: 10 }} />
                <ZAxis type="number" dataKey="size" range={[80, 500]} />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="border-border/50 bg-background rounded-lg border px-3 py-2 text-xs shadow-xl">
                        <p className="font-semibold">{d.name} {d.isYou && <Badge className="ml-1 text-[10px]">You</Badge>}</p>
                        <p className="text-muted-foreground">Price Tier: {d.priceTier} · Digital: {d.digitalStrength}</p>
                      </div>
                    );
                  }}
                />
                {positioningData.map((d, i) => (
                  <Scatter
                    key={d.name}
                    name={d.name}
                    data={[d]}
                    fill={d.isYou ? "oklch(0.65 0.18 65)" : i < 4 ? "oklch(0.55 0.1 200)" : "oklch(0.7 0.05 80)"}
                    stroke={d.isYou ? "oklch(0.65 0.18 65)" : "none"}
                    strokeWidth={d.isYou ? 2 : 0}
                    style={{ filter: d.isYou ? "drop-shadow(0 0 6px oklch(0.65 0.18 65))" : "none" }}
                  />
                ))}
                {/* Quadrant labels */}
                <text x="25%" y="8%" textAnchor="middle" fontSize="10" fill="oklch(0.6 0.05 200)" fontWeight="600">Digital Challenger</text>
                <text x="78%" y="8%" textAnchor="middle" fontSize="10" fill="oklch(0.6 0.05 200)" fontWeight="600">Digital Leader</text>
                <text x="25%" y="96%" textAnchor="middle" fontSize="10" fill="oklch(0.6 0.05 200)" fontWeight="600">Traditional Value</text>
                <text x="78%" y="96%" textAnchor="middle" fontSize="10" fill="oklch(0.6 0.05 200)" fontWeight="600">Premium Heritage</text>
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {positioningData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${d.isYou ? "bg-primary ring-2 ring-primary/30" : d.name === "Kalyan" || d.name === "Malabar" || d.name === "Senco" || d.name === "PC Jeweller" ? "bg-muted-foreground/40" : "bg-primary/40"}`} />
                <span className={`text-[10px] ${d.isYou ? "font-semibold" : "text-muted-foreground"}`}>{d.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Share of Voice Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Share of Voice Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ sov: { label: "SOV %", color: "oklch(0.65 0.18 65)" } }} className="h-[200px] sm:h-[240px] lg:h-[280px] w-full">
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

      {/* Competitor Landscape Table */}
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
                  <tr key={c.name} className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${c.name === "Varni Jewels" ? "bg-primary/5" : ""}`}>
                    <td className="py-2.5 px-2 font-medium">
                      {c.name}
                      {c.name === "Varni Jewels" && <Badge className="ml-1 text-[10px]">You</Badge>}
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

      {/* ========== RYZE AI: Auction Insights ========== */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Gavel className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Auction Insights</CardTitle>
            <Badge variant="outline" className="text-[10px]">AI Powered</Badge>
          </div>
          <p className="text-xs text-muted-foreground">How often your ads appear alongside competitors in search auctions</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Brand</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Impr. Share</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Overlap Rate</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Avg. Position</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Share Bar</th>
                </tr>
              </thead>
              <tbody>
                {auctionInsightsData.map((item) => (
                  <tr key={item.brand} className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${item.isYou ? "bg-primary/5" : ""}`}>
                    <td className="py-2.5 px-3 font-medium">
                      {item.brand}
                      {item.isYou && <Badge className="ml-1 text-[10px]">You</Badge>}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex items-center justify-center w-12 h-6 rounded text-xs font-bold ${
                        item.impressionShare >= 50 ? "bg-emerald-500/10 text-emerald-600" :
                        item.impressionShare >= 30 ? "bg-amber-500/10 text-amber-600" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {item.impressionShare}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center tabular-nums text-muted-foreground">
                      {item.overlapRate !== null ? `${item.overlapRate}%` : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge variant={item.avgPosition <= 1.5 ? "default" : item.avgPosition <= 2.5 ? "secondary" : "outline"} className="text-[10px]">
                        {item.avgPosition.toFixed(1)}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 min-w-[80px] sm:min-w-[120px]">
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${item.isYou ? "bg-primary" : "bg-primary/40"}`}
                          style={{ width: `${item.impressionShare}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Documented Moats */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Documented Competitive Moats</CardTitle>
          <p className="text-xs text-muted-foreground">Structural advantages that are difficult for competitors to replicate</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {moats.map((m) => (
            <div key={m.title} className="p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    m.color === "emerald" ? "bg-emerald-500/10 text-emerald-600" :
                    m.color === "amber" ? "bg-amber-500/10 text-amber-600" :
                    "bg-primary/10 text-primary"
                  }`}>
                    {m.category}
                  </span>
                  <h3 className="text-sm font-semibold">{m.title}</h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-lg font-bold tabular-nums">{m.metric}</span>
                    <span className="text-[10px] text-muted-foreground block">{m.benchmark}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
              <div className="mt-2 p-2 rounded bg-background/50 border border-border/30">
                <p className="text-[10px] text-primary font-medium">{m.impact}</p>
              </div>
            </div>
          ))}
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
                  <span className="text-sm font-medium w-28 sm:w-36 shrink-0">{p.category}</span>
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
