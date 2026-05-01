// ============================================================
// VARNI JEWELS — SEO Command Center Data
// Comprehensive mock data for Ryze AI SEO Agent capabilities
// ============================================================

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type Severity = 'critical' | 'warning' | 'info';
export type IssueStatus = 'detected' | 'auto-fixed' | 'pending';
export type FixStatus = 'applied' | 'pending' | 'rejected';
export type VitalRating = 'good' | 'needs-improvement' | 'poor';
export type Trend = 'improving' | 'stable' | 'declining';
export type DecayAction = 'refresh' | 'merge' | 'delete' | 'leave';
export type PipelineStatus = 'researching' | 'writing' | 'editing' | 'scheduled' | 'published';
export type OutreachStatus = 'identified' | 'reached' | 'followed-up' | 'accepted' | 'published';
export type BacklinkType = 'blog' | 'guest-post' | 'PR' | 'directory';
export type ReportStatus = 'active' | 'paused';
export type ProgType = 'city-page' | 'comparison-page' | 'faq-hub';
export type ProgStatus = 'live' | 'draft' | 'indexed' | 'ranking';

export interface CrawlIssue {
  id: string;
  url: string;
  category: string;
  severity: Severity;
  impact: string;
  fixSuggestion: string;
  status: IssueStatus;
}

export interface MetaRewrite {
  id: string;
  url: string;
  pageTitle: string;
  currentTitle: string;
  currentMeta: string;
  currentCTR: number;
  aiTitle: string;
  aiMeta: string;
  expectedCTRImprovement: number;
  status: FixStatus;
}

export interface SchemaPage {
  id: string;
  url: string;
  schemaTypes: string[];
  validationStatus: 'valid' | 'invalid' | 'warnings';
  errors: string[];
  fixesApplied: string[];
}

export interface WebVitalsPage {
  id: string;
  url: string;
  lcp: number;
  lcpRating: VitalRating;
  cls: number;
  clsRating: VitalRating;
  inp: number;
  inpRating: VitalRating;
  overallScore: number;
  trend: Trend;
  recommendations: string[];
}

export interface RankEntry {
  id: string;
  keyword: string;
  engine: 'Google' | 'Bing' | 'ChatGPT' | 'Perplexity' | 'Google AI';
  position: number;
  previousPosition: number;
  change: number;
  searchVolume: number;
  url: string | null;
  bestPosition: number;
  avgPosition: number;
}

export interface ContentDecayItem {
  id: string;
  url: string;
  title: string;
  peakTraffic: number;
  currentTraffic: number;
  declinePct: number;
  monthsDeclining: number;
  lastUpdated: string;
  aiRecommendation: DecayAction;
  recommendationReason: string;
}

export interface ProgPage {
  id: string;
  title: string;
  type: ProgType;
  url: string;
  wordCount: number;
  status: ProgStatus;
  trafficGenerated: number;
  rankingsGained: number;
}

export interface BlogPost {
  id: string;
  title: string;
  status: PipelineStatus;
  targetKeyword: string;
  scheduledDate: string;
  wordCount: number;
  seoScore: number;
}

export interface BacklinkTarget {
  id: string;
  site: string;
  da: number;
  type: BacklinkType;
  outreachStatus: OutreachStatus;
  anchorText: string;
  estimatedDAValue: number;
}

export interface AICitation {
  id: string;
  query: string;
  aiEngine: string;
  cited: boolean;
  ourUrlMentioned: string;
  competitorMentioned: string;
  recommendation: string;
}

export interface RollbackEntry {
  id: string;
  url: string;
  changeType: string;
  beforeValue: string;
  afterValue: string;
  dateChanged: string;
  rankingImpact: number;
  rollbackAvailable: boolean;
}

export interface ReportConfig {
  id: string;
  reportType: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  channels: string[];
  recipients: string[];
  lastSent: string;
  status: ReportStatus;
}

/* ------------------------------------------------------------------ */
/*  KPI Data                                                           */
/* ------------------------------------------------------------------ */

export const seoKPIs = {
  organicTraffic: 84520,
  organicTrafficChange: 12.4,
  keywordsOnPage1: 67,
  totalKeywordsTracked: 234,
  domainAuthority: 48,
  backlinks: 3420,
  coreWebVitalsScore: 87,
  contentHealthScore: 72,
};

/* ------------------------------------------------------------------ */
/*  1. Technical Crawl Results                                         */
/* ------------------------------------------------------------------ */

