'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles, Palette, Download, TrendingUp, Eye, Layers, FlaskConical, Target,
  BookOpen, Cpu, Check, X, ChevronDown, ChevronUp, Pause, Copy, Archive,
  ArrowUpRight, ArrowDownRight, Minus, RefreshCw, Star, Zap, Users,
  Image, Film, LayoutGrid, Clock, BarChart3, Play, Plus, Lightbulb,
  Shield, ThumbsUp, ThumbsDown, BadgePercent, Percent, MousePointerClick,
  DollarSign, Award, Beaker, CircleDot, FileText, Wand2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAction } from '@/lib/action-context';
import { exportToCSV } from '@/lib/real-actions';
import { ActionBar } from './action-bar';
import {
  creativeLibrary, aiGeneratedCreatives, performanceByType, performanceByHook,
  performanceByFormat, reviewQueueItems, testResults, topPerformerPatterns,
  creativeGenerationQueue, platformGuides,
  getStatusColor, getStatusLabel, getTypeLabel, getTypeBadgeVariant,
  getTrendIcon, getTrendColor, getRecommendationBadge, getConfidenceColor,
  getConfidenceBg, getPlatformIcon, getPlatformBadgeColor,
  type CreativeItem, type AIGeneratedCreative, type CreativeType, type Platform,
  type Recommendation, type SuggestedFormat,
} from '@/lib/creative-studio-data';

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function MiniMetric({ label, value, subtext, icon: Icon }: { label: string; value: string; subtext?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col p-4 rounded-xl bg-muted/20 border border-border/30">
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
      </div>
      <p className="text-xl font-bold tabular-nums">{value}</p>
      {subtext && <p className="text-[10px] text-muted-foreground mt-0.5">{subtext}</p>}
    </div>
  );
}

function ApproveDenyButtons({
  itemId,
  onApprove,
  onDeny,
  approvedSet,
  deniedSet,
  approveLabel = 'Approve',
  denyLabel = 'Reject',
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
    return <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px]">Approved ✓</Badge>;
  }
  if (deniedSet.has(itemId)) {
    return <Badge variant="secondary" className="text-muted-foreground text-[10px]">Rejected</Badge>;
  }
  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-[10px] gap-1 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 px-2"
        onClick={() => onDeny(itemId)}
      >
        <X className="h-3 w-3" />
        <span className="hidden sm:inline">{denyLabel}</span>
      </Button>
      <Button
        size="sm"
        className="h-7 text-[10px] gap-1 px-2"
        onClick={() => onApprove(itemId)}
      >
        <Check className="h-3 w-3" />
        <span className="hidden sm:inline">{approveLabel}</span>
      </Button>
    </div>
  );
}

function TabExportButton({ data, filename }: { data: Record<string, unknown>[]; filename: string }) {
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
      <span className="hidden sm:inline">Export</span>
    </Button>
  );
}

