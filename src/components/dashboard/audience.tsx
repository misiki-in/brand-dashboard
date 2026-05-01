"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";

/* ─── Chart Configs ─────────────────────────────────────────── */

const cityConfig = {
  index: {
    label: "Market Index",
    color: "oklch(0.65 0.18 65)",
  },
};

const genderConfig = {
  female: { label: "Female", color: "oklch(0.65 0.2 340)" },
  male: { label: "Male", color: "oklch(0.55 0.15 250)" },
  nonBinary: { label: "Non-binary", color: "oklch(0.7 0.12 160)" },
};

const ageConfig = {
  age: { label: "Share", color: "oklch(0.65 0.18 65)" },
};

const incomeConfig = {
  income: { label: "Share", color: "oklch(0.6 0.15 200)" },
};

/* ─── Data ──────────────────────────────────────────────────── */

const personas = [
  {
    name: "The Bride",
    share: 28,
    emoji: "💍",
    avgSpend: "₹1,20,000",
    topCategories: ["Bridal Sets", "Engagement Rings", "Gold Bands"],
    ageRange: "22–30",
    channels: ["Instagram", "Pinterest", "In-Store"],
    quote: "This is my forever piece — I want it to tell our story.",
  },
  {
    name: "The Gifter",
    share: 24,
    emoji: "🎁",
    avgSpend: "₹45,000",
    topCategories: ["Necklaces", "Earrings", "Gift Sets"],
    ageRange: "28–45",
    channels: ["Word of Mouth", "Google", "Instagram"],
    quote: "I want something that makes them feel truly special.",
  },
  {
    name: "The Self-Treat",
    share: 18,
    emoji: "✨",
    avgSpend: "₹32,000",
    topCategories: ["Everyday Wear", "Tennis Bracelets", "Stackable Rings"],
    ageRange: "25–38",
    channels: ["Instagram", "Website", "Influencers"],
    quote: "I work hard — I deserve a little luxury for myself.",
  },
  {
    name: "The Collector / HNI",
    share: 12,
    emoji: "👑",
    avgSpend: "₹4,50,000",
    topCategories: ["Polki / Kundan", "Heritage Pieces", "Solitaires"],
    ageRange: "35–55",
    channels: ["VIP Events", "Personal Stylist", "WhatsApp"],
    quote: "Exclusivity and provenance matter more than price.",
  },
  {
    name: "The Conscious Buyer",
    share: 10,
    emoji: "🌿",
    avgSpend: "₹28,000",
    topCategories: ["Lab-Grown", "Recycled Gold", "Minimalist"],
    ageRange: "20–32",
    channels: ["TikTok / Reels", "Sustainability Blogs", "D2C Site"],
    quote: "Beauty shouldn't come at the planet's expense.",
  },
  {
    name: "The B2B / Corporate",
    share: 8,
    emoji: "🏢",
    avgSpend: "₹2,10,000",
    topCategories: ["Corporate Gifting", "Bulk Orders", "Custom Trophies"],
    ageRange: "30–50",
    channels: ["LinkedIn", "Direct Outreach", "Trade Shows"],
    quote: "Brand-aligned gifts strengthen our client relationships.",
  },
];

const genderData = [
  { name: "Female", value: 72, fill: "oklch(0.65 0.2 340)" },
  { name: "Male", value: 24, fill: "oklch(0.55 0.15 250)" },
  { name: "Non-binary", value: 4, fill: "oklch(0.7 0.12 160)" },
];

const ageData = [
  { name: "18–24", value: 12, fill: "oklch(0.75 0.14 90)" },
  { name: "25–34", value: 38, fill: "oklch(0.65 0.18 65)" },
  { name: "35–44", value: 28, fill: "oklch(0.58 0.16 45)" },
  { name: "45–54", value: 14, fill: "oklch(0.6 0.12 280)" },
  { name: "55+", value: 8, fill: "oklch(0.65 0.1 200)" },
];

const incomeData = [
  { name: "<$50K", value: 8, fill: "oklch(0.72 0.1 150)" },
  { name: "$50–100K", value: 32, fill: "oklch(0.65 0.16 85)" },
  { name: "$100–200K", value: 38, fill: "oklch(0.6 0.18 55)" },
  { name: "$200K+", value: 22, fill: "oklch(0.55 0.2 310)" },
];

const cityData = [
  { city: "Mumbai", index: 145, fill: "oklch(0.55 0.22 55)" },
  { city: "Delhi NCR", index: 132, fill: "oklch(0.58 0.2 60)" },
  { city: "Bangalore", index: 128, fill: "oklch(0.6 0.18 65)" },
  { city: "Hyderabad", index: 118, fill: "oklch(0.62 0.16 72)" },
  { city: "Chennai", index: 112, fill: "oklch(0.65 0.14 78)" },
  { city: "Pune", index: 108, fill: "oklch(0.67 0.12 85)" },
  { city: "Kolkata", index: 95, fill: "oklch(0.7 0.08 200)" },
  { city: "Jaipur", index: 88, fill: "oklch(0.72 0.06 260)" },
];