export const crawlResults: CrawlIssue[] = [
  { id: 'c1', url: '/collections/gold-necklaces/antique-set', category: 'Broken Links (404)', severity: 'critical', impact: 'Users hitting dead ends, link equity lost', fixSuggestion: 'Set up 301 redirect to /collections/gold-necklaces/', status: 'detected' },
  { id: 'c2', url: '/blog/jewelry-care-tips-2024', category: 'Broken Links (404)', severity: 'critical', impact: '404 error, lost backlink equity from 12 referring domains', fixSuggestion: 'Restore page or redirect to /blog/jewelry-care-guide', status: 'auto-fixed' },
  { id: 'c3', url: '/products/diamond-ring-123 → /products/diamond-ring-123-new → /shop/rings/diamond', category: 'Redirect Chains (3xx)', severity: 'warning', impact: '3 redirects slow crawling, 15% link equity loss', fixSuggestion: 'Consolidate to single 301 redirect', status: 'detected' },
  { id: 'c4', url: '/collections/wedding → /collections/bridal → /wedding-jewelry', category: 'Redirect Chains (3xx)', severity: 'warning', impact: '2-hop chain causes crawl budget waste', fixSuggestion: 'Redirect directly to /wedding-jewelry', status: 'pending' },
  { id: 'c5', url: '/pages/terms', category: 'Missing Title Tags', severity: 'warning', impact: 'Appears as "Terms - Varni Jewels" in SERPs — poor CTR', fixSuggestion: 'Add: "Terms & Conditions | Varni Jewels — Secure Shopping"', status: 'detected' },
  { id: 'c6', url: '/pages/shipping-policy', category: 'Missing Title Tags', severity: 'warning', impact: 'Generic title in search results', fixSuggestion: 'Add: "Shipping Policy | Free Delivery on Orders ₹999+ | Varni Jewels"', status: 'detected' },
  { id: 'c7', url: '/collections/silver-earrings', category: 'Missing Meta Descriptions', severity: 'info', impact: 'Google auto-generates snippet, may not match intent', fixSuggestion: 'Add compelling 155-char description with USPs', status: 'detected' },
  { id: 'c8', url: '/products/pearl-necklace', category: 'Missing Meta Descriptions', severity: 'info', impact: 'Lower CTR in search results', fixSuggestion: 'Add: "Shop authentic pearl necklaces at Varni Jewels. Certified pearls, lifetime exchange. Free shipping."', status: 'auto-fixed' },
  { id: 'c9', url: '/collections/gold-rings & /shop/gold-rings', category: 'Duplicate Content', severity: 'critical', impact: 'Self-cannibalization — both pages rank #11-13', fixSuggestion: 'Canonicalize to /collections/gold-rings, noindex /shop/gold-rings', status: 'detected' },
  { id: 'c10', url: '/blog/engagement-ring-guide & /blog/how-to-choose-engagement-ring', category: 'Duplicate Content', severity: 'warning', impact: 'Similar content splits ranking signals', fixSuggestion: 'Merge into one comprehensive guide with redirects', status: 'pending' },
  { id: 'c11', url: '/collections/bridal-jewelry', category: 'Slow Pages', severity: 'critical', impact: 'LCP 6.2s — 82% bounce rate for mobile users', fixSuggestion: 'Optimize hero images (WebP), defer JS, enable Brotli compression', status: 'detected' },
  { id: 'c12', url: '/products/customized-ring-builder', category: 'Slow Pages', severity: 'warning', impact: 'LCP 4.1s, interactive element delay 380ms', fixSuggestion: 'Lazy-load 3D viewer, preconnect to CDN, code-split builder module', status: 'detected' },
  { id: 'c13', url: '/products/solitaire-diamond-ring', category: 'Schema Errors', severity: 'warning', impact: 'Product rich results not appearing — missing priceCurrency', fixSuggestion: 'Add "priceCurrency": "INR" to Product schema', status: 'auto-fixed' },
  { id: 'c14', url: '/collections/gold-bangles', category: 'Schema Errors', severity: 'warning', impact: 'Invalid AggregateRating — count exceeds review count', fixSuggestion: 'Sync review count or remove aggregate rating', status: 'detected' },
  { id: 'c15', url: '/pages/about-us', category: 'Missing H1 Tags', severity: 'info', impact: 'No clear heading hierarchy for crawlers', fixSuggestion: 'Add H1: "About Varni Jewels — 25 Years of Craftsmanship"', status: 'detected' },
  { id: 'c16', url: '/collections/pendants', category: 'Missing H1 Tags', severity: 'info', impact: 'Search engines use title as fallback heading', fixSuggestion: 'Add H1: "Pendant Collection — Gold, Diamond & Silver Pendants"', status: 'auto-fixed' },
  { id: 'c17', url: '/blog/top-10-jewelry-trends-2025 (3 images)', category: 'Missing Alt Text', severity: 'warning', impact: 'Missing image SEO opportunity + accessibility issue', fixSuggestion: 'Add descriptive alt text to 3 images: "gold layered necklace trend 2025", etc.', status: 'detected' },
  { id: 'c18', url: '/collections/platinum-rings (5 images)', category: 'Missing Alt Text', severity: 'warning', impact: '5 product images without alt — Google Images traffic loss', fixSuggestion: 'Add product-specific alt text with metal and gemstone details', status: 'pending' },
  { id: 'c19', url: '/products/emerald-ring → no canonical tag', category: 'Canonical Issues', severity: 'warning', impact: 'Duplicate URL parameters create soft duplicates', fixSuggestion: 'Add self-referencing canonical + parameter handling rules', status: 'detected' },
  { id: 'c20', url: '/blog/* (pagination pages)', category: 'Canonical Issues', severity: 'info', impact: 'Paginated blog pages canonicalized to page 1', fixSuggestion: 'Use rel=prev/next or proper pagination canonicals', status: 'detected' },
];

/* ------------------------------------------------------------------ */
/*  2. Title & Meta Rewriting                                          */
/* ------------------------------------------------------------------ */

