'use client';

import { useState, useMemo } from 'react';
import {
  DollarSign, Brain, TrendingUp, AlertTriangle, Target, Clock, Globe, Zap, Search,
  Play, Pause, CheckCircle2, XCircle, ArrowRight, ChevronRight, Download, RefreshCw,
  BarChart3, PieChart, Layout, Monitor, Shield, Calendar, Eye, MessageSquare,
  Settings2, Plus, Filter, Wrench, Gavel, Timer, Users, Copy, ToggleLeft, Crosshair,
  Megaphone, Radio, ExternalLink, Bot, Sparkles, Globe2, Layers, Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAction } from '@/lib/action-context';
import { exportToCSV } from '@/lib/real-actions';
import { ActionBar } from './action-bar';
import {
  platformAccounts, auditFindings, bidRecommendations, budgetPacingItems,
  negativeKeywordItems, qualityScoreItems, audienceOverlapItems, daypartingData,
  daypartingScheduleAdjustments, nlCampaignExamples, auctionInsights,
  wastedSpendCategories, conversionTrackingIssues, crossPlatformCampaigns,
  getSeverityColor, getSeverityBg, getSeverityBadge, getPacingStatusColor,
  getPacingStatusBg, getPlatformIcon, getStatusBadgeVariant,
  getDaypartingCellColor, formatHour, formatDayShort,
  type AuditFinding, type BidRecommendation, type NegativeKeywordItem,
  type QualityScoreItem, type AudienceOverlapItem, type ConversionTrackingIssue,
} from '@/lib/paid-ads-data';

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function ApproveDenyButtons({
  itemId,
  onApprove,
  onDeny,
  approvedSet,
  deniedSet,
  approveLabel = 'Apply',
  denyLabel = 'Dismiss',
}: {
  itemId: string;
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
  approvedSet: Set<string>;
  deniedSet: Set<string>;
  approveLabel?: string;
  denyLabel?: string;
}) {
  if (approvedSet.has(itemId)) {
    return <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/15 text-[10px]">Applied ✓</Badge>;
  }
  if (deniedSet.has(itemId)) {
    return <Badge variant="secondary" className="text-muted-foreground text-[10px]">Dismissed</Badge>;
  }
  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-[10px] gap-1 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 px-2"
        onClick={() => onDeny(itemId)}
      >
        <XCircle className="h-3 w-3" />
        <span className="hidden sm:inline">{denyLabel}</span>
      </Button>
      <Button
        size="sm"
        className="h-7 text-[10px] gap-1 px-2"
        onClick={() => onApprove(itemId)}
      >
        <CheckCircle2 className="h-3 w-3" />
        <span className="hidden sm:inline">{approveLabel}</span>
      </Button>
    </div>
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

function MiniMetric({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-muted/20">
      <p className="text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      {subtext && <p className="text-[9px] text-muted-foreground/70">{subtext}</p>}
    </div>
  );
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export function PaidAdsCommand() {
  const { executeAction, automations } = useAction();
  const paidAdsAutomations = automations.filter(a => a.module === 'ads');

  // Approve/deny state
  const [auditApproved, setAuditApproved] = useState<Set<string>>(new Set());
  const [auditDenied, setAuditDenied] = useState<Set<string>>(new Set());
  const [bidApproved, setBidApproved] = useState<Set<string>>(new Set());
  const [bidDenied, setBidDenied] = useState<Set<string>>(new Set());
  const [negAdded, setNegAdded] = useState<Set<string>>(new Set());
  const [qsApplied, setQsApplied] = useState<Set<string>>(new Set());
  const [qsDismissed, setQsDismissed] = useState<Set<string>>(new Set());
  const [overlapApplied, setOverlapApplied] = useState<Set<string>>(new Set());
  const [overlapDismissed, setOverlapDismissed] = useState<Set<string>>(new Set());
  const [convApproved, setConvApproved] = useState<Set<string>>(new Set());
  const [convDenied, setConvDenied] = useState<Set<string>>(new Set());
  const [auditRunning, setAuditRunning] = useState(false);
  const [nlInput, setNlInput] = useState('');
  const [nlResult, setNlResult] = useState<typeof nlCampaignExamples[number]['parsedOutput'] | null>(null);
  const [nlGenerating, setNlGenerating] = useState(false);

  // NL Campaign builder handler
  const handleNLGenerate = () => {
    if (!nlInput.trim()) return;
    setNlGenerating(true);
    setTimeout(() => {
      // Match to closest example or use first
      const match = nlCampaignExamples.find(e =>
        nlInput.toLowerCase().includes('retarget') || nlInput.toLowerCase().includes('cart')
      ) || nlCampaignExamples.find(e =>
        nlInput.toLowerCase().includes('tiktok') || nlInput.toLowerCase().includes('gen z')
      ) || nlCampaignExamples[0];
      setNlResult(match.parsedOutput);
      setNlGenerating(false);
      toast.success('Campaign generated', { description: `"${match.parsedOutput.campaignName}" ready for review` });
    }, 1500);
  };

  // Compute totals
  const totals = useMemo(() => {
    const totalSpend = platformAccounts.reduce((s, p) => s + p.totalSpend, 0);
    const totalConversions = platformAccounts.reduce((s, p) => s + p.conversions, 0);
    const avgROAS = +(platformAccounts.reduce((s, p) => s + p.roas, 0) / platformAccounts.length).toFixed(1);
    const totalIssues = platformAccounts.reduce((s, p) => s + p.issuesFound, 0);
    const totalWasted = wastedSpendCategories.reduce((s, w) => s + w.amount, 0);
    return { totalSpend, totalConversions, avgROAS, totalIssues, totalWasted };
  }, []);

  // Dayparting: precompute grid
  const daypartingGrid = useMemo(() => {
    const grid: Record<string, typeof daypartingData[number]> = {};
    daypartingData.forEach(cell => {
      grid[`${cell.day}-${cell.hour}`] = cell;
    });
    return grid;
  }, []);

  return (
    <div className="space-y-6">
      {/* ========== KPI Summary ========== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MiniMetric label="Total Spend" value={`$${(totals.totalSpend / 1000).toFixed(1)}K`} subtext="Across 5 platforms" />
        <MiniMetric label="Avg ROAS" value={`${totals.avgROAS}x`} subtext="Blended across platforms" />
        <MiniMetric label="Conversions" value={totals.totalConversions.toLocaleString()} subtext="This month" />
        <MiniMetric label="Issues Found" value={`${totals.totalIssues}`} subtext="Requires attention" />
        <MiniMetric label="Wasted Spend" value={`$${(totals.totalWasted / 1000).toFixed(1)}K`} subtext="Potential savings" />
      </div>

      {/* ========== Action Bar ========== */}
      <ActionBar
        module="paid-ads-command"
        primary={{
          label: 'Run Full Audit',
          icon: Shield,
          onClick: () => {
            setAuditRunning(true);
            executeAction({
              action: 'Run Full Audit',
              module: 'paid-ads-command',
              detail: 'Scanning all 5 connected ad accounts for issues, wasted spend, and optimization opportunities',
              successMsg: 'Audit complete — 12 findings across 5 platforms',
              simulateDelay: 3000,
            });
            setTimeout(() => setAuditRunning(false), 3000);
          },
          loading: auditRunning,
        }}
        actions={[
          {
            label: 'Export Report',
            icon: Download,
            onClick: () => {
              exportToCSV([
                ...auditFindings.map(a => ({ Finding: a.title, Severity: a.severity, Platform: a.platform, Category: a.category, Impact: a.impact, Recommendation: a.recommendation })),
                ...bidRecommendations.map(b => ({ Campaign: b.campaign, Platform: b.platform, CurrentBid: '$' + b.currentBid, RecommendedBid: '$' + b.recommendedBid, ExpectedImpact: b.expectedImpact })),
                ...negativeKeywordItems.map(n => ({ Keyword: n.keyword, Platform: n.platform, Impressions: n.searchTermImpressions, Spend: '$' + n.spend, Wasted: '$' + n.wastedAmount, Conversions: n.conversions })),
              ], 'paid-ads-command-report.csv');
              toast.success('Full report exported', { description: 'paid-ads-command-report.csv downloaded' });
            },
          },
          {
            label: 'Schedule Audit',
            icon: Calendar,
            onClick: () => {
              toast.success('Audit scheduled', { description: 'Full audit will run daily at 9:00 AM IST', action: { label: 'Edit Schedule', onClick: () => toast.info('Schedule editor opened') } });
            },
          },
        ]}
        relevantAutomations={paidAdsAutomations}
      />

      {/* ========== Platform Status Cards ========== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {platformAccounts.map((platform) => (
          <Card key={platform.name} className="border-border/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getPlatformIcon(platform.name)}</span>
                  <span className="text-sm font-semibold">{platform.name}</span>
                </div>
                <Badge variant={getStatusBadgeVariant(platform.status)} className="text-[9px] h-5">
                  {platform.status === 'connected' ? 'Connected' : platform.status === 'error' ? 'Error' : 'Offline'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-muted-foreground">Spend</p>
                  <p className="text-sm font-bold tabular-nums">${(platform.totalSpend / 1000).toFixed(1)}K</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">ROAS</p>
                  <p className={`text-sm font-bold tabular-nums ${platform.roas >= 3 ? 'text-emerald-500' : platform.roas >= 2 ? 'text-amber-500' : 'text-red-500'}`}>
                    {platform.roas}x
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Conversions</p>
                  <p className="text-sm font-semibold tabular-nums">{platform.conversions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Issues</p>
                  <p className={`text-sm font-bold tabular-nums ${platform.issuesFound > 3 ? 'text-red-500' : platform.issuesFound > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {platform.issuesFound}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                Last audit: {platform.lastAudit}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ========== Main Tabs ========== */}
      <Tabs defaultValue="audit" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1 bg-muted/50">
          <TabsTrigger value="audit" className="text-xs gap-1 data-[state=active]:bg-primary"><AlertTriangle className="h-3 w-3" />Audit</TabsTrigger>
          <TabsTrigger value="bids" className="text-xs gap-1 data-[state=active]:bg-primary"><Gavel className="h-3 w-3" />Bids</TabsTrigger>
          <TabsTrigger value="budget" className="text-xs gap-1 data-[state=active]:bg-primary"><Target className="h-3 w-3" />Budget</TabsTrigger>
          <TabsTrigger value="wasted" className="text-xs gap-1 data-[state=active]:bg-primary"><DollarSign className="h-3 w-3" />Waste</TabsTrigger>
          <TabsTrigger value="negatives" className="text-xs gap-1 data-[state=active]:bg-primary"><Search className="h-3 w-3" />Negatives</TabsTrigger>
          <TabsTrigger value="quality" className="text-xs gap-1 data-[state=active]:bg-primary"><BarChart3 className="h-3 w-3" />QS</TabsTrigger>
          <TabsTrigger value="overlap" className="text-xs gap-1 data-[state=active]:bg-primary"><Layers className="h-3 w-3" />Overlap</TabsTrigger>
          <TabsTrigger value="dayparting" className="text-xs gap-1 data-[state=active]:bg-primary"><Clock className="h-3 w-3" />Daypart</TabsTrigger>
          <TabsTrigger value="nl-builder" className="text-xs gap-1 data-[state=active]:bg-primary"><Bot className="h-3 w-3" />NL Builder</TabsTrigger>
          <TabsTrigger value="auction" className="text-xs gap-1 data-[state=active]:bg-primary"><Eye className="h-3 w-3" />Auction</TabsTrigger>
          <TabsTrigger value="tracking" className="text-xs gap-1 data-[state=active]:bg-primary"><Monitor className="h-3 w-3" />Tracking</TabsTrigger>
          <TabsTrigger value="cross-platform" className="text-xs gap-1 data-[state=active]:bg-primary"><Globe2 className="h-3 w-3" />Cross</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* TAB 1: Performance Audit                                     */}
        {/* ============================================================ */}
        <TabsContent value="audit">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Performance Audit Findings
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {auditFindings.filter(f => f.status === 'pending').length} findings requiring review — sorted by severity
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={auditFindings.map(a => ({ ID: a.id, Severity: a.severity, Platform: a.platform, Category: a.category, Title: a.title, Description: a.description, Impact: a.impact, Recommendation: a.recommendation }))}
                  filename="audit-findings.csv"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {auditFindings
                .sort((a, b) => {
                  const sev = { critical: 0, warning: 1, info: 2 };
                  return sev[a.severity] - sev[b.severity];
                })
                .map((finding) => (
                <div key={finding.id} className={`p-4 rounded-lg border ${getSeverityBg(finding.severity)} transition-colors`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`text-[9px] ${getSeverityBadge(finding.severity)}`}>
                          {finding.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-[9px]">{finding.category}</Badge>
                        <span className="text-[9px] text-muted-foreground">{getPlatformIcon(finding.platform)} {finding.platform}</span>
                        <span className="text-[9px] text-muted-foreground">{finding.id}</span>
                      </div>
                      <p className="text-sm font-medium">{finding.title}</p>
                      <p className="text-xs text-muted-foreground">{finding.description}</p>
                      <div className="flex items-center gap-4 text-[10px]">
                        <span className="text-red-500 font-medium">Impact: {finding.impact}</span>
                      </div>
                      <p className="text-xs text-emerald-600">💡 {finding.recommendation}</p>
                    </div>
                    <div className="shrink-0">
                      <ApproveDenyButtons
                        itemId={finding.id}
                        onApprove={(id) => {
                          setAuditApproved(prev => new Set(prev).add(id));
                          toast.success('Finding applied', { description: finding.title });
                        }}
                        onDeny={(id) => {
                          setAuditDenied(prev => new Set(prev).add(id));
                          toast.info('Finding dismissed', { description: finding.title });
                        }}
                        approvedSet={auditApproved}
                        deniedSet={auditDenied}
                        approveLabel="Apply"
                        denyLabel="Dismiss"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 2: Bid Management                                        */}
        {/* ============================================================ */}
        <TabsContent value="bids">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    AI Bid Recommendations
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {bidRecommendations.filter(b => b.status === 'pending').length} pending bid adjustments
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={bidRecommendations.map(b => ({ ID: b.id, Campaign: b.campaign, Platform: b.platform, Keyword: b.keyword, CurrentBid: '$' + b.currentBid.toFixed(2), RecommendedBid: '$' + b.recommendedBid.toFixed(2), BidType: b.bidType, ExpectedImpact: b.expectedImpact, Status: b.status }))}
                  filename="bid-recommendations.csv"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Campaign</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Platform</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Keyword</th>
                      <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Current Bid</th>
                      <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Recommended</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Impact</th>
                      <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bidRecommendations.map((bid) => (
                      <tr key={bid.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-2 font-medium text-xs max-w-[140px] truncate">{bid.campaign}</td>
                        <td className="py-2.5 px-2 text-xs">{getPlatformIcon(bid.platform)} {bid.platform}</td>
                        <td className="py-2.5 px-2 text-xs max-w-[120px] truncate">{bid.keyword}</td>
                        <td className="py-2.5 px-2 text-right tabular-nums text-xs font-medium">${bid.currentBid.toFixed(2)}</td>
                        <td className={`py-2.5 px-2 text-right tabular-nums text-xs font-bold ${bid.recommendedBid > bid.currentBid ? 'text-emerald-500' : 'text-amber-500'}`}>
                          ${bid.recommendedBid.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2">
                          <Badge variant="outline" className="text-[9px]">{bid.bidType}</Badge>
                        </td>
                        <td className="py-2.5 px-2 text-[10px] text-muted-foreground max-w-[160px] truncate">{bid.expectedImpact}</td>
                        <td className="py-2.5 px-2 text-right">
                          {bid.status === 'applied' ? (
                            <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[9px]">Applied</Badge>
                          ) : bid.status === 'rejected' ? (
                            <Badge variant="secondary" className="text-[9px]">Rejected</Badge>
                          ) : (
                            <ApproveDenyButtons
                              itemId={bid.id}
                              onApprove={(id) => {
                                setBidApproved(prev => new Set(prev).add(id));
                                toast.success('Bid updated', { description: `${bid.keyword} → $${bid.recommendedBid.toFixed(2)}` });
                              }}
                              onDeny={(id) => {
                                setBidDenied(prev => new Set(prev).add(id));
                                toast.info('Bid rejected', { description: `${bid.keyword} — no change` });
                              }}
                              approvedSet={bidApproved}
                              deniedSet={bidDenied}
                              approveLabel="Apply"
                              denyLabel="Reject"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 3: Budget Pacing                                         */}
        {/* ============================================================ */}
        <TabsContent value="budget">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Budget Pacing — Monthly
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {budgetPacingItems.filter(b => b.status === 'overspending').length} overspending, {budgetPacingItems.filter(b => b.status === 'underspending').length} underspending
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={budgetPacingItems.map(b => ({ Channel: b.channel, Platform: b.platform, DailyBudget: '$' + b.dailyBudget, SpentToday: '$' + b.spentToday, SpentMonth: '$' + b.spentThisMonth, MonthlyBudget: '$' + b.monthlyBudget, PacingPct: b.pacingPct + '%', Status: b.status, ProjectedEOM: '$' + b.projectedEndOfMonth, DaysRemaining: b.daysRemaining }))}
                  filename="budget-pacing.csv"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetPacingItems.map((item) => {
                const pct = Math.round((item.spentThisMonth / item.monthlyBudget) * 100);
                const statusColor = getPacingStatusBg(item.status);
                const statusText = item.status === 'on-track' ? 'On Track' : item.status === 'overspending' ? 'Overspending' : 'Underspending';
                const projectedDiff = item.projectedEndOfMonth - item.monthlyBudget;
                return (
                  <div key={item.channel} className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{getPlatformIcon(item.platform)}</span>
                        <span className="text-sm font-medium">{item.channel}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground tabular-nums">
                          ${(item.spentThisMonth / 1000).toFixed(1)}K / ${(item.monthlyBudget / 1000).toFixed(0)}K
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px]"
                          style={{ borderColor: statusColor, color: statusColor }}
                        >
                          {statusText}
                        </Badge>
                      </div>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(pct, 120)}%`, backgroundColor: statusColor }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Pacing: {pct}% · Daily: ${(item.spentToday).toLocaleString()} / ${(item.dailyBudget).toLocaleString()}</span>
                      <span>
                        Projected: ${(item.projectedEndOfMonth / 1000).toFixed(1)}K
                        {projectedDiff !== 0 && (
                          <span className={projectedDiff > 0 ? 'text-red-500 font-medium' : 'text-emerald-500 font-medium'}>
                            {' '}({projectedDiff > 0 ? '+' : ''}${(projectedDiff / 1000).toFixed(1)}K)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Total Monthly</span>
                <div className="flex items-center gap-3">
                  <span className="font-bold tabular-nums">
                    ${budgetPacingItems.reduce((s, b) => s + b.spentThisMonth, 0).toLocaleString()} / ${budgetPacingItems.reduce((s, b) => s + b.monthlyBudget, 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round((budgetPacingItems.reduce((s, b) => s + b.spentThisMonth, 0) / budgetPacingItems.reduce((s, b) => s + b.monthlyBudget, 0)) * 100)}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 4: Wasted Spend                                          */}
        {/* ============================================================ */}
        <TabsContent value="wasted">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-red-500" />
                    Wasted Spend Breakdown
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Total wasted: ${wastedSpendCategories.reduce((s, w) => s + w.amount, 0).toLocaleString()}/month across all platforms
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={wastedSpendCategories.map(w => ({ Category: w.category, Amount: '$' + w.amount.toLocaleString(), Percentage: w.percentage + '%', Details: w.details, Actionable: w.actionable }))}
                  filename="wasted-spend.csv"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {wastedSpendCategories.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium">{item.category}</span>
                      {item.actionable && (
                        <Badge variant="outline" className="text-[9px] text-emerald-500 border-emerald-500/30">Actionable</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                      <span className="text-sm font-bold tabular-nums text-red-500">${item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-4 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{item.details}</p>
                </div>
              ))}
              <Separator className="my-4" />
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    AI Recommendation: Implementing all actionable fixes could save ~${wastedSpendCategories.filter(w => w.actionable).reduce((s, w) => s + w.amount, 0).toLocaleString()}/month
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 5: Negative Keywords                                     */}
        {/* ============================================================ */}
        <TabsContent value="negatives">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    Negative Keyword Discovery
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {negativeKeywordItems.filter(n => n.action === 'add').length} terms recommended for negative keyword lists — ${negativeKeywordItems.reduce((s, n) => s + n.wastedAmount, 0).toLocaleString()} wasted
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-7 text-[10px] gap-1"
                    onClick={() => {
                      negativeKeywordItems.filter(n => n.action === 'add').forEach(n => setNegAdded(prev => new Set(prev).add(n.id)));
                      toast.success(`${negativeKeywordItems.filter(n => n.action === 'add').length} keywords added to negatives`);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Add All to Negatives
                  </Button>
                  <TabExportButton
                    label="Export"
                    data={negativeKeywordItems.map(n => ({ ID: n.id, Keyword: n.keyword, Platform: n.platform, Impressions: n.searchTermImpressions, Clicks: n.clicks, Spend: '$' + n.spend, Conversions: n.conversions, WastedAmount: '$' + n.wastedAmount, MatchType: n.matchType }))}
                    filename="negative-keywords.csv"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[500px]">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Keyword</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Platform</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Impressions</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Clicks</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Spend</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Conversions</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Wasted</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {negativeKeywordItems.map((item) => (
                        <tr key={item.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 px-2 font-medium text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="text-red-400">—</span>
                              {item.keyword}
                              <Badge variant="outline" className="text-[8px] h-4">{item.matchType}</Badge>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-xs">{getPlatformIcon(item.platform)}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">{item.searchTermImpressions.toLocaleString()}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">{item.clicks.toLocaleString()}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">${item.spend.toLocaleString()}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">{item.conversions}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs text-red-500 font-medium">${item.wastedAmount.toLocaleString()}</td>
                          <td className="py-2.5 px-2 text-right">
                            {negAdded.has(item.id) ? (
                              <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[9px]">Added ✓</Badge>
                            ) : item.action === 'already-added' ? (
                              <Badge variant="secondary" className="text-[9px]">Already Added</Badge>
                            ) : (
                              <Button
                                size="sm"
                                className="h-6 text-[9px] gap-1 px-2"
                                onClick={() => {
                                  setNegAdded(prev => new Set(prev).add(item.id));
                                  toast.success('Added to negatives', { description: `"${item.keyword}" on ${item.platform}` });
                                }}
                              >
                                <Plus className="h-2.5 w-2.5" />
                                Add
                              </Button>
                            )}
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
        {/* TAB 6: Quality Score                                         */}
        {/* ============================================================ */}
        <TabsContent value="quality">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Quality Score Monitor
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {qualityScoreItems.length} keywords below threshold (QS &lt; 5) — AI-suggested ad copy rewrites
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={qualityScoreItems.map(q => ({ ID: q.id, Keyword: q.keyword, CurrentQS: q.currentQS, HistoricalQS: q.historicalQS, AdGroup: q.adGroup, Platform: q.platform, ExpectedImprovement: '+' + q.expectedQSImprovement, LandingPageIssue: q.landingPageIssue }))}
                  filename="quality-scores.csv"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {qualityScoreItems.map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border ${item.currentQS <= 2 ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'} transition-colors`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`text-[9px] ${item.currentQS <= 2 ? 'bg-red-500/15 text-red-500' : 'bg-amber-500/15 text-amber-500'}`}>
                          QS: {item.currentQS}/10
                        </Badge>
                        <Badge variant="outline" className="text-[9px]">
                          Was {item.historicalQS}/10
                        </Badge>
                        <span className="text-[9px] text-muted-foreground">{getPlatformIcon(item.platform)} {item.adGroup}</span>
                      </div>
                      <p className="text-sm font-medium">"{item.keyword}"</p>
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold text-emerald-600">✨ Suggested Ad Copy:</p>
                        <p className="text-xs bg-muted/30 p-2 rounded italic">{item.suggestedAdCopy}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-emerald-500">Expected improvement: +{item.expectedQSImprovement} QS</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        <span className="font-medium text-amber-500">Landing page:</span> {item.landingPageIssue}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <ApproveDenyButtons
                        itemId={item.id}
                        onApprove={(id) => {
                          setQsApplied(prev => new Set(prev).add(id));
                          toast.success('Ad copy updated', { description: `"${item.keyword}" — new copy applied` });
                        }}
                        onDeny={(id) => {
                          setQsDismissed(prev => new Set(prev).add(id));
                          toast.info('Suggestion dismissed', { description: `"${item.keyword}" — no change` });
                        }}
                        approvedSet={qsApplied}
                        deniedSet={qsDismissed}
                        approveLabel="Apply"
                        denyLabel="Skip"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 7: Audience Overlap                                      */}
        {/* ============================================================ */}
        <TabsContent value="overlap">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Audience Overlap Analysis
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {audienceOverlapItems.filter(o => o.overlapPct > 50).length} high-overlap pairs detected — ${audienceOverlapItems.reduce((s, o) => s + o.estimatedSavings, 0).toLocaleString()} potential savings
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={audienceOverlapItems.map(o => ({ ID: o.id, AdSet1: o.adSet1, AdSet2: o.adSet2, Platform: o.platform, OverlapPct: o.overlapPct + '%', SharedImpressions: o.sharedImpressions.toLocaleString(), Recommendation: o.recommendation, EstimatedSavings: '$' + o.estimatedSavings.toLocaleString() }))}
                  filename="audience-overlap.csv"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {audienceOverlapItems
                .sort((a, b) => b.overlapPct - a.overlapPct)
                .map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border ${item.overlapPct > 50 ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'} transition-colors`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] text-muted-foreground">{getPlatformIcon(item.platform)} {item.platform}</span>
                        <Badge variant="outline" className="text-[9px]">{item.recommendation === 'merge' ? 'Merge' : 'Adjust'}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm flex-wrap">
                        <span className="font-medium">{item.adSet1}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="font-medium">{item.adSet2}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span>Overlap</span>
                            <span className={`font-bold ${item.overlapPct > 50 ? 'text-red-500' : 'text-amber-500'}`}>{item.overlapPct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full ${item.overlapPct > 50 ? 'bg-red-500' : 'bg-amber-500'}`}
                              style={{ width: `${item.overlapPct}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] text-muted-foreground">{item.sharedImpressions.toLocaleString()} shared impressions</p>
                          <p className="text-xs text-emerald-600 font-medium">Save ${item.estimatedSavings.toLocaleString()}/mo</p>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <ApproveDenyButtons
                        itemId={item.id}
                        onApprove={(id) => {
                          setOverlapApplied(prev => new Set(prev).add(id));
                          toast.success('Merge applied', { description: `${item.adSet1} + ${item.adSet2}` });
                        }}
                        onDeny={(id) => {
                          setOverlapDismissed(prev => new Set(prev).add(id));
                          toast.info('Recommendation dismissed', { description: `No changes to ${item.adSet1} / ${item.adSet2}` });
                        }}
                        approvedSet={overlapApplied}
                        deniedSet={overlapDismissed}
                        approveLabel={item.recommendation === 'merge' ? 'Merge' : 'Apply'}
                        denyLabel="Skip"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 8: Dayparting Analysis                                   */}
        {/* ============================================================ */}
        <TabsContent value="dayparting">
          <div className="space-y-4">
            {/* Schedule adjustments */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Recommended Schedule Adjustments
                    </CardTitle>
                  </div>
                  <TabExportButton
                    label="Export"
                    data={daypartingScheduleAdjustments.map(d => ({ Day: d.day, StartHour: d.startHour, EndHour: d.endHour, CurrentMultiplier: d.currentBidMultiplier, RecommendedMultiplier: d.recommendedMultiplier, Reason: d.reason }))}
                    filename="dayparting-adjustments.csv"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {daypartingScheduleAdjustments.map((adj) => (
                  <div key={adj.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium">{adj.day}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px]">
                        {formatHour(adj.startHour)} — {formatHour(adj.endHour)}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground">×{adj.currentBidMultiplier}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span className={`font-bold ${adj.recommendedMultiplier === 0 ? 'text-red-500' : adj.recommendedMultiplier > 1 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {adj.recommendedMultiplier === 0 ? 'PAUSE' : `×${adj.recommendedMultiplier}`}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{adj.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 7×24 Performance Grid */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  7 × 24 Performance Grid
                </CardTitle>
                <CardDescription className="text-xs">Color indicates conversion efficiency — click cells for details. Red = zero conversions.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="min-w-[900px]">
                    {/* Header row */}
                    <div className="grid grid-cols-[60px_repeat(24,1fr)] gap-px mb-1">
                      <div className="text-[9px] text-muted-foreground font-medium" />
                      {Array.from({ length: 24 }, (_, i) => (
                        <div key={i} className="text-[8px] text-center text-muted-foreground font-medium">{formatHour(i)}</div>
                      ))}
                    </div>
                    {/* Data rows */}
                    {DAYS.map((day) => (
                      <div key={day} className="grid grid-cols-[60px_repeat(24,1fr)] gap-px mb-px">
                        <div className="text-[9px] text-muted-foreground font-medium flex items-center">{formatDayShort(day)}</div>
                        {Array.from({ length: 24 }, (_, hour) => {
                          const cell = daypartingGrid[`${day}-${hour}`];
                          if (!cell) return <div key={hour} className="h-8 bg-muted/10" />;
                          return (
                            <div
                              key={hour}
                              className={`h-8 rounded-sm flex flex-col items-center justify-center cursor-default transition-colors ${getDaypartingCellColor(cell)}`}
                              title={`${day} ${formatHour(hour)}: ${cell.impressions.toLocaleString()} imp · ${cell.clicks} clicks · ${cell.conversions} conv · $${cell.cost.toFixed(2)} · CPA $${cell.cpa}`}
                            >
                              <span className="text-[8px] leading-none">{cell.conversions}</span>
                              <span className="text-[7px] leading-none opacity-70">${cell.cpa}</span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    {/* Legend */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30 flex-wrap">
                      <span className="text-[9px] text-muted-foreground">Legend:</span>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500/30" /><span className="text-[9px] text-muted-foreground">Zero conv</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500/40" /><span className="text-[9px] text-muted-foreground">CPA &lt;$10</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500/20" /><span className="text-[9px] text-muted-foreground">CPA $10-$20</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-500/25" /><span className="text-[9px] text-muted-foreground">CPA $20-$35</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500/20" /><span className="text-[9px] text-muted-foreground">CPA &gt;$35</span></div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 9: NL Campaign Builder                                   */}
        {/* ============================================================ */}
        <TabsContent value="nl-builder">
          <div className="space-y-4">
            <Card className="border-border/50 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  NL Campaign Builder
                  <Badge variant="outline" className="text-[9px]">AI Powered</Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Describe your campaign in plain English and let AI generate the full configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Campaign Description</Label>
                  <Textarea
                    placeholder='e.g. "Launch a retargeting campaign for cart abandoners with $50/day budget targeting women 25-40 interested in jewelry"'
                    value={nlInput}
                    onChange={(e) => setNlInput(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 text-xs gap-1.5"
                      disabled={!nlInput.trim() || nlGenerating}
                      onClick={handleNLGenerate}
                    >
                      {nlGenerating ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                      {nlGenerating ? 'Generating...' : 'Generate Campaign'}
                    </Button>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <span className="text-[9px] text-muted-foreground">Try:</span>
                      {nlCampaignExamples.map((ex) => (
                        <Button
                          key={ex.id}
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[9px] text-primary hover:text-primary/80"
                          onClick={() => setNlInput(ex.rawInput)}
                        >
                          {ex.parsedOutput.objective}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated output */}
            {nlResult && (
              <Card className="border-border/50 border-emerald-500/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                      Generated Campaign Configuration
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px] gap-1"
                      onClick={() => {
                        toast.success('Campaign created', { description: `"${nlResult.campaignName}" is now live`, action: { label: 'Edit Campaign', onClick: () => toast.info('Campaign editor opened') } });
                      }}
                    >
                      <Play className="h-3 w-3" />
                      Launch Campaign
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Campaign name & objective */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/20">
                      <p className="text-[10px] text-muted-foreground mb-1">Campaign Name</p>
                      <p className="text-sm font-semibold">{nlResult.campaignName}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/20">
                      <p className="text-[10px] text-muted-foreground mb-1">Objective</p>
                      <p className="text-sm font-semibold">{nlResult.objective}</p>
                    </div>
                  </div>

                  {/* Budget & bid strategy */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-muted/20">
                      <p className="text-[10px] text-muted-foreground mb-1">Budget</p>
                      <p className="text-sm font-bold tabular-nums">{nlResult.budget}</p>
                      <p className="text-[9px] text-muted-foreground">{nlResult.budgetType}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/20">
                      <p className="text-[10px] text-muted-foreground mb-1">Bid Strategy</p>
                      <p className="text-sm font-semibold">{nlResult.bidStrategy}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/20">
                      <p className="text-[10px] text-muted-foreground mb-1">Platforms</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {nlResult.platforms.map((p) => (
                          <Badge key={p} variant="outline" className="text-[9px]">{getPlatformIcon(p)} {p}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Targeting */}
                  <div className="p-3 rounded-lg bg-muted/20 space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Targeting</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-[9px] text-muted-foreground">Age</p>
                        <p className="text-xs font-medium">{nlResult.targeting.age}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground">Gender</p>
                        <p className="text-xs font-medium">{nlResult.targeting.gender}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground">Locations</p>
                        <p className="text-xs font-medium">{nlResult.targeting.locations.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-muted-foreground">Interests</p>
                        <p className="text-xs font-medium">{nlResult.targeting.interests.join(', ')}</p>
                      </div>
                    </div>
                    {nlResult.targeting.customAudiences.length > 0 && (
                      <div>
                        <p className="text-[9px] text-muted-foreground">Custom Audiences</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {nlResult.targeting.customAudiences.map((ca) => (
                            <Badge key={ca} variant="secondary" className="text-[9px]">{ca}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ad copy suggestions */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ad Copy Suggestions</p>
                    {nlResult.adCopySuggestions.map((copy, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/20 flex items-start gap-3">
                        <span className="text-xs font-bold text-primary/30 mt-0.5">{i + 1}</span>
                        <p className="text-xs italic flex-1">{copy}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[9px] gap-1 shrink-0"
                          onClick={() => {
                            navigator.clipboard.writeText(copy);
                            toast.success('Copied to clipboard');
                          }}
                        >
                          <Copy className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Estimated performance */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <MiniMetric label="Daily Reach" value={nlResult.estimatedPerformance.dailyReach.toLocaleString()} />
                    <MiniMetric label="Weekly Conv" value={nlResult.estimatedPerformance.weeklyConversions.toString()} />
                    <MiniMetric label="Est. ROAS" value={`${nlResult.estimatedPerformance.estimatedROAS}x`} />
                    <MiniMetric label="Est. CPA" value={`$${nlResult.estimatedPerformance.estimatedCPA.toFixed(2)}`} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 10: Auction Insights                                     */}
        {/* ============================================================ */}
        <TabsContent value="auction">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    Auction Insights — Competitor Tracking
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {auctionInsights.length} competitors tracked across {new Set(auctionInsights.map(a => a.platform)).size} platforms
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={auctionInsights.map(a => ({ Competitor: a.competitor, Platform: a.platform, Metric: a.metric, ImpressionShare: a.impressionShare + '%', OverlapRate: a.overlapRate + '%', PositionAboveRate: a.positionAboveRate + '%', OutrankingShare: a.outrankingShare + '%', TopOfPageRate: a.topOfPageRate + '%', Trend: a.trend, TrendChange: (a.trendChange > 0 ? '+' : '') + a.trendChange + '%' }))}
                  filename="auction-insights.csv"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[500px]">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Competitor</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Platform</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Metric</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Imp Share</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Overlap</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Pos Above</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Outrank</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Top Page</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auctionInsights.map((item) => (
                        <tr key={item.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 px-2 font-medium text-xs">{item.competitor}</td>
                          <td className="py-2.5 px-2 text-xs">{getPlatformIcon(item.platform)}</td>
                          <td className="py-2.5 px-2">
                            <Badge variant="outline" className="text-[9px]">{item.metric}</Badge>
                          </td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs font-medium">{item.impressionShare}%</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">{item.overlapRate}%</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">{item.positionAboveRate}%</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">{item.outrankingShare}%</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">{item.topOfPageRate}%</td>
                          <td className="py-2.5 px-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {item.trend === 'up' ? (
                                <TrendingUp className="h-3 w-3 text-emerald-500" />
                              ) : item.trend === 'down' ? (
                                <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                              ) : (
                                <Activity className="h-3 w-3 text-amber-500" />
                              )}
                              <span className={`text-[10px] tabular-nums font-medium ${item.trend === 'up' ? 'text-emerald-500' : item.trend === 'down' ? 'text-red-500' : 'text-amber-500'}`}>
                                {item.trendChange > 0 ? '+' : ''}{item.trendChange}%
                              </span>
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
        {/* TAB 11: Conversion Tracking Audit                            */}
        {/* ============================================================ */}
        <TabsContent value="tracking">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-primary" />
                    Conversion Tracking Audit
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {conversionTrackingIssues.filter(c => c.severity === 'critical').length} critical issues affecting attribution accuracy
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={conversionTrackingIssues.map(c => ({ ID: c.id, Platform: c.platform, IssueType: c.issueType, Severity: c.severity, Title: c.title, Description: c.description, Impact: c.impact, AffectedEvents: c.affectedEvents, Recommendation: c.recommendation }))}
                  filename="conversion-tracking.csv"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversionTrackingIssues.map((issue) => (
                <div key={issue.id} className={`p-4 rounded-lg border ${getSeverityBg(issue.severity)} transition-colors`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`text-[9px] ${getSeverityBadge(issue.severity)}`}>
                          {issue.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-[9px]">
                          {issue.issueType.replace(/-/g, ' ')}
                        </Badge>
                        <span className="text-[9px] text-muted-foreground">{getPlatformIcon(issue.platform)} {issue.platform}</span>
                        <span className="text-[9px] text-muted-foreground">{issue.id}</span>
                      </div>
                      <p className="text-sm font-medium">{issue.title}</p>
                      <p className="text-xs text-muted-foreground">{issue.description}</p>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="text-red-500 font-medium">Impact: {issue.impact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-muted-foreground">Affected events:</span>
                        <span className="text-[10px] font-medium">{issue.affectedEvents}</span>
                      </div>
                      <p className="text-xs text-emerald-600">💡 {issue.recommendation}</p>
                    </div>
                    <div className="shrink-0">
                      <ApproveDenyButtons
                        itemId={issue.id}
                        onApprove={(id) => {
                          setConvApproved(prev => new Set(prev).add(id));
                          toast.success('Fix applied', { description: issue.title });
                        }}
                        onDeny={(id) => {
                          setConvDenied(prev => new Set(prev).add(id));
                          toast.info('Issue dismissed', { description: issue.title });
                        }}
                        approvedSet={convApproved}
                        deniedSet={convDenied}
                        approveLabel="Fix"
                        denyLabel="Dismiss"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 12: Cross-Platform View                                  */}
        {/* ============================================================ */}
        <TabsContent value="cross-platform">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-primary" />
                    Cross-Platform Campaign View
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {crossPlatformCampaigns.length} campaigns across {new Set(crossPlatformCampaigns.map(c => c.platform)).size} platforms — unified metrics
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={crossPlatformCampaigns.map(c => ({
                    Campaign: c.campaignName, Platform: c.platform, Status: c.status, Objective: c.objective,
                    Budget: '$' + c.budget, Spent: '$' + c.spent, Impressions: c.impressions.toLocaleString(),
                    Clicks: c.clicks.toLocaleString(), Conversions: c.conversions, ROAS: c.roas + 'x',
                    CTR: c.ctr + '%', CPC: '$' + c.cpc.toFixed(3), CPA: '$' + c.cpa.toFixed(2),
                    StartDate: c.startDate, EndDate: c.endDate
                  }))}
                  filename="cross-platform-campaigns.csv"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[500px]">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Campaign</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Platform</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Spent</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">ROAS</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">CTR</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">CPA</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Conversions</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crossPlatformCampaigns.map((campaign) => (
                        <tr key={campaign.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 px-2 font-medium text-xs max-w-[160px] truncate">{campaign.campaignName}</td>
                          <td className="py-2.5 px-2 text-xs">{getPlatformIcon(campaign.platform)}</td>
                          <td className="py-2.5 px-2">
                            <Badge variant={getStatusBadgeVariant(campaign.status)} className="text-[9px]">
                              {campaign.status === 'active' ? 'Active' : campaign.status === 'paused' ? 'Paused' : campaign.status === 'draft' ? 'Draft' : 'Done'}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">${(campaign.spent / 1000).toFixed(1)}K</td>
                          <td className={`py-2.5 px-2 text-right tabular-nums text-xs font-bold ${campaign.roas >= 4 ? 'text-emerald-500' : campaign.roas >= 2.5 ? 'text-amber-500' : campaign.roas > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {campaign.roas > 0 ? `${campaign.roas}x` : '—'}
                          </td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">{campaign.ctr > 0 ? `${campaign.ctr}%` : '—'}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">${campaign.cpa > 0 ? campaign.cpa.toFixed(2) : '—'}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs font-medium">{campaign.conversions.toLocaleString()}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs text-muted-foreground">{campaign.clicks.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
