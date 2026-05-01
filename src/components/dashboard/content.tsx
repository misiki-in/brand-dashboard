"use client";

import { contentData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
} from "recharts";

const contentTypeConfig = {
  engagement: { label: "Engagement %", color: "oklch(0.65 0.18 65)" },
  conversionAssist: { label: "Conv. Assist %", color: "oklch(0.55 0.12 200)" },
};

const contentPillars = [
  {
    name: "Craftsmanship & Heritage",
    icon: "Hammer",
    share: 30,
    engagement: 5.8,
    conversionAssist: 4.2,
    description: "Behind-the-scenes artisan stories, material sourcing journeys, and the making-of process. This pillar taps into the jewelry buyer's desire to understand the human skill behind each piece.",
    examples: ["Behind the Craft video series", "Artisan spotlight interviews", "Raw material to finished piece"],
    mappedPsyche: "Trust & Authenticity — Jewelry buyers need to believe in the provenance and quality of what they're purchasing, especially at premium price points.",
  },
  {
    name: "Aspirational Lifestyle",
    icon: "Sparkles",
    share: 25,
    engagement: 7.4,
    conversionAssist: 3.1,
    description: "Styled editorial content showing jewelry in real-life moments — date nights, celebrations, milestones. Focus on the emotional context rather than product features.",
    examples: ["Styled lookbooks", "Milestone moment campaigns", "Lifestyle Reels and carousels"],
    mappedPsyche: "Identity & Self-Expression — Buyers don't just purchase jewelry; they invest in how it makes them feel and the story it tells about who they are.",
  },
  {
    name: "Education & Guides",
    icon: "BookOpen",
    share: 20,
    engagement: 4.2,
    conversionAssist: 6.8,
    description: "Definitive guides on choosing metals, understanding gemstone quality, ring sizing, and care tips. Positions the brand as the trusted expert advisor.",
    examples: ["Engagement Ring Buying Guide", "Gold vs Platinum comparison", "Gemstone care 101"],
    mappedPsyche: "Confidence & Risk Reduction — Jewelry is a high-consideration purchase. Buyers seek expert guidance to feel confident in their decision and minimize buyer's remorse.",
  },
  {
    name: "Sustainability & Ethics",
    icon: "Leaf",
    share: 15,
    engagement: 5.1,
    conversionAssist: 3.8,
    description: "Ethical sourcing stories, lab-grown diamond education, recycling programs, and carbon-neutral commitments. Appeals to the conscious luxury consumer.",
    examples: ["Our ethical sourcing map", "Lab-grown vs mined: the facts", "Sustainability annual report"],
    mappedPsyche: "Values Alignment — Especially for Gen Z and Millennial buyers, purchasing from a brand that shares their values is non-negotiable, not a bonus.",
  },
  {
    name: "Community & Social Proof",
    icon: "Users",
    share: 10,
    engagement: 8.2,
    conversionAssist: 5.4,
    description: "Customer stories, UGC galleries, proposal videos, and milestone celebrations. Real customers wearing and loving the jewelry.",
    examples: ["Customer proposal videos", "UGC galleries", "Review highlights and milestones"],
    mappedPsyche: "Validation & Belonging — Seeing others like them choose and love the brand reduces perceived risk and creates aspirational belonging.",
  },
];

const voiceGuidelines = {
  tone: ["Warm but confident", "Sophisticated never stuffy", "Inspirational not pushy", "Knowledgeable not lecturing"],
  vocabulary: {
    use: ["Curated", "Handcrafted", "Timeless", "Luminous", "Ethically sourced", "Your story", "Celebrate"],
    avoid: ["Cheap", "Deal", "Bargain", "Sale frenzy", "Buy now", "Hurry", "Mass-produced"],
  },
  ctaStyle: "Soft invitation over hard sell. Prefer 'Discover your piece' over 'Shop now.' Use 'Begin your journey' for bridal, 'Treat yourself' for self-purchase, and 'Find the perfect gift' for gifting occasions.",
};

const pillarRadarData = contentPillars.map((p) => ({
  pillar: p.name.split(" & ")[0].split(" ")[0],
  engagement: p.engagement,
  conversionAssist: p.conversionAssist,
}));

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

      {/* Content Pillars — Mapped to Purchase Psyche */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Content Pillars — Mapped to Jewelry Purchase Psyche</CardTitle>
          <p className="text-xs text-muted-foreground">Five pillars aligned with how jewelry buyers think, feel, and decide</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contentPillars.map((pillar, i) => (
              <div key={pillar.name} className="p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors border-l-4" style={{ borderLeftColor: `oklch(0.65 ${0.12 + i * 0.02} ${65 + i * 15})` }}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold">{pillar.name}</h3>
                    <Badge variant="outline" className="text-[10px]">{pillar.share}% of content</Badge>
                  </div>
                  <div className="flex gap-3 text-xs shrink-0">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {pillar.engagement}% eng
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "oklch(0.55 0.12 200)" }} />
                      {pillar.conversionAssist}% conv-assist
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{pillar.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {pillar.examples.map((ex) => (
                    <span key={ex} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{ex}</span>
                  ))}
                </div>
                <div className="mt-2 p-2 rounded bg-background/50 border border-border/30">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Purchase Psyche: </span>{pillar.mappedPsyche}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Pillar Radar: Engagement vs Conversion-Assist */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Pillar Performance: Engagement vs Conversion-Assist</CardTitle>
            <p className="text-xs text-muted-foreground">Community & Social Proof leads engagement; Education drives conversions</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={contentTypeConfig} className="mx-auto aspect-square max-h-[300px]">
              <RadarChart data={pillarRadarData} outerRadius="75%">
                <PolarGrid strokeDasharray="3 3" className="opacity-30" />
                <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Engagement" dataKey="engagement" stroke="oklch(0.65 0.18 65)" fill="oklch(0.65 0.18 65)" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Conv. Assist" dataKey="conversionAssist" stroke="oklch(0.55 0.12 200)" fill="oklch(0.55 0.12 200)" fillOpacity={0.15} strokeWidth={2} strokeDasharray="4 4" />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Brand Voice Guidelines */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Brand Voice Guidelines</CardTitle>
            <p className="text-xs text-muted-foreground">How Lumière Jewels speaks across every touchpoint</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tone</p>
              <div className="flex flex-wrap gap-2">
                {voiceGuidelines.tone.map((t) => (
                  <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">{t}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold text-emerald-600 mb-1.5">Words We Use</p>
                <div className="flex flex-wrap gap-1">
                  {voiceGuidelines.vocabulary.use.map((w) => (
                    <span key={w} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">{w}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-500 mb-1.5">Words We Avoid</p>
                <div className="flex flex-wrap gap-1">
                  {voiceGuidelines.vocabulary.avoid.map((w) => (
                    <span key={w} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 line-through">{w}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold mb-1">CTA Style</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{voiceGuidelines.ctaStyle}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Discover your piece", "Begin your journey", "Treat yourself", "Find the perfect gift", "Explore the collection"].map((cta) => (
                  <span key={cta} className="text-[10px] px-2 py-0.5 rounded bg-background border border-border/50 text-foreground">{cta}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
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
  );
}