export const metaRewrites: MetaRewrite[] = [
  {
    id: 'mr1', url: '/collections/diamond-necklaces', pageTitle: 'Diamond Necklaces',
    currentTitle: 'Diamond Necklaces | Varni Jewels',
    currentMeta: 'Buy diamond necklaces online from Varni Jewels. Wide collection of diamond necklace sets.',
    currentCTR: 3.2,
    aiTitle: 'Stunning Diamond Necklaces — Certified Diamonds | Varni Jewels',
    aiMeta: 'Explore 500+ certified diamond necklaces at Varni Jewels. Lifetime exchange, BIS hallmark, EMI available. Shop now with free shipping.',
    expectedCTRImprovement: 1.8, status: 'pending',
  },
  {
    id: 'mr2', url: '/collections/gold-earrings', pageTitle: 'Gold Earrings',
    currentTitle: 'Gold Earrings Collection',
    currentMeta: 'Shop gold earrings at Varni Jewels. Latest designs available.',
    currentCTR: 2.8,
    aiTitle: 'Gold Earrings — 1000+ Designs | 22K Hallmarked | Varni Jewels',
    aiMeta: 'Browse 1000+ gold earring designs in jhumkas, studs & drops. 22K BIS hallmarked, lifetime exchange, 15-day returns. Free shipping.',
    expectedCTRImprovement: 2.1, status: 'applied',
  },
  {
    id: 'mr3', url: '/blog/engagement-ring-guide', pageTitle: 'Engagement Ring Guide',
    currentTitle: 'How to Buy an Engagement Ring',
    currentMeta: 'Guide to buying engagement rings. Tips on diamond quality, ring settings.',
    currentCTR: 4.1,
    aiTitle: 'Ultimate Engagement Ring Buying Guide 2025 (Expert Tips) | Varni Jewels',
    aiMeta: 'Learn how to choose the perfect engagement ring — 4Cs guide, budget tips, setting styles, and 15 real examples. Updated for 2025.',
    expectedCTRImprovement: 1.4, status: 'pending',
  },
  {
    id: 'mr4', url: '/collections/solitaire-rings', pageTitle: 'Solitaire Rings',
    currentTitle: 'Solitaire Rings | Varni Jewels',
    currentMeta: 'Buy solitaire diamond rings from Varni Jewels.',
    currentCTR: 3.6,
    aiTitle: 'Solitaire Diamond Rings — IGI Certified | Starting ₹45,000 | Varni Jewels',
    aiMeta: 'Shop IGI-certified solitaire rings starting ₹45,000. Choose from 200+ designs, 0.3ct to 2ct diamonds. Free certification & insurance.',
    expectedCTRImprovement: 2.3, status: 'pending',
  },
  {
    id: 'mr5', url: '/collections/wedding-jewelry', pageTitle: 'Wedding Jewelry',
    currentTitle: 'Wedding Jewelry Collection',
    currentMeta: 'Wedding jewelry for bride and groom available at Varni Jewels.',
    currentCTR: 2.4,
    aiTitle: 'Bridal Jewelry Sets — Gold, Diamond & Kundan | Free Wedding Consultation',
    aiMeta: 'Complete bridal jewelry sets from ₹2L. Gold, diamond, kundan & polki sets. Free wedding consultation, custom designs, installment plans.',
    expectedCTRImprovement: 2.7, status: 'rejected',
  },
  {
    id: 'mr6', url: '/collections/mangalsutra', pageTitle: 'Mangalsutra',
    currentTitle: 'Mangalsutra Collection',
    currentMeta: 'Shop mangalsutra designs online.',
    currentCTR: 3.0,
    aiTitle: 'Mangalsutra Designs — 500+ Traditional & Modern | Varni Jewels',
    aiMeta: 'Discover 500+ mangalsutra designs in gold, diamond & black bead. Traditional & modern styles. Lifetime exchange, BIS hallmark, free shipping.',
    expectedCTRImprovement: 1.9, status: 'pending',
  },
];

/* ------------------------------------------------------------------ */
/*  3. Schema Markup                                                   */
/* ------------------------------------------------------------------ */

export const schemaPages: SchemaPage[] = [
  { id: 's1', url: '/products/solitaire-diamond-ring', schemaTypes: ['Product', 'BreadcrumbList', 'FAQPage'], validationStatus: 'valid', errors: [], fixesApplied: ['Added priceCurrency: INR'] },
  { id: 's2', url: '/collections/gold-necklaces', schemaTypes: ['CollectionPage', 'BreadcrumbList'], validationStatus: 'valid', errors: [], fixesApplied: [] },
  { id: 's3', url: '/blog/engagement-ring-guide', schemaTypes: ['Article', 'FAQPage', 'BreadcrumbList'], validationStatus: 'valid', errors: [], fixesApplied: [] },
  { id: 's4', url: '/', schemaTypes: ['LocalBusiness', 'WebSite', 'Organization', 'BreadcrumbList'], validationStatus: 'warnings', errors: ['openingHoursSpecification format outdated', 'logo URL returns 404'], fixesApplied: [] },
  { id: 's5', url: '/collections/diamond-necklaces', schemaTypes: ['CollectionPage'], validationStatus: 'invalid', errors: ['Missing required "name" field in ItemList', 'Incorrect itemListElement format'], fixesApplied: ['Corrected ItemList structure'] },
  { id: 's6', url: '/products/emerald-ring', schemaTypes: ['Product', 'BreadcrumbList'], validationStatus: 'valid', errors: [], fixesApplied: ['Fixed AggregateRating count mismatch'] },
  { id: 's7', url: '/blog/top-10-jewelry-trends-2025', schemaTypes: ['Article', 'BreadcrumbList'], validationStatus: 'valid', errors: [], fixesApplied: [] },
  { id: 's8', url: '/collections/wedding-jewelry', schemaTypes: ['CollectionPage', 'FAQPage'], validationStatus: 'warnings', errors: ['FAQ answers exceed 300 chars (may be truncated)'], fixesApplied: [] },
  { id: 's9', url: '/pages/contact-us', schemaTypes: ['LocalBusiness', 'ContactPage'], validationStatus: 'valid', errors: [], fixesApplied: [] },
  { id: 's10', url: '/stores/mumbai', schemaTypes: ['LocalBusiness', 'Store', 'BreadcrumbList'], validationStatus: 'valid', errors: [], fixesApplied: [] },
];

/* ------------------------------------------------------------------ */
/*  4. Core Web Vitals                                                 */
/* ------------------------------------------------------------------ */

