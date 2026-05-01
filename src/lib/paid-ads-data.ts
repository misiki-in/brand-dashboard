// ============================================================
// VARNI JEWELS — Paid Ads Command Center Data
// Comprehensive mock data for the Ryze AI Paid Ads Agent
// ============================================================

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type PlatformName = 'Google Ads' | 'Meta Ads' | 'TikTok Ads' | 'LinkedIn Ads' | 'Microsoft Ads';
export type Severity = 'critical' | 'warning' | 'info';
export type BidStatus = 'applied' | 'pending' | 'rejected';
export type PacingStatus = 'on-track' | 'overspending' | 'underspending';
export type NegativeAction = 'add' | 'already-added';
export type OverlapRecommendation = 'merge' | 'adjust-targeting';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface PlatformAccount {
  name: PlatformName;
  status: 'connected' | 'disconnected' | 'error';
  accountId: string;
  totalSpend: number;
  roas: number;
  impressions: number;
  clicks: number;
  conversions: number;
  lastAudit: string;
  issuesFound: number;
}

export interface AuditFinding {
  id: string;
  platform: PlatformName;
  severity: Severity;
  category: string;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  status: 'pending' | 'approved' | 'dismissed';
}

export interface BidRecommendation {
  id: string;
  campaign: string;
  platform: PlatformName;
  keyword: string;
  currentBid: number;
  recommendedBid: number;
  bidType: 'tROAS' | 'tCPA' | 'manual-cpc';
  expectedImpact: string;
  status: BidStatus;
}

export interface BudgetPacingItem {
  channel: string;
  platform: PlatformName;
  dailyBudget: number;
  spentToday: number;
  spentThisMonth: number;
  monthlyBudget: number;
  pacingPct: number;
  status: PacingStatus;
  projectedEndOfMonth: number;
  daysRemaining: number;
}

export interface NegativeKeywordItem {
  id: string;
  keyword: string;
  platform: PlatformName;
  searchTermImpressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  wastedAmount: number;
  action: NegativeAction;
  matchType: 'broad' | 'phrase' | 'exact';
}

export interface QualityScoreItem {
  id: string;
  keyword: string;
  currentQS: number;
  historicalQS: number;
  adGroup: string;
  platform: PlatformName;
  suggestedAdCopy: string;
  expectedQSImprovement: number;
  landingPageIssue: string;
}

export interface AudienceOverlapItem {
  id: string;
  adSet1: string;
  adSet2: string;
  platform: PlatformName;
  overlapPct: number;
  sharedImpressions: number;
  recommendation: OverlapRecommendation;
  estimatedSavings: number;
}

export interface DaypartingCell {
  hour: number;
  day: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  cpa: number;
  isZeroConversion: boolean;
}

export interface DaypartingScheduleAdjustment {
  id: string;
  day: string;
  startHour: number;
  endHour: number;
  currentBidMultiplier: number;
  recommendedMultiplier: number;
  reason: string;
}

export interface NLCampaignInput {
  id: string;
  rawInput: string;
  parsedOutput: {
    campaignName: string;
    objective: string;
    budget: string;
    budgetType: string;
    targeting: {
      age: string;
      gender: string;
      locations: string[];
      interests: string[];
      customAudiences: string[];
    };
    adCopySuggestions: string[];
    bidStrategy: string;
    estimatedPerformance: {
      dailyReach: number;
      weeklyConversions: number;
      estimatedROAS: number;
      estimatedCPA: number;
    };
    platforms: PlatformName[];
  };
}

export interface AuctionInsight {
  id: string;
  competitor: string;
  platform: PlatformName;
  impressionShare: number;
  overlapRate: number;
  positionAboveRate: number;
  outrankingShare: number;
  topOfPageRate: number;
  trend: TrendDirection;
  trendChange: number;
  metric: string;
}

export interface WastedSpendCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  details: string;
  actionable: boolean;
}

export interface ConversionTrackingIssue {
  id: string;
  platform: PlatformName;
  issueType: 'double-firing' | 'misconfigured-event' | 'missing-conversion' | 'attribution-issue';
  severity: Severity;
  title: string;
  description: string;
  impact: string;
  affectedEvents: string;
  recommendation: string;
  status: 'pending' | 'approved' | 'dismissed';
}

export interface CrossPlatformCampaign {
  id: string;
  campaignName: string;
  platform: PlatformName;
  status: 'active' | 'paused' | 'draft' | 'completed';
  objective: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  ctr: number;
  cpc: number;
  cpa: number;
  startDate: string;
  endDate: string;
}

// ------------------------------------------------------------------
// 1. Performance Audit — Platform Accounts
// ------------------------------------------------------------------

export const platformAccounts: PlatformAccount[] = [
  {
    name: 'Google Ads',
    status: 'connected',
    accountId: 'G-782-410-2931',
    totalSpend: 48750,
    roas: 4.2,
    impressions: 2840000,
    clicks: 142000,
    conversions: 3890,
    lastAudit: '12 min ago',
    issuesFound: 3,
  },
  {
    name: 'Meta Ads',
    status: 'connected',
    accountId: 'ACT-891234567',
    totalSpend: 34200,
    roas: 3.8,
    impressions: 5120000,
    clicks: 198000,
    conversions: 2940,
    lastAudit: '8 min ago',
    issuesFound: 5,
  },
  {
    name: 'TikTok Ads',
    status: 'connected',
    accountId: 'TT-7014253689',
    totalSpend: 12400,
    roas: 2.1,
    impressions: 8900000,
    clicks: 89000,
    conversions: 780,
    lastAudit: '22 min ago',
    issuesFound: 7,
  },
  {
    name: 'LinkedIn Ads',
    status: 'connected',
    accountId: 'LI-5124987634',
    totalSpend: 8900,
    roas: 1.4,
    impressions: 620000,
    clicks: 12400,
    conversions: 210,
    lastAudit: '35 min ago',
    issuesFound: 2,
  },
  {
    name: 'Microsoft Ads',
    status: 'error',
    accountId: 'MS-987654321',
    totalSpend: 5600,
    roas: 2.8,
    impressions: 890000,
    clicks: 26700,
    conversions: 560,
    lastAudit: '2 hours ago',
    issuesFound: 4,
  },
];

// ------------------------------------------------------------------
// 1b. Audit Findings
// ------------------------------------------------------------------

