// ============================================================
// VARNI JEWELS — AI Landing Page Builder Data
// Mock data for landing page generation, A/B testing, coherence, and analytics
// ============================================================

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type PageStatus = 'draft' | 'published' | 'paused';
export type TestStatus = 'running' | 'completed';
export type TestMetric = 'headline' | 'cta' | 'hero_image' | 'social_proof';
export type TemplateCategory = 'product_launch' | 'seasonal' | 'collection' | 'brand_story' | 'sale' | 'lead_gen';
export type CoherenceIssue = 'messaging mismatch' | 'visual inconsistency' | 'offer mismatch' | 'loading speed';

export interface LandingPage {
  id: string;
  name: string;
  url: string;
  status: PageStatus;
  linkedCampaign: string;
  traffic: number;
  conversions: number;
  conversionRate: number;
  avgTimeOnPage: string;
  scrollDepth: number;
  bounceRate: number;
  createdAt: string;
  lastModified: string;
  template: string;
}

export interface ABTestVariant {
  label: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
}

export interface ABTest {
  id: string;
  pageName: string;
  variants: ABTestVariant[];
  metric: TestMetric;
  startDate: string;
  status: TestStatus;
  winner: 'A' | 'B' | null;
  confidence: number;
  improvement: number;
}

export interface PageTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  preview: string;
  conversionBenchmark: number;
  bestFor: string;
}

export interface CoherenceCheck {
  pageName: string;
  adCampaign: string;
  coherenceScore: number;
  issues: CoherenceIssue[];
  recommendations: string[];
}

export interface FunnelStep {
  label: string;
  count: number;
  percentage: number;
}

export interface ConversionTracking {
  pageName: string;
  timeOnPage: string;
  scrollDepth: number;
  formCompletions: number;
  clickThroughs: number;
  addToCarts: number;
  purchases: number;
  revenue: number;
  funnel: FunnelStep[];
}

export interface PageElement {
  type: string;
  description: string;
  avgConversionLift: number;
  usageCount: number;
}

// ------------------------------------------------------------------
// Landing Pages
// ------------------------------------------------------------------