export const webVitals: WebVitalsPage[] = [
  { id: 'wv1', url: '/', lcp: 1.8, lcpRating: 'good', cls: 0.04, clsRating: 'good', inp: 85, inpRating: 'good', overallScore: 96, trend: 'improving', recommendations: [] },
  { id: 'wv2', url: '/collections/gold-necklaces', lcp: 2.1, lcpRating: 'good', cls: 0.08, clsRating: 'good', inp: 120, inpRating: 'needs-improvement', overallScore: 82, trend: 'stable', recommendations: ['Reduce main thread work — defer analytics scripts', 'Preload hero image with fetchpriority="high"'] },
  { id: 'wv3', url: '/collections/diamond-necklaces', lcp: 2.4, lcpRating: 'good', cls: 0.12, clsRating: 'needs-improvement', inp: 95, inpRating: 'good', overallScore: 78, trend: 'declining', recommendations: ['Set explicit width/height on below-fold images', 'Avoid inserting DOM elements above existing content'] },
  { id: 'wv4', url: '/products/solitaire-diamond-ring', lcp: 2.8, lcpRating: 'needs-improvement', cls: 0.06, clsRating: 'good', inp: 110, inpRating: 'needs-improvement', overallScore: 74, trend: 'stable', recommendations: ['Serve product images in AVIF format', 'Optimize 3D ring viewer initialization', 'Reduce third-party script impact'] },
  { id: 'wv5', url: '/collections/bridal-jewelry', lcp: 6.2, lcpRating: 'poor', cls: 0.25, clsRating: 'poor', inp: 340, inpRating: 'poor', overallScore: 32, trend: 'declining', recommendations: ['URGENT: Optimize hero carousel (6.1s render block)', 'Lazy-load off-screen product cards', 'Remove render-blocking CSS in <head>', 'Enable Brotli compression on CDN', 'Reduce total JS bundle by 180KB'] },
  { id: 'wv6', url: '/blog/engagement-ring-guide', lcp: 2.0, lcpRating: 'good', cls: 0.03, clsRating: 'good', inp: 78, inpRating: 'good', overallScore: 95, trend: 'improving', recommendations: [] },
  { id: 'wv7', url: '/collections/mangalsutra', lcp: 2.3, lcpRating: 'good', cls: 0.09, clsRating: 'good', inp: 130, inpRating: 'needs-improvement', overallScore: 79, trend: 'stable', recommendations: ['Minimize main thread work during filter interactions'] },
  { id: 'wv8', url: '/products/customized-ring-builder', lcp: 4.1, lcpRating: 'needs-improvement', cls: 0.18, clsRating: 'needs-improvement', inp: 280, inpRating: 'poor', overallScore: 51, trend: 'declining', recommendations: ['Lazy-load 3D ring builder until interaction', 'Preconnect to Three.js CDN', 'Code-split builder module (420KB savings)'] },
];

/* ------------------------------------------------------------------ */
/*  5. Rank Tracking                                                   */
/* ------------------------------------------------------------------ */

export const rankTracking: RankEntry[] = [
  { id: 'rk1', keyword: 'diamond necklace online', engine: 'Google', position: 5, previousPosition: 7, change: 2, searchVolume: 18100, url: '/collections/diamond-necklaces', bestPosition: 3, avgPosition: 6.2 },
  { id: 'rk2', keyword: 'gold earrings designs', engine: 'Google', position: 8, previousPosition: 8, change: 0, searchVolume: 33100, url: '/collections/gold-earrings', bestPosition: 5, avgPosition: 7.8 },
  { id: 'rk3', keyword: 'solitaire ring', engine: 'Google', position: 3, previousPosition: 4, change: 1, searchVolume: 27100, url: '/collections/solitaire-rings', bestPosition: 2, avgPosition: 4.1 },
  { id: 'rk4', keyword: 'engagement ring guide', engine: 'Google', position: 6, previousPosition: 9, change: 3, searchVolume: 14800, url: '/blog/engagement-ring-guide', bestPosition: 4, avgPosition: 7.3 },
  { id: 'rk5', keyword: 'bridal jewelry set', engine: 'Google', position: 12, previousPosition: 10, change: -2, searchVolume: 9900, url: '/collections/wedding-jewelry', bestPosition: 8, avgPosition: 11.4 },
  { id: 'rk6', keyword: 'mangalsutra designs', engine: 'Google', position: 7, previousPosition: 7, change: 0, searchVolume: 40500, url: '/collections/mangalsutra', bestPosition: 5, avgPosition: 7.1 },
  { id: 'rk7', keyword: '22k gold bangles', engine: 'Google', position: 9, previousPosition: 11, change: 2, searchVolume: 6600, url: '/collections/gold-bangles', bestPosition: 7, avgPosition: 9.8 },
  { id: 'rk8', keyword: 'diamond necklace online', engine: 'Bing', position: 4, previousPosition: 6, change: 2, searchVolume: 4200, url: '/collections/diamond-necklaces', bestPosition: 3, avgPosition: 5.1 },
  { id: 'rk9', keyword: 'best jewelry brands india', engine: 'Google', position: 15, previousPosition: 18, change: 3, searchVolume: 8800, url: '/pages/about-us', bestPosition: 12, avgPosition: 16.5 },
  { id: 'rk10', keyword: 'gold ring designs for women', engine: 'Google', position: 6, previousPosition: 5, change: -1, searchVolume: 22200, url: '/collections/gold-rings', bestPosition: 4, avgPosition: 6.8 },
  { id: 'rk11', keyword: 'where to buy engagement ring', engine: 'ChatGPT', position: 0, previousPosition: 0, change: 0, searchVolume: 0, url: null, bestPosition: 0, avgPosition: 0 },
  { id: 'rk12', keyword: 'best online jewelry store india', engine: 'ChatGPT', position: 0, previousPosition: 0, change: 0, searchVolume: 0, url: null, bestPosition: 0, avgPosition: 0 },
  { id: 'rk13', keyword: 'gold necklace designs 2025', engine: 'Google', position: 4, previousPosition: 4, change: 0, searchVolume: 12100, url: '/collections/gold-necklaces', bestPosition: 3, avgPosition: 4.5 },
  { id: 'rk14', keyword: 'kundan jewelry online', engine: 'Google', position: 11, previousPosition: 14, change: 3, searchVolume: 8100, url: '/collections/kundan-jewelry', bestPosition: 9, avgPosition: 12.1 },
  { id: 'rk15', keyword: 'platinum rings for men', engine: 'Bing', position: 8, previousPosition: 10, change: 2, searchVolume: 3600, url: '/collections/platinum-rings', bestPosition: 6, avgPosition: 9.3 },
  { id: 'rk16', keyword: 'best jewelry stores online', engine: 'Perplexity', position: 0, previousPosition: 0, change: 0, searchVolume: 0, url: null, bestPosition: 0, avgPosition: 0 },
  { id: 'rk17', keyword: 'lightweight gold earrings', engine: 'Google', position: 7, previousPosition: 9, change: 2, searchVolume: 5400, url: '/collections/gold-earrings', bestPosition: 5, avgPosition: 8.0 },
  { id: 'rk18', keyword: 'diamond ring price in india', engine: 'Google AI', position: 0, previousPosition: 0, change: 0, searchVolume: 0, url: null, bestPosition: 0, avgPosition: 0 },
];