export const auditFindings: AuditFinding[] = [
  {
    id: 'AUD-001',
    platform: 'TikTok Ads',
    severity: 'critical',
    category: 'Budget Waste',
    title: 'Ad group spending 3.2x daily budget',
    description: 'The "Engagement Retargeting" ad group has exceeded its $150/day budget by $320 today. TikTok delivery acceleration is enabled, causing overspend.',
    impact: 'Estimated $4,800/month in unplanned spend',
    recommendation: 'Disable delivery acceleration and set hard budget cap at $150/day',
    status: 'pending',
  },
  {
    id: 'AUD-002',
    platform: 'Meta Ads',
    severity: 'critical',
    category: 'Conversion Tracking',
    title: 'Purchase pixel firing duplicate events',
    description: 'Meta Pixel purchase event is firing twice per transaction due to duplicate pixel code on checkout success page.',
    impact: 'Inflating conversion count by ~45%, skewing ROAS data significantly',
    recommendation: 'Remove duplicate pixel code and implement server-side tracking',
    status: 'pending',
  },
  {
    id: 'AUD-003',
    platform: 'Google Ads',
    severity: 'warning',
    category: 'Quality Score',
    title: '12 keywords with Quality Score below 3/10',
    description: 'Keywords in "Diamond Rings" and "Gold Necklace" ad groups have QS of 1-2, increasing CPC by 200-400%.',
    impact: 'Wasting ~$2,100/month on inflated CPCs',
    recommendation: 'Rewrite ad copy, improve landing page relevance, and pause keywords below QS 2',
    status: 'pending',
  },
  {
    id: 'AUD-004',
    platform: 'TikTok Ads',
    severity: 'critical',
    category: 'Audience Overlap',
    title: '68% audience overlap between top 3 ad groups',
    description: 'Three TikTok ad groups targeting similar interest-based audiences are competing against each other in auctions.',
    impact: '$3,400/month wasted in internal competition, driving up CPM by 35%',
    recommendation: 'Consolidate into 2 ad groups with exclusive audience segments',
    status: 'pending',
  },
  {
    id: 'AUD-005',
    platform: 'Microsoft Ads',
    severity: 'critical',
    category: 'Account Error',
    title: 'Payment method declined — campaigns paused',
    description: 'Microsoft Ads payment method expired 3 days ago. All campaigns are currently paused, losing an estimated 120 conversions/day.',
    impact: 'Losing ~$8,400/day in revenue (120 conv × $70 AOV)',
    recommendation: 'Update payment method immediately and restart all campaigns',
    status: 'pending',
  },
  {
    id: 'AUD-006',
    platform: 'Meta Ads',
    severity: 'warning',
    category: 'Creative Fatigue',
    title: '4 ad creatives showing frequency > 4.0x',
    description: 'Top-performing creatives in "Valentine Collection" campaign have exceeded healthy frequency thresholds.',
    impact: 'CTR dropped 42% over last 2 weeks for affected creatives',
    recommendation: 'Rotate new creatives and pause creatives with frequency > 5.0x',
    status: 'pending',
  },
  {
    id: 'AUD-007',
    platform: 'Google Ads',
    severity: 'warning',
    category: 'Search Terms',
    title: '89 irrelevant search terms triggering ads',
    description: 'Broad match keywords in Shopping campaigns are matching irrelevant queries like "jewelry box", "jewelry cleaner", "costume jewelry".',
    impact: '$1,850/month wasted on irrelevant clicks',
    recommendation: 'Add 89 terms as negative keywords (bulk action available)',
    status: 'pending',
  },
  {
    id: 'AUD-008',
    platform: 'LinkedIn Ads',
    severity: 'info',
    category: 'Bid Strategy',
    title: 'Manual CPC bids below recommended minimum',
    description: 'Current max CPC of $3.50 is below LinkedIn\'s recommended $5.20 for target audience. Losing 28% of auctions.',
    impact: 'Missing ~1,400 impressions/day, potential 56 additional conversions/month',
    recommendation: 'Increase max CPC to $5.50 to win more auctions in jewelry niche',
    status: 'pending',
  },
  {
    id: 'AUD-009',
    platform: 'TikTok Ads',
    severity: 'warning',
    category: 'Placement',
    title: 'TopView placement consuming 62% of budget',
    description: 'TopView (in-feed premium) placement alone uses 62% of TikTok budget but delivers only 23% of conversions.',
    impact: 'Inefficient allocation — $7,700/month with suboptimal ROAS of 1.4x',
    recommendation: 'Shift budget to Spark Ads and In-Feed Ads with better conversion rates',
    status: 'pending',
  },
  {
    id: 'AUD-010',
    platform: 'Google Ads',
    severity: 'info',
    category: 'Ad Schedule',
    title: 'Ads running in zero-conversion hours (1 AM – 5 AM)',
    description: 'Google Search campaigns are active 24/7 but hours between 1 AM and 5 AM IST produce zero conversions consistently.',
    impact: '$890/month spent on zero-conversion time slots',
    recommendation: 'Add ad schedule exclusion for 1 AM – 5 AM IST',
    status: 'pending',
  },
  {
    id: 'AUD-011',
    platform: 'Meta Ads',
    severity: 'warning',
    category: 'Attribution',
    title: '7-day click attribution inflating Meta ROAS',
    description: 'Meta default 7-day click window attributes conversions that actually originated from Google or organic search.',
    impact: 'True Meta ROAS is estimated 25-30% lower than reported (3.8x vs ~2.7x)',
    recommendation: 'Compare with GA4 data and consider switching to 1-day view attribution',
    status: 'pending',
  },
  {
    id: 'AUD-012',
    platform: 'Microsoft Ads',
    severity: 'warning',
    category: 'Negative Keywords',
    title: 'No negative keywords configured',
    description: 'Microsoft Ads account has zero negative keywords. 34% of search terms are irrelevant (jewelry box, beaded jewelry, etc.).',
    impact: '$1,900/month wasted on irrelevant clicks',
    recommendation: 'Import negative keyword list from Google Ads and add 45 new terms',
    status: 'pending',
  },
];

// ------------------------------------------------------------------
// 2. Bid Management
// ------------------------------------------------------------------

