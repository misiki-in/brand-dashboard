'use client';

import React, { useState } from 'react';
import {
  Search, Brain, TrendingUp, AlertTriangle, Globe, FileText, BarChart3,
  CheckCircle2, XCircle, ArrowRight, ChevronRight, Download, RefreshCw,
  Clock, Eye, Shield, Layers, Activity, Zap, Target, Calendar, Link2,
  Wrench, RotateCcw, Settings2, Sparkles, Gauge, BookOpen, ExternalLink,
  MessageSquare, GitBranch, Rss, Bot, Plus, Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAction } from '@/lib/action-context';
import { exportToCSV } from '@/lib/real-actions';
import {
  seoKPIs, crawlResults, metaRewrites, schemaPages, webVitals,
  rankTracking, contentDecay, progContent, blogPipeline, backlinkTargets,
  aiCitations, rollbackLog, reportConfigs,
  getSeverityColor, getSeverityBg, getVitalColor, getVitalBg, getVitalDot,
  getTrendIcon, getTrendColor, getDecayBadgeColor, getPipelineBadgeColor,
  getOutreachColor, getProgStatusColor,
  type CrawlIssue, type RankEntry, type BacklinkTarget, type ReportConfig,
} from '@/lib/seo-command-data';

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

function SeverityBadge({ severity }: { severity: 'critical' | 'warning' | 'info' }) {
  return (
    <Badge variant="outline" className={`text-[10px] ${getSeverityColor(severity)}`}>
      {severity === 'critical' ? 'Critical' : severity === 'warning' ? 'Warning' : 'Info'}
    </Badge>
  );
}

function VitalBadge({ rating }: { rating: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${getVitalColor(rating as any)}`}>
      <span className={`h-2 w-2 rounded-full ${getVitalDot(rating as any)}`} />
      {rating === 'good' ? 'Good' : rating === 'needs-improvement' ? 'Needs Work' : 'Poor'}
    </span>
  );
}

function MiniCard({ label, value, sub, change, icon: Icon }: {
  label: string; value: string; sub?: string; change?: number; icon?: React.ElementType;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-2xl lg:text-3xl font-bold tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
            {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
            {change !== undefined && (
              <p className={`text-xs font-medium mt-1 ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </p>
            )}
          </div>
          {Icon && <Icon className="h-5 w-5 text-muted-foreground/50 mt-1" />}
        </div>
      </CardContent>
    </Card>
  );
}