export const landingPages: LandingPage[] = [
  {
    id: 'lp-001',
    name: 'Akshaya Tritiya Gold Collection',
    url: '/akshaya-tritiya-2026',
    status: 'published',
    linkedCampaign: 'Akshaya Tritiya Meta Campaign',
    traffic: 14820,
    conversions: 1234,
    conversionRate: 8.3,
    avgTimeOnPage: '2m 45s',
    scrollDepth: 72,
    bounceRate: 34,
    createdAt: '2026-03-15',
    lastModified: '2026-04-10',
    template: 'Festive Collection Launch',
  },
  {
    id: 'lp-002',
    name: 'Diamond Engagement Ring Finder',
    url: '/engagement-ring-finder',
    status: 'published',
    linkedCampaign: 'Engagement Season Google Ads',
    traffic: 9340,
    conversions: 612,
    conversionRate: 6.6,
    avgTimeOnPage: '4m 12s',
    scrollDepth: 85,
    bounceRate: 28,
    createdAt: '2026-02-01',
    lastModified: '2026-04-08',
    template: 'Interactive Product Finder',
  },
  {
    id: 'lp-003',
    name: 'Summer Wedding Jewelry',
    url: '/summer-wedding-2026',
    status: 'draft',
    linkedCampaign: 'Summer Wedding Meta & Google',
    traffic: 0,
    conversions: 0,
    conversionRate: 0,
    avgTimeOnPage: '—',
    scrollDepth: 0,
    bounceRate: 0,
    createdAt: '2026-04-05',
    lastModified: '2026-04-12',
    template: 'Seasonal Collection',
  },
  {
    id: 'lp-004',
    name: 'Valentine\'s Day Sale',
    url: '/valentine-sale-2026',
    status: 'paused',
    linkedCampaign: 'Valentine\'s Day Campaign',
    traffic: 22450,
    conversions: 2018,
    conversionRate: 9.0,
    avgTimeOnPage: '2m 10s',
    scrollDepth: 68,
    bounceRate: 38,
    createdAt: '2026-01-10',
    lastModified: '2026-02-20',
    template: 'Flash Sale',
  },
  {
    id: 'lp-005',
    name: 'Sustainability & Ethical Sourcing',
    url: '/our-ethos',
    status: 'published',
    linkedCampaign: 'Brand Awareness Campaign',
    traffic: 5620,
    conversions: 189,
    conversionRate: 3.4,
    avgTimeOnPage: '5m 30s',
    scrollDepth: 91,
    bounceRate: 22,
    createdAt: '2026-01-20',
    lastModified: '2026-03-18',
    template: 'Brand Story',
  },
  {
    id: 'lp-006',
    name: 'Gold Rate Lock Offer',
    url: '/gold-rate-lock',
    status: 'published',
    linkedCampaign: 'Gold Investment WhatsApp Blast',
    traffic: 7890,
    conversions: 843,
    conversionRate: 10.7,
    avgTimeOnPage: '1m 50s',
    scrollDepth: 62,
    bounceRate: 31,
    createdAt: '2026-03-01',
    lastModified: '2026-04-02',
    template: 'Lead Gen Offer',
  },
  {
    id: 'lp-007',
    name: 'New Arrivals — Temple Jewelry',
    url: '/new-arrivals-temple',
    status: 'draft',
    linkedCampaign: 'New Collection Launch',
    traffic: 0,
    conversions: 0,
    conversionRate: 0,
    avgTimeOnPage: '—',
    scrollDepth: 0,
    bounceRate: 0,
    createdAt: '2026-04-08',
    lastModified: '2026-04-11',
    template: 'Product Launch',
  },
  {
    id: 'lp-008',
    name: 'Customer Loyalty VIP Preview',
    url: '/vip-preview',
    status: 'paused',
    linkedCampaign: 'VIP Email Campaign',
    traffic: 3200,
    conversions: 448,
    conversionRate: 14.0,
    avgTimeOnPage: '3m 20s',
    scrollDepth: 78,
    bounceRate: 19,
    createdAt: '2026-02-15',
    lastModified: '2026-03-25',
    template: 'Exclusive Access',
  },
];

// ------------------------------------------------------------------
// A/B Tests
// ------------------------------------------------------------------

export const abTests: ABTest[] = [
  {
    id: 'abt-001',
    pageName: 'Akshaya Tritiya Gold Collection',
    variants: [
      { label: 'A — Original Headline', impressions: 7420, conversions: 587, conversionRate: 7.9 },
      { label: 'B — Urgency Headline', impressions: 7400, conversions: 647, conversionRate: 8.7 },
    ],
    metric: 'headline',
    startDate: '2026-04-01',
    status: 'running',
    winner: null,
    confidence: 87,
    improvement: 10.1,
  },
  {
    id: 'abt-002',
    pageName: 'Diamond Engagement Ring Finder',
    variants: [
      { label: 'A — "Shop Now" CTA', impressions: 4680, conversions: 289, conversionRate: 6.2 },
      { label: 'B — "Find Your Ring" CTA', impressions: 4660, conversions: 323, conversionRate: 6.9 },
    ],
    metric: 'cta',
    startDate: '2026-03-15',
    status: 'completed',
    winner: 'B',
    confidence: 96,
    improvement: 11.3,
  },
  {
    id: 'abt-003',
    pageName: 'Valentine\'s Day Sale',
    variants: [
      { label: 'A — Model Image', impressions: 11230, conversions: 985, conversionRate: 8.8 },
      { label: 'B — Product Closeup', impressions: 11220, conversions: 1033, conversionRate: 9.2 },
    ],
    metric: 'hero_image',
    startDate: '2026-01-20',
    status: 'completed',
    winner: 'B',
    confidence: 92,
    improvement: 4.5,
  },
  {
    id: 'abt-004',
    pageName: 'Gold Rate Lock Offer',
    variants: [
      { label: 'A — No Social Proof', impressions: 3950, conversions: 395, conversionRate: 10.0 },
      { label: 'B — With Testimonials', impressions: 3940, conversions: 448, conversionRate: 11.4 },
    ],
    metric: 'social_proof',
    startDate: '2026-03-10',
    status: 'running',
    winner: null,
    confidence: 94,
    improvement: 14.0,
  },
  {
    id: 'abt-005',
    pageName: 'Sustainability & Ethical Sourcing',
    variants: [
      { label: 'A — Data-First Narrative', impressions: 2810, conversions: 87, conversionRate: 3.1 },
      { label: 'B — Story-First Narrative', impressions: 2810, conversions: 102, conversionRate: 3.6 },
    ],
    metric: 'headline',
    startDate: '2026-03-20',
    status: 'completed',
    winner: 'B',
    confidence: 82,
    improvement: 16.1,
  },
];