/* ------------------------------------------------------------------ */
/*  6. Content Decay Detection                                         */
/* ------------------------------------------------------------------ */

export const contentDecay: ContentDecayItem[] = [
  { id: 'cd1', url: '/blog/jewelry-care-tips', title: 'Complete Jewelry Care Guide', peakTraffic: 4200, currentTraffic: 1400, declinePct: 67, monthsDeclining: 6, lastUpdated: '2024-06-15', aiRecommendation: 'refresh', recommendationReason: 'Content outdated — add 2025 care methods, new metal types' },
  { id: 'cd2', url: '/blog/gold-rate-today', title: 'Gold Rate Today — Live Updates', peakTraffic: 8900, currentTraffic: 3100, declinePct: 65, monthsDeclining: 3, lastUpdated: '2024-11-20', aiRecommendation: 'refresh', recommendationReason: 'Competitor pages have real-time API integration — add live widget' },
  { id: 'cd3', url: '/blog/anniversary-gift-ideas', title: '25 Anniversary Gift Ideas', peakTraffic: 5600, currentTraffic: 2100, declinePct: 63, monthsDeclining: 4, lastUpdated: '2024-08-10', aiRecommendation: 'refresh', recommendationReason: 'Gift guides need annual refresh — update for 2025 trends' },
  { id: 'cd4', url: '/blog/types-of-gold', title: 'Types of Gold — 14K, 18K, 22K, 24K', peakTraffic: 3400, currentTraffic: 1500, declinePct: 56, monthsDeclining: 8, lastUpdated: '2024-02-28', aiRecommendation: 'refresh', recommendationReason: 'Evergreen content losing to newer competitors with infographics' },
  { id: 'cd5', url: '/blog/silver-jewelry-care', title: 'How to Clean Silver Jewelry', peakTraffic: 2800, currentTraffic: 1300, declinePct: 54, monthsDeclining: 5, lastUpdated: '2024-07-05', aiRecommendation: 'merge', recommendationReason: 'Overlap with jewelry-care-tips — merge into comprehensive guide' },
  { id: 'cd6', url: '/blog/kundan-jewelry-history', title: 'History of Kundan Jewelry', peakTraffic: 1200, currentTraffic: 580, declinePct: 52, monthsDeclining: 9, lastUpdated: '2023-12-01', aiRecommendation: 'leave', recommendationReason: 'Niche topic with stable low traffic — not worth investment' },
  { id: 'cd7', url: '/blog/wedding-planning-checklist-2024', title: 'Wedding Planning Checklist 2024', peakTraffic: 6700, currentTraffic: 3200, declinePct: 52, monthsDeclining: 3, lastUpdated: '2024-01-15', aiRecommendation: 'refresh', recommendationReason: 'Create 2025 version — time-sensitive content requires annual update' },
  { id: 'cd8', url: '/blog/old-gold-exchange-guide', title: 'Old Gold Exchange Guide', peakTraffic: 1900, currentTraffic: 980, declinePct: 48, monthsDeclining: 7, lastUpdated: '2024-04-20', aiRecommendation: 'delete', recommendationReason: 'Policy changes made content inaccurate — high risk for trust signals' },
];

/* ------------------------------------------------------------------ */
/*  7. Programmatic Content                                            */
/* ------------------------------------------------------------------ */

export const progContent: ProgPage[] = [
  { id: 'pc1', title: 'Jewelry Store in Mumbai', type: 'city-page', url: '/stores/mumbai-jewelry-store', wordCount: 2450, status: 'ranking', trafficGenerated: 1800, rankingsGained: 12 },
  { id: 'pc2', title: 'Jewelry Store in Delhi', type: 'city-page', url: '/stores/delhi-jewelry-store', wordCount: 2380, status: 'ranking', trafficGenerated: 1500, rankingsGained: 10 },
  { id: 'pc3', title: 'Gold vs Diamond — Which to Buy?', type: 'comparison-page', url: '/blog/gold-vs-diamond', wordCount: 3200, status: 'ranking', trafficGenerated: 4200, rankingsGained: 8 },
  { id: 'pc4', title: 'Jewelry Store in Bangalore', type: 'city-page', url: '/stores/bangalore-jewelry-store', wordCount: 2510, status: 'ranking', trafficGenerated: 1200, rankingsGained: 9 },
  { id: 'pc5', title: 'Gold vs Platinum Rings', type: 'comparison-page', url: '/blog/gold-vs-platinum-rings', wordCount: 2800, status: 'ranking', trafficGenerated: 3400, rankingsGained: 6 },
  { id: 'pc6', title: 'FAQ — Diamond Rings', type: 'faq-hub', url: '/faq/diamond-rings', wordCount: 4200, status: 'ranking', trafficGenerated: 5600, rankingsGained: 15 },
  { id: 'pc7', title: 'FAQ — Gold Jewelry', type: 'faq-hub', url: '/faq/gold-jewelry', wordCount: 4800, status: 'ranking', trafficGenerated: 7200, rankingsGained: 18 },
  { id: 'pc8', title: 'Jewelry Store in Chennai', type: 'city-page', url: '/stores/chennai-jewelry-store', wordCount: 2300, status: 'indexed', trafficGenerated: 400, rankingsGained: 3 },
  { id: 'pc9', title: 'FAQ — Wedding Jewelry', type: 'faq-hub', url: '/faq/wedding-jewelry', wordCount: 3900, status: 'live', trafficGenerated: 0, rankingsGained: 0 },
  { id: 'pc10', title: 'Jewelry Store in Hyderabad', type: 'city-page', url: '/stores/hyderabad-jewelry-store', wordCount: 2200, status: 'draft', trafficGenerated: 0, rankingsGained: 0 },
  { id: 'pc11', title: 'Kundan vs Polki Jewelry', type: 'comparison-page', url: '/blog/kundan-vs-polki', wordCount: 2600, status: 'draft', trafficGenerated: 0, rankingsGained: 0 },
  { id: 'pc12', title: 'FAQ — Engagement Rings', type: 'faq-hub', url: '/faq/engagement-rings', wordCount: 4100, status: 'indexed', trafficGenerated: 200, rankingsGained: 2 },
];

