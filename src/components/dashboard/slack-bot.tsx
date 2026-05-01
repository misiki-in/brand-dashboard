'use client';

import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Send, Bot, Hash, Clock, CheckCircle2, AlertTriangle, Zap, Settings2, Plus,
  Filter, ArrowRight, User, Users, Bell, Calendar, BarChart3, Sparkles, Globe, ExternalLink,
  RefreshCw, ToggleLeft, Command, Play, Pause, Shield,
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
  connectedChannels, conversationHistory, automatedMessages, quickCommands, actionApprovals,
  getChannelTypeBadge, getIntentBadge, getApprovalStatusColor, getFrequencyLabel,
  getCommandCategoryColor, getPlatformBadge,
  type ConnectedChannel, type ActionApproval, type AutomatedMessage,
} from '@/lib/integration-data';

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function MiniMetric({ label, value, subtext, icon: Icon }: { label: string; value: string; subtext?: string; icon?: React.ElementType }) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4 flex items-center gap-3">
        {Icon && <div className="p-2 rounded-lg bg-primary/10"><Icon className="h-4 w-4 text-primary" /></div>}
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold tabular-nums">{value}</p>
          <p className="text-[10px] text-muted-foreground">{label}</p>
          {subtext && <p className="text-[9px] text-muted-foreground/70">{subtext}</p>}
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
      <ExternalLink className="h-3 w-3" />
      {label}
    </Button>
  );
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export function SlackBot() {
  const { executeAction } = useAction();

  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    role: 'user' | 'bot';
    content: string;
    timestamp: string;
    intent?: string;
    confidence?: number;
  }>>(conversationHistory.map(c => ({
    id: c.id,
    role: 'user' as const,
    content: c.message,
    timestamp: c.timestamp,
    intent: c.intent,
    confidence: c.confidence,
  })).flatMap((c, i) => [
    c,
    {
      id: `${c.id}-bot`,
      role: 'bot' as const,
      content: conversationHistory[i].botResponse,
      timestamp: c.timestamp,
    },
  ]));
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Channel state
  const [channels, setChannels] = useState(connectedChannels);

  // Automation state
  const [automations, setAutomations] = useState(automatedMessages);

  // Approval state
  const [approvals, setApprovals] = useState(actionApprovals);
  const [approvedSet, setApprovedSet] = useState<Set<string>>(new Set());
  const [rejectedSet, setRejectedSet] = useState<Set<string>>(new Set());

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Mock bot responses
  const mockBotResponses: Record<string, string> = {
    roas: '📊 Current ROAS across all platforms: **Google Ads** 4.2x | **Meta Ads** 3.8x | **TikTok** 2.1x | **LinkedIn** 1.4x | **Microsoft** 2.8x. Blended ROAS: **3.4x**. Top performer: Google Shopping at 6.1x.',
    spend: '💰 Ad Spend Today: $2,840 across all platforms. Google: $1,180 (on-track) | Meta: $900 (on-track) | TikTok: $570 (overspending) | LinkedIn: $180 (on-track) | Microsoft: $10 (under). Monthly total: $109.6K of $109.8K budget.',
    conversions: '🎯 Conversions today: **347** total. Google: 142 | Meta: 128 | TikTok: 42 | LinkedIn: 18 | Microsoft: 17. Revenue: $24,290. Best CPA: Microsoft at $18.82.',
    inventory: '📦 Stock Status: 3 items below reorder: Gold Bangle Set (12 left), Pearl Necklace (8 left), Silver Anklet (3 left). 8 items with < 30 days stock. Total inventory value: $1.2M.',
    report: '📋 Latest reports available:\n• Weekly Paid Media (Jan 8-15) — PDF\n• Monthly SEO Audit (Dec) — PDF\n• Creative Performance — Dashboard\n\nWant me to generate a fresh report?',
    creative: '🎨 Top 3 Creatives:\n1. "Everlasting Diamond Ring" — ROAS 7.2x\n2. "Gold Necklace Close-up" — ROAS 5.8x\n3. "Valentine Proposal" — ROAS 5.1x\n\n⚠️ 4 creatives showing fatigue (frequency > 4.0x)',
    sentiment: '💡 Brand Sentiment (7-day): **Positive 72%** | Neutral 21% | Negative 7%. Trending topics: Valentine collection (+18%), Gold necklace designs (+12%), Customer service (-3%). No spikes detected.',
    seo: '🔍 SEO Quick Check: Domain Authority 42 | Keywords on Page 1: 89 (+3 this week) | Organic Traffic: 14.2K/month (+8%). 3 new backlinks acquired. 2 pages with content decay detected.',
    audits: '📩 Audit Requests: 8 pending, 2 processing, 1 completed, 2 delivered. High-priority leads: 4. Total pipeline value: $48K MRR potential.',
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: chatInput.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const input = chatInput.toLowerCase();
      let response = "I'm not sure I understand that query. Try using a command like `/roas`, `/spend`, `/conversions`, `/inventory`, `/report`, `/creative`, `/sentiment`, `/seo`, or `/audits`.";

      if (input.includes('roas') || input.includes('performance') || input.includes('return')) {
        response = mockBotResponses.roas;
      } else if (input.includes('spend') || input.includes('budget') || input.includes('cost')) {
        response = mockBotResponses.spend;
      } else if (input.includes('conversion') || input.includes('sales') || input.includes('order')) {
        response = mockBotResponses.conversions;
      } else if (input.includes('stock') || input.includes('inventory') || input.includes('reorder')) {
        response = mockBotResponses.inventory;
      } else if (input.includes('report') || input.includes('generate')) {
        response = mockBotResponses.report;
      } else if (input.includes('creative') || input.includes('ad') || input.includes('image')) {
        response = mockBotResponses.creative;
      } else if (input.includes('sentiment') || input.includes('review') || input.includes('feedback')) {
        response = mockBotResponses.sentiment;
      } else if (input.includes('seo') || input.includes('keyword') || input.includes('organic')) {
        response = mockBotResponses.seo;
      } else if (input.includes('audit') || input.includes('lead') || input.includes('free')) {
        response = mockBotResponses.audits;
      } else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
        response = "Hello! 👋 I'm the Varni Jewels Bot. I can help with:\n• `/roas` — Performance metrics\n• `/spend` — Budget tracking\n• `/conversions` — Sales data\n• `/inventory` — Stock levels\n• `/report` — Generate reports\n• `/audits` — Free audit pipeline\n\nHow can I help you today?";
      }

      setChatMessages(prev => [...prev, {
        id: `msg-bot-${Date.now()}`,
        role: 'bot' as const,
        content: response,
        timestamp: new Date().toISOString(),
      }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === 'active' ? ('paused' as const) : ('active' as const) } : a
    ));
    const msg = automatedMessages.find(a => a.id === id);
    toast.success('Automation updated', { description: `"${msg?.type}" ${msg?.status === 'active' ? 'paused' : 'activated'}` });
  };

  const handleToggleChannel = (id: string) => {
    setChannels(prev => prev.map(c =>
      c.id === id ? { ...c, activeMembers: c.activeMembers > 0 ? 0 : Math.ceil(c.memberCount * 0.6) } : c
    ));
  };

  const handleApproval = (id: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      setApprovedSet(prev => new Set(prev).add(id));
      const approval = approvals.find(a => a.id === id);
      toast.success('Action approved', { description: `${approval?.action}: ${approval?.detail.slice(0, 60)}...` });
    } else {
      setRejectedSet(prev => new Set(prev).add(id));
      const approval = approvals.find(a => a.id === id);
      toast.info('Action rejected', { description: `${approval?.action} was dismissed` });
    }
  };

  return (
    <div className="space-y-6">
      {/* ========== KPI Row ========== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniMetric icon={Hash} label="Connected Channels" value={`${channels.length}`} subtext={`${channels.filter(c => c.platform === 'slack').length} Slack, ${channels.filter(c => c.platform === 'teams').length} Teams`} />
        <MiniMetric icon={MessageSquare} label="Messages This Week" value="1,247" subtext="+12% vs last week" />
        <MiniMetric icon={Zap} label="Actions via Chat" value={`${approvals.filter(a => a.status === 'pending').length} pending`} subtext="23 approved this month" />
        <MiniMetric icon={Bell} label="Automation Messages" value={`${automations.filter(a => a.status === 'active').length} active`} subtext="8 total configured" />
      </div>

      {/* ========== Main Tabs ========== */}
      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1 bg-muted/50">
          <TabsTrigger value="chat" className="text-xs gap-1 data-[state=active]:bg-primary"><MessageSquare className="h-3 w-3" />Chat</TabsTrigger>
          <TabsTrigger value="channels" className="text-xs gap-1 data-[state=active]:bg-primary"><Hash className="h-3 w-3" />Channels</TabsTrigger>
          <TabsTrigger value="automation" className="text-xs gap-1 data-[state=active]:bg-primary"><RefreshCw className="h-3 w-3" />Automation</TabsTrigger>
          <TabsTrigger value="approvals" className="text-xs gap-1 data-[state=active]:bg-primary"><Shield className="h-3 w-3" />Approvals</TabsTrigger>
          <TabsTrigger value="commands" className="text-xs gap-1 data-[state=active]:bg-primary"><Command className="h-3 w-3" />Commands</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* TAB 1: Chat Interface                                        */}
        {/* ============================================================ */}
        <TabsContent value="chat">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">Bot Chat Interface</CardTitle>
                  <Badge className="text-[9px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30">● Online</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-[9px]">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {chatMessages.filter(m => m.role === 'bot').length} responses
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-xs mt-1">
                Simulated Slack/Teams chat — Type a message or use commands like /roas, /spend, /conversions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* Chat Messages Area */}
              <div className="h-[480px] flex flex-col">
                <ScrollArea className="flex-1 px-4 py-3">
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'bot' && (
                          <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                          <div className={`rounded-xl px-4 py-2.5 text-sm ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-tr-sm'
                              : 'bg-muted rounded-tl-sm'
                          }`}>
                            <p className="whitespace-pre-wrap leading-relaxed text-[13px]">{msg.content}</p>
                          </div>
                          <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[9px] text-muted-foreground">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {msg.confidence && (
                              <Badge className="text-[8px] h-4 px-1.5 bg-blue-500/15 text-blue-400 border-blue-500/30">
                                {Math.round(msg.confidence * 100)}% confidence
                              </Badge>
                            )}
                          </div>
                        </div>
                        {msg.role === 'user' && (
                          <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="border-t border-border/50 px-4 py-3 bg-muted/20">
                  <div className="flex items-center gap-2 max-w-3xl mx-auto">
                    <div className="flex-1 relative">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message or command (e.g., /roas, /spend, /help)..."
                        className="pr-10 h-10 text-sm bg-background"
                      />
                      <Bot className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isTyping}
                      className="h-10 px-4"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 max-w-3xl mx-auto flex-wrap">
                    <span className="text-[9px] text-muted-foreground">Quick:</span>
                    {['/roas', '/spend', '/conversions', '/inventory', '/report', '/help'].map(cmd => (
                      <button
                        key={cmd}
                        className="text-[9px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        onClick={() => { setChatInput(cmd); }}
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 2: Channels                                              */}
        {/* ============================================================ */}
        <TabsContent value="channels">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Hash className="h-4 w-4 text-primary" />
                    Connected Channels
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {channels.length} channels connected across Slack and Teams
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={channels.map(c => ({ ID: c.id, Platform: c.platform, Channel: c.channelName, Type: c.type, Members: c.memberCount, ActiveMembers: c.activeMembers, Messages: c.messageCount, LastActivity: c.lastActivity }))}
                  filename="slack-bot-channels.csv"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {channels.map((ch) => {
                  const typeBadge = getChannelTypeBadge(ch.type);
                  const platformBadge = getPlatformBadge(ch.platform);
                  const isActive = ch.activeMembers > 0;
                  return (
                    <div key={ch.id} className={`p-4 rounded-lg border transition-all ${isActive ? 'border-border/50 bg-background' : 'border-border/30 bg-muted/30 opacity-60'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-[9px] ${platformBadge.color}`}>{platformBadge.label}</Badge>
                          <Badge className={`text-[9px] ${typeBadge.color}`}>{typeBadge.label}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleToggleChannel(ch.id)}
                        >
                          {isActive ? <Pause className="h-3 w-3 text-amber-400" /> : <Play className="h-3 w-3 text-emerald-400" />}
                        </Button>
                      </div>
                      <p className="text-sm font-medium mb-1">{ch.channelName}</p>
                      <div className="space-y-1.5 text-[10px] text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Members</span>
                          <span className="font-medium text-foreground">{ch.memberCount} ({ch.activeMembers} active)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Messages</span>
                          <span className="font-medium text-foreground">{ch.messageCount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Last Activity</span>
                          <span>{ch.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 3: Automation                                           */}
        {/* ============================================================ */}
        <TabsContent value="automation">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    Automated Messages
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {automations.filter(a => a.status === 'active').length} active, {automations.filter(a => a.status === 'paused').length} paused
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] gap-1"
                    onClick={() => {
                      automations.filter(a => a.status === 'paused').forEach(a => {
                        setAutomations(prev => prev.map(m => m.id === a.id ? { ...m, status: 'active' as const } : m));
                      });
                      toast.success('All automations activated');
                    }}
                  >
                    <Play className="h-3 w-3" />
                    Enable All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] gap-1"
                    onClick={() => {
                      automations.filter(a => a.status === 'active').forEach(a => {
                        setAutomations(prev => prev.map(m => m.id === a.id ? { ...m, status: 'paused' as const } : m));
                      });
                      toast.success('All automations paused');
                    }}
                  >
                    <Pause className="h-3 w-3" />
                    Pause All
                  </Button>
                  <TabExportButton
                    label="Export"
                    data={automations.map(a => ({ ID: a.id, Type: a.type, Frequency: a.frequency, Channels: a.channels.join(', '), Status: a.status, LastSent: a.lastSent, NextScheduled: a.nextScheduled, AvgReactions: a.engagement.avgReactions, AvgReplies: a.engagement.avgReplies }))}
                    filename="slack-bot-automations.csv"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {automations.map((auto) => (
                <div key={auto.id} className={`p-4 rounded-lg border transition-all ${auto.status === 'active' ? 'border-border/50' : 'border-border/30 opacity-60'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{auto.type}</span>
                        <Badge variant="outline" className="text-[9px]">{getFrequencyLabel(auto.frequency)}</Badge>
                        <Badge className={`text-[9px] ${auto.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-muted text-muted-foreground border-muted-foreground/30'}`}>
                          {auto.status === 'active' ? '● Active' : '○ Paused'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{auto.contentPreview}</p>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Channels: {auto.channels.join(', ')}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Last sent: {new Date(auto.lastSent).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Next: {new Date(auto.nextScheduled).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="text-muted-foreground">Engagement:</span>
                        <span className="text-foreground font-medium">👍 {auto.engagement.avgReactions} avg reactions</span>
                        <span className="text-foreground font-medium">💬 {auto.engagement.avgReplies} avg replies</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-[10px] gap-1"
                        onClick={() => handleToggleAutomation(auto.id)}
                      >
                        {auto.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        {auto.status === 'active' ? 'Pause' : 'Enable'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-[10px] gap-1"
                        onClick={() => {
                          executeAction({
                            action: 'Send Now',
                            module: 'slack-bot',
                            detail: `Manually trigger "${auto.type}" automation`,
                            successMsg: `"${auto.type}" sent to ${auto.channels.length} channels`,
                            simulateDelay: 1000,
                          });
                        }}
                      >
                        <Send className="h-3 w-3" />
                        Send Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 4: Pending Approvals                                     */}
        {/* ============================================================ */}
        <TabsContent value="approvals">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Action Approvals via Chat
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {approvals.filter(a => a.status === 'pending').length} pending approvals requiring attention
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={approvals.map(a => ({ ID: a.id, Action: a.action, Detail: a.detail, RequestedBy: a.requestedBy, RequestedAt: a.requestedAt, Platform: a.platform, Status: a.status, Channel: a.channel }))}
                  filename="slack-bot-approvals.csv"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {approvals.map((approval) => {
                const isProcessed = approvedSet.has(approval.id) || rejectedSet.has(approval.id);
                const currentStatus = isProcessed
                  ? (approvedSet.has(approval.id) ? 'approved' : 'rejected')
                  : approval.status;

                return (
                  <div key={approval.id} className={`p-4 rounded-lg border transition-all ${
                    currentStatus === 'approved' ? 'border-emerald-500/30 bg-emerald-500/5' :
                    currentStatus === 'rejected' ? 'border-red-500/30 bg-red-500/5 opacity-60' :
                    currentStatus === 'expired' ? 'border-border/30 opacity-40' :
                    'border-amber-500/30 bg-amber-500/5'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{approval.action}</span>
                          <Badge className={`text-[9px] ${getApprovalStatusColor(currentStatus)}`}>
                            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                          </Badge>
                          <Badge className={`text-[9px] ${getPlatformBadge(approval.platform).color}`}>
                            {getPlatformBadge(approval.platform).label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{approval.detail}</p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {approval.requestedBy}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(approval.requestedAt).toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> {approval.channel}</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {currentStatus === 'approved' ? (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Approved
                          </Badge>
                        ) : currentStatus === 'rejected' ? (
                          <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-[10px]">
                            Rejected
                          </Badge>
                        ) : currentStatus === 'expired' ? (
                          <Badge variant="secondary" className="text-[10px]">Expired</Badge>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-[10px] gap-1 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 px-2"
                              onClick={() => handleApproval(approval.id, 'reject')}
                            >
                              <AlertTriangle className="h-3 w-3" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="h-7 text-[10px] gap-1 px-2"
                              onClick={() => handleApproval(approval.id, 'approve')}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Approve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 5: Commands                                              */}
        {/* ============================================================ */}
        <TabsContent value="commands">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Command className="h-4 w-4 text-primary" />
                    Available Bot Commands
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {quickCommands.length} commands available — {quickCommands.filter(c => c.requiresAuth).length} require authentication
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={quickCommands.map(c => ({ Command: c.command, Description: c.description, Example: c.example, Category: c.category, RequiresAuth: c.requiresAuth }))}
                  filename="slack-bot-commands.csv"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[500px]">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Command</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Description</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Example</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Category</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Auth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quickCommands.map((cmd) => (
                        <tr key={cmd.command} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 px-2">
                            <code className="text-xs font-mono bg-muted/50 px-1.5 py-0.5 rounded text-primary">{cmd.command}</code>
                          </td>
                          <td className="py-2.5 px-2 text-xs max-w-[200px]">{cmd.description}</td>
                          <td className="py-2.5 px-2 text-[11px] text-muted-foreground font-mono max-w-[180px] truncate">{cmd.example}</td>
                          <td className="py-2.5 px-2">
                            <Badge className={`text-[9px] ${getCommandCategoryColor(cmd.category)}`}>{cmd.category}</Badge>
                          </td>
                          <td className="py-2.5 px-2">
                            {cmd.requiresAuth ? (
                              <Badge className="text-[9px] bg-amber-500/15 text-amber-400 border-amber-500/30">
                                <Shield className="h-2.5 w-2.5 mr-0.5" /> Required
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[9px]">Open</Badge>
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
      </Tabs>
    </div>
  );
}