const insights = [
  {
    tag: "Growth",
    tagColor: "bg-emerald-500/10 text-emerald-600",
    title: "Bridal Segment Expansion",
    desc: "The Bride persona drives 28% of revenue. With wedding season campaigns and Pinterest-funnel optimization, this segment shows 18% YoY growth — our single largest opportunity for Q3.",
  },
  {
    tag: "Emerging",
    tagColor: "bg-amber-500/10 text-amber-600",
    title: "Rise of the Conscious Buyer",
    desc: "Lab-grown and recycled-gold searches are up 64% YoY. While only 10% today, this segment is the fastest-growing. A dedicated sustainability landing page could capture early demand.",
  },
  {
    tag: "Strategy",
    tagColor: "bg-primary/10 text-primary",
    title: "HNI Retention Gap",
    desc: "Collectors represent 12% of customers but 34% of revenue. LTV is 6× the average, yet churn hit 12% last quarter. Accelerating VIP event cadence and personal stylist touchpoints is critical.",
  },
  {
    tag: "Geography",
    tagColor: "bg-violet-500/10 text-violet-600",
    title: "Tier-2 City Penetration",
    desc: "Pune, Hyderabad, and Jaipur collectively show 22% index growth vs last year. Geo-targeted digital campaigns and pop-up trunk shows in these markets could unlock the next wave of acquisition.",
  },
];

/* ─── Helpers ───────────────────────────────────────────────── */

function personaGradient(share: number) {
  if (share >= 24) return "from-primary/10 via-primary/5 to-transparent";
  if (share >= 12) return "from-amber-500/10 via-amber-500/5 to-transparent";
  return "from-muted/60 via-muted/30 to-transparent";
}

/* ─── Component ─────────────────────────────────────────────── */

export function Audience() {
  return (
    <div className="space-y-6">
      {/* ── Section Heading ──────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Audience Intelligence</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Deep-dive into buyer personas, demographics, and geographic market indexing
          for the luxury jewelry customer base.
        </p>
      </div>

      {/* ── Buyer Personas ───────────────────────────────── */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Buyer Personas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {personas.map((p) => (
              <div
                key={p.name}
                className={`rounded-xl border border-border/40 bg-gradient-to-br ${personaGradient(p.share)} p-5 hover:shadow-md transition-shadow`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {p.emoji}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold leading-tight">
                        {p.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Ages {p.ageRange}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs font-bold tabular-nums bg-background/80 backdrop-blur"
                  >
                    {p.share}%
                  </Badge>
                </div>

                {/* Avg Spend */}
                <div className="mb-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Avg Order Value
                  </p>
                  <p className="text-lg font-bold tabular-nums">{p.avgSpend}</p>
                </div>

                {/* Top Categories */}
                <div className="mb-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                    Top Categories
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {p.topCategories.map((cat) => (
                      <Badge
                        key={cat}
                        variant="outline"
                        className="text-[10px] font-normal"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Preferred Channels */}
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Preferred Channels
                  </p>
                  <p className="text-xs">{p.channels.join(" · ")}</p>
                </div>

                {/* Quote */}
                <blockquote className="border-l-2 border-primary/40 pl-3">
                  <p className="text-xs italic text-muted-foreground leading-relaxed">
                    &ldquo;{p.quote}&rdquo;
                  </p>
                </blockquote>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Demographic Splits ───────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Gender */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Gender Split
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={genderConfig} className="mx-auto aspect-square max-h-[180px] sm:max-h-[220px] lg:max-h-[240px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {genderData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center gap-5 mt-2">
              {genderData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: d.fill }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {d.name}{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {d.value}%
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Age */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={ageConfig} className="mx-auto aspect-square max-h-[180px] sm:max-h-[220px] lg:max-h-[240px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {ageData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2">
              {ageData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: d.fill }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {d.name}{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {d.value}%
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Income */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Income Bracket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={incomeConfig} className="mx-auto aspect-square max-h-[180px] sm:max-h-[220px] lg:max-h-[240px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {incomeData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2">
              {incomeData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: d.fill }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {d.name}{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {d.value}%
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── City-Level Market Index ──────────────────────── */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            City-Level Market Index
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Purchase propensity indexed against national average (base = 100).
            Values above 100 indicate above-average demand concentration.
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={cityConfig} className="h-[220px] sm:h-[300px] lg:h-[360px] w-full">
            <BarChart
              data={cityData}
              layout="vertical"
              margin={{ top: 4, right: 32, bottom: 4, left: 8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="opacity-30"
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 160]}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `${v}`}
              />
              <YAxis
                type="category"
                dataKey="city"
                tick={{ fontSize: 12 }}
                width={80}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="index" radius={[0, 6, 6, 0]} barSize={28}>
                {cityData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* ── Audience Insights ────────────────────────────── */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Strategic Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((item) => (
              <div
                key={item.title}
                className="flex gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${item.tagColor}`}
                >
                  {item.tag}
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