/* ------------------------------------------------------------------ */
/*  8. Blog Content Pipeline                                           */
/* ------------------------------------------------------------------ */

export const blogPipeline: BlogPost[] = [
  { id: 'bp1', title: '2025 Bridal Jewelry Trends: What Brides Are Choosing', status: 'published', targetKeyword: 'bridal jewelry trends 2025', scheduledDate: '2025-06-10', wordCount: 2800, seoScore: 94 },
  { id: 'bp2', title: 'How to Check Diamond Quality at Home — Complete Guide', status: 'published', targetKeyword: 'check diamond quality at home', scheduledDate: '2025-06-08', wordCount: 3200, seoScore: 91 },
  { id: 'bp3', title: 'Gold Investment Guide 2025: How to Buy Gold Smartly', status: 'scheduled', targetKeyword: 'gold investment guide 2025', scheduledDate: '2025-06-15', wordCount: 3500, seoScore: 88 },
  { id: 'bp4', title: 'Top 20 Mangalsutra Designs for Modern Brides', status: 'editing', targetKeyword: 'mangalsutra designs modern', scheduledDate: '2025-06-18', wordCount: 2600, seoScore: 82 },
  { id: 'bp5', title: 'Lab-Grown vs Natural Diamonds: Complete Comparison', status: 'editing', targetKeyword: 'lab grown vs natural diamonds', scheduledDate: '2025-06-20', wordCount: 3000, seoScore: 79 },
  { id: 'bp6', title: 'Indian Wedding Jewelry Checklist — Don\'t Forget These!', status: 'writing', targetKeyword: 'indian wedding jewelry checklist', scheduledDate: '2025-06-25', wordCount: 1800, seoScore: 0 },
  { id: 'bp7', title: 'Rose Gold Jewelry: Why It\'s Trending in 2025', status: 'writing', targetKeyword: 'rose gold jewelry trend', scheduledDate: '2025-06-28', wordCount: 1400, seoScore: 0 },
  { id: 'bp8', title: 'How to Store Jewelry When Traveling — Expert Tips', status: 'researching', targetKeyword: 'how to store jewelry traveling', scheduledDate: '2025-07-02', wordCount: 0, seoScore: 0 },
  { id: 'bp9', title: 'Platinum Jewelry Care: Everything You Need to Know', status: 'researching', targetKeyword: 'platinum jewelry care', scheduledDate: '2025-07-05', wordCount: 0, seoScore: 0 },
  { id: 'bp10', title: 'Antique Jewelry Collecting: Beginner\'s Guide', status: 'researching', targetKeyword: 'antique jewelry collecting guide', scheduledDate: '2025-07-10', wordCount: 0, seoScore: 0 },
];

/* ------------------------------------------------------------------ */
/*  9. Backlink Building                                               */
/* ------------------------------------------------------------------ */

export const backlinkTargets: BacklinkTarget[] = [
  { id: 'bl1', site: 'weddingwire.in', da: 72, type: 'blog', outreachStatus: 'published', anchorText: 'best bridal jewelry sets', estimatedDAValue: 72 },
  { id: 'bl2', site: 'thebridalbox.com', da: 65, type: 'guest-post', outreachStatus: 'accepted', anchorText: 'gold mangalsutra designs', estimatedDAValue: 65 },
  { id: 'bl3', site: 'indiatimes.com', da: 88, type: 'PR', outreachStatus: 'followed-up', anchorText: 'Varni Jewels', estimatedDAValue: 88 },
  { id: 'bl4', site: 'jewelryshoppingguide.com', da: 45, type: 'blog', outreachStatus: 'reached', anchorText: 'diamond necklace online India', estimatedDAValue: 45 },
  { id: 'bl5', site: 'yourstory.com', da: 78, type: 'PR', outreachStatus: 'reached', anchorText: 'Varni Jewels founder interview', estimatedDAValue: 78 },
  { id: 'bl6', site: 'gemsworld.org', da: 52, type: 'guest-post', outreachStatus: 'identified', anchorText: 'diamond certification guide', estimatedDAValue: 52 },
  { id: 'bl7', site: '时尚珠宝网.com', da: 38, type: 'directory', outreachStatus: 'identified', anchorText: 'indian jewelry brand', estimatedDAValue: 38 },
  { id: 'bl8', site: 'wedmegood.com', da: 61, type: 'blog', outreachStatus: 'accepted', anchorText: 'wedding jewelry trends 2025', estimatedDAValue: 61 },
  { id: 'bl9', site: 'luxurylaunches.com', da: 56, type: 'guest-post', outreachStatus: 'reached', anchorText: 'luxury diamond rings', estimatedDAValue: 56 },
  { id: 'bl10', site: 'indiaretailing.com', da: 48, type: 'PR', outreachStatus: 'identified', anchorText: 'jewelry ecommerce growth', estimatedDAValue: 48 },
  { id: 'bl11', site: 'beyondcarat.com', da: 34, type: 'blog', outreachStatus: 'followed-up', anchorText: 'solitaire ring guide', estimatedDAValue: 34 },
  { id: 'bl12', site: 'truesilver.in', da: 29, type: 'directory', outreachStatus: 'identified', anchorText: 'silver jewelry online', estimatedDAValue: 29 },
];

/* ------------------------------------------------------------------ */
/*  10. AI Search Optimization                                         */
/* ------------------------------------------------------------------ */