// ------------------------------------------------------------------
// Template Library
// ------------------------------------------------------------------

export const pageTemplates: PageTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Festive Collection Launch',
    category: 'product_launch',
    preview: 'Bold hero with countdown timer, featured products grid, limited-time offer banner, trust badges, and urgency-driven CTA.',
    conversionBenchmark: 7.5,
    bestFor: 'Diwali, Akshaya Tritiya, Navratri, and other festival collections',
  },
  {
    id: 'tpl-002',
    name: 'Seasonal Collection',
    category: 'seasonal',
    preview: 'Elegant hero with seasonal imagery, curated product carousel, lookbook section, and soft-CTA newsletter signup.',
    conversionBenchmark: 5.8,
    bestFor: 'Summer, Monsoon, Wedding season drops',
  },
  {
    id: 'tpl-003',
    name: 'Interactive Product Finder',
    category: 'product_launch',
    preview: 'Step-by-step quiz/filter UI, personalized results grid, comparison table, and guided purchase flow.',
    conversionBenchmark: 6.9,
    bestFor: 'Engagement rings, gift selectors, style finders',
  },
  {
    id: 'tpl-004',
    name: 'Brand Story',
    category: 'brand_story',
    preview: 'Full-width imagery, founder story timeline, craftsmanship showcase, video embed, and mission statement section.',
    conversionBenchmark: 3.2,
    bestFor: 'About pages, sustainability reports, heritage collections',
  },
  {
    id: 'tpl-005',
    name: 'Flash Sale',
    category: 'sale',
    preview: 'Urgency hero with countdown, discount tiers, top deals grid, stock-level indicators, and sticky buy bar.',
    conversionBenchmark: 9.0,
    bestFor: 'End-of-season sales, clearance events, flash deals',
  },
  {
    id: 'tpl-006',
    name: 'Lead Gen Offer',
    category: 'lead_gen',
    preview: 'Single-column focus, compelling offer card, form with social proof, FAQ section, and trust indicators.',
    conversionBenchmark: 11.0,
    bestFor: 'Webinars, WhatsApp signups, gold rate alerts, price lock offers',
  },
  {
    id: 'tpl-007',
    name: 'Collection Showcase',
    category: 'collection',
    preview: 'Minimalist hero, high-resolution product gallery, detailed specifications, and add-to-cart integration.',
    conversionBenchmark: 6.4,
    bestFor: 'New collections, capsule drops, designer collaborations',
  },
  {
    id: 'tpl-008',
    name: 'Exclusive Access',
    category: 'lead_gen',
    preview: 'VIP branding, early-access product reveal, invite-code entry, loyalty program enrollment, and referral CTA.',
    conversionBenchmark: 12.5,
    bestFor: 'VIP previews, loyalty member events, pre-launch access',
  },
];

// ------------------------------------------------------------------
// Ad-to-Page Coherence
// ------------------------------------------------------------------