function ExpandableRow({ children, defaultOpen = false }: { children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full text-left">
        <ChevronRight className={`h-3.5 w-3.5 inline transition-transform ${open ? 'rotate-90' : ''} mr-1 text-muted-foreground`} />
      </button>
      {open && <div className="mt-1 ml-4">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                      */
/* ------------------------------------------------------------------ */

export function SeoCommand() {
  const { executeAction } = useAction();
  const [crawlRunning, setCrawlRunning] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [metaStatuses, setMetaStatuses] = useState<Record<string, 'applied' | 'pending' | 'rejected'>>({});
  const [fixedDecay, setFixedDecay] = useState<Set<string>>(new Set());
  const [rollbackDisabled, setRollbackDisabled] = useState<Set<string>>(new Set());
  const [reportStatuses, setReportStatuses] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    reportConfigs.forEach(r => { m[r.id] = r.status === 'active'; });
    return m;
  });
  const [engineFilter, setEngineFilter] = useState<string>('all');

  const toggleExpand = (id: string) => {
    setExpandedIssues(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* --- Tab 1: Technical Crawl --- */
  const groupedCrawl = crawlResults.reduce<Record<string, CrawlIssue[]>>((acc, issue) => {
    if (!acc[issue.category]) acc[issue.category] = [];
    acc[issue.category].push(issue);
    return acc;
  }, {});

  const criticalCount = crawlResults.filter(i => i.severity === 'critical').length;
  const warningCount = crawlResults.filter(i => i.severity === 'warning').length;

  /* --- Tab 5: Rank Tracking filter --- */
  const filteredRanks = engineFilter === 'all'
    ? rankTracking
    : rankTracking.filter(r => r.engine === engineFilter);

  /* ---------------------------------------------------------------- */
  /*  Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <div className="space-y-6">
      {/* ===== KPI Row ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <MiniCard label="Organic Traffic" value={(seoKPIs.organicTraffic / 1000).toFixed(1) + 'K'} change={seoKPIs.organicTrafficChange} icon={TrendingUp} />
        <MiniCard label="Keywords on Page 1" value={String(seoKPIs.keywordsOnPage1)} sub={`of ${seoKPIs.totalKeywordsTracked} tracked`} icon={Search} />
        <MiniCard label="Domain Authority" value={String(seoKPIs.domainAuthority)} icon={Shield} />
        <MiniCard label="Backlinks" value={(seoKPIs.backlinks / 1000).toFixed(1) + 'K'} icon={Link2} />
        <MiniCard label="Web Vitals Score" value={seoKPIs.coreWebVitalsScore + '/100'} icon={Gauge} />
        <MiniCard label="Content Health" value={seoKPIs.contentHealthScore + '/100'} icon={Heart} />
      </div>

      {/* ===== Action Bar ===== */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5"
            disabled={crawlRunning}
            onClick={() => {
              setCrawlRunning(true);
              setTimeout(() => {
                setCrawlRunning(false);
                executeAction({
                  action: 'Run Full Crawl',
                  module: 'seo-command',
                  detail: 'Crawling 247 pages across varnijewels.com',
                  successMsg: 'Crawl complete — 20 issues found (3 critical, 6 warnings), 2 auto-fixed',
                  simulateDelay: 100,
                });
              }, 2500);
            }}
          >
            {crawlRunning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            {crawlRunning ? 'Crawling...' : 'Run Full Crawl'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => {
              exportToCSV(
                [
                  ...crawlResults.map(i => ({ URL: i.url, Category: i.category, Severity: i.severity, Impact: i.impact, Status: i.status })),
                  ...rankTracking.filter(r => r.engine === 'Google').map(r => ({ URL: r.url, Keyword: r.keyword, Position: r.position, Volume: r.searchVolume })),
                  ...webVitals.map(w => ({ URL: w.url, LCP: w.lcp + 's', CLS: w.cls, INP: w.inp + 'ms', Score: w.overallScore })),
                ],
                'seo-full-report.csv'
              );
              toast.success('SEO report exported to CSV');
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Export SEO Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => {
              executeAction({
                action: 'Schedule Crawl',
                module: 'seo-command',
                detail: 'Setting up weekly crawl schedule for Mondays at 6:00 AM IST',
                successMsg: 'Crawl scheduled — Weekly on Mondays at 6:00 AM IST',
              });
            }}
          >
            <Calendar className="h-3.5 w-3.5" />
            Schedule Crawl
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] border-red-500/30 text-red-500">{criticalCount} Critical</Badge>
          <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600">{warningCount} Warnings</Badge>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <Tabs defaultValue="crawl" className="space-y-4">
        <ScrollArea className="w-full -mb-4" type="scroll">
          <TabsList className="h-9 p-0.5 bg-muted/50 w-max">
            {[
              { value: 'crawl', label: 'Technical Crawl', icon: Wrench },
              { value: 'meta', label: 'Title & Meta', icon: FileText },
              { value: 'schema', label: 'Schema Markup', icon: Layers },
              { value: 'vitals', label: 'Core Web Vitals', icon: Gauge },
              { value: 'ranks', label: 'Rank Tracking', icon: Target },
              { value: 'decay', label: 'Content Decay', icon: TrendingUp },
              { value: 'programmatic', label: 'Programmatic SEO', icon: GitBranch },
              { value: 'blog', label: 'Blog Pipeline', icon: BookOpen },
              { value: 'backlinks', label: 'Backlink Builder', icon: Link2 },
              { value: 'ai-search', label: 'AI Search', icon: Brain },
              { value: 'rollback', label: 'Rollback Log', icon: RotateCcw },
              { value: 'reporting', label: 'Reporting', icon: Settings2 },
            ].map(t => (
              <TabsTrigger key={t.value} value={t.value} className="text-xs h-8 px-3 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <t.icon className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">{t.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {/* ===== TAB 1: Technical Crawl ===== */}
        <TabsContent value="crawl" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{crawlResults.length} issues found across {Object.keys(groupedCrawl).length} categories</p>
            <Button
              variant="outline" size="sm" className="h-7 text-[10px] gap-1"
              onClick={() => {
                const fixable = crawlResults.filter(i => i.status === 'detected' && i.severity !== 'critical');
                exportToCSV(fixable.map(i => ({ URL: i.url, Category: i.category, Severity: i.severity, Impact: i.impact, Fix: i.fixSuggestion })), 'crawl-issues.csv');
                toast.success(`Exported ${fixable.length} crawl issues`);
              }}
            >
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
          {Object.entries(groupedCrawl).map(([category, issues]) => (
            <Card key={category} className="border-border/50">
              <CardHeader className="pb-2 px-4 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold">{category}</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">{issues.length}</Badge>
                  </div>
                  {issues.some(i => i.status === 'detected') && (
                    <Button
                      variant="outline" size="sm" className="h-6 text-[10px] gap-1"
                      onClick={() => {
                        executeAction({
                          action: `Auto-fix ${category}`,
                          module: 'seo-command',
                          detail: `Applying auto-fixes to ${issues.filter(i => i.status === 'detected').length} issues in ${category}`,
                          successMsg: `Auto-fixed ${Math.min(issues.filter(i => i.status === 'detected').length, 2)} issues in ${category}`,
                        });
                      }}
                    >
                      <Zap className="h-3 w-3" /> Auto-Fix
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-3 space-y-2">
                {issues.map(issue => {
                  const isExpanded = expandedIssues.has(issue.id);
                  return (
                    <div key={issue.id} className={`rounded-lg border-l-2 p-3 transition-colors ${getSeverityBg(issue.severity)} bg-muted/20`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <SeverityBadge severity={issue.severity} />
                            <span className="text-xs font-medium text-primary truncate max-w-[280px] sm:max-w-[400px]">{issue.url}</span>
                            <Badge variant="outline" className={`text-[9px] ${issue.status === 'auto-fixed' ? 'border-emerald-500/30 text-emerald-600' : issue.status === 'pending' ? 'border-amber-500/30 text-amber-600' : 'border-border'}`}>
                              {issue.status === 'auto-fixed' ? 'Auto-Fixed' : issue.status === 'pending' ? 'Pending' : 'Detected'}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">{issue.impact}</p>
                          {isExpanded && (
                            <div className="mt-2 p-2 rounded bg-background/60 border border-border/30">
                              <p className="text-[11px] font-medium text-primary mb-1">💡 Fix Suggestion:</p>
                              <p className="text-[11px] text-muted-foreground">{issue.fixSuggestion}</p>
                              {issue.status !== 'auto-fixed' && (
                                <Button
                                  size="sm" variant="outline" className="h-6 text-[10px] gap-1 mt-2"
                                  onClick={() => {
                                    executeAction({
                                      action: `Fix: ${issue.url.substring(0, 30)}`,
                                      module: 'seo-command',
                                      detail: issue.fixSuggestion,
                                      successMsg: `Fix applied: ${issue.category}`,
                                    });
                                  }}
                                >
                                  <Wrench className="h-3 w-3" /> Apply Fix
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={() => toggleExpand(issue.id)}>
                          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ===== TAB 2: Title & Meta ===== */}
        <TabsContent value="meta" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{metaRewrites.length} AI-suggested title & meta rewrites</p>
            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
              exportToCSV(metaRewrites.map(m => ({ URL: m.url, CurrentTitle: m.currentTitle, AI_Title: m.aiTitle, CurrentCTR: m.currentCTR + '%', ExpectedCTRImprovement: '+' + m.expectedCTRImprovement + '%', Status: m.status })), 'meta-rewrites.csv');
              toast.success('Meta rewrites exported');
            }}>
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
          <div className="space-y-3">
            {metaRewrites.map(item => {
              const status = metaStatuses[item.id] || item.status;
              return (
                <Card key={item.id} className="border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">{item.pageTitle}</p>
                        <p className="text-[10px] text-muted-foreground">{item.url}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] ${status === 'applied' ? 'border-emerald-500/30 text-emerald-600' : status === 'rejected' ? 'border-red-500/30 text-red-500' : 'border-amber-500/30 text-amber-600'}`}>
                          {status === 'applied' ? 'Applied ✓' : status === 'rejected' ? 'Rejected' : 'Pending'}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">CTR: {item.currentCTR}%</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Current */}
                      <div className="p-3 rounded-lg bg-muted/30 space-y-1.5">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Current</p>
                        <p className="text-xs font-medium">{item.currentTitle}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.currentMeta}</p>
                      </div>
                      {/* AI Suggested */}
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1.5">
                        <p className="text-[10px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1"><Sparkles className="h-3 w-3" /> AI Suggested</p>
                        <p className="text-xs font-medium">{item.aiTitle}</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{item.aiMeta}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-emerald-600 font-medium">+{item.expectedCTRImprovement}% expected CTR improvement</p>
                      {status === 'pending' && (
                        <div className="flex items-center gap-1.5">
                          <Button size="sm" variant="default" className="h-6 text-[10px] gap-1" onClick={() => {
                            setMetaStatuses(prev => ({ ...prev, [item.id]: 'applied' }));
                            toast.success(`Applied AI title for ${item.pageTitle}`);
                          }}>
                            <CheckCircle2 className="h-3 w-3" /> Apply
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1" onClick={() => {
                            setMetaStatuses(prev => ({ ...prev, [item.id]: 'rejected' }));
                            toast.info(`Rejected AI title for ${item.pageTitle}`);
                          }}>
                            <XCircle className="h-3 w-3" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ===== TAB 3: Schema Markup ===== */}
        <TabsContent value="schema" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{schemaPages.length} pages with structured data</p>
            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
              exportToCSV(schemaPages.map(s => ({ URL: s.url, Types: s.schemaTypes.join(', '), Status: s.validationStatus, Errors: s.errors.join('; '), Fixes: s.fixesApplied.join('; ') })), 'schema-markup.csv');
              toast.success('Schema data exported');
            }}>
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">URL</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Schema Types</th>
                  <th className="text-center py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Issues</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Fixes</th>
                </tr>
              </thead>
              <tbody>
                {schemaPages.map(page => (
                  <tr key={page.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="text-xs font-medium text-primary">{page.url}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {page.schemaTypes.map(t => (
                          <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge variant="outline" className={`text-[10px] ${page.validationStatus === 'valid' ? 'border-emerald-500/30 text-emerald-600' : page.validationStatus === 'invalid' ? 'border-red-500/30 text-red-500' : 'border-amber-500/30 text-amber-600'}`}>
                        {page.validationStatus === 'valid' ? '✓ Valid' : page.validationStatus === 'invalid' ? '✗ Invalid' : '⚠ Warnings'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="text-[10px] text-muted-foreground max-w-[200px] truncate">
                        {page.errors.length > 0 ? page.errors.join('; ') : '—'}
                      </p>
                    </td>
                    <td className="py-2.5 px-3">
                      {page.fixesApplied.length > 0 ? (
                        <span className="text-[10px] text-emerald-600">{page.fixesApplied.join('; ')}</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ===== TAB 4: Core Web Vitals ===== */}
        <TabsContent value="vitals" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Performance metrics for {webVitals.length} key pages</p>
            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
              exportToCSV(webVitals.map(w => ({ URL: w.url, LCP: w.lcp + 's', LCP_Rating: w.lcpRating, CLS: w.cls, CLS_Rating: w.clsRating, INP: w.inp + 'ms', INP_Rating: w.inpRating, Score: w.overallScore, Trend: w.trend })), 'web-vitals.csv');
              toast.success('Web Vitals exported');
            }}>
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
          <div className="space-y-3">
            {webVitals.map(page => (
              <Card key={page.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-primary">{page.url}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-medium ${getTrendColor(page.trend)}`}>
                          {getTrendIcon(page.trend)} {page.trend.charAt(0).toUpperCase() + page.trend.slice(1)}
                        </span>
                        <Badge variant="outline" className={`text-[10px] ${page.overallScore >= 80 ? 'border-emerald-500/30 text-emerald-600' : page.overallScore >= 50 ? 'border-amber-500/30 text-amber-600' : 'border-red-500/30 text-red-500'}`}>
                          Score: {page.overallScore}/100
                        </Badge>
                      </div>
                    </div>
                    {page.recommendations.length > 0 && (
                      <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1"
                        onClick={() => {
                          executeAction({
                            action: 'Generate Speed Fix',
                            module: 'seo-command',
                            detail: `Generating optimization report for ${page.url}`,
                            successMsg: `Fix plan generated for ${page.url} — ${page.recommendations.length} recommendations`,
                          });
                        }}
                      >
                        <Wrench className="h-3 w-3" /> Fix Plan
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'LCP', value: page.lcp + 's', rating: page.lcpRating },
                      { label: 'CLS', value: page.cls.toFixed(2), rating: page.clsRating },
                      { label: 'INP', value: page.inp + 'ms', rating: page.inpRating },
                    ].map(m => (
                      <div key={m.label} className={`p-2.5 rounded-lg text-center ${getVitalBg(m.rating as any)}`}>
                        <p className="text-[10px] text-muted-foreground font-medium">{m.label}</p>
                        <p className="text-base font-bold tabular-nums mt-0.5">{m.value}</p>
                        <VitalBadge rating={m.rating} />
                      </div>
                    ))}
                  </div>
                  {page.recommendations.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {page.recommendations.map((rec, i) => (
                        <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                          <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                          {rec}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ===== TAB 5: Rank Tracking ===== */}
        <TabsContent value="ranks" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              {['all', 'Google', 'Bing', 'ChatGPT', 'Perplexity', 'Google AI'].map(engine => (
                <Button key={engine} variant={engineFilter === engine ? 'default' : 'outline'} size="sm"
                  className="h-7 text-[10px] px-2.5"
                  onClick={() => setEngineFilter(engine)}>
                  {engine}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
              exportToCSV(filteredRanks.map(r => ({ Keyword: r.keyword, Engine: r.engine, Position: r.position, Previous: r.previousPosition, Change: r.change, Volume: r.searchVolume, URL: r.url, Best: r.bestPosition, Avg: r.avgPosition })), 'rank-tracking.csv');
              toast.success(`${filteredRanks.length} rank entries exported`);
            }}>
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
          <Card className="border-border/50">
            <CardContent className="p-0">
              <ScrollArea className="max-h-[480px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background z-10">
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Keyword</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Engine</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Position</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Change</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Volume</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Best</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRanks.map(rank => (
                      <tr key={rank.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-xs">{rank.keyword}</td>
                        <td className="py-2.5 px-3 text-center">
                          <Badge variant="outline" className={`text-[9px] ${rank.engine.includes('AI') || rank.engine === 'ChatGPT' || rank.engine === 'Perplexity' ? 'border-purple-500/30 text-purple-600' : 'border-border'}`}>
                            {rank.engine.includes('AI') || rank.engine === 'ChatGPT' || rank.engine === 'Perplexity' ? '🤖 ' : ''}{rank.engine}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {rank.position > 0 ? (
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                              rank.position <= 3 ? 'bg-emerald-500/10 text-emerald-600' :
                              rank.position <= 10 ? 'bg-amber-500/10 text-amber-600' :
                              'bg-muted text-muted-foreground'
                            }`}>#{rank.position}</span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {rank.change > 0 && <span className="text-xs font-medium text-emerald-500">↑ {rank.change}</span>}
                          {rank.change < 0 && <span className="text-xs font-medium text-red-500">↓ {Math.abs(rank.change)}</span>}
                          {rank.change === 0 && <span className="text-xs text-muted-foreground">—</span>}
                        </td>
                        <td className="py-2.5 px-3 text-center tabular-nums text-xs text-muted-foreground">
                          {rank.searchVolume > 0 ? rank.searchVolume.toLocaleString() : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center tabular-nums text-xs text-muted-foreground hidden lg:table-cell">
                          {rank.bestPosition > 0 ? `#${rank.bestPosition}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center tabular-nums text-xs text-muted-foreground hidden lg:table-cell">
                          {rank.avgPosition > 0 ? rank.avgPosition.toFixed(1) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 6: Content Decay ===== */}
        <TabsContent value="decay" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{contentDecay.length} pages losing organic traffic</p>
            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
              exportToCSV(contentDecay.map(d => ({ URL: d.url, Title: d.title, PeakTraffic: d.peakTraffic, CurrentTraffic: d.currentTraffic, Decline: d.declinePct + '%', MonthsDeclining: d.monthsDeclining, LastUpdated: d.lastUpdated, Recommendation: d.aiRecommendation })), 'content-decay.csv');
              toast.success('Content decay data exported');
            }}>
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
          <div className="space-y-2">
            {contentDecay.sort((a, b) => b.declinePct - a.declinePct).map(item => (
              <Card key={item.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{item.title}</p>
                        <Badge variant="outline" className={`text-[10px] ${getDecayBadgeColor(item.aiRecommendation)}`}>
                          <Sparkles className="h-3 w-3 mr-0.5" />
                          {item.aiRecommendation.charAt(0).toUpperCase() + item.aiRecommendation.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-primary mt-0.5">{item.url}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{item.recommendationReason}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Peak</p>
                          <p className="text-sm font-bold tabular-nums">{item.peakTraffic.toLocaleString()}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-red-400" />
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Current</p>
                          <p className="text-sm font-bold tabular-nums text-red-500">{item.currentTraffic.toLocaleString()}</p>
                        </div>
                        <div className="px-2 py-1 rounded bg-red-500/10">
                          <p className="text-xs font-bold text-red-600">-{item.declinePct}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">Months</p>
                          <p className="text-xs font-semibold">{item.monthsDeclining}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-muted-foreground">Last Updated</p>
                          <p className="text-xs">{item.lastUpdated}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      {fixedDecay.has(item.id) ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Refreshed
                        </Badge>
                      ) : (
                        <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
                          setFixedDecay(prev => new Set(prev).add(item.id));
                          executeAction({
                            action: `Refresh: ${item.title}`,
                            module: 'seo-command',
                            detail: `Creating content refresh task for "${item.title}" — ${item.recommendationReason}`,
                            successMsg: `Refresh task created for "${item.title}"`,
                          });
                        }}>
                          <RefreshCw className="h-3 w-3" /> Refresh
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ===== TAB 7: Programmatic SEO ===== */}
        <TabsContent value="programmatic" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{progContent.length} programmatic pages generated</p>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
                exportToCSV(progContent.map(p => ({ Title: p.title, Type: p.type, URL: p.url, Words: p.wordCount, Status: p.status, Traffic: p.trafficGenerated, RankingsGained: p.rankingsGained })), 'programmatic-seo.csv');
                toast.success('Programmatic SEO data exported');
              }}>
                <Download className="h-3 w-3" /> Export
              </Button>
              <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
                executeAction({
                  action: 'Generate New Pages',
                  module: 'seo-command',
                  detail: 'AI generating 5 new city pages, 3 comparison pages, and 2 FAQ hubs',
                  successMsg: '10 new programmatic pages generated — drafts ready for review',
                  simulateDelay: 1500,
                });
              }}>
                <Plus className="h-3 w-3" /> Generate New
              </Button>
            </div>
          </div>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Traffic', value: progContent.reduce((s, p) => s + p.trafficGenerated, 0).toLocaleString() },
              { label: 'Rankings Gained', value: String(progContent.reduce((s, p) => s + p.rankingsGained, 0)) },
              { label: 'Pages Ranking', value: String(progContent.filter(p => p.status === 'ranking').length) },
              { label: 'In Pipeline', value: String(progContent.filter(p => p.status !== 'ranking').length) },
            ].map(m => (
              <Card key={m.label} className="border-border/50">
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold tabular-nums">{m.value}</p>
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border-border/50">
            <CardContent className="p-0">
              <ScrollArea className="max-h-[400px]">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background z-10">
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2.5 px-3 text-xs font-medium text-muted-foreground">Page</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Type</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">Words</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">Status</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Traffic</th>
                      <th className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Rankings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progContent.map(page => (
                      <tr key={page.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-3">
                          <p className="text-xs font-medium">{page.title}</p>
                          <p className="text-[9px] text-primary">{page.url}</p>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <Badge variant="outline" className="text-[9px]">
                            {page.type === 'city-page' ? '📍 City' : page.type === 'comparison-page' ? '⚖️ Compare' : '❓ FAQ'}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-center tabular-nums text-xs text-muted-foreground hidden sm:table-cell">{page.wordCount.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-center">
                          <Badge variant="outline" className={`text-[9px] ${getProgStatusColor(page.status)}`}>{page.status}</Badge>
                        </td>
                        <td className="py-2.5 px-3 text-center tabular-nums text-xs text-muted-foreground hidden md:table-cell">{page.trafficGenerated > 0 ? page.trafficGenerated.toLocaleString() : '—'}</td>
                        <td className="py-2.5 px-3 text-center tabular-nums text-xs text-muted-foreground hidden md:table-cell">{page.rankingsGained > 0 ? `+${page.rankingsGained}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 8: Blog Pipeline ===== */}
        <TabsContent value="blog" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{blogPipeline.length} posts in pipeline</p>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
                exportToCSV(blogPipeline.map(b => ({ Title: b.title, Status: b.status, Keyword: b.targetKeyword, Date: b.scheduledDate, Words: b.wordCount, SEOScore: b.seoScore })), 'blog-pipeline.csv');
                toast.success('Blog pipeline exported');
              }}>
                <Download className="h-3 w-3" /> Export
              </Button>
              <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
                executeAction({
                  action: 'Create New Post',
                  module: 'seo-command',
                  detail: 'Opening blog post wizard with keyword research',
                  successMsg: 'New blog post created — in research phase',
                });
              }}>
                <Plus className="h-3 w-3" /> New Post
              </Button>
            </div>
          </div>
          {/* Pipeline Stages */}
          {(['researching', 'writing', 'editing', 'scheduled', 'published'] as const).map(stage => {
            const posts = blogPipeline.filter(b => b.status === stage);
            if (posts.length === 0) return null;
            return (
              <div key={stage}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={`text-[10px] ${getPipelineBadgeColor(stage)}`}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)} ({posts.length})
                  </Badge>
                  <Separator className="flex-1" />
                </div>
                <div className="space-y-2">
                  {posts.map(post => (
                    <Card key={post.id} className="border-border/50">
                      <CardContent className="p-3 flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold">{post.title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-[9px]"><Target className="h-2.5 w-2.5 mr-0.5" />{post.targetKeyword}</Badge>
                            {post.wordCount > 0 && <span className="text-[10px] text-muted-foreground">{post.wordCount.toLocaleString()} words</span>}
                            {post.seoScore > 0 && (
                              <Badge variant="outline" className={`text-[9px] ${post.seoScore >= 85 ? 'border-emerald-500/30 text-emerald-600' : post.seoScore >= 60 ? 'border-amber-500/30 text-amber-600' : 'border-red-500/30 text-red-500'}`}>
                                SEO: {post.seoScore}
                              </Badge>
                            )}
                            <span className="text-[10px] text-muted-foreground"><Clock className="h-2.5 w-2.5 inline mr-0.5" />{post.scheduledDate}</span>
                          </div>
                        </div>
                        {post.status === 'scheduled' || post.status === 'published' ? (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 shrink-0"
                            onClick={() => {
                              executeAction({
                                action: `Advance: ${post.title.substring(0, 25)}`,
                                module: 'seo-command',
                                detail: `Moving "${post.title}" to next pipeline stage`,
                                successMsg: `Post advanced to ${post.status === 'researching' ? 'writing' : post.status === 'writing' ? 'editing' : post.status === 'editing' ? 'scheduled' : 'published'}`,
                              });
                            }}>
                            <ArrowRight className="h-3 w-3" /> Advance
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        {/* ===== TAB 9: Backlink Builder ===== */}
        <TabsContent value="backlinks" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{backlinkTargets.length} outreach targets · {backlinkTargets.filter(b => b.outreachStatus === 'published').length} published</p>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
                exportToCSV(backlinkTargets.map(b => ({ Site: b.site, DA: b.da, Type: b.type, Status: b.outreachStatus, AnchorText: b.anchorText, EstimatedDAValue: b.estimatedDAValue })), 'backlink-outreach.csv');
                toast.success('Backlink targets exported');
              }}>
                <Download className="h-3 w-3" /> Export
              </Button>
              <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
                executeAction({
                  action: 'Find New Targets',
                  module: 'seo-command',
                  detail: 'Scanning for new backlink opportunities in jewelry & wedding niche',
                  successMsg: '8 new backlink targets identified — 2 high DA (70+) opportunities',
                  simulateDelay: 1500,
                });
              }}>
                <Plus className="h-3 w-3" /> Find Targets
              </Button>
            </div>
          </div>
          {/* Kanban Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {(['identified', 'reached', 'followed-up', 'accepted', 'published'] as const).map(stage => {
              const targets = backlinkTargets.filter(b => b.outreachStatus === stage);
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold capitalize">{stage.replace('-', ' ')}</p>
                    <Badge variant="secondary" className="text-[9px]">{targets.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {targets.map(target => (
                      <Card key={target.id} className="border-border/50">
                        <CardContent className="p-3">
                          <p className="text-xs font-semibold">{target.site}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="outline" className={`text-[9px] ${getOutreachColor(target.outreachStatus)}`}>DA {target.da}</Badge>
                            <Badge variant="outline" className="text-[9px]">{target.type}</Badge>
                          </div>
                          <p className="text-[9px] text-muted-foreground mt-1 truncate">"{target.anchorText}"</p>
                          {stage !== 'published' && (
                            <Button variant="outline" size="sm" className="h-5 text-[9px] gap-0.5 mt-2 w-full"
                              onClick={() => {
                                executeAction({
                                  action: `Outreach: ${target.site}`,
                                  module: 'seo-command',
                                  detail: `Advancing ${target.site} from ${stage} to next stage`,
                                  successMsg: `${target.site} moved to ${stage === 'identified' ? 'reached' : stage === 'reached' ? 'followed up' : stage === 'followed-up' ? 'accepted' : 'published'}`,
                                });
                              }}>
                              <ArrowRight className="h-2.5 w-2.5" /> Next
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ===== TAB 10: AI Search Optimization ===== */}
        <TabsContent value="ai-search" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple-500" />
              <p className="text-xs text-muted-foreground">{aiCitations.filter(c => c.cited).length}/{aiCitations.length} queries citing Varni Jewels in AI results</p>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
              exportToCSV(aiCitations.map(c => ({ Query: c.query, Engine: c.aiEngine, Cited: c.cited ? 'Yes' : 'No', OurURL: c.ourUrlMentioned || 'No', Competitor: c.competitorMentioned || 'None', Recommendation: c.recommendation })), 'ai-citations.csv');
              toast.success('AI citation data exported');
            }}>
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
          <div className="space-y-2">
            {aiCitations.map(citation => (
              <Card key={citation.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-semibold">&ldquo;{citation.query}&rdquo;</p>
                        <Badge variant="outline" className={`text-[9px] ${citation.aiEngine.includes('Google') ? 'border-sky-500/30 text-sky-600' : citation.aiEngine === 'ChatGPT' ? 'border-emerald-500/30 text-emerald-600' : 'border-purple-500/30 text-purple-600'}`}>
                          {citation.aiEngine}
                        </Badge>
                        {citation.cited ? (
                          <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-[9px] gap-0.5">
                            <CheckCircle2 className="h-3 w-3" /> Cited
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px] border-red-500/30 text-red-500 gap-0.5">
                            <XCircle className="h-3 w-3" /> Not Cited
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        {citation.ourUrlMentioned && (
                          <p className="text-[10px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Our URL: {citation.ourUrlMentioned}</p>
                        )}
                        {citation.competitorMentioned && (
                          <p className="text-[10px] text-amber-600 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Also mentioned: {citation.competitorMentioned}</p>
                        )}
                      </div>
                      <div className="mt-2 p-2 rounded bg-muted/30 flex items-start gap-1.5">
                        <Sparkles className="h-3 w-3 text-purple-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-muted-foreground">{citation.recommendation}</p>
                      </div>
                    </div>
                    {!citation.cited && (
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 shrink-0"
                        onClick={() => {
                          executeAction({
                            action: `Optimize for: ${citation.query.substring(0, 25)}`,
                            module: 'seo-command',
                            detail: citation.recommendation,
                            successMsg: `Optimization plan created for "${citation.query}" on ${citation.aiEngine}`,
                          });
                        }}>
                        <Zap className="h-3 w-3" /> Optimize
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ===== TAB 11: Rollback Log ===== */}
        <TabsContent value="rollback" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{rollbackLog.length} SEO changes tracked with ranking impact</p>
            <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
              exportToCSV(rollbackLog.map(r => ({ URL: r.url, Type: r.changeType, Before: r.beforeValue, After: r.afterValue, Date: r.dateChanged, RankingImpact: r.rankingImpact > 0 ? '+' + r.rankingImpact : r.rankingImpact, RollbackAvailable: r.rollbackAvailable ? 'Yes' : 'No' })), 'rollback-log.csv');
              toast.success('Rollback log exported');
            }}>
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
          <div className="space-y-2">
            {rollbackLog.map(entry => (
              <Card key={entry.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[9px]">{entry.changeType}</Badge>
                        <p className="text-xs font-semibold text-primary">{entry.url}</p>
                        <span className="text-[10px] text-muted-foreground">{entry.dateChanged}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div className="p-2 rounded bg-red-500/5 border border-red-500/10">
                          <p className="text-[9px] text-red-500 font-semibold uppercase">Before</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{entry.beforeValue}</p>
                        </div>
                        <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/10">
                          <p className="text-[9px] text-emerald-600 font-semibold uppercase">After</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{entry.afterValue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className={`text-[10px] ${entry.rankingImpact >= 0 ? 'border-emerald-500/30 text-emerald-600' : 'border-red-500/30 text-red-500'}`}>
                          7-day impact: {entry.rankingImpact >= 0 ? '+' : ''}{entry.rankingImpact} positions
                        </Badge>
                        <Badge variant="outline" className={`text-[9px] ${entry.rollbackAvailable ? 'border-border text-muted-foreground' : 'border-red-500/20 text-red-400'}`}>
                          {entry.rollbackAvailable ? 'Rollback Available' : 'Locked'}
                        </Badge>
                      </div>
                    </div>
                    {entry.rollbackAvailable && !rollbackDisabled.has(entry.id) && (
                      <Button variant="destructive" size="sm" className="h-7 text-[10px] gap-1 shrink-0"
                        onClick={() => {
                          setRollbackDisabled(prev => new Set(prev).add(entry.id));
                          executeAction({
                            action: `Rollback: ${entry.url.substring(0, 30)}`,
                            module: 'seo-command',
                            detail: `Reverting ${entry.changeType} on ${entry.url}`,
                            successMsg: `Rollback complete — reverted ${entry.changeType} on ${entry.url}`,
                          });
                        }}>
                        <RotateCcw className="h-3 w-3" /> Rollback
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ===== TAB 12: Reporting ===== */}
        <TabsContent value="reporting" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{reportConfigs.length} configured reports & alerts</p>
            <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => {
              executeAction({
                action: 'Create Report',
                module: 'seo-command',
                detail: 'Opening report configuration wizard',
                successMsg: 'New report created — configure settings below',
              });
            }}>
              <Plus className="h-3 w-3" /> New Report
            </Button>
          </div>
          <div className="space-y-2">
            {reportConfigs.map(config => (
              <Card key={config.id} className={`border-border/50 ${reportStatuses[config.id] ? '' : 'opacity-60'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{config.reportType}</p>
                        <Badge variant="outline" className="text-[10px] capitalize">{config.frequency}</Badge>
                        <Badge variant="outline" className="text-[9px]">
                          {config.channels.map(c => c === 'email' ? '📧' : '💬').join(' ')}
                        </Badge>
                      </div>
                      <div className="mt-1.5 space-y-0.5">
                        {config.recipients.map(r => (
                          <p key={r} className="text-[10px] text-muted-foreground">{r}</p>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Last sent: {config.lastSent}
                      </p>
                    </div>
                    <Switch
                      checked={reportStatuses[config.id]}
                      onCheckedChange={checked => {
                        setReportStatuses(prev => ({ ...prev, [config.id]: checked }));
                        toast.success(`${config.reportType} ${checked ? 'enabled' : 'paused'}`);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* Heart icon needed for KPI row */
function Heart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
