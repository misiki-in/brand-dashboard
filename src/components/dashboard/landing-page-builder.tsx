'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAction } from '@/lib/action-context';
import { exportToCSV } from '@/lib/real-actions';
import {
  type LandingPage,
  type ABTest,
  type PageTemplate,
  type CoherenceCheck,
  type ConversionTracking,
  type PageElement,
  landingPages,
  abTests,
  pageTemplates,
  coherenceChecks,
  conversionTracking,
  pageElements,
  getStatusColor,
  getStatusLabel,
  getTestStatusColor,
  getTestStatusLabel,
  getMetricLabel,
  getCategoryLabel,
  getCategoryColor,
  getCoherenceColor,
  getCoherenceBg,
  getElementIcon,
} from '@/lib/landing-page-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Layout, Sparkles, Play, Pause, Eye, Copy, Plus, Trash2, BarChart3,
  Target, TrendingUp, Clock, ArrowRight, Download, RefreshCw, Split,
  FileText, Image, Video, ShoppingCart, Star, MessageSquare, Layers,
  Palette, Settings2, CheckCircle2, XCircle, ExternalLink, Zap,
  Monitor, Smartphone, Globe, Wrench, ArrowLeftRight, GitBranch,
  Trophy, ChevronRight, ChevronLeft, AlertTriangle, Lightbulb,
  MousePointerClick, Timer, Percent, DollarSign, Users, Search,
  Loader2, Crown, Shield, Package, CircleDot,
} from 'lucide-react';

// ============================================================
// Main Exported Component
// ============================================================
export function LandingPageBuilder() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [abDialogOpen, setAbDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [expandedCoherence, setExpandedCoherence] = useState<string | null>(null);

  const totalPages = landingPages.length;
  const activeTests = abTests.filter(t => t.status === 'running').length;
  const avgConversionRate =
    landingPages.filter(p => p.status === 'published').reduce((s, p) => s + p.conversionRate, 0) /
    Math.max(1, landingPages.filter(p => p.status === 'published').length);
  const autoPromoted = 2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" />
            AI Landing Page Builder
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generate, test, and optimize high-converting landing pages — powered by AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-2"
            style={{ background: 'linear-gradient(135deg, #D4A843, #B8922E)', color: 'white' }}
            onClick={() => setWizardOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create New Page
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          icon={<Layers className="h-4 w-4" />}
          label="Total Pages"
          value={totalPages.toString()}
          sub="across all statuses"
          color="primary"
        />
        <KpiCard
          icon={<Split className="h-4 w-4" />}
          label="Active Tests"
          value={activeTests.toString()}
          sub="A/B tests running"
          color="blue"
        />
        <KpiCard
          icon={<Target className="h-4 w-4" />}
          label="Avg Conversion"
          value={`${avgConversionRate.toFixed(1)}%`}
          sub="published pages"
          color="emerald"
        />
        <KpiCard
          icon={<Zap className="h-4 w-4" />}
          label="Auto-Promoted"
          value={autoPromoted.toString()}
          sub="winners deployed"
          color="amber"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 p-1">
          <TabsTrigger value="pages" className="gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5" /> Pages
          </TabsTrigger>
          <TabsTrigger value="ab-tests" className="gap-1.5 text-xs">
            <Split className="h-3.5 w-3.5" /> A/B Tests
          </TabsTrigger>
          <TabsTrigger value="builder" className="gap-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5" /> Page Builder
          </TabsTrigger>
          <TabsTrigger value="coherence" className="gap-1.5 text-xs">
            <ArrowLeftRight className="h-3.5 w-3.5" /> Ad-to-Page
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5 text-xs">
            <BarChart3 className="h-3.5 w-3.5" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* Pages Tab */}
        <TabsContent value="pages" className="mt-4">
          <PagesTab
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        </TabsContent>

        {/* A/B Tests Tab */}
        <TabsContent value="ab-tests" className="mt-4">
          <ABTestsTab
            expandedTest={expandedTest}
            setExpandedTest={setExpandedTest}
            onCreateTest={() => setAbDialogOpen(true)}
          />
        </TabsContent>

        {/* Page Builder Tab */}
        <TabsContent value="builder" className="mt-4">
          <BuilderTab />
        </TabsContent>

        {/* Ad-to-Page Coherence Tab */}
        <TabsContent value="coherence" className="mt-4">
          <CoherenceTab
            expandedCoherence={expandedCoherence}
            setExpandedCoherence={setExpandedCoherence}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-4">
          <AnalyticsTab />
        </TabsContent>
      </Tabs>

      {/* Create New Page Wizard Dialog */}
      <CreatePageWizard open={wizardOpen} onOpenChange={setWizardOpen} />

      {/* Create New A/B Test Dialog */}
      <CreateABTestDialog open={abDialogOpen} onOpenChange={setAbDialogOpen} />
    </div>
  );
}

