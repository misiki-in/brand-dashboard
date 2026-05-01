'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  Heart, BarChart3, MessageSquare, Star, Search, FileText,
  Share2, Mail, DollarSign, Users, Crown, Gem, TrendingUp,
  Swords, Calendar, ChevronLeft, ChevronRight, Sparkles, Menu, Bell, Settings, LayoutDashboard,
  Eye, UserCircle, Route, Package, MessageCircle, Palette, Brain,
} from 'lucide-react';

import { BrandOverview } from '@/components/dashboard/brand-overview';
import { BrandAwareness } from '@/components/dashboard/brand-awareness';
import { SentimentListening } from '@/components/dashboard/sentiment';
import { CustomerExperience } from '@/components/dashboard/customer-experience';
import { SeoDigital } from '@/components/dashboard/seo';
import { ContentStrategy } from '@/components/dashboard/content';
import { SocialMedia } from '@/components/dashboard/social';
import { EmailSms } from '@/components/dashboard/email-sms';
import { PaidMedia } from '@/components/dashboard/paid-media';
import { InfluencerPartnerships } from '@/components/dashboard/influencer';
import { LoyaltyRetention } from '@/components/dashboard/loyalty';
import { ProductPerformance } from '@/components/dashboard/product';
import { RevenueConversions } from '@/components/dashboard/revenue';
import { CompetitiveIntel } from '@/components/dashboard/competitive';
import { CampaignCalendar } from '@/components/dashboard/campaigns';
import { Audience } from '@/components/dashboard/audience';
import { CustomerJourney } from '@/components/dashboard/journey';
import { InventoryIntelligence } from '@/components/dashboard/inventory';
import { WhatsAppCommerceHub } from '@/components/dashboard/whatsapp';
import { CreativeBrandLayer } from '@/components/dashboard/creative';
import { AIGrowthEngine } from '@/components/dashboard/ai-engine';

const navSections = [
  {
    label: 'Brand Health',
    items: [
      { id: 'overview', label: 'Brand Overview', icon: LayoutDashboard },
      { id: 'awareness', label: 'Brand Awareness', icon: Eye },
      { id: 'sentiment', label: 'Sentiment & Listening', icon: MessageSquare },
      { id: 'cx', label: 'Customer Experience', icon: Star },
    ],
  },
  {
    label: 'Commerce & Inventory',
    items: [
      { id: 'product', label: 'Sales Intelligence', icon: Gem },
      { id: 'inventory', label: 'Inventory Intelligence', icon: Package },
      { id: 'revenue', label: 'Revenue & Funnel', icon: TrendingUp },
      { id: 'loyalty', label: 'Loyalty & Retention', icon: Crown },
    ],
  },
  {
    label: 'Marketing Operations',
    items: [
      { id: 'ads', label: 'Marketing Command', icon: DollarSign },
      { id: 'whatsapp', label: 'WhatsApp Hub', icon: MessageCircle },
      { id: 'creative', label: 'Creative & Brand', icon: Palette },
      { id: 'email', label: 'Email & SMS', icon: Mail },
      { id: 'influencer', label: 'Influencer & PR', icon: Users },
    ],
  },
  {
    label: 'Audience & Journey',
    items: [
      { id: 'audience', label: 'Audience & Personas', icon: UserCircle },
      { id: 'journey', label: 'Customer Journey', icon: Route },
    ],
  },
  {
    label: 'Digital Presence',
    items: [
      { id: 'social', label: 'Social Media', icon: Share2 },
      { id: 'content', label: 'Content Strategy', icon: FileText },
      { id: 'seo', label: 'SEO & Digital', icon: Search },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { id: 'competitive', label: 'Competitive Intel', icon: Swords },
      { id: 'campaigns', label: 'Campaign Calendar', icon: Calendar },
      { id: 'ai-engine', label: 'AI Growth Engine', icon: Brain },
    ],
  },
];

const tabComponents: Record<string, React.ComponentType> = {
  overview: BrandOverview,
  awareness: BrandAwareness,
  sentiment: SentimentListening,
  cx: CustomerExperience,
  audience: Audience,
  journey: CustomerJourney,
  seo: SeoDigital,
  content: ContentStrategy,
  social: SocialMedia,
  email: EmailSms,
  ads: PaidMedia,
  influencer: InfluencerPartnerships,
  loyalty: LoyaltyRetention,
  product: ProductPerformance,
  revenue: RevenueConversions,
  competitive: CompetitiveIntel,
  campaigns: CampaignCalendar,
  inventory: InventoryIntelligence,
  whatsapp: WhatsAppCommerceHub,
  creative: CreativeBrandLayer,
  'ai-engine': AIGrowthEngine,
};

function SidebarNav({
  activeTab,
  onTabChange,
  collapsed,
}: {
  activeTab: string;
  onTabChange: (id: string) => void;
  collapsed: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-sm font-bold gold-shimmer truncate">Lumière Jewels</h1>
            <p className="text-[10px] text-sidebar-foreground/60">Brand Command Center</p>
          </div>
        )}
      </div>
      <Separator className="bg-sidebar-border/50" />

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3 custom-scrollbar">
        <div className="space-y-4 px-2">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-1.5">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size={collapsed ? "icon" : "sm"}
                      onClick={() => onTabChange(item.id)}
                      className={cn(
                        "w-full justify-start gap-2.5 h-9 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-all",
                        isActive && "bg-primary/15 text-sidebar-foreground font-medium shadow-sm",
                        collapsed && "justify-center px-0"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary")} />
                      {!collapsed && (
                        <span className="text-xs truncate">{item.label}</span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator className="bg-sidebar-border/50" />

      {/* Bottom */}
      {!collapsed && (
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-sidebar-accent/30">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              LJ
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-sidebar-foreground truncate">Marketing Team</p>
              <p className="text-[10px] text-sidebar-foreground/50">Enterprise Plan</p>
            </div>
            <Settings className="h-3.5 w-3.5 text-sidebar-foreground/40 cursor-pointer hover:text-sidebar-foreground transition-colors" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const ActiveComponent = tabComponents[activeTab] || BrandOverview;
  const activeLabel = navSections
    .flatMap((s) => s.items)
    .find((i) => i.id === activeTab)?.label || 'Brand Overview';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-sidebar-border/30 bg-sidebar text-sidebar-foreground transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute top-1/2 -translate-y-1/2 items-center justify-center h-6 w-6 rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all z-10 cursor-pointer"
          style={{ left: collapsed ? '52px' : '236px' }}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border/30">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarNav activeTab={activeTab} onTabChange={(id) => { setActiveTab(id); setMobileOpen(false); }} collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border/50 bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            </Sheet>
            <div>
              <h2 className="text-sm font-semibold">{activeLabel}</h2>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                Jewelry Commerce — Marketing Automation Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Live Data</span>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </div>
        </header>

        {/* Dashboard Content */}
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="p-4 lg:p-6 max-w-[1400px] mx-auto w-full">
            <ActiveComponent />
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
