"use client";

import { aiEngineData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "./kpi-components";
import { Gauge } from "./kpi-components";
import {
  Brain, Zap, Target, TrendingUp, AlertTriangle, ArrowRight,
  CheckCircle2, Clock, Calendar, Rocket, Sparkles, ChevronRight,
} from "lucide-react";

const priorityConfig: Record<string, { bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  Critical: { bg: "bg-red-500/5", border: "border-red-500/20", icon: AlertTriangle },
  High: { bg: "bg-amber-500/5", border: "border-amber-500/20", icon: Zap },
  Medium: { bg: "bg-blue-500/5", border: "border-blue-500/20", icon: Target },
  Low: { bg: "bg-muted/20", border: "border-border/30", icon: Sparkles },
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Inventory: () => <span className="text-[10px]">&#128230;</span>,
  Ads: () => <span className="text-[10px]">&#128640;</span>,
  WhatsApp: () => <span className="text-[10px]">&#128172;</span>,
  Creative: () => <span className="text-[10px]">&#127912;</span>,
  Bundle: () => <span className="text-[10px]">&#127873;</span>,
  Content: () => <span className="text-[10px]">&#128221;</span>,
};

const dayEmojis: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Weekend: "Sat-Sun",
};

export function AIGrowthEngine() {
  return (
    <div className="space-y-6">
      {/* Hero — AI Engine Status */}
      <Card className="border-border/50 bg-gradient-to-br from-card via-card to-violet-500/5">
        <CardContent className="p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <Gauge value={aiEngineData.momentumScore} size={130} label="Brand Momentum Score" />
            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-violet-500" />
                <h2 className="text-xl font-bold">AI Growth Engine</h2>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                  Live
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Your brand momentum has increased by <span className="text-emerald-500 font-semibold">+{aiEngineData.momentumTrend} points</span> this week, driven by strong social traction, accelerating repeat purchase rate, and improving stock velocity. The AI engine is actively monitoring {aiEngineData.dailySuggestions.length} action items and tracking {aiEngineData.predictedInsights.length} predicted metrics.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Last updated: {aiEngineData.lastUpdated}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily AI Suggestions — THE HERO SECTION */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            <CardTitle className="text-base font-semibold">Today&apos;s AI Suggestions</CardTitle>
            <Badge className="bg-violet-500/10 text-violet-600 text-[10px]">{aiEngineData.dailySuggestions.length} actions</Badge>
          </div>
          <p className="text-xs text-muted-foreground">AI-driven daily recommendations sorted by impact. Act on these to maximize growth.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiEngineData.dailySuggestions.map((suggestion) => {
            const config = priorityConfig[suggestion.priority] || priorityConfig.Medium;
            const PriorityIcon = config.icon;
            return (
              <div key={suggestion.id} className={`p-4 rounded-xl ${config.bg} border ${config.border} hover:shadow-sm transition-all`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <PriorityIcon className={`h-4 w-4 ${
                      suggestion.priority === "Critical" ? "text-red-500" :
                      suggestion.priority === "High" ? "text-amber-500" :
                      suggestion.priority === "Medium" ? "text-blue-500" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={suggestion.priority === "Critical" ? "destructive" : suggestion.priority === "High" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {suggestion.priority}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">{suggestion.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">{suggestion.id}</span>
                    </div>
                    <p className="text-sm">{suggestion.action}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-600 font-medium">{suggestion.impact}</span>
                    </div>
                  </div>
                  <button className="shrink-0 px-3 py-1.5 text-[10px] font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    Act Now
                  </button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Weekly Playbook */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-base font-semibold">Weekly Growth Playbook</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">AI-generated daily focus areas and action items</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {aiEngineData.weeklyPlaybook.map((day) => (
              <div key={day.day} className="p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold w-14">{dayEmojis[day.day]}</span>
                    <span className="text-sm font-medium">{day.focus}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{day.kpi}</Badge>
                </div>
                <div className="pl-16 space-y-0.5">
                  {day.actions.map((action, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ChevronRight className="h-2.5 w-2.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Growth Actions Roadmap */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-violet-500" />
              <CardTitle className="text-base font-semibold">Growth Actions Roadmap</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">AI-recommended strategic initiatives ranked by impact</p>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {aiEngineData.growthActions.map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.action}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                      <span className="text-emerald-600 font-medium">{item.projectedImpact}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant={item.effort === "Low" ? "default" : item.effort === "Medium" ? "secondary" : "outline"} className="text-[10px]">
                        {item.effort} effort
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">{item.timeline}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Predicted Insights */}
      <Card className="border-border/50 bg-gradient-to-br from-card to-blue-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-base font-semibold">AI Predicted Insights</CardTitle>
            <Badge className="bg-blue-500/10 text-blue-600 text-[10px]">Predictive</Badge>
          </div>
          <p className="text-xs text-muted-foreground">AI-powered forecasts to help you plan ahead</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiEngineData.predictedInsights.map((insight, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">{insight.metric}</p>
                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${insight.trend === "up" ? "bg-emerald-500" : "bg-red-500"}`} />
                    <span className="text-[10px] text-muted-foreground">{insight.trend}</span>
                  </div>
                </div>
                <p className="text-lg font-bold tabular-nums">{insight.prediction}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${insight.confidence}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{insight.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