export const bidRecommendations: BidRecommendation[] = [
  {
    id: 'BID-001',
    campaign: 'Diamond Rings — Shopping',
    platform: 'Google Ads',
    keyword: 'diamond engagement ring',
    currentBid: 4.50,
    recommendedBid: 6.80,
    bidType: 'tROAS',
    expectedImpact: 'Increase conversions by 35% with same budget',
    status: 'pending',
  },
  {
    id: 'BID-002',
    campaign: 'Gold Necklace — Search',
    platform: 'Google Ads',
    keyword: '22k gold necklace india',
    currentBid: 3.20,
    recommendedBid: 2.10,
    bidType: 'tCPA',
    expectedImpact: 'Reduce CPA from $18.40 to $12.60 while maintaining volume',
    status: 'pending',
  },
  {
    id: 'BID-003',
    campaign: 'Valentine Collection — Prospecting',
    platform: 'Meta Ads',
    keyword: 'interest: jewelry, luxury gifts',
    currentBid: 8.50,
    recommendedBid: 11.20,
    bidType: 'manual-cpc',
    expectedImpact: 'Win 22% more auctions, estimated +180 conversions/week',
    status: 'pending',
  },
  {
    id: 'BID-004',
    campaign: 'Retargeting — Cart Abandoners',
    platform: 'Meta Ads',
    keyword: 'custom audience: cart abandoners 7d',
    currentBid: 12.00,
    recommendedBid: 9.50,
    bidType: 'tCPA',
    expectedImpact: 'Maintain conversion rate, save $420/week on reduced CPM',
    status: 'applied',
  },
  {
    id: 'BID-005',
    campaign: 'TikTok — Spark Ads',
    platform: 'TikTok Ads',
    keyword: 'interest: fashion, luxury lifestyle',
    currentBid: 5.00,
    recommendedBid: 3.50,
    bidType: 'manual-cpc',
    expectedImpact: 'Reduce CPA by 30%, maintain 80% of current impressions',
    status: 'pending',
  },
  {
    id: 'BID-006',
    campaign: 'B2B Corporate Gifting',
    platform: 'LinkedIn Ads',
    keyword: 'decision-maker: procurement, HR',
    currentBid: 18.00,
    recommendedBid: 22.50,
    bidType: 'tCPA',
    expectedImpact: 'Increase impression share from 32% to 48%',
    status: 'pending',
  },
  {
    id: 'BID-007',
    campaign: 'Bing Shopping — All Products',
    platform: 'Microsoft Ads',
    keyword: 'shopping — all products',
    currentBid: 1.80,
    recommendedBid: 2.40,
    bidType: 'tROAS',
    expectedImpact: 'Increase Shopping clicks by 45%, maintain 2.8x ROAS',
    status: 'rejected',
  },
  {
    id: 'BID-008',
    campaign: 'Temple Jewelry — Search',
    platform: 'Google Ads',
    keyword: 'temple jewellery online',
    currentBid: 2.80,
    recommendedBid: 4.20,
    bidType: 'tROAS',
    expectedImpact: 'Capture high-intent traffic, +25% conversions',
    status: 'pending',
  },
  {
    id: 'BID-009',
    campaign: 'Wedding Collection — Lookalike',
    platform: 'Meta Ads',
    keyword: 'lookalike: top 1% buyers, wedding',
    currentBid: 14.00,
    recommendedBid: 16.50,
    bidType: 'manual-cpc',
    expectedImpact: 'Expand reach to wedding-planning audience, +120 conv/week',
    status: 'pending',
  },
  {
    id: 'BID-010',
    campaign: 'Silver Jewelry — Discovery',
    platform: 'TikTok Ads',
    keyword: 'hashtag: #jewelry, #silver',
    currentBid: 2.00,
    recommendedBid: 1.20,
    bidType: 'tCPA',
    expectedImpact: 'Reduce wasted spend by 40%, focus on higher-converting placements',
    status: 'pending',
  },
];

// ------------------------------------------------------------------
// 3. Budget Pacing
// ------------------------------------------------------------------

export const budgetPacingItems: BudgetPacingItem[] = [
  {
    channel: 'Google — Search',
    platform: 'Google Ads',
    dailyBudget: 1200,
    spentToday: 1180,
    spentThisMonth: 31200,
    monthlyBudget: 36000,
    pacingPct: 86.7,
    status: 'on-track',
    projectedEndOfMonth: 35800,
    daysRemaining: 4,
  },
  {
    channel: 'Google — Shopping',
    platform: 'Google Ads',
    dailyBudget: 800,
    spentToday: 940,
    spentThisMonth: 17550,
    monthlyBudget: 24000,
    pacingPct: 73.1,
    status: 'overspending',
    projectedEndOfMonth: 27200,
    daysRemaining: 4,
  },
  {
    channel: 'Meta — Prospecting',
    platform: 'Meta Ads',
    dailyBudget: 600,
    spentToday: 520,
    spentThisMonth: 14800,
    monthlyBudget: 18000,
    pacingPct: 82.2,
    status: 'on-track',
    projectedEndOfMonth: 17200,
    daysRemaining: 4,
  },
  {
    channel: 'Meta — Retargeting',
    platform: 'Meta Ads',
    dailyBudget: 400,
    spentToday: 380,
    spentThisMonth: 11200,
    monthlyBudget: 12000,
    pacingPct: 93.3,
    status: 'on-track',
    projectedEndOfMonth: 12000,
    daysRemaining: 4,
  },
  {
    channel: 'TikTok — Spark Ads',
    platform: 'TikTok Ads',
    dailyBudget: 300,
    spentToday: 450,
    spentThisMonth: 9800,
    monthlyBudget: 9000,
    pacingPct: 108.9,
    status: 'overspending',
    projectedEndOfMonth: 11200,
    daysRemaining: 4,
  },
  {
    channel: 'TikTok — TopView',
    platform: 'TikTok Ads',
    dailyBudget: 150,
    spentToday: 120,
    spentThisMonth: 2600,
    monthlyBudget: 4500,
    pacingPct: 57.8,
    status: 'underspending',
    projectedEndOfMonth: 3100,
    daysRemaining: 4,
  },
  {
    channel: 'LinkedIn — B2B',
    platform: 'LinkedIn Ads',
    dailyBudget: 200,
    spentToday: 180,
    spentThisMonth: 5600,
    monthlyBudget: 6000,
    pacingPct: 93.3,
    status: 'on-track',
    projectedEndOfMonth: 5900,
    daysRemaining: 4,
  },
  {
    channel: 'Microsoft — Shopping',
    platform: 'Microsoft Ads',
    dailyBudget: 120,
    spentToday: 40,
    spentThisMonth: 2800,
    monthlyBudget: 3600,
    pacingPct: 77.8,
    status: 'underspending',
    projectedEndOfMonth: 3100,
    daysRemaining: 4,
  },
];

// ------------------------------------------------------------------
// 4. Negative Keyword Discovery
// ------------------------------------------------------------------

