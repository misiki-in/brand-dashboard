"use client";

import { whatsappData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "./kpi-components";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from "recharts";
import { MessageCircle, Zap, Bot, TrendingUp, Phone, ArrowRight } from "lucide-react";

export function WhatsAppCommerceHub() {
  const COLORS = ["oklch(0.55 0.18 145)", "oklch(0.65 0.18 65)", "oklch(0.6 0.15 340)", "oklch(0.55 0.12 200)", "oklch(0.7 0.1 140)", "oklch(0.6 0.2 30)"];

  const conversionData = whatsappData.conversationToSale.topCategories.map((c, i) => ({
    ...c,
    fill: COLORS[i % COLORS.length],
  }));

  const broadcastBarData = whatsappData.broadcastCampaigns.map((c) => ({
    name: c.name.length > 20 ? c.name.slice(0, 20) + "..." : c.name,
    revenue: c.revenue / 1000,
    conversions: c.conversions,
  }));

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="border-border/50 bg-gradient-to-br from-card via-card to-green-500/5">
        <CardContent className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                <MessageCircle className="h-7 w-7 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">WhatsApp Commerce Hub</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {whatsappData.totalContacts.toLocaleString()} contacts · {whatsappData.activeConversations.toLocaleString()} active conversations
                </p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 lg:ml-auto w-full lg:w-auto">
              {[
                { label: "WhatsApp Revenue", value: `$${(whatsappData.whatsappRevenue / 1000).toFixed(0)}K`, sub: `+${whatsappData.whatsappRevenueGrowth}% MoM` },
                { label: "Conv. Rate", value: `${whatsappData.conversionRate}%`, sub: "From broadcast" },
                { label: "Avg Response", value: whatsappData.avgResponseTime, sub: "First reply" },
                { label: "Auto-Replies", value: `${whatsappData.automatedReplies}%`, sub: "Of all messages" },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-lg bg-muted/30">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  <p className="text-lg font-bold tabular-nums">{m.value}</p>
                  <p className="text-[10px] text-green-500">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="WhatsApp Revenue" value={whatsappData.whatsappRevenue} unit="$" change={38} icon="DollarSign" />
        <KpiCard label="Conv. Rate" value={whatsappData.conversionRate} unit="%" change={4.2} icon="TrendingUp" />
        <KpiCard label="Active Conversations" value={whatsappData.activeConversations} unit="" change={22} icon="MessageCircle" />
        <KpiCard label="Auto-Reply Rate" value={whatsappData.automatedReplies} unit="%" change={8} icon="Bot" />
      </div>

      {/* Broadcast Campaign Revenue */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Broadcast Campaign Revenue</CardTitle>
          <p className="text-xs text-muted-foreground">Revenue generated per broadcast campaign (in thousands)</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ revenue: { label: "Revenue ($K)", color: "oklch(0.55 0.18 145)" } }} className="h-[280px] w-full">
            <BarChart data={broadcastBarData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}K`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={36}>
                {broadcastBarData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Automated Flows */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              <CardTitle className="text-base font-semibold">Automated WhatsApp Flows</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Revenue and conversion by automation flow</p>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {whatsappData.automatedFlows.map((flow) => (
              <div key={flow.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  {flow.active ? <Zap className="h-4 w-4 text-green-500" /> : <Phone className="h-4 w-4 text-muted-foreground/40" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{flow.name}</p>
                    <Badge variant={flow.active ? "default" : "secondary"} className="text-[10px] shrink-0">
                      {flow.active ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {flow.triggered.toLocaleString()} triggered · {flow.conversion}% conv.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-green-600 tabular-nums">${(flow.revenue / 1000).toFixed(0)}K</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Conversation-to-Sale Breakdown */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Conversation-to-Sale Breakdown</CardTitle>
            <p className="text-xs text-muted-foreground">
              {whatsappData.conversationToSale.conversionRate}% of conversations convert · AOV ${whatsappData.conversationToSale.avgOrderValue}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold tabular-nums">{whatsappData.conversationToSale.totalConversations.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Conversations</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600 tabular-nums">{whatsappData.conversationToSale.convertedToSale.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Converted</p>
              </div>
            </div>
            <div className="space-y-3">
              {conversionData.map((cat) => (
                <div key={cat.category} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.fill }} />
                  <span className="text-sm flex-1 truncate">{cat.category}</span>
                  <span className="text-xs text-muted-foreground">{cat.share}%</span>
                  <span className="text-xs font-medium tabular-nums">${cat.avgDealSize}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Reply Suggestions */}
      <Card className="border-border/50 bg-gradient-to-br from-card to-blue-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-base font-semibold">AI Reply Suggestions</CardTitle>
            <Badge className="bg-blue-500/10 text-blue-600 text-[10px]">Powered by AI</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Smart AI-generated reply suggestions for sales agents — increase close rate by 28%</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {whatsappData.aiReplySuggestions.map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0 mt-0.5">
                    U
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Customer Query</p>
                      <p className="text-sm">&quot;{item.customerQuery}&quot;</p>
                    </div>
                    <div className="pl-4 border-l-2 border-primary/30">
                      <p className="text-xs text-muted-foreground mb-1">AI Suggested Reply</p>
                      <p className="text-sm text-primary">{item.aiSuggestion}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {item.confidence}% confidence
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