export const coherenceChecks: CoherenceCheck[] = [
  {
    pageName: 'Akshaya Tritiya Gold Collection',
    adCampaign: 'Akshaya Tritiya Meta Campaign',
    coherenceScore: 88,
    issues: [],
    recommendations: ['Add WhatsApp CTA to match ad creative promise', 'Include customer photos section for social proof alignment'],
  },
  {
    pageName: 'Diamond Engagement Ring Finder',
    adCampaign: 'Engagement Season Google Ads',
    coherenceScore: 92,
    issues: [],
    recommendations: ['Consider adding video testimonials to match ad video creative'],
  },
  {
    pageName: 'Valentine\'s Day Sale',
    adCampaign: 'Valentine\'s Day Campaign',
    coherenceScore: 74,
    issues: ['messaging mismatch', 'offer mismatch'],
    recommendations: [
      'Update hero headline to match ad copy ("20% Off All Couples Jewelry" vs current "Valentine Sale")',
      'Align discount tiers on page with ad creative: show 15/20/25% instead of flat 20%',
      'Add "Free Gift Wrapping" badge — mentioned in ads but missing from page',
    ],
  },
  {
    pageName: 'Sustainability & Ethical Sourcing',
    adCampaign: 'Brand Awareness Campaign',
    coherenceScore: 95,
    issues: [],
    recommendations: ['Page is well-aligned — consider adding certification logos for even stronger trust signals'],
  },
  {
    pageName: 'Gold Rate Lock Offer',
    adCampaign: 'Gold Investment WhatsApp Blast',
    coherenceScore: 62,
    issues: ['messaging mismatch', 'visual inconsistency', 'loading speed'],
    recommendations: [
      'Hero image uses stock photo — replace with Varni showroom imagery to match WhatsApp creative',
      'Add "Lock Your Rate Today" headline — matches blast message but page says "Special Offer"',
      'Compress hero image (currently 4.2MB) — page loads in 6.8s, should be under 3s',
      'Add WhatsApp floating CTA button for consistency with campaign channel',
    ],
  },
  {
    pageName: 'Customer Loyalty VIP Preview',
    adCampaign: 'VIP Email Campaign',
    coherenceScore: 83,
    issues: ['offer mismatch'],
    recommendations: [
      'Email mentions "Exclusive 30% off for VIPs" but page shows 25% — align the offer',
      'Add email personalization elements (name, member tier) to match email tone',
    ],
  },
];

// ------------------------------------------------------------------
// Conversion Tracking
// ------------------------------------------------------------------