export const negativeKeywordItems: NegativeKeywordItem[] = [
  { id: 'NEG-001', keyword: 'jewelry box', platform: 'Google Ads', searchTermImpressions: 12400, clicks: 890, spend: 1240, conversions: 0, wastedAmount: 1240, action: 'add', matchType: 'broad' },
  { id: 'NEG-002', keyword: 'jewelry cleaner', platform: 'Google Ads', searchTermImpressions: 8900, clicks: 620, spend: 870, conversions: 2, wastedAmount: 810, action: 'add', matchType: 'broad' },
  { id: 'NEG-003', keyword: 'costume jewelry', platform: 'Google Ads', searchTermImpressions: 6700, clicks: 480, spend: 670, conversions: 0, wastedAmount: 670, action: 'add', matchType: 'phrase' },
  { id: 'NEG-004', keyword: 'jewelry making supplies', platform: 'Google Ads', searchTermImpressions: 5200, clicks: 340, spend: 510, conversions: 0, wastedAmount: 510, action: 'add', matchType: 'broad' },
  { id: 'NEG-005', keyword: 'fake diamond ring', platform: 'Google Ads', searchTermImpressions: 4100, clicks: 290, spend: 420, conversions: 0, wastedAmount: 420, action: 'add', matchType: 'phrase' },
  { id: 'NEG-006', keyword: 'jewelry repair near me', platform: 'Microsoft Ads', searchTermImpressions: 3800, clicks: 260, spend: 380, conversions: 1, wastedAmount: 360, action: 'add', matchType: 'broad' },
  { id: 'NEG-007', keyword: 'free jewelry', platform: 'Meta Ads', searchTermImpressions: 3200, clicks: 210, spend: 340, conversions: 0, wastedAmount: 340, action: 'add', matchType: 'broad' },
  { id: 'NEG-008', keyword: 'beaded jewelry diy', platform: 'Google Ads', searchTermImpressions: 2800, clicks: 180, spend: 290, conversions: 0, wastedAmount: 290, action: 'add', matchType: 'broad' },
  { id: 'NEG-009', keyword: 'jewelry appraisal', platform: 'Microsoft Ads', searchTermImpressions: 2400, clicks: 160, spend: 250, conversions: 0, wastedAmount: 250, action: 'add', matchType: 'broad' },
  { id: 'NEG-010', keyword: 'wholesale jewelry', platform: 'Google Ads', searchTermImpressions: 2100, clicks: 140, spend: 220, conversions: 0, wastedAmount: 220, action: 'add', matchType: 'phrase' },
  { id: 'NEG-011', keyword: 'jewelry stand display', platform: 'Google Ads', searchTermImpressions: 1800, clicks: 120, spend: 190, conversions: 0, wastedAmount: 190, action: 'add', matchType: 'broad' },
  { id: 'NEG-012', keyword: 'cheap jewelry online', platform: 'TikTok Ads', searchTermImpressions: 9500, clicks: 780, spend: 560, conversions: 0, wastedAmount: 560, action: 'add', matchType: 'broad' },
  { id: 'NEG-013', keyword: 'indian gold rate today', platform: 'Google Ads', searchTermImpressions: 15600, clicks: 920, spend: 1480, conversions: 0, wastedAmount: 1480, action: 'add', matchType: 'broad' },
  { id: 'NEG-014', keyword: 'how to clean jewelry', platform: 'Google Ads', searchTermImpressions: 6100, clicks: 410, spend: 590, conversions: 0, wastedAmount: 590, action: 'already-added', matchType: 'broad' },
  { id: 'NEG-015', keyword: 'body piercing jewelry', platform: 'Meta Ads', searchTermImpressions: 4400, clicks: 310, spend: 420, conversions: 0, wastedAmount: 420, action: 'add', matchType: 'broad' },
];

// ------------------------------------------------------------------
// 5. Quality Score Monitor
// ------------------------------------------------------------------

export const qualityScoreItems: QualityScoreItem[] = [
  {
    id: 'QS-001',
    keyword: 'buy diamond ring online',
    currentQS: 2,
    historicalQS: 5,
    adGroup: 'Diamond Rings — Search',
    platform: 'Google Ads',
    suggestedAdCopy: 'Shop certified diamond rings at Varni Jewels. GIA-certified, free insurance, lifetime exchange. EMI available.',
    expectedQSImprovement: 4,
    landingPageIssue: 'Landing page lacks diamond certification badges and trust signals',
  },
  {
    id: 'QS-002',
    keyword: '22k gold necklace designs',
    currentQS: 1,
    historicalQS: 4,
    adGroup: 'Gold Necklace — Search',
    platform: 'Google Ads',
    suggestedAdCopy: 'Discover 500+ 22K gold necklace designs. BIS hallmarked, certified purity. Try at home, free shipping.',
    expectedQSImprovement: 5,
    landingPageIssue: 'Landing page bounce rate 78% — slow load time, no mobile optimization',
  },
  {
    id: 'QS-003',
    keyword: 'wedding jewelry set',
    currentQS: 3,
    historicalQS: 6,
    adGroup: 'Wedding Collection',
    platform: 'Google Ads',
    suggestedAdCopy: 'Bridal jewelry sets starting ₹24,999. Complete set: necklace, earrings, maang tikka. Free gift wrapping.',
    expectedQSImprovement: 3,
    landingPageIssue: 'Landing page shows individual pieces instead of curated sets',
  },
  {
    id: 'QS-004',
    keyword: 'silver anklet online',
    currentQS: 2,
    historicalQS: 5,
    adGroup: 'Silver Jewelry — Search',
    platform: 'Google Ads',
    suggestedAdCopy: 'Sterling silver anklets at Varni Jewels. 92.5% purity guaranteed. 50+ designs with adjustable sizing.',
    expectedQSImprovement: 4,
    landingPageIssue: 'Landing page keyword density for "anklet" is too low',
  },
  {
    id: 'QS-005',
    keyword: 'gold bangle designs',
    currentQS: 1,
    historicalQS: 3,
    adGroup: 'Gold Bangles',
    platform: 'Google Ads',
    suggestedAdCopy: 'Explore 200+ gold bangle designs. Lightweight to heavy, daily wear to wedding. Hallmarked & certified.',
    expectedQSImprovement: 5,
    landingPageIssue: 'Landing page redirects to generic category instead of bangles',
  },
  {
    id: 'QS-006',
    keyword: 'pearl jewelry gift',
    currentQS: 3,
    historicalQS: 5,
    adGroup: 'Gift Collection',
    platform: 'Google Ads',
    suggestedAdCopy: 'Gift pearl jewelry this season. Freshwater pearls, elegant packaging. Free engraving & express delivery.',
    expectedQSImprovement: 2,
    landingPageIssue: 'No gift-specific messaging or packaging options on landing page',
  },
  {
    id: 'QS-007',
    keyword: 'temple jewellery online',
    currentQS: 2,
    historicalQS: 4,
    adGroup: 'Temple Jewelry',
    platform: 'Google Ads',
    suggestedAdCopy: 'Authentic temple jewelry collection. Inspired by South Indian heritage. Gold-plated, lightweight designs.',
    expectedQSImprovement: 3,
    landingPageIssue: 'Landing page missing cultural context and heritage storytelling',
  },
  {
    id: 'QS-008',
    keyword: 'men\'s gold chain',
    currentQS: 2,
    historicalQS: 4,
    adGroup: 'Men\'s Collection',
    platform: 'Google Ads',
    suggestedAdCopy: 'Premium men\'s gold chains at Varni Jewels. 18K & 22K options. Cuban, rope & box chain styles.',
    expectedQSImprovement: 3,
    landingPageIssue: 'Landing page shows unisex products, no dedicated men\'s section',
  },
];

