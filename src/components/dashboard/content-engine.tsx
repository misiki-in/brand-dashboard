'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAction } from '@/lib/action-context';
import {
  type BrandVoice,
  type KeywordSuggestion,
  type Competitor,
  type ContentCalendarItem,
  type GeneratedArticle,
  type ArticleConfig,
  defaultBrandVoice,
  defaultKeywords,
  defaultCompetitors,
  generateContentCalendar,
  contentTypeDistribution,
  getDifficultyBg,
  getDifficultyLabel,
  getIntentColor,
  getStatusBadge,
} from '@/lib/content-engine-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  PenLine, Search, BarChart3, Globe, Calendar, Sparkles,
  CheckCircle2, Circle, ChevronRight, ChevronLeft, Plus,
  Loader2, ExternalLink, ArrowRight, FileText, Eye, Zap,
  BookOpen, Target, TrendingUp, Clock, RotateCcw,
} from 'lucide-react';

// ============================================================
// Main Content Engine Component
// ============================================================
export function ContentEngine() {
  const [view, setView] = useState<'dashboard' | 'wizard' | 'article'>('dashboard');
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordSuggestion | null>(null);
  const [brandVoice, setBrandVoice] = useState<BrandVoice>(defaultBrandVoice);
  const [competitors, setCompetitors] = useState(defaultCompetitors);
  const [calendar] = useState<ContentCalendarItem[]>(() => generateContentCalendar());
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [articleConfig, setArticleConfig] = useState<ArticleConfig>({
    title: '', contentType: '', keyword: '', internalLinks: [], instructions: '',
  });

  const handleSelectKeyword = (kw: KeywordSuggestion) => {
    setSelectedKeyword(kw);
    setArticleConfig(prev => ({
      ...prev,
      keyword: kw.keyword,
      title: `${kw.keyword.charAt(0).toUpperCase() + kw.keyword.slice(1)}: The Essential 2026 Guide`,
    }));
  };

  const handleGenerateArticle = useCallback(async () => {
    try {
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: articleConfig.keyword,
          title: articleConfig.title,
          contentType: articleConfig.contentType || 'Article',
          writingStyle: brandVoice.writingStyle,
          tone: brandVoice.tone,
          instructions: brandVoice.additionalInstructions,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setArticles(prev => [data.article, ...prev]);
        setView('article');
        toast.success('Article generated!', { description: data.article.title });
      } else {
        toast.error('Generation failed', { description: data.error });
      }
    } catch (err: any) {
      toast.error('Generation failed', { description: err.message });
    }
  }, [articleConfig, brandVoice]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            ClickFlow Content Engine
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Publish 30 Expert Articles a Month — Without Hiring a Team
          </p>
        </div>
        <div className="flex items-center gap-2">
          {view !== 'dashboard' && (
            <Button variant="outline" size="sm" onClick={() => setView('dashboard')}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <Button
            size="sm"
            className="gap-2"
            style={{ background: 'linear-gradient(135deg, #D4A843, #B8922E)', color: 'white' }}
            onClick={() => { setView('wizard'); setWizardStep(0); }}
          >
            <PenLine className="h-4 w-4" />
            New Article
          </Button>
        </div>
      </div>

      {/* Views */}
      {view === 'dashboard' && (
        <ContentDashboard
          calendar={calendar}
          articles={articles}
          competitors={competitors}
          onSelectKeyword={(kw) => { handleSelectKeyword(kw); setView('wizard'); setWizardStep(3); }}
          onGenerate={handleGenerateArticle}
        />
      )}

      {view === 'wizard' && (
        <ArticleWizard
          step={wizardStep}
          setStep={setWizardStep}
          brandVoice={brandVoice}
          setBrandVoice={setBrandVoice}
          keywords={defaultKeywords}
          selectedKeyword={selectedKeyword}
          onSelectKeyword={handleSelectKeyword}
          competitors={competitors}
          setCompetitors={setCompetitors}
          calendar={calendar}
          articleConfig={articleConfig}
          setArticleConfig={setArticleConfig}
          onGenerate={handleGenerateArticle}
        />
      )}

      {view === 'article' && articles.length > 0 && (
        <ArticleReview article={articles[0]} brandVoice={brandVoice} />
      )}
    </div>
  );
}

// ============================================================
// Dashboard View
// ============================================================
function ContentDashboard({
  calendar,
  articles,
  competitors,
  onSelectKeyword,
  onGenerate,
}: {
  calendar: ContentCalendarItem[];
  articles: GeneratedArticle[];
  competitors: Competitor[];
  onSelectKeyword: (kw: KeywordSuggestion) => void;
  onGenerate: () => void;
}) {
  const published = calendar.filter(c => c.status === 'published').length;
  const drafting = calendar.filter(c => c.status === 'drafting').length;
  const review = calendar.filter(c => c.status === 'review').length;
  const planned = calendar.filter(c => c.status === 'planned').length;
  const totalWords = calendar.reduce((s, c) => s + (c.wordCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KPICard icon={<FileText className="h-4 w-4" />} label="Published" value={published.toString()} sub="articles live" color="emerald" />
        <KPICard icon={<PenLine className="h-4 w-4" />} label="Drafting" value={drafting.toString()} sub="in progress" color="blue" />
        <KPICard icon={<Eye className="h-4 w-4" />} label="In Review" value={review.toString()} sub="pending approval" color="amber" />
        <KPICard icon={<Calendar className="h-4 w-4" />} label="Planned" value={planned.toString()} sub="this month" color="gray" />
        <KPICard icon={<BookOpen className="h-4 w-4" />} label="Total Words" value={`${(totalWords / 1000).toFixed(1)}K`} sub="content produced" color="primary" />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 p-1">
          <TabsTrigger value="calendar" className="gap-1.5 text-xs"><Calendar className="h-3.5 w-3.5" /> Content Calendar</TabsTrigger>
          <TabsTrigger value="roadmap" className="gap-1.5 text-xs"><Target className="h-3.5 w-3.5" /> Content Roadmap</TabsTrigger>
          <TabsTrigger value="keywords" className="gap-1.5 text-xs"><Search className="h-3.5 w-3.5" /> Keyword Research</TabsTrigger>
          <TabsTrigger value="competitors" className="gap-1.5 text-xs"><Globe className="h-3.5 w-3.5" /> Competitors</TabsTrigger>
          {articles.length > 0 && (
            <TabsTrigger value="articles" className="gap-1.5 text-xs"><FileText className="h-3.5 w-3.5" /> Generated ({articles.length})</TabsTrigger>
          )}
        </TabsList>

        {/* Content Calendar Tab */}
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">30-Day Content Calendar</CardTitle>
                  <CardDescription className="text-xs mt-1">Automated content pipeline — 30 articles per month across 8 content types</CardDescription>
                </div>
                <Badge variant="secondary" className="text-[10px]">{calendar.length} articles</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-[10px] font-semibold uppercase text-muted-foreground py-2">{d}</div>
                  ))}
                  {/* Empty cells for the first day offset */}
                  {Array.from({ length: new Date(calendar[0]?.date || '2026-01-01').getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-20" />
                  ))}
                  {calendar.map(item => {
                    const date = new Date(item.date + 'T00:00:00');
                    const isToday = date.toDateString() === new Date().toDateString();
                    const statusBadge = getStatusBadge(item.status);
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'min-h-20 border border-border/50 rounded-lg p-1.5 text-xs cursor-pointer hover:bg-accent/30 transition-colors',
                          isToday && 'ring-1 ring-primary/40 bg-primary/5'
                        )}
                        onClick={() => {
                          if (item.status === 'planned') onSelectKeyword({ id: item.id, keyword: item.keyword, difficulty: 10, volume: 500, intent: 'informational' });
                          else toast.info(item.title, { description: `${item.type} · ${item.wordCount?.toLocaleString() || '—'} words` });
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn('text-[10px] font-medium', isToday && 'text-primary font-bold')}>{date.getDate()}</span>
                          <span className={cn('text-[8px] px-1 py-0 rounded-full', statusBadge.variant)}>{statusBadge.label}</span>
                        </div>
                        <p className="font-medium leading-tight line-clamp-2">{item.title}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{item.type}</p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Roadmap Tab */}
        <TabsContent value="roadmap" className="mt-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Content Type Distribution</CardTitle>
                <CardDescription className="text-xs">Strategic mix of 8 content types for SEO coverage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {contentTypeDistribution.map(ct => (
                    <div key={ct.type} className="flex items-center gap-3">
                      <span className="text-xs w-28 shrink-0 truncate">{ct.type}</span>
                      <div className="flex-1 h-5 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${(ct.count / 30) * 100}%`, backgroundColor: ct.color }}
                        />
                      </div>
                      <span className="text-xs font-medium w-6 text-right">{ct.count}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">Total: 30 articles/month · ~52,000 words/month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Content Pipeline Status</CardTitle>
                <CardDescription className="text-xs">Real-time view of your content production line</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: 'Brand Voice Configured', done: true, desc: 'Luxury tone with aspirational language' },
                    { label: 'Keywords Researched', done: true, desc: '15 high-potential keywords identified' },
                    { label: 'Competitors Analyzed', done: true, desc: '4 competitors · 370 articles scanned' },
                    { label: 'Content Calendar Set', done: true, desc: '30 articles planned for this month' },
                    { label: 'Articles Published', done: false, desc: `${published} of 30 articles live` },
                    { label: 'Traffic Tracking', done: false, desc: 'Awaiting first published articles' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {item.done ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-medium">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Keyword Research Tab */}
        <TabsContent value="keywords" className="mt-4">
          <KeywordResearchPanel onSelectKeyword={onSelectKeyword} />
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Competitor Analysis</CardTitle>
              <CardDescription className="text-xs">{competitors.length} competitors analyzed · {competitors.reduce((s, c) => s + c.articlesAnalyzed, 0)} articles scanned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {competitors.map(comp => (
                  <div key={comp.id} className="border border-border/60 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-primary" />
                        {comp.domain}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">{comp.articlesAnalyzed} articles</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-muted-foreground">Avg Word Count</span>
                        <p className="font-medium">{comp.avgWordCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Top Topics</span>
                        <p className="font-medium">{comp.topTopics.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-1.5">Content Gaps We Can Exploit</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.contentGaps.map(gap => (
                          <Badge key={gap} variant="outline" className="text-[10px] border-primary/30 text-primary">{gap}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generated Articles Tab */}
        {articles.length > 0 && (
          <TabsContent value="articles" className="mt-4">
            <div className="space-y-3">
              {articles.map(art => (
                <Card key={art.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold truncate">{art.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{art.keyword} · {art.contentType}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3" /> {art.wordCount} words</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {art.readingTime} min read</span>
                          <span className="text-[10px] text-muted-foreground">{art.sections?.length || 0} sections</span>
                        </div>
                      </div>
                      <Badge className={cn('text-[10px]', getStatusBadge(art.status).variant)}>{getStatusBadge(art.status).label}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// ============================================================
// Keyword Research Panel
// ============================================================
function KeywordResearchPanel({ onSelectKeyword }: { onSelectKeyword: (kw: KeywordSuggestion) => void }) {
  const [search, setSearch] = useState('');
  const [customKeyword, setCustomKeyword] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return defaultKeywords;
    const q = search.toLowerCase();
    return defaultKeywords.filter(kw => kw.keyword.includes(q));
  }, [search]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Pick Your Target Keyword</CardTitle>
        <CardDescription className="text-xs">Choose a keyword you want to rank for — ClickFlow will write a comprehensive article about it</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Enter your own keyword..."
              className="h-9 pl-8 text-xs"
              value={customKeyword}
              onChange={e => setCustomKeyword(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            className="h-9 px-3 text-xs shrink-0"
            onClick={() => {
              if (customKeyword.trim()) {
                onSelectKeyword({
                  id: `custom-${Date.now()}`,
                  keyword: customKeyword.trim(),
                  difficulty: Math.floor(Math.random() * 30),
                  volume: Math.floor(Math.random() * 5000) + 100,
                  intent: 'commercial',
                });
                setCustomKeyword('');
              }
            }}
          >
            USE THIS
          </Button>
        </div>

        {/* Filter */}
        <Input
          placeholder="Filter suggestions..."
          className="h-8 text-xs max-w-xs"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="text-center">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Or Choose From Our Suggestions</span>
        </div>

        {/* Keyword Table */}
        <div className="border border-border/60 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_100px_100px_60px] gap-0 bg-muted/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Keyword</span>
            <span>Difficulty</span>
            <span>Volume</span>
            <span>Intent</span>
            <span></span>
          </div>
          {filtered.map(kw => (
            <div
              key={kw.id}
              className="grid grid-cols-[1fr_100px_100px_100px_60px] gap-0 px-3 py-2.5 border-t border-border/30 hover:bg-accent/30 cursor-pointer transition-colors items-center"
              onClick={() => onSelectKeyword(kw)}
            >
              <span className="text-xs font-medium truncate">{kw.keyword}</span>
              <span className={cn('text-[10px] px-2 py-0.5 rounded-full w-fit', getDifficultyBg(kw.difficulty))}>
                {kw.difficulty} · {getDifficultyLabel(kw.difficulty)}
              </span>
              <span className="text-[11px] text-muted-foreground">{kw.volume.toLocaleString()}/mo</span>
              <span className={cn('text-[10px] px-2 py-0.5 rounded-full w-fit capitalize', getIntentColor(kw.intent))}>
                {kw.intent}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Article Wizard (Multi-step)
// ============================================================
function ArticleWizard({
  step, setStep,
  brandVoice, setBrandVoice,
  keywords, selectedKeyword, onSelectKeyword,
  competitors, setCompetitors,
  calendar,
  articleConfig, setArticleConfig,
  onGenerate,
}: {
  step: number;
  setStep: (s: number) => void;
  brandVoice: BrandVoice;
  setBrandVoice: React.Dispatch<React.SetStateAction<BrandVoice>>;
  keywords: KeywordSuggestion[];
  selectedKeyword: KeywordSuggestion | null;
  onSelectKeyword: (kw: KeywordSuggestion) => void;
  competitors: Competitor[];
  setCompetitors: React.Dispatch<React.SetStateAction<Competitor[]>>;
  calendar: ContentCalendarItem[];
  articleConfig: ArticleConfig;
  setArticleConfig: React.Dispatch<React.SetStateAction<ArticleConfig>>;
  onGenerate: () => void;
}) {
  const steps = [
    { label: 'Brand Voice', icon: Sparkles },
    { label: 'Keyword Research', icon: Search },
    { label: 'Configure Article', icon: FileText },
    { label: 'Writing Style', icon: PenLine },
    { label: 'Generate', icon: Zap },
  ];

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

      {/* Step Content */}
      {step === 0 && <BrandVoiceStep brandVoice={brandVoice} setBrandVoice={setBrandVoice} />}
      {step === 1 && <KeywordStep keywords={keywords} selectedKeyword={selectedKeyword} onSelectKeyword={onSelectKeyword} />}
      {step === 2 && <ConfigureArticleStep articleConfig={articleConfig} setArticleConfig={setArticleConfig} competitors={competitors} />}
      {step === 3 && <WritingStyleStep brandVoice={brandVoice} setBrandVoice={setBrandVoice} articleConfig={articleConfig} />}
      {step === 4 && <GenerateStep articleConfig={articleConfig} brandVoice={brandVoice} onGenerate={onGenerate} />}

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
// Step 1: Brand Voice
// ============================================================
function BrandVoiceStep({ brandVoice, setBrandVoice }: { brandVoice: BrandVoice; setBrandVoice: React.Dispatch<React.SetStateAction<BrandVoice>> }) {
  const styles = [
    { value: 'your_style', label: 'Your Current Style', desc: 'Based on Varni Jewels\' existing tone — luxurious, aspirational' },
    { value: 'casual', label: 'Casual', desc: 'Friendly, conversational, approachable' },
    { value: 'professional', label: 'Professional', desc: 'Formal, authoritative, business-focused' },
    { value: 'luxury', label: 'Luxury', desc: 'Sophisticated, elegant, aspirational, premium feel' },
  ];

  const imageStyles = [
    { value: 'stock_photo', label: 'Stock Photo' },
    { value: 'watercolor', label: 'Watercolor' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'sketch', label: 'Sketch' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Configure Your Writing Style</CardTitle>
        <CardDescription className="text-xs">These settings will be used for all content we create for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Choose a Writing Style</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {styles.map(s => (
              <button
                key={s.value}
                className={cn(
                  'text-left p-3 rounded-lg border-2 transition-all',
                  brandVoice.writingStyle === s.value ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/30'
                )}
                onClick={() => setBrandVoice(prev => ({ ...prev, writingStyle: s.value as BrandVoice['writingStyle'] }))}
              >
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Image Style</p>
          <div className="grid grid-cols-4 gap-2">
            {imageStyles.map(s => (
              <button
                key={s.value}
                className={cn(
                  'p-2.5 rounded-lg border-2 text-center transition-all',
                  brandVoice.imageStyle === s.value ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/30'
                )}
                onClick={() => setBrandVoice(prev => ({ ...prev, imageStyle: s.value as BrandVoice['imageStyle'] }))}
              >
                <div className={cn(
                  'w-8 h-8 mx-auto rounded-md mb-1.5',
                  s.value === 'stock_photo' && 'bg-gradient-to-br from-amber-200 to-amber-400',
                  s.value === 'watercolor' && 'bg-gradient-to-br from-blue-200 to-purple-200',
                  s.value === 'illustration' && 'bg-gradient-to-br from-emerald-200 to-teal-400',
                  s.value === 'sketch' && 'bg-gradient-to-br from-gray-200 to-gray-400',
                )} />
                <p className="text-[10px] font-medium">{s.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Brand Tone</p>
          <Textarea
            className="text-xs min-h-[80px]"
            value={brandVoice.tone}
            onChange={e => setBrandVoice(prev => ({ ...prev, tone: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Additional Writing Instructions</p>
          <Textarea
            className="text-xs min-h-[60px]"
            placeholder="e.g., Always highlight craftsmanship and heritage. Include care tips. Mention Varni Jewels naturally..."
            value={brandVoice.additionalInstructions}
            onChange={e => setBrandVoice(prev => ({ ...prev, additionalInstructions: e.target.value }))}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Step 2: Keyword Selection
// ============================================================
function KeywordStep({ keywords, selectedKeyword, onSelectKeyword }: { keywords: KeywordSuggestion[]; selectedKeyword: KeywordSuggestion | null; onSelectKeyword: (kw: KeywordSuggestion) => void }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Pick Your Target Keyword</CardTitle>
        <CardDescription className="text-xs">This is the topic ClickFlow will write your article about. Choose a keyword you want to rank for.</CardDescription>
      </CardHeader>
      <CardContent>
        <KeywordResearchPanel onSelectKeyword={onSelectKeyword} />
        {selectedKeyword && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs text-emerald-700 dark:text-emerald-300">Selected: <strong>{selectedKeyword.keyword}</strong> — {selectedKeyword.volume.toLocaleString()}/mo searches · Difficulty {selectedKeyword.difficulty}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================
// Step 3: Configure Article
// ============================================================
function ConfigureArticleStep({ articleConfig, setArticleConfig, competitors }: { articleConfig: ArticleConfig; setArticleConfig: React.Dispatch<React.SetStateAction<ArticleConfig>>; competitors: Competitor[] }) {
  const [linkDomain, setLinkDomain] = useState('varnijewels.com');
  const [linkPath, setLinkPath] = useState('');

  const avgWordCount = 1850;
  const competitorsAnalyzed = competitors.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Configure This Article</CardTitle>
        <CardDescription className="text-xs">Settings specific to your article about &apos;{articleConfig.keyword}&apos;</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Article Title</Label>
              <Input className="text-sm" value={articleConfig.title} onChange={e => setArticleConfig(prev => ({ ...prev, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Content Type</Label>
              <Select value={articleConfig.contentType} onValueChange={v => setArticleConfig(prev => ({ ...prev, contentType: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select type..." /></SelectTrigger>
                <SelectContent>
                  {['Article', 'How-to Guide', 'Listicle', 'Case Study', 'Comparison', 'Resource Roundup', 'FAQ'].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Link to These Pages <span className="text-muted-foreground/60">({articleConfig.internalLinks.length} links)</span></Label>
              <div className="flex gap-2">
                <Input className="h-8 text-xs flex-1" placeholder="varnijewels.com" value={linkDomain} onChange={e => setLinkDomain(e.target.value)} />
                <Input className="h-8 text-xs flex-1" placeholder="/path/to/page" value={linkPath} onChange={e => setLinkPath(e.target.value)} />
                <Button
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => {
                    if (linkPath.trim()) {
                      setArticleConfig(prev => ({ ...prev, internalLinks: [...prev.internalLinks, { domain: linkDomain, path: linkPath }] }));
                      setLinkPath('');
                    }
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
              {articleConfig.internalLinks.length > 0 && (
                <div className="space-y-1 mt-1">
                  {articleConfig.internalLinks.map((link, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <ExternalLink className="h-3 w-3" />
                      {link.domain}{link.path}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Article Instructions (Optional)</Label>
              <Textarea
                className="text-xs min-h-[80px]"
                placeholder="e.g., Focus on beginner-friendly explanations. Include a comparison table. Mention our product as a solution..."
                value={articleConfig.instructions}
                onChange={e => setArticleConfig(prev => ({ ...prev, instructions: e.target.value }))}
              />
            </div>
          </div>

          {/* Research Panel */}
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/60 space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Research</p>
              <div>
                <span className="text-[10px] text-muted-foreground">Avg Word Count</span>
                <p className="text-sm font-bold">{avgWordCount.toLocaleString()} words</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Typical Format</span>
                <p className="text-sm font-medium">Guide</p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Competitor Approach</span>
                <p className="text-xs text-muted-foreground leading-relaxed">Most competitors mix high-level market context with product comparisons and India-specific buying tips, but few offer structured, decision-focused guides tailored for jewelry buyers.</p>
              </div>
              <Separator />
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground mb-2">Competitors Analyzed ({competitorsAnalyzed})</p>
                {competitors.map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between py-1">
                    <span className="text-[11px]">#{i + 2} {c.domain}</span>
                    <span className="text-[10px] text-muted-foreground">{c.articlesAnalyzed} articles</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Step 4: Writing Style
// ============================================================
function WritingStyleStep({ brandVoice, setBrandVoice, articleConfig }: { brandVoice: BrandVoice; setBrandVoice: React.Dispatch<React.SetStateAction<BrandVoice>>; articleConfig: ArticleConfig }) {
  const styles = [
    { value: 'your_style', label: 'Your Current Style', desc: 'Based on your website\'s existing tone' },
    { value: 'casual', label: 'Casual', desc: 'Friendly, conversational, approachable' },
    { value: 'professional', label: 'Professional', desc: 'Formal, authoritative, business-focused' },
    { value: 'luxury', label: 'Luxury', desc: 'Sophisticated, elegant, aspirational' },
  ];

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Configure Your Writing Style</CardTitle>
          <CardDescription className="text-xs">These settings will be used for all content we create for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Choose a Writing Style</p>
            <div className="space-y-2">
              {styles.map(s => (
                <button
                  key={s.value}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border-2 flex items-center gap-3 transition-all',
                    brandVoice.writingStyle === s.value ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/30'
                  )}
                  onClick={() => setBrandVoice(prev => ({ ...prev, writingStyle: s.value as BrandVoice['writingStyle'] }))}
                >
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                    brandVoice.writingStyle === s.value ? 'border-primary' : 'border-gray-300'
                  )}>
                    {brandVoice.writingStyle === s.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Additional Writing Instructions</p>
            <Textarea
              className="text-xs min-h-[60px]"
              value={brandVoice.additionalInstructions}
              onChange={e => setBrandVoice(prev => ({ ...prev, additionalInstructions: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Voice Preview */}
      <Card className="h-fit">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Voice Preview</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-[10px] text-muted-foreground">Preview how your writing style sounds on your article.</p>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Writing About</p>
            <p className="text-sm font-semibold">{articleConfig.keyword || 'gold necklace designs'}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 text-xs leading-relaxed text-foreground/80">
            {brandVoice.writingStyle === 'luxury' && (
              <>When it comes to selecting the perfect gold necklace, the journey is as important as the destination. At Varni Jewels, we believe every woman deserves a piece that reflects her unique elegance — a necklace that doesn&apos;t just adorn, but tells a story of heritage and craftsmanship passed down through generations of master artisans.</>
            )}
            {brandVoice.writingStyle === 'casual' && (
              <>Looking for the perfect gold necklace? We&apos;ve got you covered! Whether you&apos;re dressing up for a wedding or keeping it simple for everyday wear, there&apos;s a gold necklace style out there that&apos;s just right for you. Let&apos;s walk through the options together!</>
            )}
            {brandVoice.writingStyle === 'professional' && (
              <>The Indian gold necklace market has evolved significantly, with consumer preferences shifting toward lightweight designs that maintain traditional aesthetics. This comprehensive guide examines the key factors influencing gold necklace purchases, including karat purity, design categorization, and investment considerations.</>
            )}
            {brandVoice.writingStyle === 'your_style' && (
              <>Gold necklaces remain the cornerstone of Indian jewelry collections, blending timeless tradition with contemporary design sensibilities. Understanding the nuances of gold purity, craftsmanship techniques, and styling options is essential for making an informed purchase that lasts generations.</>
            )}
          </div>
          <p className="text-[9px] text-muted-foreground italic">Sample only — demonstrates your voice settings</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// Step 5: Generate
// ============================================================
function GenerateStep({ articleConfig, brandVoice, onGenerate }: { articleConfig: ArticleConfig; brandVoice: BrandVoice; onGenerate: () => void }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await onGenerate();
    setGenerating(false);
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="py-10 text-center space-y-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-2">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Ready to Generate Your Article</h3>
          <p className="text-sm text-muted-foreground mt-1">ClickFlow will write a comprehensive article using your configured settings</p>
        </div>
        <div className="text-left p-4 rounded-lg bg-muted/30 border border-border/60 space-y-2 max-w-sm mx-auto">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Title</span>
            <span className="font-medium text-right max-w-[200px] truncate">{articleConfig.title}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Keyword</span>
            <span className="font-medium">{articleConfig.keyword}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Writing Style</span>
            <span className="font-medium capitalize">{brandVoice.writingStyle.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Content Type</span>
            <span className="font-medium">{articleConfig.contentType || 'Article'}</span>
          </div>
        </div>
        <Button
          size="lg"
          className="gap-2 text-sm"
          style={{ background: 'linear-gradient(135deg, #D4A843, #B8922E)', color: 'white' }}
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating with AI...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Article
            </>
          )}
        </Button>
        {generating && (
          <p className="text-xs text-muted-foreground">This usually takes about 30 seconds...</p>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================
// Article Review
// ============================================================
function ArticleReview({ article, brandVoice }: { article: GeneratedArticle; brandVoice: BrandVoice }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Article Header */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Badge className={cn('text-[10px] mb-2', getStatusBadge(article.status).variant)}>{getStatusBadge(article.status).label}</Badge>
              <h3 className="text-lg font-bold">{article.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{article.keyword} · {article.contentType} · {new Date(article.createdAt).toLocaleDateString()}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3" /> {article.wordCount} words</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readingTime} min read</span>
                <span className="text-[10px] text-muted-foreground">{article.sections?.length || 0} sections</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => toast.success('Article approved for publishing!')}>
                <CheckCircle2 className="h-3.5 w-3.5" /> Approve
              </Button>
              <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => toast.success('Article exported!')}>
                <FileText className="h-3.5 w-3.5" /> Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta */}
      <Card>
        <CardContent className="py-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Meta Title</p>
              <p className="text-xs font-medium">{article.metaTitle}</p>
              <p className="text-[9px] text-muted-foreground">{article.metaTitle?.length || 0}/60 chars</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Meta Description</p>
              <p className="text-xs">{article.metaDescription}</p>
              <p className="text-[9px] text-muted-foreground">{article.metaDescription?.length || 0}/155 chars</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outline */}
      {article.outline && article.outline.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Article Outline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {article.outline.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      {article.sections?.map((section, i) => (
        <Card key={i}>
          <CardContent className="py-0">
            <button
              className="w-full flex items-center justify-between py-3 text-left"
              onClick={() => setExpandedSection(expandedSection === section.heading ? null : section.heading)}
            >
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                <h4 className="text-sm font-semibold">{section.heading}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{section.wordCount || section.content?.split(/\s+/).length || 0} words</span>
                <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', expandedSection === section.heading && 'rotate-90')} />
              </div>
            </button>
            {expandedSection === section.heading && (
              <div className="pb-4 pl-8">
                <div className="prose prose-sm max-w-none text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Internal Links */}
      {article.internalLinks && article.internalLinks.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Suggested Internal Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {article.internalLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ExternalLink className="h-3 w-3" />
                  {link}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// KPI Card
// ============================================================
function KPICard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-3.5 space-y-1.5">
      <div className="flex items-center gap-2">
        <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center', color === 'emerald' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400', color === 'blue' && 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400', color === 'amber' && 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400', color === 'gray' && 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400', color === 'primary' && 'bg-primary/10 text-primary')}>
          {icon}
        </div>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}