export const aiCitations: AICitation[] = [
  { id: 'ai1', query: 'best online jewelry stores in India', aiEngine: 'ChatGPT', cited: true, ourUrlMentioned: 'varnijewels.com', competitorMentioned: 'caratlane.com, bluestone.com', recommendation: 'Maintain position — add more authoritative product reviews' },
  { id: 'ai2', query: 'where to buy diamond necklace online', aiEngine: 'Perplexity', cited: true, ourUrlMentioned: 'varnijewels.com/collections/diamond-necklaces', competitorMentioned: 'caratlane.com', recommendation: 'Add structured comparison content for featured snippets' },
  { id: 'ai3', query: 'engagement ring buying guide', aiEngine: 'Google AI Overviews', cited: false, ourUrlMentioned: '', competitorMentioned: 'brilliantearth.com, caratlane.com', recommendation: 'Add expert quotes and data points — Google AI favors E-E-A-T signals' },
  { id: 'ai4', query: 'gold rate prediction 2025', aiEngine: 'ChatGPT', cited: false, ourUrlMentioned: '', competitorMentioned: 'timesofindia.com', recommendation: 'Create gold market analysis content with expert commentary' },
  { id: 'ai5', query: 'bridal jewelry trends', aiEngine: 'Perplexity', cited: true, ourUrlMentioned: 'varnijewels.com/blog/bridal-jewelry-trends', competitorMentioned: 'tanishq.co.in', recommendation: 'Add visual lookbook with trending designs for image citations' },
  { id: 'ai6', query: 'best diamond brands India', aiEngine: 'ChatGPT', cited: true, ourUrlMentioned: 'varnijewels.com', competitorMentioned: 'caratlane.com, tanishq.co.in, bluestone.com', recommendation: 'Improve — build brand authority with industry awards and certifications' },
  { id: 'ai7', query: 'how to choose a wedding ring', aiEngine: 'Google AI Overviews', cited: false, ourUrlMentioned: '', competitorMentioned: 'brilliantearth.com', recommendation: 'Create step-by-step video guide with transcript for AI indexing' },
  { id: 'ai8', query: 'most trusted jewelry brands', aiEngine: 'Perplexity', cited: true, ourUrlMentioned: 'varnijewels.com/pages/about-us', competitorMentioned: 'tanishq.co.in', recommendation: 'Add customer testimonials with real names and purchase details' },
  { id: 'ai9', query: '22k gold earrings latest designs', aiEngine: 'ChatGPT', cited: false, ourUrlMentioned: '', competitorMentioned: 'malabargoldanddiamonds.com', recommendation: 'Create design gallery with detailed descriptions for AI training data' },
  { id: 'ai10', query: 'solitaire diamond ring price', aiEngine: 'Google AI Overviews', cited: true, ourUrlMentioned: 'varnijewels.com/collections/solitaire-rings', competitorMentioned: 'caratlane.com', recommendation: 'Keep price transparency — regularly update pricing pages' },
];

/* ------------------------------------------------------------------ */
/*  11. One-Click Rollback                                             */
/* ------------------------------------------------------------------ */

export const rollbackLog: RollbackEntry[] = [
  { id: 'rb1', url: '/collections/diamond-necklaces', changeType: 'Title Tag', beforeValue: 'Diamond Necklaces | Varni Jewels', afterValue: 'Stunning Diamond Necklaces — Certified Diamonds | Varni Jewels', dateChanged: '2025-06-01', rankingImpact: 1.2, rollbackAvailable: true },
  { id: 'rb2', url: '/collections/gold-earrings', changeType: 'Meta Description', beforeValue: 'Shop gold earrings at Varni Jewels. Latest designs available.', afterValue: 'Browse 1000+ gold earring designs in jhumkas, studs & drops. 22K BIS hallmarked, lifetime exchange, 15-day returns.', dateChanged: '2025-05-28', rankingImpact: 2.4, rollbackAvailable: true },
  { id: 'rb3', url: '/products/solitaire-diamond-ring', changeType: 'Schema Markup', beforeValue: 'Product schema without priceCurrency', afterValue: 'Added priceCurrency: INR to Product schema', dateChanged: '2025-05-25', rankingImpact: 0.8, rollbackAvailable: true },
  { id: 'rb4', url: '/collections/bridal-jewelry', changeType: 'URL Redirect', beforeValue: '/collections/wedding-jewelry', afterValue: '/collections/bridal-jewelry', dateChanged: '2025-05-20', rankingImpact: -3.1, rollbackAvailable: true },
  { id: 'rb5', url: '/blog/engagement-ring-guide', changeType: 'Content Update', beforeValue: '1800 words, no FAQ schema', afterValue: '3200 words, added FAQ section + schema', dateChanged: '2025-05-15', rankingImpact: 4.5, rollbackAvailable: true },
  { id: 'rb6', url: '/collections/mangalsutra', changeType: 'Internal Links', beforeValue: '12 internal links pointing to page', afterValue: 'Added 8 new internal links from blog posts', dateChanged: '2025-05-10', rankingImpact: 1.8, rollbackAvailable: true },
  { id: 'rb7', url: '/pages/about-us', changeType: 'Title Tag', beforeValue: 'About Us | Varni Jewels', afterValue: 'About Varni Jewels — 25 Years of Heritage & Craftsmanship', dateChanged: '2025-05-05', rankingImpact: 0.3, rollbackAvailable: false },
  { id: 'rb8', url: '/collections/gold-bangles', changeType: 'Schema Markup', beforeValue: 'Invalid AggregateRating (count mismatch)', afterValue: 'Fixed review count to match actual reviews (847)', dateChanged: '2025-04-28', rankingImpact: 0.6, rollbackAvailable: true },
  { id: 'rb9', url: '/blog/jewelry-care-tips', changeType: 'Canonical Tag', beforeValue: 'No canonical tag', afterValue: 'Self-referencing canonical added', dateChanged: '2025-04-22', rankingImpact: 0.1, rollbackAvailable: false },
  { id: 'rb10', url: '/collections/platinum-rings', changeType: 'H1 Tag', beforeValue: 'No H1 tag on page', afterValue: 'Added H1: "Platinum Rings — Elegant & Timeless"', dateChanged: '2025-04-18', rankingImpact: 1.0, rollbackAvailable: true },
];