// ------------------------------------------------------------------
// 6. Audience Overlap
// ------------------------------------------------------------------

export const audienceOverlapItems: AudienceOverlapItem[] = [
  {
    id: 'OVR-001',
    adSet1: 'Women 25-40 — Jewelry Interest',
    adSet2: 'Women 28-45 — Luxury Shopping',
    platform: 'Meta Ads',
    overlapPct: 68,
    sharedImpressions: 890000,
    recommendation: 'merge',
    estimatedSavings: 2400,
  },
  {
    id: 'OVR-002',
    adSet1: 'Engaged Shoppers — 30d',
    adSet2: 'Recent Viewers — 7d',
    platform: 'Meta Ads',
    overlapPct: 45,
    sharedImpressions: 340000,
    recommendation: 'adjust-targeting',
    estimatedSavings: 1200,
  },
  {
    id: 'OVR-003',
    adSet1: 'Interest: Fashion & Accessories',
    adSet2: 'Interest: Wedding Planning',
    platform: 'TikTok Ads',
    overlapPct: 52,
    sharedImpressions: 1200000,
    recommendation: 'merge',
    estimatedSavings: 1800,
  },
  {
    id: 'OVR-004',
    adSet1: 'Lookalike 1% — Top Buyers',
    adSet2: 'Lookalike 2% — Top Buyers',
    platform: 'Meta Ads',
    overlapPct: 74,
    sharedImpressions: 560000,
    recommendation: 'merge',
    estimatedSavings: 3100,
  },
  {
    id: 'OVR-005',
    adSet1: 'Broad — Age 25-55',
    adSet2: 'Interest: Fine Jewelry',
    platform: 'TikTok Ads',
    overlapPct: 38,
    sharedImpressions: 780000,
    recommendation: 'adjust-targeting',
    estimatedSavings: 900,
  },
  {
    id: 'OVR-006',
    adSet1: 'Cart Abandoners — 7d',
    adSet2: 'Website Visitors — 14d',
    platform: 'Meta Ads',
    overlapPct: 62,
    sharedImpressions: 290000,
    recommendation: 'adjust-targeting',
    estimatedSavings: 1500,
  },
  {
    id: 'OVR-007',
    adSet1: 'Search — Diamond Rings',
    adSet2: 'Search — Engagement Rings',
    platform: 'Google Ads',
    overlapPct: 41,
    sharedImpressions: 420000,
    recommendation: 'merge',
    estimatedSavings: 800,
  },
];

// ------------------------------------------------------------------
// 7. Dayparting Analysis — 7×24 Grid
// ------------------------------------------------------------------

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function generateDaypartingData(): DaypartingCell[] {
  const cells: DaypartingCell[] = [];

  // Performance multiplier by hour (IST timezone simulation)
  const hourMultipliers: Record<number, number> = {
    0: 0.1, 1: 0.05, 2: 0.02, 3: 0.01, 4: 0.02, 5: 0.05,
    6: 0.2, 7: 0.4, 8: 0.6, 9: 0.8, 10: 1.0, 11: 1.1,
    12: 0.9, 13: 0.85, 14: 0.9, 15: 1.0, 16: 1.2, 17: 1.4,
    18: 1.5, 19: 1.6, 20: 1.3, 21: 1.1, 22: 0.8, 23: 0.4,
  };

  // Weekend multiplier
  const dayMultipliers: Record<string, number> = {
    Monday: 1.0, Tuesday: 1.0, Wednesday: 1.05, Thursday: 1.1,
    Friday: 1.2, Saturday: 1.3, Sunday: 1.15,
  };

  for (const day of days) {
    for (let hour = 0; hour < 24; hour++) {
      const mult = hourMultipliers[hour] * dayMultipliers[day];
      const impressions = Math.round(8000 * mult + Math.random() * 2000 * mult);
      const clicks = Math.round(impressions * (0.04 + Math.random() * 0.02));
      const conversions = hour >= 1 && hour <= 4 ? 0 : Math.round(clicks * (0.015 + Math.random() * 0.01));
      const cost = +(clicks * (1.2 + Math.random() * 0.8)).toFixed(2);
      const cpa = conversions > 0 ? +(cost / conversions).toFixed(2) : 0;

      cells.push({
        hour,
        day,
        impressions,
        clicks,
        conversions,
        cost,
        cpa,
        isZeroConversion: conversions === 0,
      });
    }
  }

  return cells;
}

export const daypartingData: DaypartingCell[] = generateDaypartingData();

export const daypartingScheduleAdjustments: DaypartingScheduleAdjustment[] = [
  { id: 'DP-001', day: 'All Days', startHour: 1, endHour: 5, currentBidMultiplier: 1.0, recommendedMultiplier: 0.0, reason: 'Zero conversions consistently — pause ads' },
  { id: 'DP-002', day: 'All Days', startHour: 17, endHour: 20, currentBidMultiplier: 1.0, recommendedMultiplier: 1.3, reason: 'Peak conversion window — 40% above-average ROAS' },
  { id: 'DP-003', day: 'Saturday', startHour: 10, endHour: 22, currentBidMultiplier: 1.0, recommendedMultiplier: 1.2, reason: 'Weekend traffic 30% higher — increase bids' },
  { id: 'DP-004', day: 'Sunday', startHour: 15, endHour: 20, currentBidMultiplier: 1.0, recommendedMultiplier: 1.25, reason: 'Highest Sunday conversion window' },
  { id: 'DP-005', day: 'Weekdays', startHour: 9, endHour: 12, currentBidMultiplier: 1.0, recommendedMultiplier: 0.8, reason: 'Moderate performance — reduce to save budget' },
  { id: 'DP-006', day: 'Weekdays', startHour: 22, endHour: 24, currentBidMultiplier: 1.0, recommendedMultiplier: 0.3, reason: 'Low conversion rate — minimize spend' },
];

// ------------------------------------------------------------------
// 8. NL Campaign Builder — Example Inputs/Outputs
// ------------------------------------------------------------------