export const conversionTracking: ConversionTracking[] = [
  {
    pageName: 'Akshaya Tritiya Gold Collection',
    timeOnPage: '2m 45s',
    scrollDepth: 72,
    formCompletions: 312,
    clickThroughs: 2340,
    addToCarts: 1890,
    purchases: 1234,
    revenue: 2847600,
    funnel: [
      { label: 'Page View', count: 14820, percentage: 100 },
      { label: 'Scroll to Products', count: 10672, percentage: 72 },
      { label: 'Click Product', count: 7845, percentage: 53 },
      { label: 'Add to Cart', count: 1890, percentage: 12.8 },
      { label: 'Begin Checkout', count: 1560, percentage: 10.5 },
      { label: 'Purchase', count: 1234, percentage: 8.3 },
    ],
  },
  {
    pageName: 'Diamond Engagement Ring Finder',
    timeOnPage: '4m 12s',
    scrollDepth: 85,
    formCompletions: 890,
    clickThroughs: 1450,
    addToCarts: 820,
    purchases: 612,
    revenue: 4284000,
    funnel: [
      { label: 'Page View', count: 9340, percentage: 100 },
      { label: 'Start Quiz', count: 4680, percentage: 50 },
      { label: 'View Results', count: 3200, percentage: 34.3 },
      { label: 'Click Product', count: 1450, percentage: 15.5 },
      { label: 'Add to Cart', count: 820, percentage: 8.8 },
      { label: 'Purchase', count: 612, percentage: 6.6 },
    ],
  },
  {
    pageName: 'Valentine\'s Day Sale',
    timeOnPage: '2m 10s',
    scrollDepth: 68,
    formCompletions: 180,
    clickThroughs: 3450,
    addToCarts: 2680,
    purchases: 2018,
    revenue: 1567200,
    funnel: [
      { label: 'Page View', count: 22450, percentage: 100 },
      { label: 'Scroll to Deals', count: 15266, percentage: 68 },
      { label: 'Click Deal', count: 6450, percentage: 28.7 },
      { label: 'Add to Cart', count: 2680, percentage: 11.9 },
      { label: 'Begin Checkout', count: 2280, percentage: 10.2 },
      { label: 'Purchase', count: 2018, percentage: 9.0 },
    ],
  },
  {
    pageName: 'Sustainability & Ethical Sourcing',
    timeOnPage: '5m 30s',
    scrollDepth: 91,
    formCompletions: 420,
    clickThroughs: 890,
    addToCarts: 0,
    purchases: 0,
    revenue: 0,
    funnel: [
      { label: 'Page View', count: 5620, percentage: 100 },
      { label: 'Read Full Story', count: 5114, percentage: 91 },
      { label: 'Watch Video', count: 2360, percentage: 42 },
      { label: 'Newsletter Signup', count: 420, percentage: 7.5 },
      { label: 'Visit Shop', count: 890, percentage: 15.8 },
      { label: 'Browse Products', count: 189, percentage: 3.4 },
    ],
  },
  {
    pageName: 'Gold Rate Lock Offer',
    timeOnPage: '1m 50s',
    scrollDepth: 62,
    formCompletions: 1240,
    clickThroughs: 560,
    addToCarts: 0,
    purchases: 843,
    revenue: 623800,
    funnel: [
      { label: 'Page View', count: 7890, percentage: 100 },
      { label: 'View Offer', count: 4892, percentage: 62 },
      { label: 'Submit Form', count: 1240, percentage: 15.7 },
      { label: 'WhatsApp Opt-in', count: 1040, percentage: 13.2 },
      { label: 'Store Visit', count: 843, percentage: 10.7 },
      { label: 'Purchase', count: 843, percentage: 10.7 },
    ],
  },
  {
    pageName: 'Customer Loyalty VIP Preview',
    timeOnPage: '3m 20s',
    scrollDepth: 78,
    formCompletions: 0,
    clickThroughs: 890,
    addToCarts: 620,
    purchases: 448,
    revenue: 896000,
    funnel: [
      { label: 'Page View', count: 3200, percentage: 100 },
      { label: 'Enter Invite Code', count: 2880, percentage: 90 },
      { label: 'Browse Products', count: 2496, percentage: 78 },
      { label: 'Add to Cart', count: 620, percentage: 19.4 },
      { label: 'Begin Checkout', count: 510, percentage: 15.9 },
      { label: 'Purchase', count: 448, percentage: 14.0 },
    ],
  },
];

// ------------------------------------------------------------------
// Page Elements (Component Library)
// ------------------------------------------------------------------

