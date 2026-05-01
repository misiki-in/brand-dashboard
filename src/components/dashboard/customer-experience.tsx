"use client";

import { cxData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAction } from "@/lib/action-context";
import { ActionBar } from "./action-bar";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Send, Download, FileText } from "lucide-react";

const cxConfig = {
  nps: { label: "NPS", color: "oklch(0.65 0.18 65)" },
  csat: { label: "CSAT", color: "oklch(0.55 0.12 200)" },
  ces: { label: "CES (inverted)", color: "oklch(0.6 0.15 340)" },
};

export function CustomerExperience() {
  const { executeAction, automations } = useAction();
  const relevantAutomations = automations.filter(a => a.module === "cx");
  return (
    <div className="space-y-6">
      {/* Hero NPS + CSAT */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Net Promoter Score", value: cxData.nps, change: cxData.nps - cxData.npsPrevious },
          { label: "CSAT Score", value: `${cxData.csat}%`, sub: `${cxData.csatPrevious}% → ${cxData.csat}%` },
          { label: "Customer Effort Score", value: cxData.ces, sub: "Lower is better (scale 1-5)" },
          { label: "First Contact Resolution", value: `${cxData.firstContactResolution}%` },
        ].map((m) => (
          <Card key={m.label} className="border-border/50">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold tabular-nums">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              {m.sub && <p className="text-[10px] text-muted-foreground">{m.sub}</p>}
              {m.change && (
                <p className={`text-xs font-medium mt-1 ${m.change > 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {m.change > 0 ? "+" : ""}{m.change} pts vs prev
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <ActionBar
        module="cx"
        primary={{
          label: "Launch NPS Survey",
          icon: Send,
          onClick: () => executeAction({
            action: "Launch NPS Survey",
            module: "cx",
            detail: "Launching NPS survey to 5,855 recent purchasers",
            successMsg: "NPS survey launched to 5,855 customers",
          }),
        }}
        actions={[
          {
            label: "Export CX Report",
            icon: Download,
            onClick: () => executeAction({
              action: "Export CX Report",
              module: "cx",
              detail: "Generating customer experience report",
              successMsg: "CX report exported",
            }),
          },
          {
            label: "Create Response Template",
            icon: FileText,
            onClick: () => executeAction({
              action: "Create Response Template",
              module: "cx",
              detail: "Creating new customer response template",
              successMsg: "Response template created",
            }),
          },
        ]}
        relevantAutomations={relevantAutomations}
      />

      {/* CX Trend */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Experience Metrics Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={cxConfig} className="h-[200px] sm:h-[240px] lg:h-[280px] w-full">
            <LineChart data={cxData.customerEffortTrend}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="nps" stroke="var(--color-nps)" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="csat" stroke="var(--color-csat)" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="ces" stroke="var(--color-ces)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Touchpoint Satisfaction */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Touchpoint Satisfaction Score</CardTitle>
          <p className="text-xs text-muted-foreground">Customer satisfaction by interaction point</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cxData.touchpointSatisfaction.map((t) => {
              const colorClass = t.score >= 90 ? "from-emerald-500 to-emerald-400" :
                t.score >= 80 ? "from-primary/80 to-primary" :
                t.score >= 70 ? "from-amber-500 to-amber-400" :
                "from-red-500 to-red-400";
              return (
                <div key={t.touchpoint} className="flex items-center gap-3">
                  <span className="text-sm w-24 sm:w-36 shrink-0 truncate">{t.touchpoint}</span>
                  <div className="flex-1 h-7 rounded-lg bg-muted/50 overflow-hidden relative">
                    <div
                      className={`h-full rounded-lg bg-gradient-to-r ${colorClass} transition-all duration-700 flex items-center justify-end pr-3`}
                      style={{ width: `${t.score}%` }}
                    >
                      <span className="text-xs font-bold text-white">{t.score}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium w-10 text-right ${t.trend >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {t.trend >= 0 ? "+" : ""}{t.trend}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* CX Strategy Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Response Time", value: cxData.responseTime, desc: "Average response time across all channels. Target: under 2 hours. Current performance exceeds target for email but falls short on social media DMs." },
          { title: "Return Process", value: "78/100", desc: "The return experience is the lowest-scoring touchpoint. Consider implementing prepaid return labels and a self-service portal to reduce friction." },
          { title: "App Experience", value: "80/100", desc: "Mobile app satisfaction jumped +6 points after the UX overhaul. Continue monitoring and iterate on the try-on AR feature." },
        ].map((note) => (
          <Card key={note.title} className="border-border/50 bg-muted/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-semibold">{note.title}</p>
                <span className="text-xs font-bold text-primary">{note.value}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{note.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