export const nlCampaignExamples: NLCampaignInput[] = [
  {
    id: 'NL-001',
    rawInput: 'Launch a retargeting campaign for cart abandoners with $50/day budget targeting women 25-40 interested in jewelry',
    parsedOutput: {
      campaignName: 'Cart Abandonment Retargeting — Women 25-40',
      objective: 'Conversions',
      budget: '$50/day',
      budgetType: 'Daily',
      targeting: {
        age: '25-40',
        gender: 'Women',
        locations: ['India', 'United States', 'United Arab Emirates'],
        interests: ['Jewelry', 'Fashion', 'Luxury Shopping', 'Online Shopping'],
        customAudiences: ['Cart Abandoners — 7 Days', 'Website Visitors — 30 Days'],
      },
      adCopySuggestions: [
        'Still thinking about it? Complete your purchase and get 10% off with code COMEBACK10 ✨',
        'Your cart misses you! Premium jewelry, free shipping, easy returns. Shop now.',
        'Wait — your favorites might sell out! Secure your Varni Jewels pieces today.',
      ],
      bidStrategy: 'Target CPA ($18.50)',
      estimatedPerformance: {
        dailyReach: 12000,
        weeklyConversions: 42,
        estimatedROAS: 4.8,
        estimatedCPA: 16.80,
      },
      platforms: ['Meta Ads'],
    },
  },
  {
    id: 'NL-002',
    rawInput: 'Create a brand awareness campaign for our new temple jewelry collection targeting women 30-50 in South India with $100/day budget',
    parsedOutput: {
      campaignName: 'Temple Jewelry Collection — South India Awareness',
      objective: 'Brand Awareness',
      budget: '$100/day',
      budgetType: 'Daily',
      targeting: {
        age: '30-50',
        gender: 'Women',
        locations: ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh'],
        interests: ['South Indian Jewelry', 'Temple Jewelry', 'Traditional Jewelry', 'Indian Culture'],
        customAudiences: ['Lookalike — Temple Jewelry Buyers'],
      },
      adCopySuggestions: [
        'Introducing our new Temple Jewelry Collection. Handcrafted heritage, modern elegance. 🕉️',
        'Inspired by centuries of South Indian artistry. Discover temple jewelry at Varni Jewels.',
        'Gold-plated temple jewelry starting ₹2,999. Certified quality, timeless beauty.',
      ],
      bidStrategy: 'Lowest Cost',
      estimatedPerformance: {
        dailyReach: 85000,
        weeklyConversions: 18,
        estimatedROAS: 2.2,
        estimatedCPA: 42.00,
      },
      platforms: ['Meta Ads', 'Google Ads'],
    },
  },
  {
    id: 'NL-003',
    rawInput: 'Run a TikTok discovery campaign for silver jewelry targeting Gen Z with $30/day, fun and trendy content',
    parsedOutput: {
      campaignName: 'Silver Jewelry Discovery — Gen Z TikTok',
      objective: 'Traffic',
      budget: '$30/day',
      budgetType: 'Daily',
      targeting: {
        age: '18-26',
        gender: 'All',
        locations: ['India', 'United States', 'United Kingdom'],
        interests: ['TikTok Trends', 'Fashion', 'Accessories', 'Gen Z Culture', 'Street Style'],
        customAudiences: [],
      },
      adCopySuggestions: [
        'POV: You found the perfect silver chain at Varni Jewels 🔗✨ #silverjewelry #varnijewels',
        'This or That? Pick your favorite stack! Silver jewelry that slays 💅 #jewelrytok',
        'Best $49 you\'ll ever spend. Trust us. #silverchain #jewelryfinds #affordableluxury',
      ],
      bidStrategy: 'Target CPA ($24.00)',
      estimatedPerformance: {
        dailyReach: 120000,
        weeklyConversions: 15,
        estimatedROAS: 1.8,
        estimatedCPA: 22.40,
      },
      platforms: ['TikTok Ads'],
    },
  },
];

// ------------------------------------------------------------------
// 9. Auction Insights
// ------------------------------------------------------------------

export const auctionInsights: AuctionInsight[] = [
  { id: 'AU-001', competitor: 'CaratLane', platform: 'Google Ads', impressionShare: 34, overlapRate: 62, positionAboveRate: 41, outrankingShare: 28, topOfPageRate: 38, trend: 'up', trendChange: 5.2, metric: 'Diamond Rings' },
  { id: 'AU-002', competitor: 'Tanishq', platform: 'Google Ads', impressionShare: 52, overlapRate: 78, positionAboveRate: 68, outrankingShare: 58, topOfPageRate: 61, trend: 'stable', trendChange: 0.8, metric: 'Gold Necklace' },
  { id: 'AU-003', competitor: 'BlueStone', platform: 'Meta Ads', impressionShare: 28, overlapRate: 45, positionAboveRate: 35, outrankingShare: 22, topOfPageRate: 30, trend: 'down', trendChange: -3.1, metric: 'Engagement Rings' },
  { id: 'AU-004', competitor: 'Malabar Gold', platform: 'Google Ads', impressionShare: 42, overlapRate: 55, positionAboveRate: 48, outrankingShare: 38, topOfPageRate: 44, trend: 'up', trendChange: 7.8, metric: 'Wedding Jewelry' },
  { id: 'AU-005', competitor: 'Joyalukkas', platform: 'Meta Ads', impressionShare: 22, overlapRate: 38, positionAboveRate: 29, outrankingShare: 18, topOfPageRate: 25, trend: 'down', trendChange: -1.5, metric: 'Gold Bangles' },
  { id: 'AU-006', competitor: 'Kalyan Jewellers', platform: 'Google Ads', impressionShare: 38, overlapRate: 52, positionAboveRate: 42, outrankingShare: 32, topOfPageRate: 36, trend: 'stable', trendChange: 0.3, metric: 'Temple Jewelry' },
  { id: 'AU-007', competitor: 'Senco Gold', platform: 'Microsoft Ads', impressionShare: 45, overlapRate: 58, positionAboveRate: 50, outrankingShare: 42, topOfPageRate: 47, trend: 'up', trendChange: 4.2, metric: 'All Jewelry' },
  { id: 'AU-008', competitor: 'PC Jeweller', platform: 'Meta Ads', impressionShare: 18, overlapRate: 32, positionAboveRate: 24, outrankingShare: 15, topOfPageRate: 20, trend: 'stable', trendChange: 0.5, metric: 'Silver Jewelry' },
  { id: 'AU-009', competitor: 'CaratLane', platform: 'TikTok Ads', impressionShare: 15, overlapRate: 28, positionAboveRate: 18, outrankingShare: 12, topOfPageRate: 14, trend: 'up', trendChange: 8.4, metric: 'Discovery' },
  { id: 'AU-010', competitor: 'Tanishq', platform: 'LinkedIn Ads', impressionShare: 48, overlapRate: 65, positionAboveRate: 55, outrankingShare: 45, topOfPageRate: 52, trend: 'up', trendChange: 3.6, metric: 'Corporate Gifting' },
];

// ------------------------------------------------------------------
// 10. Wasted Spend Breakdown
// ------------------------------------------------------------------

