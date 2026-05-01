'use client';

import { useState } from 'react';
import {
  ClipboardCheck, Mail, Globe, BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Clock,
  ArrowRight, Download, RefreshCw, Search, Eye, User, Building2, Target, Zap, FileText,
  Star, Shield, Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAction } from '@/lib/action-context';
import { exportToCSV } from '@/lib/real-actions';
import {
  auditRequests, auditResults, conversionFunnel, leadScores,
  getAuditStatusColor, getAuditTypeLabel, getScoreColor, getScoreBgColor,
  getFindingSeverityColor, getLeadRecommendationColor,
  type AuditRequest, type AuditResult, type LeadScore as LeadScoreType,
} from '@/lib/integration-data';

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function MiniMetric({ label, value, subtext, icon: Icon, trend }: {
  label: string; value: string; subtext?: string; icon?: React.ElementType; trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4 flex items-center gap-3">
        {Icon && <div className="p-2 rounded-lg bg-primary/10"><Icon className="h-4 w-4 text-primary" /></div>}
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold tabular-nums">{value}</p>
          <p className="text-[10px] text-muted-foreground">{label}</p>
          {subtext && (
            <p className={`text-[9px] ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-muted-foreground/70'}`}>
              {trend === 'up' && '↑ '}{trend === 'down' && '↓ '}{subtext}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TabExportButton({ label, data, filename }: { label: string; data: Record<string, unknown>[]; filename: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 text-[10px] gap-1 ml-auto text-muted-foreground hover:text-foreground"
      onClick={() => {
        exportToCSV(data, filename);
        toast.success('Exported', { description: `${filename} downloaded` });
      }}
    >
      <Download className="h-3 w-3" />
      {label}
    </Button>
  );
}

function ScoreGauge({ score, label, size = 'md' }: { score: number; label: string; size?: 'sm' | 'md' }) {
  const isMd = size === 'md';
  const circumference = 2 * Math.PI * (isMd ? 40 : 28);
  const filled = (score / 100) * circumference;
  const colorClass = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`relative ${isMd ? 'w-24 h-24' : 'w-16 h-16'}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={isMd ? 40 : 28} fill="none" stroke="currentColor" className="text-muted/30" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={isMd ? 40 : 28} fill="none"
            stroke="currentColor"
            className={colorClass}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - filled}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${isMd ? 'text-xl' : 'text-sm'} font-bold tabular-nums ${colorClass}`}>{score}</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export function FreeAudit() {
  const { executeAction } = useAction();

  // Hero form
  const [heroEmail, setHeroEmail] = useState('');
  const [heroWebsite, setHeroWebsite] = useState('');

  // Audit requests state
  const [requests] = useState<AuditRequest[]>(auditRequests);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  // Lead scoring
  const [leads] = useState<LeadScoreType[]>(leadScores);
  const [followedUpSet, setFollowedUpSet] = useState<Set<string>>(new Set());

  const handleHeroSubmit = () => {
    if (!heroEmail.trim()) {
      toast.error('Email required', { description: 'Please enter your email address' });
      return;
    }
    executeAction({
      action: 'Submit Audit Request',
      module: 'free-audit',
      detail: `Free audit request for ${heroWebsite || 'website not provided'}`,
      successMsg: 'Audit request submitted! You\'ll receive your free report within 48 hours.',
      simulateDelay: 1500,
    });
    setHeroEmail('');
    setHeroWebsite('');
  };

  const handleProcessRequest = (id: string) => {
    executeAction({
      action: 'Process Audit',
      module: 'free-audit',
      detail: `Processing audit request ${id}`,
      successMsg: 'Audit processing started — results will be ready in ~2 hours',
      simulateDelay: 2000,
    });
  };

  const handleSendFollowUp = (id: string) => {
    executeAction({
      action: 'Send Follow-up',
      module: 'free-audit',
      detail: `Sending follow-up for ${id}`,
      successMsg: 'Follow-up email sent with personalized recommendations',
      simulateDelay: 1000,
    });
  };

  const handleSendReport = (resultId: string) => {
    executeAction({
      action: 'Send Report',
      module: 'free-audit',
      detail: `Sending audit report for ${resultId}`,
      successMsg: 'Audit report sent via email with detailed findings',
      simulateDelay: 1500,
    });
  };

  const handleFollowUp = (requestId: string) => {
    setFollowedUpSet(prev => new Set(prev).add(requestId));
    const lead = leads.find(l => l.requestId === requestId);
    toast.success('Follow-up scheduled', { description: `${lead?.followUpAction.slice(0, 80)}...` });
  };

  // Compute KPI values
  const totalRequests = auditRequests.length;
  const completedAudits = auditRequests.filter(a => a.status === 'completed' || a.status === 'delivered').length;
  const conversionRate = conversionFunnel[conversionFunnel.length - 1].conversionRate;
  const avgLeadScore = Math.round(leadScores.reduce((s, l) => s + l.leadScore, 0) / leadScores.length);
  const revenueFromAudits = 34; // converted clients * estimated avg MRR

  return (
    <div className="space-y-6">
      {/* ========== Hero Banner ========== */}
      <Card className="border-border/50 overflow-hidden">
        <div className="relative">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          <CardContent className="relative p-6 sm:p-8">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ClipboardCheck className="h-6 w-6 text-primary" />
                <Badge className="text-xs bg-primary/15 text-primary border-primary/30">Free Tool</Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Free Audit — Grow Your Business with AI-Powered Insights
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Get a comprehensive audit of your ads, SEO, website, and tracking setup. 
                Our AI analyzes your business and delivers actionable recommendations to boost performance.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto mt-4">
                <div className="flex-1 w-full">
                  <Input
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    placeholder="Enter your email"
                    type="email"
                    className="h-10 text-sm bg-background"
                  />
                </div>
                <div className="flex-1 w-full">
                  <Input
                    value={heroWebsite}
                    onChange={(e) => setHeroWebsite(e.target.value)}
                    placeholder="Your website URL"
                    className="h-10 text-sm bg-background"
                  />
                </div>
                <Button onClick={handleHeroSubmit} className="h-10 px-6 shrink-0">
                  <Zap className="h-4 w-4 mr-1" />
                  Get Free Audit
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                No credit card required · Results in 48 hours · Trusted by 200+ businesses
              </p>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* ========== KPI Row ========== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MiniMetric icon={ClipboardCheck} label="Total Audit Requests" value={`${totalRequests}`} subtext="+18 this week" trend="up" />
        <MiniMetric icon={CheckCircle2} label="Completed Audits" value={`${completedAudits}`} subtext="87% completion rate" trend="up" />
        <MiniMetric icon={TrendingUp} label="Conversion Rate" value={`${conversionRate}%`} subtext="+2.1% vs last quarter" trend="up" />
        <MiniMetric icon={Star} label="Avg Lead Score" value={`${avgLeadScore}/100`} subtext="4 high priority leads" trend="up" />
        <MiniMetric icon={BarChart3} label="Revenue from Audits" value={`$${(revenueFromAudits * 1.2).toFixed(0)}K`} subtext="MRR from audit converts" trend="up" />
      </div>

      {/* ========== Main Tabs ========== */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1 bg-muted/50">
          <TabsTrigger value="requests" className="text-xs gap-1 data-[state=active]:bg-primary"><ClipboardCheck className="h-3 w-3" />Requests</TabsTrigger>
          <TabsTrigger value="results" className="text-xs gap-1 data-[state=active]:bg-primary"><BarChart3 className="h-3 w-3" />Results</TabsTrigger>
          <TabsTrigger value="pipeline" className="text-xs gap-1 data-[state=active]:bg-primary"><ArrowRight className="h-3 w-3" />Pipeline</TabsTrigger>
          <TabsTrigger value="scoring" className="text-xs gap-1 data-[state=active]:bg-primary"><Target className="h-3 w-3" />Lead Scoring</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* TAB 1: Audit Requests                                        */}
        {/* ============================================================ */}
        <TabsContent value="requests">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-primary" />
                    Audit Requests
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {requests.filter(r => r.status === 'pending').length} pending, {requests.filter(r => r.status === 'processing').length} processing, {completedAudits} completed
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={requests.map(r => ({ ID: r.id, Email: r.email, Company: r.company, Website: r.website, Date: r.requestDate, Status: r.status, Type: getAuditTypeLabel(r.auditType), CompletedDate: r.completionDate || '', DeliveredVia: r.deliveredVia || '' }))}
                  filename="free-audit-requests.csv"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[500px]">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Company</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Website</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Type</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Date</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <tr key={req.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                {req.company.split(' ').map(w => w[0]).join('').slice(0, 2)}
                              </div>
                              <span className="text-xs font-medium">{req.company}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-xs text-muted-foreground">{req.email}</td>
                          <td className="py-2.5 px-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Globe className="h-3 w-3" /> {req.website}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <Badge variant="outline" className="text-[9px]">{getAuditTypeLabel(req.auditType)}</Badge>
                          </td>
                          <td className="py-2.5 px-2">
                            <Badge className={`text-[9px] ${getAuditStatusColor(req.status)}`}>
                              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-2 text-[10px] text-muted-foreground">{req.requestDate}</td>
                          <td className="py-2.5 px-2 text-right">
                            <div className="flex items-center gap-1 justify-end">
                              {req.status === 'pending' && (
                                <Button
                                  size="sm"
                                  className="h-6 text-[9px] gap-1 px-2"
                                  onClick={() => handleProcessRequest(req.id)}
                                >
                                  <Zap className="h-2.5 w-2.5" />
                                  Process
                                </Button>
                              )}
                              {(req.status === 'completed' || req.status === 'delivered') && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 text-[9px] gap-1 px-2"
                                  onClick={() => handleSendFollowUp(req.id)}
                                >
                                  <Mail className="h-2.5 w-2.5" />
                                  Follow-up
                                </Button>
                              )}
                              {auditResults.find(r => r.requestId === req.id) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-[9px] gap-1 px-2 text-muted-foreground"
                                  onClick={() => {
                                    setExpandedResult(expandedResult === req.id ? null : req.id);
                                    const resultsTab = document.querySelector('[data-state="results"]');
                                    if (resultsTab && expandedResult !== req.id) {
                                      (resultsTab as HTMLElement).click();
                                    }
                                  }}
                                >
                                  <Eye className="h-2.5 w-2.5" />
                                  View
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 2: Audit Results                                         */}
        {/* ============================================================ */}
        <TabsContent value="results">
          <div className="space-y-4">
            {auditResults.map((result) => {
              const request = auditRequests.find(r => r.id === result.requestId);
              const isExpanded = expandedResult === result.requestId;
              const companyInitials = request?.company.split(' ').map(w => w[0]).join('').slice(0, 2) || '??';

              return (
                <Card key={result.requestId} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {companyInitials}
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold">{request?.company}</CardTitle>
                          <CardDescription className="text-[10px]">
                            {request?.website} · {getAuditTypeLabel(request?.auditType || 'full')} · {request?.completionDate}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] gap-1"
                          onClick={() => {
                            setExpandedResult(isExpanded ? null : result.requestId);
                          }}
                        >
                          {isExpanded ? 'Collapse' : 'Expand'}
                          <ArrowRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 text-[10px] gap-1"
                          onClick={() => handleSendReport(result.requestId)}
                        >
                          <Send className="h-3 w-3" />
                          Send Report
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Score Overview */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-4">
                      <ScoreGauge score={result.overallScore} label="Overall Score" />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
                        {Object.entries(result.categoryScores).map(([key, value]) => (
                          <ScoreGauge key={key} score={value} label={key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} size="sm" />
                        ))}
                      </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                      <Badge className="text-[10px] bg-red-500/15 text-red-400 border-red-500/30">
                        <AlertTriangle className="h-3 w-3 mr-1" /> {result.totalIssues} issues found
                      </Badge>
                      <Badge className="text-[10px] bg-amber-500/15 text-amber-400 border-amber-500/30">
                        💸 ${result.wastedSpend.toLocaleString()}/mo wasted spend
                      </Badge>
                    </div>

                    {/* Expandable Findings */}
                    {isExpanded && (
                      <div className="space-y-3 mt-4 border-t border-border/50 pt-4">
                        <p className="text-xs font-semibold flex items-center gap-1">
                          <Search className="h-3 w-3" /> Top Findings
                        </p>
                        {result.topFindings.map((finding, idx) => (
                          <div key={idx} className={`p-3 rounded-lg border ${getFindingSeverityColor(finding.severity)} border-opacity-30`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge className={`text-[8px] ${getFindingSeverityColor(finding.severity)}`}>
                                    {finding.severity.toUpperCase()}
                                  </Badge>
                                  <Badge variant="outline" className="text-[8px]">{finding.category}</Badge>
                                  <span className="text-xs font-medium">{finding.title}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground">{finding.description}</p>
                                <p className="text-[11px] text-emerald-500">💡 {finding.recommendation}</p>
                              </div>
                              <span className="text-[10px] font-medium text-red-400 whitespace-nowrap">{finding.estImpact}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {auditResults.length === 0 && (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <ClipboardCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No audit results available yet</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Completed audits will appear here with detailed findings</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 3: Lead Pipeline                                         */}
        {/* ============================================================ */}
        <TabsContent value="pipeline">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    Conversion Pipeline
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    From audit request to paying client — {conversionFunnel[0].count} total leads, {conversionFunnel[conversionFunnel.length - 1].count} converted
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={conversionFunnel.map(s => ({ Stage: s.stage, Count: s.count, ConversionRate: s.conversionRate + '%' }))}
                  filename="free-audit-pipeline.csv"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Funnel Visualization */}
              <div className="space-y-2">
                {conversionFunnel.map((stage, idx) => {
                  const widthPct = Math.max(15, (stage.count / conversionFunnel[0].count) * 100);
                  const isLast = idx === conversionFunnel.length - 1;
                  const stageColor = isLast
                    ? 'from-emerald-500/20 to-emerald-500/10 border-emerald-500/30'
                    : 'from-primary/10 to-primary/5 border-primary/20';

                  return (
                    <div key={stage.stage} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stage.stage}</span>
                          {idx < conversionFunnel.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold tabular-nums">{stage.count}</span>
                          <span className={`text-[10px] ${isLast ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                            {stage.conversionRate}% conversion
                          </span>
                        </div>
                      </div>
                      <div className="h-10 rounded-lg bg-gradient-to-r border overflow-hidden relative" style={{ width: `${widthPct}%` }}>
                        <div className={`absolute inset-0 bg-gradient-to-r ${stageColor} border rounded-lg`} />
                        <div className="absolute inset-0 flex items-center px-4">
                          <span className="text-xs font-medium">{stage.count}</span>
                          <div className="ml-auto flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">
                              {idx > 0 ? `${((stage.count / conversionFunnel[idx - 1].count) * 100).toFixed(0)}% from previous` : '100% entry'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {idx < conversionFunnel.length - 1 && (
                        <div className="flex justify-start pl-4">
                          <div className="text-[10px] text-muted-foreground">
                            ↓ {conversionFunnel[idx - 1]?.count ? ((1 - stage.count / conversionFunnel[idx - 1].count) * 100).toFixed(0) : 0}% drop-off
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-muted/20 text-center">
                  <p className="text-lg font-bold tabular-nums text-emerald-400">{conversionFunnel[conversionFunnel.length - 1].count}</p>
                  <p className="text-[10px] text-muted-foreground">Clients Converted</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 text-center">
                  <p className="text-lg font-bold tabular-nums">{conversionFunnel[conversionFunnel.length - 1].conversionRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Overall Conversion</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 text-center">
                  <p className="text-lg font-bold tabular-nums">$1.2K</p>
                  <p className="text-[10px] text-muted-foreground">Avg Revenue / Client</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 text-center">
                  <p className="text-lg font-bold tabular-nums text-emerald-400">3.2 days</p>
                  <p className="text-[10px] text-muted-foreground">Avg Time to Convert</p>
                </div>
              </div>

              {/* Pipeline Insights */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    AI Insight: The biggest drop-off is between "Follow-up Sent" and "Demo Scheduled" (56% loss). 
                    Personalizing follow-ups with audit-specific insights could improve demo rate by 25%.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 4: Lead Scoring                                          */}
        {/* ============================================================ */}
        <TabsContent value="scoring">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    AI Lead Scoring
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {leads.filter(l => l.recommendation === 'high_priority').length} high priority, {leads.filter(l => l.recommendation === 'nurture').length} nurture, {leads.filter(l => l.recommendation === 'low_priority').length} low priority
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={leads.map(l => {
                    const req = auditRequests.find(r => r.id === l.requestId);
                    return {
                      RequestID: l.requestId,
                      Company: req?.company || '',
                      LeadScore: l.leadScore,
                      CompanySize: l.signals.company_size,
                      IndustryFit: l.signals.industry_fit,
                      BudgetIndicator: l.signals.budget_indicator,
                      Urgency: l.signals.urgency,
                      Recommendation: l.recommendation,
                      FollowUpAction: l.followUpAction,
                    };
                  })}
                  filename="free-audit-lead-scores.csv"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[600px]">
                <div className="space-y-3">
                  {leads
                    .sort((a, b) => b.leadScore - a.leadScore)
                    .map((lead) => {
                      const request = auditRequests.find(r => r.id === lead.requestId);
                      const recBadge = getLeadRecommendationColor(lead.recommendation);
                      const isFollowedUp = followedUpSet.has(lead.requestId);

                      return (
                        <div key={lead.requestId} className={`p-4 rounded-lg border transition-all ${
                          lead.recommendation === 'high_priority' ? 'border-red-500/30 bg-red-500/5' :
                          lead.recommendation === 'nurture' ? 'border-amber-500/30 bg-amber-500/5' :
                          'border-border/50'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                  {request?.company.split(' ').map(w => w[0]).join('').slice(0, 2) || '??'}
                                </div>
                                <span className="text-sm font-medium">{request?.company}</span>
                                <Badge className={`text-[9px] ${recBadge.color}`}>{recBadge.label}</Badge>
                                <div className={`text-xs font-bold tabular-nums ${getScoreColor(lead.leadScore)}`}>
                                  {lead.leadScore}/100
                                </div>
                              </div>

                              {/* Lead Signals */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div className="text-[10px]">
                                  <span className="text-muted-foreground">Company: </span>
                                  <span className="font-medium">{lead.signals.company_size}</span>
                                </div>
                                <div className="text-[10px]">
                                  <span className="text-muted-foreground">Industry: </span>
                                  <span className="font-medium">{lead.signals.industry_fit}</span>
                                </div>
                                <div className="text-[10px]">
                                  <span className="text-muted-foreground">Budget: </span>
                                  <span className="font-medium">{lead.signals.budget_indicator}</span>
                                </div>
                                <div className="text-[10px]">
                                  <span className="text-muted-foreground">Urgency: </span>
                                  <span className="font-medium">{lead.signals.urgency}</span>
                                </div>
                              </div>

                              {/* Follow-up Action */}
                              <p className="text-[11px] text-muted-foreground flex items-start gap-1">
                                <ArrowRight className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                                {lead.followUpAction}
                              </p>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              {isFollowedUp ? (
                                <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                                  <CheckCircle2 className="h-3 w-3 mr-1" /> Follow-up Sent
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  className="h-7 text-[10px] gap-1"
                                  onClick={() => handleFollowUp(lead.requestId)}
                                >
                                  <Mail className="h-3 w-3" />
                                  Follow Up
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[10px] gap-1 text-muted-foreground"
                                onClick={() => {
                                  setExpandedResult(lead.requestId);
                                  const resultsTab = document.querySelector('[data-state="results"]');
                                  if (resultsTab) {
                                    (resultsTab as HTMLElement).click();
                                  }
                                }}
                              >
                                <Eye className="h-3 w-3" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