export const pageElements: PageElement[] = [
  {
    type: 'hero_banner',
    description: 'Full-width hero section with headline, subtext, CTA button, and optional background image or video.',
    avgConversionLift: 12.5,
    usageCount: 8,
  },
  {
    type: 'product_grid',
    description: 'Responsive grid of product cards with images, names, prices, and add-to-cart buttons.',
    avgConversionLift: 18.2,
    usageCount: 6,
  },
  {
    type: 'testimonial_section',
    description: 'Customer review carousel or grid with star ratings, names, photos, and review text.',
    avgConversionLift: 15.8,
    usageCount: 5,
  },
  {
    type: 'cta_block',
    description: 'Standalone call-to-action section with headline, description, and action button.',
    avgConversionLift: 9.4,
    usageCount: 8,
  },
  {
    type: 'trust_badges',
    description: 'Row of trust indicators: secure payment, free shipping, certified diamonds, returns policy.',
    avgConversionLift: 7.2,
    usageCount: 7,
  },
  {
    type: 'faq_section',
    description: 'Expandable accordion FAQ with common questions about products, shipping, returns, and guarantees.',
    avgConversionLift: 5.1,
    usageCount: 4,
  },
  {
    type: 'video_embed',
    description: 'Embedded video player for brand stories, product showcases, or customer testimonials.',
    avgConversionLift: 11.3,
    usageCount: 3,
  },
  {
    type: 'countdown_timer',
    description: 'Live countdown timer for limited-time offers, sales, or event launches with urgency messaging.',
    avgConversionLift: 14.6,
    usageCount: 3,
  },
  {
    type: 'comparison_table',
    description: 'Side-by-side product comparison with specs, prices, and feature highlights.',
    avgConversionLift: 8.7,
    usageCount: 2,
  },
  {
    type: 'social_proof_bar',
    description: 'Real-time social proof ticker showing recent purchases, reviews, and visitor counts.',
    avgConversionLift: 6.9,
    usageCount: 4,
  },
  {
    type: 'instagram_feed',
    description: 'Embedded Instagram grid showing user-generated content and brand posts.',
    avgConversionLift: 4.3,
    usageCount: 3,
  },
  {
    type: 'newsletter_signup',
    description: 'Email capture section with incentive, form fields, and privacy assurance.',
    avgConversionLift: 3.8,
    usageCount: 5,
  },
];

// ------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------

export function getStatusColor(status: PageStatus): string {
  switch (status) {
    case 'published': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400';
    case 'draft': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400';
    case 'paused': return 'bg-gray-100 text-gray-600 dark:bg-gray-500/15 dark:text-gray-400';
  }
}

export function getStatusLabel(status: PageStatus): string {
  switch (status) {
    case 'published': return 'Published';
    case 'draft': return 'Draft';
    case 'paused': return 'Paused';
  }
}

export function getTestStatusColor(status: TestStatus): string {
  switch (status) {
    case 'running': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400';
    case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400';
  }
}

export function getTestStatusLabel(status: TestStatus): string {
  switch (status) {
    case 'running': return 'Running';
    case 'completed': return 'Completed';
  }
}

export function getMetricLabel(metric: TestMetric): string {
  switch (metric) {
    case 'headline': return 'Headline';
    case 'cta': return 'CTA Button';
    case 'hero_image': return 'Hero Image';
    case 'social_proof': return 'Social Proof';
  }
}

export function getCategoryLabel(category: TemplateCategory): string {
  switch (category) {
    case 'product_launch': return 'Product Launch';
    case 'seasonal': return 'Seasonal';
    case 'collection': return 'Collection';
    case 'brand_story': return 'Brand Story';
    case 'sale': return 'Sale';
    case 'lead_gen': return 'Lead Gen';
  }
}

export function getCategoryColor(category: TemplateCategory): string {
  switch (category) {
    case 'product_launch': return 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400';
    case 'seasonal': return 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400';
    case 'collection': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400';
    case 'brand_story': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400';
    case 'sale': return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
    case 'lead_gen': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400';
  }
}

export function getCoherenceColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

export function getCoherenceBg(score: number): string {
  if (score >= 80) return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20';
  if (score >= 60) return 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20';
  return 'bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20';
}

export function getElementIcon(type: string): string {
  switch (type) {
    case 'hero_banner': return '🖼️';
    case 'product_grid': return '🛍️';
    case 'testimonial_section': return '⭐';
    case 'cta_block': return '🎯';
    case 'trust_badges': return '🛡️';
    case 'faq_section': return '❓';
    case 'video_embed': return '🎬';
    case 'countdown_timer': return '⏱️';
    case 'comparison_table': return '📊';
    case 'social_proof_bar': return '👥';
    case 'instagram_feed': return '📸';
    case 'newsletter_signup': return '✉️';
    default: return '📦';
  }
}