export const wastedSpendCategories: WastedSpendCategory[] = [
  {
    category: 'Irrelevant Search Terms',
    amount: 8860,
    percentage: 32.1,
    color: '#ef4444',
    details: '15 identified terms across Google, Meta, Microsoft, and TikTok',
    actionable: true,
  },
  {
    category: 'Low Quality Score Keywords',
    amount: 6240,
    percentage: 22.6,
    color: '#f97316',
    details: '8 keywords with QS 1-3 inflating CPC by 200-400%',
    actionable: true,
  },
  {
    category: 'Audience Overlap',
    amount: 5400,
    percentage: 19.6,
    color: '#eab308',
    details: '7 overlapping ad sets causing internal competition',
    actionable: true,
  },
  {
    category: 'Zero-Conversion Hours',
    amount: 3560,
    percentage: 12.9,
    color: '#8b5cf6',
    details: '1 AM – 5 AM IST — 20 hours/week of zero conversions',
    actionable: true,
  },
  {
    category: 'Poor Placements',
    amount: 2180,
    percentage: 7.9,
    color: '#06b6d4',
    details: 'TikTok TopView + low-performing Google Display placements',
    actionable: true,
  },
  {
    category: 'Other (Fraud, Bots, Misc)',
    amount: 1340,
    percentage: 4.9,
    color: '#64748b',
    details: 'Invalid traffic, click spam, and uncategorized waste',
    actionable: false,
  },
];

// ------------------------------------------------------------------
// 11. Conversion Tracking Audit
// ------------------------------------------------------------------

export const conversionTrackingIssues: ConversionTrackingIssue[] = [
  {
    id: 'CT-001',
    platform: 'Meta Ads',
    issueType: 'double-firing',
    severity: 'critical',
    title: 'Purchase pixel fires twice per transaction',
    description: 'Meta Pixel on checkout success page includes both the standard pixel code and a Conversions API integration that are not deduplicated.',
    impact: 'Meta ROAS inflated by ~45% ($3.8x reported vs ~2.6x actual)',
    affectedEvents: 'Purchase, AddPaymentInfo',
    recommendation: 'Implement event_id deduplication between browser pixel and CAPI',
    status: 'pending',
  },
  {
    id: 'CT-002',
    platform: 'Google Ads',
    issueType: 'misconfigured-event',
    severity: 'warning',
    title: 'Enhanced conversions not enabled',
    description: 'Google Ads conversion tracking uses basic click-through without enhanced conversion data, missing 30% of cross-device conversions.',
    impact: '~900 conversions/month not attributed correctly',
    affectedEvents: 'Purchase, Lead, AddToCart',
    recommendation: 'Enable enhanced conversions and set up Google Ads API conversion upload',
    status: 'pending',
  },
  {
    id: 'CT-003',
    platform: 'TikTok Ads',
    issueType: 'missing-conversion',
    severity: 'critical',
    title: 'ViewThrough conversion not tracked',
    description: 'TikTok Events API only tracks click-through conversions. View-through conversions (users who see ad, don\'t click, but convert within 7 days) are not tracked.',
    impact: 'Underreporting TikTok ROAS by estimated 35-40%',
    affectedEvents: 'CompletePayment, CompleteRegistration',
    recommendation: 'Enable ViewThrough attribution window in TikTok Ads Manager',
    status: 'pending',
  },
  {
    id: 'CT-004',
    platform: 'Microsoft Ads',
    issueType: 'missing-conversion',
    severity: 'warning',
    title: 'UET tag missing on product pages',
    description: 'Microsoft UET tag is only on homepage and checkout. Product pages, category pages, and add-to-cart events are not tracked.',
    impact: 'Unable to optimize Shopping campaigns — missing product-level conversion data',
    affectedEvents: 'ViewProduct, AddToCart',
    recommendation: 'Add UET tag to all product and category pages with custom events',
    status: 'pending',
  },
  {
    id: 'CT-005',
    platform: 'LinkedIn Ads',
    issueType: 'attribution-issue',
    severity: 'info',
    title: '30-day attribution window too long',
    description: 'LinkedIn Insight Tag uses default 30-day attribution. For B2B jewelry corporate gifting, most decisions happen within 14 days.',
    impact: 'Some conversions attributed to LinkedIn may have been influenced by other channels',
    affectedEvents: 'Purchase, LeadForm',
    recommendation: 'Consider reducing attribution window to 14 days for more accurate LinkedIn ROAS',
    status: 'pending',
  },
  {
    id: 'CT-006',
    platform: 'Meta Ads',
    issueType: 'misconfigured-event',
    severity: 'warning',
    title: 'AddToCart fires on wishlist adds',
    description: 'Meta Pixel AddToCart event fires for both cart additions AND wishlist additions due to shared event trigger code.',
    impact: 'Meta\'s algorithm optimizes for wishlist adds instead of true cart adds, reducing purchase conversion rate',
    affectedEvents: 'AddToCart',
    recommendation: 'Split into separate AddToCart and AddToWishlist events with distinct tracking',
    status: 'pending',
  },
  {
    id: 'CT-007',
    platform: 'Google Ads',
    issueType: 'attribution-issue',
    severity: 'info',
    title: 'Google Analytics 4 and Google Ads data mismatch',
    description: 'GA4 reports 18% fewer purchases than Google Ads conversions due to different attribution models (data-driven vs last-click).',
    impact: 'Hard to reconcile reporting — which source of truth to trust',
    affectedEvents: 'Purchase',
    recommendation: 'Use Google Ads Data Hub for cross-platform attribution or implement a unified attribution model',
    status: 'pending',
  },
];

// ------------------------------------------------------------------
// 12. Cross-Platform Campaigns
// ------------------------------------------------------------------