// ============================================================
// KPI Card
// ============================================================
function KpiCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: 'primary' | 'emerald' | 'blue' | 'amber' | 'red';
}) {
  const colorMap = {
    primary: 'text-primary',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    blue: 'text-blue-600 dark:text-blue-400',
    amber: 'text-amber-600 dark:text-amber-400',
    red: 'text-red-600 dark:text-red-400',
  };
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className={cn('text-2xl font-bold mt-1', colorMap[color])}>{value}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
        </div>
        <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center bg-muted/50', colorMap[color])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ============================================================
// Pages Tab
// ============================================================
function PagesTab({
  selectedPage,
  setSelectedPage,
}: {
  selectedPage: string | null;
  setSelectedPage: (id: string | null) => void;
}) {
  const { executeAction } = useAction();

  const handleDuplicate = (page: LandingPage) => {
    executeAction({
      action: 'Duplicate Page',
      module: 'landing-page',
      detail: `Duplicating "${page.name}"`,
      successMsg: `Page duplicated — "${page.name} (Copy)" created as draft`,
    });
  };

  const handlePause = (page: LandingPage) => {
    executeAction({
      action: 'Pause Page',
      module: 'landing-page',
      detail: `Pausing "${page.name}"`,
      successMsg: `"${page.name}" paused`,
    });
  };

  const handleDelete = (page: LandingPage) => {
    executeAction({
      action: 'Delete Page',
      module: 'landing-page',
      detail: `Deleting "${page.name}"`,
      successMsg: `"${page.name}" moved to trash`,
    });
  };

  const handleExport = () => {
    exportToCSV(
      landingPages.map(p => ({
        Name: p.name,
        URL: p.url,
        Status: p.status,
        Campaign: p.linkedCampaign,
        Traffic: p.traffic,
        Conversions: p.conversions,
        'Conv. Rate': `${p.conversionRate}%`,
        'Avg Time': p.avgTimeOnPage,
        'Scroll Depth': `${p.scrollDepth}%`,
        'Bounce Rate': `${p.bounceRate}%`,
        Template: p.template,
        'Last Modified': p.lastModified,
      })),
      'landing-pages.csv'
    );
    toast.success('Exported landing pages data', { description: 'landing-pages.csv downloaded' });
  };

  const selectedPageData = selectedPage ? landingPages.find(p => p.id === selectedPage) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{landingPages.length} landing pages</p>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {landingPages.map(page => {
          const isSelected = selectedPage === page.id;
          return (
            <Card
              key={page.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-2 ring-primary/50'
              )}
              onClick={() => setSelectedPage(isSelected ? null : page.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold truncate">{page.name}</h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />{page.url}
                    </p>
                  </div>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0', getStatusColor(page.status))}>
                    {getStatusLabel(page.status)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-3">
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">{page.linkedCampaign}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Traffic</p>
                    <p className="text-xs font-bold">{page.traffic > 0 ? `${(page.traffic / 1000).toFixed(1)}K` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Conv. Rate</p>
                    <p className={cn('text-xs font-bold', page.conversionRate >= 7 ? 'text-emerald-600' : page.conversionRate > 0 ? 'text-amber-600' : 'text-muted-foreground')}>
                      {page.conversionRate > 0 ? `${page.conversionRate}%` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Modified</p>
                    <p className="text-xs font-medium">{page.lastModified.slice(5)}</p>
                  </div>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Time</p>
                        <p className="text-xs font-medium">{page.avgTimeOnPage}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Scroll</p>
                        <p className="text-xs font-medium">{page.scrollDepth > 0 ? `${page.scrollDepth}%` : '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Bounce</p>
                        <p className="text-xs font-medium">{page.bounceRate > 0 ? `${page.bounceRate}%` : '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Conversions</p>
                        <p className="text-xs font-bold text-primary">{page.conversions.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="text-[10px]">{page.template}</Badge>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1" onClick={e => e.stopPropagation()}>
                      <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => handleDuplicate(page)}>
                        <Copy className="h-3 w-3" /> Duplicate
                      </Button>
                      {page.status === 'published' && (
                        <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => handlePause(page)}>
                          <Pause className="h-3 w-3" /> Pause
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => toast.info('Opening analytics...', { description: page.name })}>
                        <BarChart3 className="h-3 w-3" /> Analytics
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] gap-1 text-red-500 hover:text-red-600 ml-auto" onClick={() => handleDelete(page)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// A/B Tests Tab
// ============================================================
function ABTestsTab({
  expandedTest,
  setExpandedTest,
  onCreateTest,
}: {
  expandedTest: string | null;
  setExpandedTest: (id: string | null) => void;
  onCreateTest: () => void;
}) {
  const { executeAction } = useAction();

  const handleAutoPromote = (test: ABTest) => {
    executeAction({
      action: 'Auto-Promote Winner',
      module: 'landing-page',
      detail: `Promoting Variant ${test.winner} for "${test.pageName}" (${test.confidence}% confidence)`,
      successMsg: `Variant ${test.winner} promoted as the new default for "${test.pageName}"`,
      simulateDelay: 1500,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">{abTests.length} tests</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">{abTests.filter(t => t.status === 'running').length} running</Badge>
            <Badge variant="secondary" className="text-[10px]">{abTests.filter(t => t.status === 'completed').length} completed</Badge>
          </div>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={onCreateTest}>
          <Plus className="h-3.5 w-3.5" /> Create New Test
        </Button>
      </div>

      <div className="space-y-3">
        {abTests.map(test => {
          const isExpanded = expandedTest === test.id;
          return (
            <Card key={test.id} className={cn('transition-all', isExpanded && 'shadow-md')}>
              <CardContent
                className="p-4 cursor-pointer"
                onClick={() => setExpandedTest(isExpanded ? null : test.id)}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <GitBranch className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{test.pageName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn('text-[10px] px-2 py-0 rounded-full font-medium', getTestStatusColor(test.status))}>
                          {getTestStatusLabel(test.status)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Testing: <span className="font-medium">{getMetricLabel(test.metric)}</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">Started {test.startDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Confidence Bar */}
                    <div className="hidden sm:flex items-center gap-2 min-w-[140px]">
                      <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            test.confidence >= 95 ? 'bg-emerald-500' : test.confidence >= 80 ? 'bg-amber-500' : 'bg-blue-500'
                          )}
                          style={{ width: `${test.confidence}%` }}
                        />
                      </div>
                      <span className={cn('text-xs font-bold w-10 text-right', test.confidence >= 95 ? 'text-emerald-600' : 'text-muted-foreground')}>
                        {test.confidence}%
                      </span>
                    </div>
                    {test.winner && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Trophy className="h-4 w-4" />
                        <span className="text-xs font-bold">Winner: {test.winner}</span>
                      </div>
                    )}
                    <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', isExpanded && 'rotate-90')} />
                  </div>
                </div>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-4" onClick={e => e.stopPropagation()}>
                    {/* Variants Side by Side */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      {test.variants.map((variant, idx) => {
                        const isWinner = test.winner === (idx === 0 ? 'A' : 'B');
                        return (
                          <div
                            key={variant.label}
                            className={cn(
                              'border rounded-lg p-3 transition-all',
                              isWinner ? 'border-amber-300 bg-amber-50/50 dark:border-amber-500/30 dark:bg-amber-500/5' : 'border-border/60'
                            )}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold">{variant.label}</span>
                              {isWinner && (
                                <Badge className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 gap-1">
                                  <Trophy className="h-3 w-3" /> Winner
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <p className="text-[10px] text-muted-foreground">Impressions</p>
                                <p className="text-sm font-bold">{variant.impressions.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground">Conversions</p>
                                <p className="text-sm font-bold">{variant.conversions.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground">Conv. Rate</p>
                                <p className="text-sm font-bold text-primary">{variant.conversionRate}%</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Improvement & Confidence */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm"><span className="font-bold text-emerald-600">{test.improvement}%</span> improvement</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Confidence: <span className="font-medium">{test.confidence}%</span></span>
                        </div>
                      </div>
                      {test.winner && test.confidence >= 95 && (
                        <Button
                          size="sm"
                          className="gap-1.5 text-xs"
                          style={{ background: 'linear-gradient(135deg, #D4A843, #B8922E)', color: 'white' }}
                          onClick={() => handleAutoPromote(test)}
                        >
                          <Zap className="h-3.5 w-3.5" /> Auto-Promote Winner
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Page Builder Tab (Embedded Wizard)
// ============================================================
function BuilderTab() {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [pageName, setPageName] = useState('');
  const [urlSlug, setUrlSlug] = useState('');
  const [linkedCampaign, setLinkedCampaign] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const steps = [
    { label: 'Template', icon: Palette },
    { label: 'Configure', icon: Settings2 },
    { label: 'AI Generate', icon: Sparkles },
    { label: 'Publish', icon: CheckCircle2 },
  ];

  const selectedTpl = pageTemplates.find(t => t.id === selectedTemplate);

  const handleAiGenerate = () => {
    if (!aiDescription.trim()) return;
    setAiGenerating(true);
    setAiResult(null);
    setTimeout(() => {
      const tpl = selectedTpl?.name || 'Product Launch';
      setAiResult(
        `AI has generated a landing page based on your description. ` +
        `Template: ${tpl}\n\n` +
        `Generated Layout:\n` +
        `1. Hero Banner — "${pageName || 'Your Collection'}" with urgency headline\n` +
        `2. Featured Products Grid — 6 top products with add-to-cart\n` +
        `3. Trust Badges — Secure payment, certified gems, free shipping\n` +
        `4. Social Proof — 4 customer testimonials with star ratings\n` +
        `5. FAQ Section — 6 common questions with expandable answers\n` +
        `6. CTA Block — "Shop Now" with limited-time offer messaging\n\n` +
        `Estimated conversion rate: ${selectedTpl ? selectedTpl.conversionBenchmark : 7.5}%\n` +
        `Page speed: 2.1s (optimized)\n` +
        `Mobile responsive: Yes\n`
      );
      setAiGenerating(false);
      toast.success('Page generated!', { description: 'AI has created your landing page layout' });
    }, 2500);
  };

  const handlePublish = () => {
    toast.success('Landing page published!', {
      description: `"${pageName || 'Untitled Page'}" is now live at /${urlSlug || 'new-page'}`,
    });
    setStep(0);
    setSelectedTemplate(null);
    setPageName('');
    setUrlSlug('');
    setLinkedCampaign('');
    setTargetAudience('');
    setAiDescription('');
    setAiResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Step Progress */}
      <div className="flex items-center justify-center gap-1 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer',
                i < step && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
                i === step && 'bg-primary text-primary-foreground',
                i > step && 'bg-muted text-muted-foreground'
              )}
              onClick={() => i <= step && setStep(i)}
            >
              {i < step ? <CheckCircle2 className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('w-6 h-px', i < step ? 'bg-emerald-300' : 'bg-border')} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 0: Select Template */}
      {step === 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Choose a Template</CardTitle>
            <CardDescription className="text-xs">Select a starting point for your landing page. AI will customize it based on your input.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pageTemplates.map(tpl => (
                <button
                  key={tpl.id}
                  className={cn(
                    'text-left p-4 rounded-lg border-2 transition-all',
                    selectedTemplate === tpl.id ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/30'
                  )}
                  onClick={() => setSelectedTemplate(tpl.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{tpl.name}</span>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full', getCategoryColor(tpl.category))}>
                      {getCategoryLabel(tpl.category)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{tpl.preview}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {tpl.conversionBenchmark}% benchmark</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Page Configuration */}
      {step === 1 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configure Your Page</CardTitle>
            <CardDescription className="text-xs">Set up the basic details for your landing page. Template: <strong>{selectedTpl?.name}</strong></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Page Name</Label>
                <Input
                  className="text-sm"
                  placeholder="e.g., Akshaya Tritiya Collection"
                  value={pageName}
                  onChange={e => setPageName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">URL Slug</Label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">/</span>
                  <Input
                    className="text-sm"
                    placeholder="e.g., akshaya-tritiya"
                    value={urlSlug}
                    onChange={e => setUrlSlug(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Linked Campaign</Label>
                <Select value={linkedCampaign} onValueChange={setLinkedCampaign}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select campaign..." /></SelectTrigger>
                  <SelectContent>
                    {['Akshaya Tritiya Meta Campaign', 'Engagement Season Google Ads', 'Summer Wedding Meta & Google', 'Brand Awareness Campaign', 'Gold Investment WhatsApp Blast'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Target Audience</Label>
                <Select value={targetAudience} onValueChange={setTargetAudience}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select audience..." /></SelectTrigger>
                  <SelectContent>
                    {['All Visitors', 'Engagement Ring Shoppers', 'Festival Buyers', 'Loyalty Members', 'New Customers', 'High-Value Segment'].map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview Card */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/60 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Preview</p>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">varnijewels.com/<strong>{urlSlug || 'your-page'}</strong></span>
              </div>
              <p className="text-sm font-semibold">{pageName || 'Untitled Page'}</p>
              {selectedTpl && (
                <div className="flex items-center gap-2">
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full', getCategoryColor(selectedTpl.category))}>
                    {getCategoryLabel(selectedTpl.category)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Template: {selectedTpl.name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: AI Generation */}
      {step === 2 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Describe Your Page
            </CardTitle>
            <CardDescription className="text-xs">Tell AI what you want in plain English. It will generate a complete landing page layout.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="text-sm min-h-[120px]"
              placeholder="e.g., Create a festive landing page for Akshaya Tritiya featuring our new gold coin collection. Highlight the 20% early bird discount, show customer testimonials, include a countdown to the festival date, and add a WhatsApp CTA for inquiries. Target audience: married women aged 25-45 in tier-1 Indian cities."
              value={aiDescription}
              onChange={e => setAiDescription(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="gap-1.5"
                style={{ background: 'linear-gradient(135deg, #D4A843, #B8922E)', color: 'white' }}
                onClick={handleAiGenerate}
                disabled={aiGenerating || !aiDescription.trim()}
              >
                {aiGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {aiGenerating ? 'Generating...' : 'Generate Page'}
              </Button>
              {aiDescription && (
                <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => setAiDescription('')}>
                  <RefreshCw className="h-3 w-3" /> Clear
                </Button>
              )}
            </div>

            {aiGenerating && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p className="text-sm font-medium">AI is crafting your page...</p>
                  <p className="text-[11px] text-muted-foreground">Analyzing description, selecting elements, optimizing layout</p>
                </div>
              </div>
            )}

            {aiResult && (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Page Generated Successfully</span>
                </div>
                <pre className="text-xs text-emerald-800 dark:text-emerald-300 whitespace-pre-wrap leading-relaxed">{aiResult}</pre>
              </div>
            )}

            {/* Suggested Elements */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/60">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">AI-Recommended Elements</p>
              <div className="flex flex-wrap gap-2">
                {['hero_banner', 'product_grid', 'countdown_timer', 'testimonial_section', 'trust_badges', 'cta_block', 'faq_section'].map(type => (
                  <Badge key={type} variant="outline" className="text-[10px] gap-1 px-2 py-1">
                    <span>{getElementIcon(type)}</span>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Publish */}
      {step === 3 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Review & Publish</CardTitle>
            <CardDescription className="text-xs">Review your page configuration before publishing or saving as draft.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border/60 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Page Details</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Name</span>
                    <span className="text-xs font-medium">{pageName || 'Untitled'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">URL</span>
                    <span className="text-xs font-medium">/{urlSlug || 'new-page'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Campaign</span>
                    <span className="text-xs font-medium">{linkedCampaign || 'None'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Audience</span>
                    <span className="text-xs font-medium">{targetAudience || 'All'}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border/60 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Template & AI</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Template</span>
                    <span className="text-xs font-medium">{selectedTpl?.name || 'None'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Benchmark</span>
                    <span className="text-xs font-medium text-primary">{selectedTpl?.conversionBenchmark || '—'}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">AI Generated</span>
                    <span className="text-xs font-medium">{aiResult ? '✅ Yes' : '⚠️ Not generated'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Elements</span>
                    <span className="text-xs font-medium">7 components</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Device Previews */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/60">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Device Previews</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border/60">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">Desktop</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border/60">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">Mobile</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border/60">
                  <Tablet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">Tablet</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                className="gap-1.5"
                style={{ background: 'linear-gradient(135deg, #D4A843, #B8922E)', color: 'white' }}
                onClick={handlePublish}
                disabled={!pageName.trim()}
              >
                <CheckCircle2 className="h-4 w-4" /> Publish Now
              </Button>
              <Button variant="outline" onClick={() => {
                toast.success('Draft saved', { description: `"${pageName || 'Untitled'}" saved as draft` });
                setStep(0);
              }}>
                <Save className="h-4 w-4 mr-1" /> Save as Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <span className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}</span>
        <Button
          size="sm"
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
          className="gap-1"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// Ad-to-Page Coherence Tab
// ============================================================
function CoherenceTab({
  expandedCoherence,
  setExpandedCoherence,
}: {
  expandedCoherence: string | null;
  setExpandedCoherence: (name: string | null) => void;
}) {
  const sorted = useMemo(() => [...coherenceChecks].sort((a, b) => a.coherenceScore - b.coherenceScore), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {coherenceChecks.length} page-campaign pairs analyzed
        </p>
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Strong (80+)</div>
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-500" /> Fair (60-79)</div>
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-red-500" /> Weak (&lt;60)</div>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map(check => {
          const isExpanded = expandedCoherence === check.pageName;
          return (
            <Card key={check.pageName} className="cursor-pointer hover:shadow-sm transition-all" onClick={() => setExpandedCoherence(isExpanded ? null : check.pageName)}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn('h-12 w-12 rounded-lg flex flex-col items-center justify-center border shrink-0', getCoherenceBg(check.coherenceScore))}>
                      <span className={cn('text-lg font-bold leading-none', getCoherenceColor(check.coherenceScore))}>{check.coherenceScore}</span>
                      <span className="text-[8px] text-muted-foreground mt-0.5">score</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold truncate">{check.pageName}</h3>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" /> {check.adCampaign}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {check.issues.length > 0 ? (
                      <Badge variant="destructive" className="text-[10px] gap-1">
                        <AlertTriangle className="h-3 w-3" /> {check.issues.length} issue{check.issues.length > 1 ? 's' : ''}
                      </Badge>
                    ) : (
                      <Badge className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Aligned
                      </Badge>
                    )}
                    <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', isExpanded && 'rotate-90')} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-3" onClick={e => e.stopPropagation()}>
                    {check.issues.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-red-600 mb-2">Issues Found</p>
                        <div className="flex flex-wrap gap-1.5">
                          {check.issues.map(issue => (
                            <Badge key={issue} variant="outline" className="text-[10px] border-red-200 text-red-600 dark:border-red-500/30 dark:text-red-400 gap-1">
                              <XCircle className="h-3 w-3" /> {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" /> Recommendations
                      </p>
                      <div className="space-y-1.5">
                        {check.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs">
                            <ArrowRight className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Analytics Tab
// ============================================================
function AnalyticsTab() {
  const [selectedAnalytics, setSelectedAnalytics] = useState<string | null>(
    conversionTracking[0]?.pageName || null
  );

  const handleExport = () => {
    const data = conversionTracking.map(ct => ({
      Page: ct.pageName,
      'Time on Page': ct.timeOnPage,
      'Scroll Depth': `${ct.scrollDepth}%`,
      'Form Completions': ct.formCompletions,
      'Click Throughs': ct.clickThroughs,
      'Add to Carts': ct.addToCarts,
      Purchases: ct.purchases,
      Revenue: ct.revenue,
    }));
    exportToCSV(data, 'conversion-analytics.csv');
    toast.success('Analytics exported', { description: 'conversion-analytics.csv downloaded' });
  };

  const current = conversionTracking.find(c => c.pageName === selectedAnalytics);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Select value={selectedAnalytics || ''} onValueChange={setSelectedAnalytics}>
          <SelectTrigger className="w-full sm:w-72 h-9 text-xs">
            <SelectValue placeholder="Select page..." />
          </SelectTrigger>
          <SelectContent>
            {conversionTracking.map(ct => (
              <SelectItem key={ct.pageName} value={ct.pageName}>{ct.pageName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" /> Export Analytics
        </Button>
      </div>

      {current && (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <MetricPill icon={<Clock className="h-3.5 w-3.5" />} label="Avg Time" value={current.timeOnPage} />
            <MetricPill icon={<MousePointerClick className="h-3.5 w-3.5" />} label="Scroll" value={`${current.scrollDepth}%`} />
            <MetricPill icon={<FileText className="h-3.5 w-3.5" />} label="Forms" value={current.formCompletions.toLocaleString()} />
            <MetricPill icon={<MousePointerClick className="h-3.5 w-3.5" />} label="Clicks" value={current.clickThroughs.toLocaleString()} />
            <MetricPill icon={<ShoppingCart className="h-3.5 w-3.5" />} label="Add to Cart" value={current.addToCarts.toLocaleString()} />
            <MetricPill icon={<DollarSign className="h-3.5 w-3.5" />} label="Purchases" value={current.purchases.toLocaleString()} />
            <MetricPill icon={<TrendingUp className="h-3.5 w-3.5" />} label="Revenue" value={current.revenue > 0 ? `₹${(current.revenue / 100000).toFixed(1)}L` : '—'} />
          </div>

          {/* Funnel Visualization */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Conversion Funnel
              </CardTitle>
              <CardDescription className="text-xs">User journey from page view to conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {current.funnel.map((step, idx) => {
                  const widthPct = step.percentage;
                  const dropoff = idx > 0 ? current.funnel[idx - 1].count - step.count : 0;
                  return (
                    <div key={step.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium w-28 shrink-0">{step.label}</span>
                          <span className="text-muted-foreground">{step.count.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {dropoff > 0 && (
                            <span className="text-[10px] text-red-500">-{dropoff.toLocaleString()} ({((dropoff / current.funnel[idx - 1].count) * 100).toFixed(1)}%)</span>
                          )}
                          <span className="font-bold text-primary w-12 text-right">{step.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-7 bg-muted/50 rounded-md overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-md transition-all flex items-center px-2',
                            idx === 0 ? 'bg-primary/20' :
                            idx === current.funnel.length - 1 ? 'bg-emerald-500/30' :
                            'bg-primary/15'
                          )}
                          style={{ width: `${Math.max(4, widthPct)}%` }}
                        >
                          {widthPct > 10 && (
                            <span className="text-[10px] font-medium text-primary truncate">{step.percentage}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* All Pages Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            All Pages Overview
          </CardTitle>
          <CardDescription className="text-xs">Conversion tracking across all landing pages</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {conversionTracking.map(ct => (
                <div
                  key={ct.pageName}
                  className={cn(
                    'p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm',
                    selectedAnalytics === ct.pageName ? 'border-primary/50 bg-primary/5' : 'border-border/60'
                  )}
                  onClick={() => setSelectedAnalytics(ct.pageName)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold truncate">{ct.pageName}</span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {ct.revenue > 0 && (
                        <span className="text-xs font-bold text-emerald-600">₹{(ct.revenue / 100000).toFixed(1)}L</span>
                      )}
                      <span className="text-xs font-bold text-primary">{ct.funnel[ct.funnel.length - 1]?.percentage || 0}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ct.timeOnPage}</span>
                    <span className="flex items-center gap-1"><Percent className="h-3 w-3" /> {ct.scrollDepth}% scroll</span>
                    <span className="flex items-center gap-1"><ShoppingCart className="h-3 w-3" /> {ct.purchases} purchases</span>
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {ct.formCompletions} forms</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Component Library */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            Page Element Library
          </CardTitle>
          <CardDescription className="text-xs">Components and their average conversion lift across all pages</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[350px]">
            <div className="space-y-2">
              {pageElements.map(element => (
                <div key={element.type} className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:bg-accent/20 transition-colors">
                  <div className="text-lg shrink-0">{getElementIcon(element.type)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold capitalize">{element.type.replace(/_/g, ' ')}</p>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <Badge variant="secondary" className="text-[10px]">Used {element.usageCount}×</Badge>
                        <span className="text-xs font-bold text-emerald-600">+{element.avgConversionLift}%</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{element.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// Metric Pill
// ============================================================
function MetricPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/30 border border-border/40">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-sm font-bold">{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

// ============================================================
// Create New Page Wizard Dialog
// ============================================================
function CreatePageWizard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create New Landing Page
          </DialogTitle>
          <DialogDescription>
            Use the Page Builder tab to create a new landing page with AI assistance. The 4-step wizard will guide you through template selection, configuration, AI generation, and publishing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Palette, label: 'Template', desc: 'Choose starting template' },
              { icon: Settings2, label: 'Configure', desc: 'Set page details' },
              { icon: Sparkles, label: 'AI Generate', desc: 'Describe & generate' },
              { icon: CheckCircle2, label: 'Publish', desc: 'Review & go live' },
            ].map((s, i) => (
              <div key={s.label} className="text-center p-2 rounded-lg bg-muted/30">
                <s.icon className="h-4 w-4 mx-auto text-primary" />
                <p className="text-[10px] font-medium mt-1">{s.label}</p>
                <p className="text-[9px] text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
            💡 Switch to the <strong>Page Builder</strong> tab to start creating your landing page.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Create A/B Test Dialog
// ============================================================
function CreateABTestDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { executeAction } = useAction();
  const [testName, setTestName] = useState('');
  const [page, setPage] = useState('');
  const [metric, setMetric] = useState('');
  const [splitPercent, setSplitPercent] = useState('50');

  const handleCreate = () => {
    if (!testName.trim() || !page || !metric) return;
    executeAction({
      action: 'Create A/B Test',
      module: 'landing-page',
      detail: `Creating "${testName}" on ${page} — testing ${metric}`,
      successMsg: `A/B test "${testName}" created — now collecting data`,
      simulateDelay: 1200,
    });
    onOpenChange(false);
    setTestName('');
    setPage('');
    setMetric('');
    setSplitPercent('50');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Split className="h-5 w-5 text-primary" />
            Create New A/B Test
          </DialogTitle>
          <DialogDescription>
            Set up a new A/B test to optimize your landing page performance.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Test Name</Label>
            <Input className="text-sm" placeholder="e.g., Hero Headline Test" value={testName} onChange={e => setTestName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Landing Page</Label>
            <Select value={page} onValueChange={setPage}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select page..." /></SelectTrigger>
              <SelectContent>
                {landingPages.filter(p => p.status === 'published').map(p => (
                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Metric to Test</Label>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select metric..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="headline">Headline</SelectItem>
                <SelectItem value="cta">CTA Button</SelectItem>
                <SelectItem value="hero_image">Hero Image</SelectItem>
                <SelectItem value="social_proof">Social Proof</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Traffic Split</Label>
            <div className="flex items-center gap-3">
              <span className="text-xs">Variant A: {splitPercent}%</span>
              <input
                type="range"
                min="10"
                max="90"
                value={splitPercent}
                onChange={e => setSplitPercent(e.target.value)}
                className="flex-1 accent-primary"
              />
              <span className="text-xs">Variant B: {100 - parseInt(splitPercent)}%</span>
            </div>
          </div>
          <Button
            className="w-full gap-1.5"
            style={{ background: 'linear-gradient(135deg, #D4A843, #B8922E)', color: 'white' }}
            onClick={handleCreate}
            disabled={!testName.trim() || !page || !metric}
          >
            <Play className="h-4 w-4" /> Start Test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Save icon (used inline)
function Save(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
}

// Tablet icon (used inline)
function Tablet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}