/* ------------------------------------------------------------------ */
/*  12. Custom Reporting Config                                        */
/* ------------------------------------------------------------------ */

export const reportConfigs: ReportConfig[] = [
  { id: 'rc1', reportType: 'Daily Rank Report', frequency: 'daily', channels: ['email'], recipients: ['seo-team@varnijewels.com', 'cmo@varnijewels.com'], lastSent: '2025-06-10 09:00 AM', status: 'active' },
  { id: 'rc2', reportType: 'Traffic Forecast', frequency: 'weekly', channels: ['email', 'slack'], recipients: ['seo-team@varnijewels.com'], lastSent: '2025-06-09 08:00 AM', status: 'active' },
  { id: 'rc3', reportType: 'AI Search Citation Alert', frequency: 'daily', channels: ['slack'], recipients: ['#seo-alerts', '#brand-team'], lastSent: '2025-06-10 10:30 AM', status: 'active' },
  { id: 'rc4', reportType: 'Weekly AI Summary', frequency: 'weekly', channels: ['email', 'slack'], recipients: ['seo-team@varnijewels.com', 'cmo@varnijewels.com', 'cto@varnijewels.com'], lastSent: '2025-06-07 07:00 AM', status: 'active' },
  { id: 'rc5', reportType: 'Content Decay Alert', frequency: 'weekly', channels: ['email'], recipients: ['content-team@varnijewels.com'], lastSent: '2025-06-09 09:00 AM', status: 'active' },
  { id: 'rc6', reportType: 'Backlink Outreach Report', frequency: 'monthly', channels: ['email'], recipients: ['pr-team@varnijewels.com', 'seo-team@varnijewels.com'], lastSent: '2025-06-01 10:00 AM', status: 'active' },
  { id: 'rc7', reportType: 'Competitor SEO Alert', frequency: 'daily', channels: ['slack'], recipients: ['#seo-alerts'], lastSent: '2025-06-10 11:00 AM', status: 'paused' },
  { id: 'rc8', reportType: 'Core Web Vitals Alert', frequency: 'daily', channels: ['email', 'slack'], recipients: ['dev-team@varnijewels.com', 'seo-team@varnijewels.com'], lastSent: '2025-06-10 08:00 AM', status: 'active' },
];

/* ------------------------------------------------------------------ */
/*  Helper functions                                                   */
/* ------------------------------------------------------------------ */

export function getSeverityColor(s: Severity): string {
  switch (s) {
    case 'critical': return 'bg-red-500/10 text-red-600 border-red-500/30';
    case 'warning': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
    case 'info': return 'bg-sky-500/10 text-sky-600 border-sky-500/30';
    default: return '';
  }
}

export function getSeverityBg(s: Severity): string {
  switch (s) {
    case 'critical': return 'border-l-red-500';
    case 'warning': return 'border-l-amber-500';
    case 'info': return 'border-l-sky-500';
    default: return '';
  }
}

export function getVitalColor(r: VitalRating): string {
  switch (r) {
    case 'good': return 'text-emerald-600';
    case 'needs-improvement': return 'text-amber-600';
    case 'poor': return 'text-red-600';
    default: return '';
  }
}

export function getVitalBg(r: VitalRating): string {
  switch (r) {
    case 'good': return 'bg-emerald-500/10';
    case 'needs-improvement': return 'bg-amber-500/10';
    case 'poor': return 'bg-red-500/10';
    default: return '';
  }
}

export function getVitalDot(r: VitalRating): string {
  switch (r) {
    case 'good': return 'bg-emerald-500';
    case 'needs-improvement': return 'bg-amber-500';
    case 'poor': return 'bg-red-500';
    default: return '';
  }
}

export function getTrendIcon(t: Trend): string {
  switch (t) {
    case 'improving': return '↗';
    case 'stable': return '→';
    case 'declining': return '↘';
    default: return '';
  }
}

export function getTrendColor(t: Trend): string {
  switch (t) {
    case 'improving': return 'text-emerald-600';
    case 'stable': return 'text-muted-foreground';
    case 'declining': return 'text-red-500';
    default: return '';
  }
}

export function getDecayBadgeColor(a: DecayAction): string {
  switch (a) {
    case 'refresh': return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
    case 'merge': return 'bg-purple-500/10 text-purple-700 border-purple-500/30';
    case 'delete': return 'bg-red-500/10 text-red-700 border-red-500/30';
    case 'leave': return 'bg-muted text-muted-foreground';
    default: return '';
  }
}

export function getPipelineBadgeColor(s: PipelineStatus): string {
  switch (s) {
    case 'published': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
    case 'scheduled': return 'bg-sky-500/10 text-sky-700 border-sky-500/30';
    case 'editing': return 'bg-purple-500/10 text-purple-700 border-purple-500/30';
    case 'writing': return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
    case 'researching': return 'bg-muted text-muted-foreground';
    default: return '';
  }
}

export function getOutreachColor(s: OutreachStatus): string {
  switch (s) {
    case 'published': return 'bg-emerald-500/10 text-emerald-700';
    case 'accepted': return 'bg-sky-500/10 text-sky-700';
    case 'followed-up': return 'bg-purple-500/10 text-purple-700';
    case 'reached': return 'bg-amber-500/10 text-amber-700';
    case 'identified': return 'bg-muted text-muted-foreground';
    default: return '';
  }
}

export function getProgStatusColor(s: ProgStatus): string {
  switch (s) {
    case 'ranking': return 'bg-emerald-500/10 text-emerald-700';
    case 'indexed': return 'bg-sky-500/10 text-sky-700';
    case 'live': return 'bg-purple-500/10 text-purple-700';
    case 'draft': return 'bg-muted text-muted-foreground';
    default: return '';
  }
}