export const crossPlatformCampaigns: CrossPlatformCampaign[] = [
  { id: 'XP-001', campaignName: 'Diamond Rings — Shopping', platform: 'Google Ads', status: 'active', objective: 'Shopping', budget: 12000, spent: 9840, impressions: 890000, clicks: 44500, conversions: 1280, roas: 4.5, ctr: 5.0, cpc: 0.22, cpa: 7.69, startDate: '2026-01-01', endDate: '2026-03-31' },
  { id: 'XP-002', campaignName: 'Gold Necklace — Search', platform: 'Google Ads', status: 'active', objective: 'Search', budget: 8000, spent: 6120, impressions: 520000, clicks: 26000, conversions: 720, roas: 3.8, ctr: 5.0, cpc: 0.24, cpa: 8.50, startDate: '2026-01-15', endDate: '2026-03-31' },
  { id: 'XP-003', campaignName: 'Valentine Collection — Prospecting', platform: 'Meta Ads', status: 'active', objective: 'Conversions', budget: 6000, spent: 5280, impressions: 2400000, clicks: 96000, conversions: 960, roas: 4.2, ctr: 4.0, cpc: 0.055, cpa: 5.50, startDate: '2026-01-20', endDate: '2026-02-28' },
  { id: 'XP-004', campaignName: 'Retargeting — Cart Abandoners', platform: 'Meta Ads', status: 'active', objective: 'Conversions', budget: 4000, spent: 3680, impressions: 680000, clicks: 34000, conversions: 680, roas: 5.8, ctr: 5.0, cpc: 0.108, cpa: 5.41, startDate: '2026-01-01', endDate: '2026-03-31' },
  { id: 'XP-005', campaignName: 'TikTok — Spark Ads', platform: 'TikTok Ads', status: 'active', objective: 'Traffic', budget: 3000, spent: 2940, impressions: 5600000, clicks: 56000, conversions: 420, roas: 2.1, ctr: 1.0, cpc: 0.053, cpa: 7.00, startDate: '2026-01-10', endDate: '2026-03-31' },
  { id: 'XP-006', campaignName: 'TikTok — TopView Premium', platform: 'TikTok Ads', status: 'active', objective: 'Awareness', budget: 1500, spent: 780, impressions: 3200000, clicks: 32000, conversions: 96, roas: 1.2, ctr: 1.0, cpc: 0.024, cpa: 8.13, startDate: '2026-02-01', endDate: '2026-04-30' },
  { id: 'XP-007', campaignName: 'B2B Corporate Gifting', platform: 'LinkedIn Ads', status: 'active', objective: 'Lead Gen', budget: 2000, spent: 1680, impressions: 180000, clicks: 5400, conversions: 108, roas: 1.8, ctr: 3.0, cpc: 0.31, cpa: 15.56, startDate: '2026-01-01', endDate: '2026-06-30' },
  { id: 'XP-008', campaignName: 'Bing Shopping — All Products', platform: 'Microsoft Ads', status: 'paused', objective: 'Shopping', budget: 1200, spent: 480, impressions: 240000, clicks: 7200, conversions: 144, roas: 2.8, ctr: 3.0, cpc: 0.067, cpa: 3.33, startDate: '2026-01-01', endDate: '2026-03-31' },
  { id: 'XP-009', campaignName: 'Wedding Collection — Lookalike', platform: 'Meta Ads', status: 'active', objective: 'Conversions', budget: 5000, spent: 4200, impressions: 1800000, clicks: 72000, conversions: 864, roas: 3.6, ctr: 4.0, cpc: 0.058, cpa: 4.86, startDate: '2026-01-05', endDate: '2026-04-30' },
  { id: 'XP-010', campaignName: 'Temple Jewelry — Search', platform: 'Google Ads', status: 'active', objective: 'Search', budget: 3500, spent: 2660, impressions: 380000, clicks: 19000, conversions: 342, roas: 3.2, ctr: 5.0, cpc: 0.14, cpa: 7.78, startDate: '2026-02-01', endDate: '2026-05-31' },
  { id: 'XP-011', campaignName: 'Silver Jewelry — Discovery', platform: 'TikTok Ads', status: 'active', objective: 'Traffic', budget: 1500, spent: 960, impressions: 2400000, clicks: 24000, conversions: 168, roas: 2.4, ctr: 1.0, cpc: 0.04, cpa: 5.71, startDate: '2026-02-10', endDate: '2026-04-30' },
  { id: 'XP-012', campaignName: 'Men\'s Collection — Search', platform: 'Google Ads', status: 'draft', objective: 'Search', budget: 2000, spent: 0, impressions: 0, clicks: 0, conversions: 0, roas: 0, ctr: 0, cpc: 0, cpa: 0, startDate: '2026-03-01', endDate: '2026-06-30' },
  { id: 'XP-013', campaignName: 'Festive Sale — Performance Max', platform: 'Google Ads', status: 'completed', objective: 'PMax', budget: 8000, spent: 8000, impressions: 2100000, clicks: 84000, conversions: 1680, roas: 4.1, ctr: 4.0, cpc: 0.095, cpa: 4.76, startDate: '2025-10-15', endDate: '2025-11-15' },
  { id: 'XP-014', campaignName: 'Re-engagement — 90d Inactive', platform: 'Meta Ads', status: 'active', objective: 'Conversions', budget: 1500, spent: 1200, impressions: 420000, clicks: 16800, conversions: 252, roas: 3.4, ctr: 4.0, cpc: 0.071, cpa: 4.76, startDate: '2026-02-01', endDate: '2026-04-30' },
];

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case 'critical': return 'text-red-500';
    case 'warning': return 'text-amber-500';
    case 'info': return 'text-blue-400';
  }
}

export function getSeverityBg(severity: Severity): string {
  switch (severity) {
    case 'critical': return 'bg-red-500/10 border-red-500/20';
    case 'warning': return 'bg-amber-500/10 border-amber-500/20';
    case 'info': return 'bg-blue-500/10 border-blue-500/20';
  }
}

export function getSeverityBadge(severity: Severity): string {
  switch (severity) {
    case 'critical': return 'bg-red-500/15 text-red-500 border-red-500/30';
    case 'warning': return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
    case 'info': return 'bg-blue-400/15 text-blue-400 border-blue-400/30';
  }
}

export function getPacingStatusColor(status: PacingStatus): string {
  switch (status) {
    case 'on-track': return 'text-emerald-500';
    case 'overspending': return 'text-red-500';
    case 'underspending': return 'text-amber-500';
  }
}

export function getPacingStatusBg(status: PacingStatus): string {
  switch (status) {
    case 'on-track': return '#22c55e';
    case 'overspending': return '#ef4444';
    case 'underspending': return '#eab308';
  }
}

export function getPlatformIcon(platform: PlatformName): string {
  switch (platform) {
    case 'Google Ads': return '🔍';
    case 'Meta Ads': return '📱';
    case 'TikTok Ads': return '🎵';
    case 'LinkedIn Ads': return '💼';
    case 'Microsoft Ads': return '🪟';
  }
}

export function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'active':
    case 'connected':
    case 'applied':
    case 'already-added':
    case 'on-track':
      return 'default';
    case 'paused':
    case 'pending':
    case 'underspending':
      return 'secondary';
    case 'draft':
    case 'rejected':
      return 'outline';
    case 'disconnected':
    case 'error':
    case 'overspending':
      return 'destructive';
    default:
      return 'outline';
  }
}

export function getDaypartingCellColor(cell: DaypartingCell): string {
  if (cell.isZeroConversion) return 'bg-red-500/30 text-red-300';
  if (cell.cpa < 10) return 'bg-emerald-500/40 text-emerald-300';
  if (cell.cpa < 20) return 'bg-emerald-500/20 text-emerald-400';
  if (cell.cpa < 35) return 'bg-amber-500/25 text-amber-300';
  return 'bg-red-500/20 text-red-400';
}

export function formatHour(h: number): string {
  if (h === 0) return '12a';
  if (h === 12) return '12p';
  return h < 12 ? `${h}a` : `${h - 12}p`;
}

export function formatDayShort(day: string): string {
  return day.substring(0, 3).toUpperCase();
}