function ProgressBar({ value, max, color = 'bg-primary' }: { value: number; max: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export function CreativeStudio() {
  const { executeAction, automations } = useAction();
  const creativeAutomations = automations.filter(a => a.module === 'creative');

  // State
  const [expandedCreative, setExpandedCreative] = useState<string | null>(null);
  const [approvedSuggestions, setApprovedSuggestions] = useState<Set<string>>(new Set());
  const [deniedSuggestions, setDeniedSuggestions] = useState<Set<string>>(new Set());
  const [approvedReviews, setApprovedReviews] = useState<Set<string>>(new Set());
  const [deniedReviews, setDeniedReviews] = useState<Set<string>>(new Set());

  // Generate form state
  const [genPlatforms, setGenPlatforms] = useState<Platform[]>([]);
  const [genType, setGenType] = useState<CreativeType>('static_image');
  const [genFormat, setGenFormat] = useState<SuggestedFormat>('lifestyle');
  const [genCampaign, setGenCampaign] = useState('');
  const [genBrief, setGenBrief] = useState('');
  const [genGenerating, setGenGenerating] = useState(false);
  const [genResult, setGenResult] = useState<AIGeneratedCreative | null>(null);

  // Computed KPIs
  const kpis = useMemo(() => {
    const totalCreatives = creativeLibrary.length;
    const activeTests = testResults.filter(t => t.actionTaken === 'continue_test').length;
    const activeCreatives = creativeLibrary.filter(c => c.status === 'active');
    const avgCTR = activeCreatives.length > 0
      ? +(activeCreatives.reduce((s, c) => s + c.ctr, 0) / activeCreatives.length).toFixed(1)
      : 0;
    const topROAS = Math.max(...creativeLibrary.map(c => c.roas));
    const pendingReview = aiGeneratedCreatives.filter(c => c.status === 'pending_review').length;
    return { totalCreatives, activeTests, avgCTR, topROAS, pendingReview };
  }, []);

  // Toggle platform in generate form
  const togglePlatform = (p: Platform) => {
    setGenPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  // Handle AI generation
  const handleGenerate = () => {
    if (genPlatforms.length === 0 || !genBrief.trim()) {
      toast.error('Missing fields', { description: 'Select at least one platform and add a brief description' });
      return;
    }
    setGenGenerating(true);
    setGenResult(null);
    setTimeout(() => {
      const mockCreative: AIGeneratedCreative = {
        id: `AI-GEN-${Date.now()}`,
        name: `${genBrief.slice(0, 40)}${genBrief.length > 40 ? '...' : ''}`,
        type: genType,
        platform: genPlatforms[0],
        suggestedFormat: genFormat,
        hook_text: genType === 'reel' ? 'Wait for this transformation... ✨' : genType === 'ugc' ? 'POV: Your friends notice this immediately' : 'Discover the difference quality makes',
        body_text: `AI-generated creative for ${genCampaign || 'general campaign'}. Based on top-performing patterns from ${creativeLibrary.filter(c => c.roas > 7).length} high-ROAS creatives.`,
        cta_text: genType === 'story' ? 'Swipe Up' : 'Shop Now',
        visual_description: `${genFormat} format showing ${genBrief}. Optimized for ${genPlatforms.join(', ')} dimensions. Uses warm gold tones with ${genFormat === 'flat_lay' ? 'aesthetic prop arrangement' : genFormat === 'ugc' ? 'authentic creator-style presentation' : 'lifestyle model photography'}.`,
        targetAudience: 'Primary: Women 25-40, mid-to-high income jewelry buyers',
        confidence_score: Math.floor(Math.random() * 15) + 82,
        status: 'pending_review',
        generatedAt: new Date().toISOString(),
      };
      setGenResult(mockCreative);
      setGenGenerating(false);
      toast.success('Creative generated', { description: `"${mockCreative.name}" ready for review` });
    }, 2500);
  };

  const allPlatforms: Platform[] = ['Instagram', 'Facebook', 'TikTok', 'Pinterest', 'YouTube'];
  const allTypes: { value: CreativeType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: 'static_image', label: 'Image', icon: Image },
    { value: 'video_script', label: 'Video', icon: Film },
    { value: 'carousel', label: 'Carousel', icon: LayoutGrid },
    { value: 'ugc', label: 'UGC', icon: Users },
    { value: 'reel', label: 'Reel', icon: Play },
  ];
  const allFormats: { value: SuggestedFormat; label: string }[] = [
    { value: 'close_up', label: 'Close-Up' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'flat_lay', label: 'Flat Lay' },
    { value: 'ugc', label: 'UGC Style' },
    { value: 'before_after', label: 'Before/After' },
    { value: 'testimonial', label: 'Testimonial' },
    { value: 'product', label: 'Product' },
  ];

  return (
    <div className="space-y-6">
      {/* ========== Hero Card ========== */}
      <Card className="border-border/50 bg-gradient-to-br from-card via-card to-purple-500/5">
        <CardContent className="p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Creative Studio</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Ryze AI Creative Generation — {kpis.totalCreatives} creatives · {kpis.activeTests} active tests · {kpis.pendingReview} pending AI review
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-500 lg:ml-auto">
              <Cpu className="h-3 w-3 mr-1" />
              Ryze AI Powered
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* ========== KPI Row ========== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <MiniMetric label="Total Creatives" value={`${kpis.totalCreatives}`} subtext="Across all platforms" icon={Layers} />
        <MiniMetric label="Active Tests" value={`${kpis.activeTests}`} subtext="A/B tests running" icon={FlaskConical} />
        <MiniMetric label="Avg CTR" value={`${kpis.avgCTR}%`} subtext="Active creatives" icon={MousePointerClick} />
        <MiniMetric label="Top ROAS" value={`${kpis.topROAS}x`} subtext="Best performer" icon={TrendingUp} />
        <MiniMetric label="Pending Review" value={`${kpis.pendingReview}`} subtext="AI suggestions" icon={Eye} />
      </div>

      {/* ========== Action Bar ========== */}
      <ActionBar
        module="creative-studio"
        primary={{
          label: 'Generate New Creative',
          icon: Wand2,
          onClick: () => {
            const generateTab = document.querySelector('[data-value="generate"]');
            if (generateTab) (generateTab as HTMLElement).click();
          },
        }}
        actions={[
          {
            label: 'Export Performance Report',
            icon: Download,
            onClick: () => {
              exportToCSV([
                ...creativeLibrary.map(c => ({ Name: c.name, Type: c.type, Platform: c.platform, Status: c.status, CTR: c.ctr + '%', ConvRate: c.conversionRate + '%', ROAS: c.roas + 'x', Impressions: c.impressions, Clicks: c.clicks })),
                ...performanceByType.map(p => ({ Analysis: 'By Type', Type: p.type, AvgCTR: p.avgCTR + '%', AvgConvRate: p.avgConversionRate + '%', AvgROAS: p.avgROAS + 'x', TotalSpend: '$' + p.totalSpend, Conversions: p.totalConversions, SampleSize: p.sampleSize })),
                ...testResults.map(t => ({ Test: t.testName, Challenger: t.challengerCreative, Control: t.controlCreative, Metric: t.metricTested, Improvement: t.improvement + '%', Significant: t.statisticalSignificance ? 'Yes' : 'No', Winner: t.winner, Action: t.actionTaken })),
              ], 'creative-studio-report.csv');
              toast.success('Performance report exported', { description: 'creative-studio-report.csv downloaded' });
            },
          },
          {
            label: 'View Top Performers',
            icon: Star,
            onClick: () => {
              const libraryTab = document.querySelector('[data-value="library"]');
              if (libraryTab) (libraryTab as HTMLElement).click();
            },
          },
        ]}
        relevantAutomations={creativeAutomations}
      />

      {/* ========== Main Tabs ========== */}
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1 bg-muted/50">
          <TabsTrigger value="library" data-value="library" className="text-xs gap-1 data-[state=active]:bg-primary"><Layers className="h-3 w-3" />Library</TabsTrigger>
          <TabsTrigger value="suggestions" data-value="suggestions" className="text-xs gap-1 data-[state=active]:bg-primary"><Sparkles className="h-3 w-3" />AI Suggestions</TabsTrigger>
          <TabsTrigger value="analysis" data-value="analysis" className="text-xs gap-1 data-[state=active]:bg-primary"><BarChart3 className="h-3 w-3" />Analysis</TabsTrigger>
          <TabsTrigger value="testing" data-value="testing" className="text-xs gap-1 data-[state=active]:bg-primary"><FlaskConical className="h-3 w-3" />Testing</TabsTrigger>
          <TabsTrigger value="generate" data-value="generate" className="text-xs gap-1 data-[state=active]:bg-primary"><Wand2 className="h-3 w-3" />Generate</TabsTrigger>
          <TabsTrigger value="patterns" data-value="patterns" className="text-xs gap-1 data-[state=active]:bg-primary"><Lightbulb className="h-3 w-3" />Patterns</TabsTrigger>
          <TabsTrigger value="platforms" data-value="platforms" className="text-xs gap-1 data-[state=active]:bg-primary"><BookOpen className="h-3 w-3" />Platform Guide</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* TAB 1: Creative Library                                      */}
        {/* ============================================================ */}
        <TabsContent value="library">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    Creative Library
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {creativeLibrary.length} creatives across {new Set(creativeLibrary.map(c => c.platform)).size} platforms
                  </CardDescription>
                </div>
                <TabExportButton
                  data={creativeLibrary.map(c => ({ ID: c.id, Name: c.name, Type: c.type, Platform: c.platform, Status: c.status, CTR: c.ctr + '%', ConvRate: c.conversionRate + '%', ROAS: c.roas + 'x', Impressions: c.impressions, Clicks: c.clicks, Campaign: c.campaign, CreatedAt: c.createdAt }))}
                  filename="creative-library.csv"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[600px]">
                <div className="space-y-2">
                  {creativeLibrary.map((creative) => {
                    const isExpanded = expandedCreative === creative.id;
                    const isLive = creative.status === 'active' && creative.roas > 0;
                    return (
                      <div key={creative.id} className={`rounded-lg border border-border/30 transition-all ${isExpanded ? 'bg-muted/30' : 'bg-muted/10 hover:bg-muted/20'}`}>
                        <div
                          className="flex items-center gap-3 p-3 cursor-pointer"
                          onClick={() => setExpandedCreative(isExpanded ? null : creative.id)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium truncate">{creative.name}</span>
                              <Badge variant={getTypeBadgeVariant(creative.type)} className="text-[9px]">{getTypeLabel(creative.type)}</Badge>
                              <Badge variant="outline" className={`text-[9px] ${getPlatformBadgeColor(creative.platform)}`}>
                                {getPlatformIcon(creative.platform)} {creative.platform}
                              </Badge>
                              <Badge className={`text-[9px] ${getStatusColor(creative.status)} border`}>{getStatusLabel(creative.status)}</Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span>{creative.campaign}</span>
                              <span>{creative.dimensions}</span>
                              {isLive && (
                                <>
                                  <span className={getTrendColor(creative.trend)}>
                                    {getTrendIcon(creative.trend)} {creative.trend === 'up' ? '+' : ''}{creative.trend === 'stable' ? '~' : ''}{creative.ctr}%
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            {isLive && (
                              <>
                                <div className="text-right hidden sm:block">
                                  <p className="text-xs text-muted-foreground">CTR</p>
                                  <p className="text-sm font-bold tabular-nums">{creative.ctr}%</p>
                                </div>
                                <div className="text-right hidden md:block">
                                  <p className="text-xs text-muted-foreground">ROAS</p>
                                  <Badge variant={creative.roas >= 8 ? 'default' : creative.roas >= 5 ? 'secondary' : 'outline'} className="text-[10px]">
                                    {creative.roas}x
                                  </Badge>
                                </div>
                                <div className="text-right hidden lg:block">
                                  <p className="text-xs text-muted-foreground">Clicks</p>
                                  <p className="text-sm font-semibold tabular-nums">{creative.clicks.toLocaleString()}</p>
                                </div>
                              </>
                            )}
                            <div className="flex items-center gap-1">
                              {creative.status === 'active' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-muted-foreground hover:text-amber-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    executeAction({
                                      action: `Pause: ${creative.name}`,
                                      module: 'creative-studio',
                                      detail: `Paused creative: ${creative.name}`,
                                      successMsg: `Paused: ${creative.name}`,
                                    });
                                  }}
                                >
                                  <Pause className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-blue-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.success('Creative duplicated', { description: `Copy of "${creative.name}" created` });
                                }}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast.info('Creative archived', { description: `"${creative.name}" moved to archive` });
                                }}
                              >
                                <Archive className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-0">
                            <Separator className="mb-3" />
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                              <div className="p-2 rounded-lg bg-muted/30">
                                <p className="text-[10px] text-muted-foreground">Impressions</p>
                                <p className="text-sm font-bold tabular-nums">{creative.impressions.toLocaleString()}</p>
                              </div>
                              <div className="p-2 rounded-lg bg-muted/30">
                                <p className="text-[10px] text-muted-foreground">Clicks</p>
                                <p className="text-sm font-bold tabular-nums">{creative.clicks.toLocaleString()}</p>
                              </div>
                              <div className="p-2 rounded-lg bg-muted/30">
                                <p className="text-[10px] text-muted-foreground">CTR</p>
                                <p className="text-sm font-bold tabular-nums">{creative.ctr}%</p>
                              </div>
                              <div className="p-2 rounded-lg bg-muted/30">
                                <p className="text-[10px] text-muted-foreground">Conv. Rate</p>
                                <p className="text-sm font-bold tabular-nums">{creative.conversionRate}%</p>
                              </div>
                              <div className="p-2 rounded-lg bg-muted/30">
                                <p className="text-[10px] text-muted-foreground">ROAS</p>
                                <p className={`text-sm font-bold tabular-nums ${creative.roas >= 8 ? 'text-emerald-500' : creative.roas >= 5 ? 'text-amber-500' : 'text-red-500'}`}>{creative.roas}x</p>
                              </div>
                              <div className="p-2 rounded-lg bg-muted/30">
                                <p className="text-[10px] text-muted-foreground">Created</p>
                                <p className="text-sm font-medium">{creative.createdAt}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 2: AI Suggestions                                        */}
        {/* ============================================================ */}
        <TabsContent value="suggestions">
          <Card className="border-border/50 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI-Generated Creative Suggestions
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {aiGeneratedCreatives.filter(c => c.status === 'pending_review').length} suggestions pending review — approve or reject each
                  </CardDescription>
                </div>
                <TabExportButton
                  data={aiGeneratedCreatives.map(c => ({ ID: c.id, Name: c.name, Type: c.type, Platform: c.platform, Format: c.suggestedFormat, Hook: c.hook_text, CTA: c.cta_text, Audience: c.targetAudience, Confidence: c.confidence_score + '%', Status: c.status }))}
                  filename="ai-suggestions.csv"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiGeneratedCreatives.map((creative) => {
                const isApproved = approvedSuggestions.has(creative.id);
                const isDenied = deniedSuggestions.has(creative.id);
                return (
                  <div key={creative.id} className={`p-4 rounded-lg border transition-all ${
                    isApproved
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : isDenied
                      ? 'bg-muted/5 opacity-50 border-border/20'
                      : 'bg-muted/10 hover:bg-muted/20 border-border/30'
                  }`}>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold">{creative.name}</span>
                            <Badge variant={getTypeBadgeVariant(creative.type)} className="text-[9px]">{getTypeLabel(creative.type)}</Badge>
                            <Badge variant="outline" className={`text-[9px] ${getPlatformBadgeColor(creative.platform)}`}>
                              {getPlatformIcon(creative.platform)} {creative.platform}
                            </Badge>
                            <Badge variant="outline" className="text-[9px]">{creative.suggestedFormat.replace('_', ' ')}</Badge>
                            {isApproved && <Badge className="bg-emerald-500/15 text-emerald-500 text-[9px]">Approved ✓</Badge>}
                            {isDenied && <Badge variant="secondary" className="text-[9px]">Rejected</Badge>}
                          </div>
                        </div>
                        <ApproveDenyButtons
                          itemId={creative.id}
                          onApprove={(id) => {
                            setApprovedSuggestions(prev => new Set(prev).add(id));
                            toast.success('Creative approved', {
                              description: `"${creative.name}" added to active queue`,
                              action: { label: 'View in Library', onClick: () => toast.info('Opening library...') },
                            });
                          }}
                          onDeny={(id) => {
                            setDeniedSuggestions(prev => new Set(prev).add(id));
                            toast.info('Creative rejected', { description: `"${creative.name}" dismissed` });
                          }}
                          approvedSet={approvedSuggestions}
                          deniedSet={deniedSuggestions}
                        />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <div className="p-3 rounded-lg bg-muted/20">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Hook</p>
                            <p className="text-sm font-medium">{creative.hook_text}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/20">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Body</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{creative.body_text}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="p-3 rounded-lg bg-muted/20">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Visual Direction</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{creative.visual_description}</p>
                          </div>
                          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20">
                            <div>
                              <p className="text-[10px] text-muted-foreground">Confidence</p>
                              <p className={`text-lg font-bold tabular-nums ${getConfidenceColor(creative.confidence_score)}`}>{creative.confidence_score}%</p>
                            </div>
                            <div className="flex-1">
                              <ProgressBar value={creative.confidence_score} max={100} color={getConfidenceBg(creative.confidence_score)} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {creative.targetAudience}</span>
                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> CTA: <span className="font-medium text-foreground">{creative.cta_text}</span></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 3: Performance Analysis                                   */}
        {/* ============================================================ */}
        <TabsContent value="analysis">
          <div className="space-y-6">
            {/* Review Queue */}
            <Card className="border-border/50 border-amber-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-500" />
                      AI Review Queue
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {reviewQueueItems.length} items pending review — one-click approve or reject
                    </CardDescription>
                  </div>
                  <TabExportButton
                    data={reviewQueueItems.map(r => ({ ID: r.id, CreativeID: r.creativeId, Platform: r.platform, Format: r.suggestedFormat, Thumbnail: r.thumbnailDescription, Similarity: r.similarityToTopPerformers + '%', Rationale: r.aiRationale }))}
                    filename="review-queue.csv"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {reviewQueueItems.map((item) => (
                  <div key={item.id} className={`p-3 rounded-lg border transition-all ${
                    approvedReviews.has(item.id)
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : deniedReviews.has(item.id)
                      ? 'bg-muted/5 opacity-50 border-border/20'
                      : 'bg-muted/10 hover:bg-muted/20 border-border/30'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={`text-[9px] ${getPlatformBadgeColor(item.platform)}`}>
                            {getPlatformIcon(item.platform)} {item.platform}
                          </Badge>
                          <Badge variant="outline" className="text-[9px]">{item.suggestedFormat.replace('_', ' ')}</Badge>
                          <span className="text-[10px] text-muted-foreground">{item.creativeId}</span>
                        </div>
                        <p className="text-sm font-medium">{item.thumbnailDescription}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">💡 {item.aiRationale}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-muted-foreground">
                            Similarity to top performers:
                          </span>
                          <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                            <ProgressBar value={item.similarityToTopPerformers} max={100} color={item.similarityToTopPerformers >= 85 ? 'bg-emerald-500' : item.similarityToTopPerformers >= 70 ? 'bg-blue-500' : 'bg-amber-500'} />
                            <span className="text-[10px] font-bold tabular-nums">{item.similarityToTopPerformers}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <ApproveDenyButtons
                          itemId={item.id}
                          onApprove={(id) => {
                            setApprovedReviews(prev => new Set(prev).add(id));
                            toast.success('Creative approved', { description: `${item.creativeId} approved for production` });
                          }}
                          onDeny={(id) => {
                            setDeniedReviews(prev => new Set(prev).add(id));
                            toast.info('Creative rejected', { description: `${item.creativeId} sent back for revision` });
                          }}
                          approvedSet={approvedReviews}
                          deniedSet={deniedReviews}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* By Type */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base font-semibold">Performance by Creative Type</CardTitle>
                    <CardDescription className="text-xs mt-1">Average metrics across {performanceByType.reduce((s, p) => s + p.sampleSize, 0)} creatives</CardDescription>
                  </div>
                  <TabExportButton
                    data={performanceByType.map(p => ({ Type: p.type, AvgCTR: p.avgCTR + '%', AvgConvRate: p.avgConversionRate + '%', AvgROAS: p.avgROAS + 'x', TotalSpend: '$' + p.totalSpend, Conversions: p.totalConversions, SampleSize: p.sampleSize }))}
                    filename="performance-by-type.csv"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Type</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Avg CTR</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Avg Conv.</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Avg ROAS</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground hidden sm:table-cell">Spend</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground hidden md:table-cell">Conversions</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground hidden lg:table-cell">Samples</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground hidden lg:table-cell">CTR Bar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceByType.sort((a, b) => b.avgROAS - a.avgROAS).map((item) => (
                        <tr key={item.type} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 px-2">
                            <Badge variant={getTypeBadgeVariant(item.type)} className="text-[10px]">{getTypeLabel(item.type)}</Badge>
                          </td>
                          <td className="py-2.5 px-2 text-right tabular-nums font-medium">{item.avgCTR}%</td>
                          <td className="py-2.5 px-2 text-right tabular-nums">{item.avgConversionRate}%</td>
                          <td className="py-2.5 px-2 text-right">
                            <span className={`font-bold tabular-nums ${item.avgROAS >= 9 ? 'text-emerald-500' : item.avgROAS >= 6 ? 'text-amber-500' : 'text-red-500'}`}>
                              {item.avgROAS}x
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs text-muted-foreground hidden sm:table-cell">${(item.totalSpend / 1000).toFixed(1)}K</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs hidden md:table-cell">{item.totalConversions.toLocaleString()}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs text-muted-foreground hidden lg:table-cell">{item.sampleSize}</td>
                          <td className="py-2.5 px-2 hidden lg:table-cell">
                            <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${item.avgROAS >= 9 ? 'bg-emerald-500' : item.avgROAS >= 6 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${(item.avgCTR / 8) * 100}%` }}
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

            {/* By Hook & By Format side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Performance by Hook Style</CardTitle>
                  <CardDescription className="text-xs mt-1">Which hook patterns drive the most engagement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {performanceByHook.sort((a, b) => b.avgCTR - a.avgCTR).map((item) => (
                    <div key={item.hook} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize">{item.hook.replace('_', ' ')}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <ProgressBar value={item.avgCTR} max={8} color={item.avgCTR >= 6 ? 'bg-emerald-500' : item.avgCTR >= 4 ? 'bg-blue-500' : 'bg-amber-500'} />
                        </div>
                      </div>
                      <div className="text-right shrink-0 space-y-0.5">
                        <p className="text-sm font-bold tabular-nums">{item.avgCTR}%</p>
                        <p className="text-[10px] text-muted-foreground">{item.usageCount} uses · {getPlatformIcon(item.topPlatform)} {item.topPlatform}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Performance by Visual Format</CardTitle>
                  <CardDescription className="text-xs mt-1">Creative format recommendations based on ROAS data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {performanceByFormat.sort((a, b) => b.avgROAS - a.avgROAS).map((item) => {
                    const rec = getRecommendationBadge(item.recommendation);
                    return (
                      <div key={item.format} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium capitalize">{item.format.replace('_', ' ')}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <ProgressBar value={item.avgROAS} max={12} color={item.avgROAS >= 8 ? 'bg-emerald-500' : item.avgROAS >= 5 ? 'bg-blue-500' : 'bg-amber-500'} />
                          </div>
                        </div>
                        <div className="text-right shrink-0 space-y-0.5">
                          <p className="text-sm font-bold tabular-nums">{item.avgROAS}x ROAS</p>
                          <p className="text-[10px] text-muted-foreground">{item.avgCTR}% CTR</p>
                        </div>
                        <Badge className={`text-[9px] border ${rec.color} shrink-0`}>{rec.label}</Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 4: Continuous Testing                                     */}
        {/* ============================================================ */}
        <TabsContent value="testing">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    Continuous Testing Results
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {testResults.length} A/B tests completed — {testResults.filter(t => t.winner === 'challenger').length} challenger wins, {testResults.filter(t => t.winner === 'control').length} control wins
                  </CardDescription>
                </div>
                <TabExportButton
                  data={testResults.map(t => ({ Test: t.testName, Challenger: t.challengerCreative, Control: t.controlCreative, Metric: t.metricTested, ChallengerPerf: t.challengerPerformance, ControlPerf: t.controlPerformance, Improvement: t.improvement + '%', Significant: t.statisticalSignificance ? 'Yes' : 'No', Winner: t.winner, Action: t.actionTaken, Date: t.date }))}
                  filename="ab-test-results.csv"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[500px]">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Test</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground hidden xl:table-cell">Challenger</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Challenger</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Control</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Improvement</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground hidden sm:table-cell">Significant</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Winner</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground hidden lg:table-cell">Action</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground hidden md:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults.map((test) => (
                        <tr key={test.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 px-2">
                            <p className="text-xs font-medium max-w-[160px] truncate">{test.testName}</p>
                            <p className="text-[10px] text-muted-foreground">{test.metricTested}</p>
                          </td>
                          <td className="py-2.5 px-2 text-xs text-muted-foreground max-w-[140px] truncate hidden xl:table-cell">{test.challengerCreative}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs font-medium">{test.challengerPerformance}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">{test.controlPerformance}</td>
                          <td className="py-2.5 px-2 text-right">
                            <span className={`text-xs font-bold tabular-nums ${test.improvement > 0 ? 'text-emerald-500' : test.improvement < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                              {test.improvement > 0 ? '+' : ''}{test.improvement}%
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center hidden sm:table-cell">
                            {test.statisticalSignificance ? (
                              <Badge className="bg-emerald-500/15 text-emerald-500 text-[9px]">95% CI</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[9px]">Low CI</Badge>
                            )}
                          </td>
                          <td className="py-2.5 px-2">
                            {test.winner === 'challenger' ? (
                              <Badge className="bg-blue-500/15 text-blue-500 text-[9px]">Challenger</Badge>
                            ) : test.winner === 'control' ? (
                              <Badge variant="secondary" className="text-[9px]">Control</Badge>
                            ) : (
                              <Badge variant="outline" className="text-[9px]">Inconclusive</Badge>
                            )}
                          </td>
                          <td className="py-2.5 px-2 hidden lg:table-cell">
                            <Badge
                              variant="outline"
                              className={`text-[9px] ${test.actionTaken === 'scale_challenger' ? 'border-emerald-500/30 text-emerald-500' : test.actionTaken === 'stop' ? 'border-red-500/30 text-red-500' : 'border-amber-500/30 text-amber-500'}`}
                            >
                              {test.actionTaken.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-2 text-xs text-muted-foreground hidden md:table-cell">{test.date}</td>
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
        {/* TAB 5: Generate Creative                                      */}
        {/* ============================================================ */}
        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-primary" />
                  Generate New Creative with AI
                </CardTitle>
                <CardDescription className="text-xs mt-1">Configure your creative brief and let Ryze AI generate optimized creatives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Platform Selection */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Platforms</Label>
                  <div className="flex flex-wrap gap-2">
                    {allPlatforms.map((p) => (
                      <Badge
                        key={p}
                        variant={genPlatforms.includes(p) ? 'default' : 'outline'}
                        className={`text-xs cursor-pointer transition-colors ${genPlatforms.includes(p) ? '' : 'hover:bg-muted/50'}`}
                        onClick={() => togglePlatform(p)}
                      >
                        {getPlatformIcon(p)} {p}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Creative Type */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Creative Type</Label>
                  <div className="flex flex-wrap gap-2">
                    {allTypes.map((t) => (
                      <Button
                        key={t.value}
                        variant={genType === t.value ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={() => setGenType(t.value)}
                      >
                        <t.icon className="h-3 w-3" />
                        {t.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Format Style */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Format Style</Label>
                  <div className="flex flex-wrap gap-2">
                    {allFormats.map((f) => (
                      <Button
                        key={f.value}
                        variant={genFormat === f.value ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setGenFormat(f.value)}
                      >
                        {f.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Campaign */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Target Campaign</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Valentine Collection', 'Spring Collection', 'Wedding Collection', 'Gift Collection', 'Brand Story'].map((c) => (
                      <Badge
                        key={c}
                        variant={genCampaign === c ? 'default' : 'outline'}
                        className="text-xs cursor-pointer transition-colors"
                        onClick={() => setGenCampaign(genCampaign === c ? '' : c)}
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Brief */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Brief / Description</Label>
                  <Textarea
                    placeholder="Describe the creative you want — visual style, messaging, target audience, special offers..."
                    className="min-h-[100px] text-sm"
                    value={genBrief}
                    onChange={(e) => setGenBrief(e.target.value)}
                  />
                </div>

                {/* Generate Button */}
                <Button
                  className="w-full gap-2"
                  disabled={genGenerating}
                  onClick={handleGenerate}
                >
                  {genGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview / Result */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Generated Preview</CardTitle>
                <CardDescription className="text-xs mt-1">{genResult ? 'AI-generated creative ready for review' : 'Configure and generate to see preview'}</CardDescription>
              </CardHeader>
              <CardContent>
                {genResult ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">{genResult.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-muted/30">
                          <p className="text-[10px] text-muted-foreground">Type</p>
                          <p className="text-xs font-medium">{getTypeLabel(genResult.type)}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/30">
                          <p className="text-[10px] text-muted-foreground">Platform</p>
                          <p className="text-xs font-medium">{getPlatformIcon(genResult.platform)} {genResult.platform}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/30">
                          <p className="text-[10px] text-muted-foreground">Format</p>
                          <p className="text-xs font-medium capitalize">{genResult.suggestedFormat.replace('_', ' ')}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/30">
                          <p className="text-[10px] text-muted-foreground">Confidence</p>
                          <p className={`text-xs font-bold ${getConfidenceColor(genResult.confidence_score)}`}>{genResult.confidence_score}%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="p-2.5 rounded-lg bg-background/60">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Hook</p>
                          <p className="text-sm font-medium">{genResult.hook_text}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-background/60">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">CTA</p>
                          <p className="text-sm font-medium">{genResult.cta_text}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-background/60">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Visual Direction</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{genResult.visual_description}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-background/60">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Body Copy</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{genResult.body_text}</p>
                        </div>
                        <div className="p-2.5 rounded-lg bg-background/60">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Target Audience</p>
                          <p className="text-xs text-muted-foreground">{genResult.targetAudience}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 gap-1"
                        onClick={() => {
                          setApprovedSuggestions(prev => new Set(prev).add(genResult.id));
                          toast.success('Creative approved', { description: `"${genResult.name}" added to production queue` });
                        }}
                      >
                        <ThumbsUp className="h-4 w-4" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 gap-1 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                        onClick={() => {
                          toast.info('Creative rejected', { description: 'Sent back for revision' });
                        }}
                      >
                        <ThumbsDown className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                      <Wand2 className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">No creative generated yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Fill in the form and click "Generate with AI"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generation Queue */}
          <Card className="border-border/50 mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Creative Generation Queue
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {creativeGenerationQueue.filter(q => q.status === 'generating').length} generating, {creativeGenerationQueue.filter(q => q.status === 'queued').length} queued
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Platform</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground hidden sm:table-cell">Campaign</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Priority</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground hidden md:table-cell">ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creativeGenerationQueue.map((task) => (
                      <tr key={task.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 px-2">
                          <Badge variant={getTypeBadgeVariant(task.requestedType)} className="text-[9px]">{getTypeLabel(task.requestedType)}</Badge>
                        </td>
                        <td className="py-2.5 px-2 text-xs">{task.platform.map(p => getPlatformIcon(p)).join(' ')}</td>
                        <td className="py-2.5 px-2 text-xs max-w-[120px] truncate hidden sm:table-cell">{task.targetCampaign}</td>
                        <td className="py-2.5 px-2">
                          <Badge variant={task.priority === 'high' ? 'default' : task.priority === 'medium' ? 'secondary' : 'outline'} className="text-[9px]">
                            {task.priority}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-2">
                          <Badge className={`text-[9px] ${
                            task.status === 'generating' ? 'bg-purple-500/15 text-purple-500' :
                            task.status === 'ready' ? 'bg-emerald-500/15 text-emerald-500' :
                            task.status === 'reviewed' ? 'bg-blue-500/15 text-blue-500' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {task.status === 'generating' && <RefreshCw className="h-2.5 w-2.5 mr-1 animate-spin inline" />}
                            {task.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-2 text-xs text-muted-foreground hidden md:table-cell">
                          {new Date(task.estimatedCompletion).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
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
        {/* TAB 6: Top Patterns                                          */}
        {/* ============================================================ */}
        <TabsContent value="patterns">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Top Performer Patterns — AI Learning
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {topPerformerPatterns.length} patterns identified from {creativeLibrary.filter(c => c.roas > 7).length} top-performing creatives
                  </CardDescription>
                </div>
                <TabExportButton
                  data={topPerformerPatterns.map(p => ({ Category: p.category, Pattern: p.pattern, CorrelationCTR: p.correlationCTR + '%', CorrelationConv: p.correlationConversions + '%', Frequency: p.usageFrequency + '%', Recommendation: p.recommendation }))}
                  filename="top-patterns.csv"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[600px]">
                <div className="space-y-3">
                  {topPerformerPatterns.map((pattern, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted/10 hover:bg-muted/20 border border-border/30 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg font-bold text-primary/30">{i + 1}</span>
                            <Badge variant="outline" className="text-[9px]">{pattern.category}</Badge>
                          </div>
                          <p className="text-sm font-medium">{pattern.pattern}</p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <MousePointerClick className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">CTR correlation:</span>
                              <span className="text-xs font-bold text-emerald-500">{pattern.correlationCTR}%</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <TrendingUp className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Conv. correlation:</span>
                              <span className="text-xs font-bold text-blue-500">{pattern.correlationConversions}%</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <BarChart3 className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Usage:</span>
                              <span className="text-xs font-bold">{pattern.usageFrequency}%</span>
                            </div>
                          </div>
                          <p className="text-xs text-primary font-medium">💡 {pattern.recommendation}</p>
                        </div>
                        <div className="shrink-0 space-y-1.5 text-right hidden sm:block">
                          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{ width: `${pattern.correlationCTR}%` }}
                            />
                          </div>
                          <p className="text-[9px] text-muted-foreground">CTR impact</p>
                          <div className="w-20 h-2 rounded-full bg-muted overflow-hidden mt-1">
                            <div
                              className="h-full rounded-full bg-blue-500 transition-all"
                              style={{ width: `${pattern.correlationConversions}%` }}
                            />
                          </div>
                          <p className="text-[9px] text-muted-foreground">Conv. impact</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 7: Platform Guide                                         */}
        {/* ============================================================ */}
        <TabsContent value="platforms">
          <div className="space-y-6">
            {platformGuides.map((guide) => (
              <Card key={guide.platform} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getPlatformIcon(guide.platform)}</span>
                    <div>
                      <CardTitle className="text-base font-semibold">{guide.platform}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {guide.recommendedFormats.length} recommended formats · {guide.bestPerformingHooks.length} hook styles
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Optimal Dimensions */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Optimal Dimensions</h4>
                      <div className="space-y-1.5">
                        {guide.optimalDimensions.map((dim) => (
                          <div key={dim.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                            <span className="text-xs font-medium">{dim.name}</span>
                            <Badge variant="outline" className="text-[9px] font-mono">{dim.size}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Best Performing Hooks */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Best Performing Hooks</h4>
                      <div className="space-y-1.5">
                        {guide.bestPerformingHooks.map((hook, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/20">
                            <Zap className="h-3 w-3 text-amber-500 shrink-0" />
                            <span className="text-xs">{hook}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trending Styles */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trending Styles</h4>
                      <div className="space-y-1.5">
                        {guide.trendingStyles.map((style, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/20">
                            <TrendingUp className="h-3 w-3 text-emerald-500 shrink-0" />
                            <span className="text-xs">{style}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Dos and Don'ts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" /> Do&apos;s
                      </h4>
                      <div className="space-y-1.5">
                        {guide.dos.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                            <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                            <span className="text-xs">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider flex items-center gap-1">
                        <ThumbsDown className="h-3 w-3" /> Don&apos;ts
                      </h4>
                      <div className="space-y-1.5">
                        {guide.donts.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                            <X className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
                            <span className="text-xs">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Formats */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recommended Formats</h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.recommendedFormats.map((format, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{format}</Badge>
                      ))}
                    </div>
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
