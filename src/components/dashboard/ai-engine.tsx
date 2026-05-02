"use client";

import { useState } from "react";
import { aiEngineData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "./kpi-components";
import { Gauge } from "./kpi-components";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Brain, Zap, Target, TrendingUp, AlertTriangle, ArrowRight,
  CheckCircle2, Clock, Calendar, Rocket, Sparkles, ChevronRight,
  Download, Settings2, Play, Pause, Trash2, Plus, ArrowUpRight,
} from "lucide-react";
import { useAction } from "@/lib/action-context";
import { ActionBar, InlineAction } from "./action-bar";
import { exportToCSV } from "@/lib/real-actions";

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
  const { executeAction, automations, toggleAutomation } = useAction();
  const allAutomations = automations;
  const [suggestionStatuses, setSuggestionStatuses] = useState<Record<string, 'pending' | 'completed'>>({});

  return (
    <div className="space-y-6">
      <ActionBar
        module="ai-engine"
        primary={{
          label: "Generate Insights",
          icon: Sparkles,
          onClick: () => executeAction({
            action: "Generate Insights",
            module: "ai-engine",
            detail: "AI is analyzing all modules to generate new strategic insights",
            successMsg: "3 new AI insights generated",
            simulateDelay: 2000,
          }),
        }}
        actions={[
          {
            label: "Export Playbook",
            icon: Download,
            onClick: () => {
              exportToCSV(aiEngineData.weeklyPlaybook.map(d => ({
                Day: d.day,
                Focus: d.focus,
                Actions: d.actions.join('; '),
                KPI: d.kpi,
              })), "weekly-playbook.csv");
              executeAction({
                action: "Export Playbook",
                module: "ai-engine",
                detail: "Exporting weekly growth playbook as CSV",
                successMsg: "Weekly playbook exported as CSV",
                simulateDelay: 300,
              });
            },
          },
          {
            label: "Schedule Report",
            icon: Calendar,
            onClick: () => executeAction({
              action: "Schedule Report",
              module: "ai-engine",
              detail: "Scheduling weekly AI insights report for every Monday 9 AM IST",
              successMsg: "Report scheduled for Mondays at 9:00 AM IST",
              simulateDelay: 800,
              undoLabel: "Edit Schedule",
            }),
          },
        ]}
        relevantAutomations={allAutomations}
      />

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
            const isCompleted = suggestionStatuses[suggestion.id] === 'completed';
            const handleActNow = () => {
              setSuggestionStatuses(prev => ({ ...prev, [suggestion.id]: 'completed' }));
              toast.success(`Action executed: ${suggestion.category}`, {
                description: suggestion.action,
              });
            };
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
                  {isCompleted ? (
                    <Badge className="shrink-0 bg-emerald-500/10 text-emerald-600 text-[10px] border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <button
                      className="shrink-0 px-3 py-1.5 text-[10px] font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                      onClick={handleActNow}
                    >
                      Act Now
                    </button>
                  )}
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

      {/* ========== AUTOMATION HUB ========== */}
      <Card className="border-border/50 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">Automation Hub</CardTitle>
              <Badge className="bg-primary/10 text-primary text-[10px]">
                {automations.filter(a => a.enabled).length} active
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                {automations.reduce((s, a) => s + a.runCount, 0).toLocaleString()} total runs
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">AI-powered automation rules that run 24/7. Toggle rules to enable or disable automated workflows.</p>
        </CardHeader>
        <CardContent>
          {/* Summary Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Active Rules", value: automations.filter(a => a.enabled).length, icon: Play, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Paused Rules", value: automations.filter(a => !a.enabled).length, icon: Pause, color: "text-muted-foreground", bg: "bg-muted/50" },
              { label: "Total Runs (All Time)", value: automations.reduce((s, a) => s + a.runCount, 0).toLocaleString(), icon: ArrowUpRight, color: "text-primary", bg: "bg-primary/10" },
              { label: "Modules Covered", value: [...new Set(automations.map(a => a.module))].length, icon: Zap, color: "text-violet-500", bg: "bg-violet-500/10" },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <div className={`h-8 w-8 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                  <m.icon className={`h-4 w-4 ${m.color}`} />
                </div>
                <div>
                  <p className="text-sm font-bold tabular-nums">{m.value}</p>
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Automation Rules List */}
          <div className="space-y-2">
            {automations.map((rule) => (
              <div
                key={rule.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  rule.enabled
                    ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                    : "bg-muted/20 border-border/30 hover:bg-muted/30"
                }`}
              >
                {/* Toggle */}
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => {
                    const newStatus = !rule.enabled;
                    toggleAutomation(rule.id);
                    toast.success(`${rule.name} ${newStatus ? 'enabled' : 'disabled'}`);
                  }}
                  aria-label={`Toggle ${rule.name}`}
                />

                {/* Icon + Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{rule.name}</p>
                    <Badge variant="outline" className="text-[9px] capitalize">{rule.module}</Badge>
                    {rule.enabled && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 text-[9px]">Active</Badge>
                    )}
                    {!rule.enabled && (
                      <Badge variant="secondary" className="text-[9px]">Paused</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{rule.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5" />
                      Trigger: {rule.trigger}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="h-2.5 w-2.5" />
                      {rule.action}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-sm font-bold tabular-nums">{rule.runCount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">runs</p>
                  {rule.lastRun && (
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">{rule.lastRun}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Enable All / Disable All */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => {
                automations.filter(a => !a.enabled).forEach(a => toggleAutomation(a.id));
                toast.success("All automations enabled");
              }}
            >
              <Play className="h-3.5 w-3.5 text-emerald-500" />
              Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => {
                automations.filter(a => a.enabled).forEach(a => toggleAutomation(a.id));
                toast.success("All automations disabled");
              }}
            >
              <Pause className="h-3.5 w-3.5" />
              Disable All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
