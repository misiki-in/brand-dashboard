// ============================================================
// LUMIÈRE JEWELS — Brand Dashboard Mock Data
// ============================================================

// ---------- BRAND HEALTH OVERVIEW ----------
export const brandHealth = {
  score: 78,
  previousScore: 72,
  trend: +6,
  components: {
    awareness: 82,
    consideration: 68,
    preference: 74,
    loyalty: 71,
    advocacy: 65,
  },
};

export const kpiSummary = [
  { label: "Brand Health Score", value: 78, unit: "/100", change: +6, icon: "Heart" },
  { label: "Net Promoter Score", value: 62, unit: "", change: +4, icon: "ThumbsUp" },
  { label: "Monthly Revenue", value: 2840000, unit: "$", change: +12.3, icon: "DollarSign" },
  { label: "Customer LTV", value: 3420, unit: "$", change: +8.7, icon: "TrendingUp" },
  { label: "Social Followers", value: 892000, unit: "", change: +15.2, icon: "Users" },
  { label: "Avg Order Value", value: 485, unit: "$", change: +5.1, icon: "Gem" },
  { label: "Email Open Rate", value: 34.2, unit: "%", change: +2.1, icon: "Mail" },
  { label: "Return Rate", value: 4.8, unit: "%", change: -0.6, icon: "RotateCcw" },
];

// ---------- BRAND AWARENESS ----------
export const awarenessData = {
  topOfMind: 28,
  aidedRecall: 67,
  unaidedRecall: 43,
  shareOfVoice: 18.4,
  searchVolume: 245000,
  directTraffic: 34,
  monthlyTrend: [
    { month: "Oct", tom: 22, aided: 60, unaided: 38, sov: 15.2 },
    { month: "Nov", tom: 24, aided: 62, unaided: 39, sov: 16.1 },
    { month: "Dec", tom: 27, aided: 65, unaided: 42, sov: 17.8 },
    { month: "Jan", tom: 28, aided: 67, unaided: 43, sov: 18.4 },
  ],
  brandAssociations: [
    { word: "Luxury", mentions: 4200, sentiment: 89 },
    { word: "Elegant", mentions: 3800, sentiment: 92 },
    { word: "Handcrafted", mentions: 2900, sentiment: 95 },
    { word: "Ethical", mentions: 2400, sentiment: 88 },
    { word: "Timeless", mentions: 2200, sentiment: 91 },
    { word: "Affordable Luxury", mentions: 1800, sentiment: 85 },
    { word: "Bridal", mentions: 1600, sentiment: 87 },
    { word: "Sustainable", mentions: 1400, sentiment: 90 },
  ],
};

// ---------- SENTIMENT & SOCIAL LISTENING ----------
export const sentimentData = {
  netSentimentScore: 72,
  positiveMentions: 6840,
  neutralMentions: 2340,
  negativeMentions: 820,
  totalMentions: 10000,
  sentimentTrend: [
    { month: "Oct", positive: 5800, neutral: 2100, negative: 1100 },
    { month: "Nov", positive: 6200, neutral: 2200, negative: 1000 },
    { month: "Dec", positive: 6500, neutral: 2250, negative: 950 },
    { month: "Jan", positive: 6840, neutral: 2340, negative: 820 },
  ],
  buzzSources: [
    { source: "Instagram", mentions: 3200, growth: 18 },
    { source: "TikTok", mentions: 2400, growth: 42 },
    { source: "Twitter/X", mentions: 1600, growth: -5 },
    { source: "Facebook", mentions: 1200, growth: 3 },
    { source: "Pinterest", mentions: 800, growth: 22 },
    { source: "Reddit", mentions: 480, growth: 15 },
  ],
  topTopics: [
    { topic: "New Collection Launch", mentions: 1800, sentiment: 94 },
    { topic: "Sustainability Practices", mentions: 1200, sentiment: 88 },
    { topic: "Customer Service", mentions: 900, sentiment: 82 },
    { topic: "Pricing & Value", mentions: 750, sentiment: 71 },
    { topic: "Packaging Experience", mentions: 620, sentiment: 96 },
    { topic: "Gift Recommendations", mentions: 580, sentiment: 90 },
  ],
};

// ---------- CUSTOMER EXPERIENCE ----------
export const cxData = {
  nps: 62,
  npsPrevious: 58,
  csat: 87,
  csatPrevious: 84,
  ces: 3.2,
  responseTime: "2.4h",
  firstContactResolution: 78,
  customerEffortTrend: [
    { month: "Oct", nps: 55, csat: 82, ces: 3.8 },
    { month: "Nov", nps: 58, csat: 84, ces: 3.5 },
    { month: "Dec", nps: 60, csat: 85, ces: 3.3 },
    { month: "Jan", nps: 62, csat: 87, ces: 3.2 },
  ],
  touchpointSatisfaction: [
    { touchpoint: "Website UX", score: 88, trend: +3 },
    { touchpoint: "Product Quality", score: 94, trend: +1 },
    { touchpoint: "Packaging", score: 96, trend: +2 },
    { touchpoint: "Shipping Speed", score: 82, trend: +5 },
    { touchpoint: "Customer Support", score: 85, trend: +4 },
    { touchpoint: "Return Process", score: 78, trend: -2 },
    { touchpoint: "In-Store Experience", score: 91, trend: +1 },
    { touchpoint: "App Experience", score: 80, trend: +6 },
  ],
};

// ---------- SEO & DIGITAL FOOTPRINT ----------
export const seoData = {
  organicTraffic: 185000,
  organicTrafficChange: 22,
  keywordRankings: 342,
  pageOneRankings: 87,
  domainAuthority: 62,
  backlinks: 12400,
  organicRevenue: 680000,
  coreWebVitals: { lcp: 2.1, fid: 45, cls: 0.08 },
  keywordPositions: [
    { keyword: "luxury jewelry online", position: 3, volume: 18100, change: +2 },
    { keyword: "handcrafted engagement rings", position: 1, volume: 14800, change: 0 },
    { keyword: "ethical diamond necklaces", position: 2, volume: 9900, change: +1 },
    { keyword: "gold bracelets for women", position: 4, volume: 12100, change: +3 },
    { keyword: "sustainable fine jewelry", position: 2, volume: 6600, change: +2 },
    { keyword: "bridal jewelry sets", position: 5, volume: 8100, change: +1 },
    { keyword: "custom name necklaces", position: 1, volume: 22200, change: 0 },
    { keyword: "rose gold earrings", position: 3, volume: 14400, change: +2 },
  ],
  trafficSources: [
    { source: "Organic Search", value: 42, color: "var(--chart-1)" },
    { source: "Paid Search", value: 22, color: "var(--chart-2)" },
    { source: "Social", value: 18, color: "var(--chart-3)" },
    { source: "Direct", value: 12, color: "var(--chart-4)" },
    { source: "Email", value: 4, color: "var(--chart-5)" },
    { source: "Referral", value: 2, color: "#888" },
  ],
};

// ---------- CONTENT STRATEGY ----------
export const contentData = {
  totalContent: 156,
  avgEngagement: 4.8,
  topPerforming: [
    { title: "Behind the Craft: How Our Artisans Shape Each Piece", type: "Video", views: 245000, engagement: 8.2, shares: 4200 },
    { title: "The Ultimate Guide to Choosing Your Engagement Ring", type: "Blog", views: 189000, engagement: 6.8, shares: 3100 },
    { title: "Sustainable Luxury: Our Commitment to Ethical Sourcing", type: "Article", views: 156000, engagement: 5.9, shares: 2800 },
    { title: "Bridal Collection 2026 — First Look", type: "Reel", views: 420000, engagement: 12.4, shares: 8500 },
    { title: "Gemstone Care 101: Expert Tips", type: "Carousel", views: 98000, engagement: 4.2, shares: 1400 },
  ],
  contentCalendar: [
    { week: "Week 1", posts: 8, stories: 14, reels: 3, blogs: 2 },
    { week: "Week 2", posts: 10, stories: 18, reels: 4, blogs: 1 },
    { week: "Week 3", posts: 7, stories: 12, reels: 2, blogs: 3 },
    { week: "Week 4", posts: 12, stories: 20, reels: 5, blogs: 2 },
  ],
  contentTypePerformance: [
    { type: "Reels", engagement: 8.4, reach: 320000 },
    { type: "Carousels", engagement: 5.2, reach: 180000 },
    { type: "Stories", engagement: 6.1, reach: 210000 },
    { type: "Static Posts", engagement: 3.1, reach: 120000 },
    { type: "Blog Posts", engagement: 4.8, reach: 89000 },
    { type: "Videos (Long)", engagement: 7.2, reach: 165000 },
  ],
};

// ---------- SOCIAL MEDIA ----------
export const socialData = {
  totalFollowers: 892000,
  followerGrowth: 15.2,
  avgEngagementRate: 4.8,
  impressions: 12400000,
  reach: 6800000,
  platforms: [
    {
      name: "Instagram",
      followers: 425000,
      growth: 18,
      engagement: 5.2,
      posts: 12,
      stories: 24,
      reels: 4,
    },
    {
      name: "TikTok",
      followers: 218000,
      growth: 42,
      engagement: 8.4,
      posts: 8,
      stories: 0,
      reels: 6,
    },
    {
      name: "Pinterest",
      followers: 124000,
      growth: 22,
      engagement: 3.1,
      posts: 15,
      stories: 0,
      reels: 0,
    },
    {
      name: "Facebook",
      followers: 89000,
      growth: 3,
      engagement: 2.4,
      posts: 8,
      stories: 10,
      reels: 2,
    },
    {
      name: "Twitter/X",
      followers: 36000,
      growth: -5,
      engagement: 1.8,
      posts: 20,
      stories: 0,
      reels: 0,
    },
  ],
  followerGrowthTrend: [
    { month: "Aug", instagram: 380, tiktok: 152, pinterest: 98, facebook: 86 },
    { month: "Sep", instagram: 398, tiktok: 175, pinterest: 108, facebook: 87 },
    { month: "Oct", instagram: 405, tiktok: 195, pinterest: 114, facebook: 88 },
    { month: "Nov", instagram: 415, tiktok: 205, pinterest: 118, facebook: 88 },
    { month: "Dec", instagram: 420, tiktok: 210, pinterest: 121, facebook: 89 },
    { month: "Jan", instagram: 425, tiktok: 218, pinterest: 124, facebook: 89 },
  ],
};

// ---------- EMAIL & SMS ----------
export const emailData = {
  listSize: 245000,
  listGrowth: 8.4,
  avgOpenRate: 34.2,
  avgClickRate: 6.8,
  avgConversionRate: 2.1,
  revenuePerEmail: 2.84,
  unsubscribeRate: 0.3,
  campaigns: [
    { name: "New Year, New Glow", type: "Email", sent: 245000, opens: 42, clicks: 9.2, conversions: 3.1, revenue: 21400 },
    { name: "Engagement Ring Guide", type: "Drip", sent: 48000, opens: 52, clicks: 14, conversions: 5.8, revenue: 18200 },
    { name: "Flash: 20% Off Earrings", type: "Email", sent: 245000, opens: 38, clicks: 8.4, conversions: 2.8, revenue: 16800 },
    { name: "Abandoned Cart Recovery", type: "Automation", sent: 12400, opens: 48, clicks: 18, conversions: 12.4, revenue: 24600 },
    { name: "VIP Early Access: Bridal", type: "Email", sent: 32000, opens: 56, clicks: 16, conversions: 7.2, revenue: 28400 },
    { name: "Restock Alert: Sapphire Ring", type: "SMS", sent: 8400, opens: 94, clicks: 28, conversions: 14.2, revenue: 12600 },
  ],
  automationFlows: [
    { name: "Welcome Series", active: true, subscribers: 12400, conversion: 4.2, revenue: 42000 },
    { name: "Abandoned Cart", active: true, subscribers: 6800, conversion: 12.4, revenue: 68000 },
    { name: "Post-Purchase", active: true, subscribers: 18200, conversion: 8.6, revenue: 54000 },
    { name: "VIP Milestone", active: true, subscribers: 4200, conversion: 15.8, revenue: 38000 },
    { name: "Win-Back (90d)", active: true, subscribers: 8900, conversion: 3.4, revenue: 22000 },
    { name: "Birthday Reward", active: false, subscribers: 15600, conversion: 0, revenue: 0 },
  ],
};

// ---------- PAID MEDIA ----------
export const adsData = {
  totalSpend: 185000,
  totalRevenue: 740000,
  roas: 4.0,
  avgCAC: 42,
  avgCPA: 38,
  avgCTR: 2.4,
  channels: [
    { channel: "Google Shopping", spend: 68000, revenue: 312000, roas: 4.59, cac: 36, conversions: 1889 },
    { channel: "Meta (IG + FB)", spend: 52000, revenue: 208000, roas: 4.0, cac: 44, conversions: 1182 },
    { channel: "Google Search", spend: 32000, revenue: 115000, roas: 3.59, cac: 48, conversions: 667 },
    { channel: "TikTok Ads", spend: 18000, revenue: 58000, roas: 3.22, cac: 52, conversions: 346 },
    { channel: "Pinterest", spend: 10000, revenue: 32000, roas: 3.2, cac: 40, conversions: 250 },
    { channel: "YouTube", spend: 5000, revenue: 15000, roas: 3.0, cac: 55, conversions: 91 },
  ],
  campaignPerformance: [
    { campaign: "Bridal Collection Launch", spend: 45000, roas: 5.2, conversions: 1083 },
    { campaign: "Retargeting — Cart Abandoners", spend: 28000, roas: 6.8, conversions: 737 },
    { campaign: "Holiday Gift Guide", spend: 35000, roas: 4.1, conversions: 921 },
    { campaign: "Brand Awareness — Video", spend: 22000, roas: 2.8, conversions: 588 },
    { campaign: "Lookalike — High LTV Customers", spend: 30000, roas: 5.5, conversions: 750 },
    { campaign: "Search — Non-Brand Keywords", spend: 25000, roas: 3.4, conversions: 521 },
  ],
};

// ---------- INFLUENCER & PARTNERSHIPS ----------
export const influencerData = {
  activePartnerships: 18,
  totalReach: 12400000,
  avgEngagement: 6.2,
  totalRevenue: 185000,
  roi: 5.2,
  partnerships: [
    { name: "Sophia Chen", platform: "Instagram", followers: "2.4M", type: "Macro", posts: 4, reach: 1200000, engagement: 7.2, revenue: 42000, status: "Active" },
    { name: "Elegant Living Blog", platform: "Blog", followers: "850K", type: "Publisher", posts: 2, reach: 680000, engagement: 4.1, revenue: 28000, status: "Active" },
    { name: "JewelryByMaya", platform: "TikTok", followers: "1.1M", type: "Creator", posts: 8, reach: 2800000, engagement: 9.8, revenue: 35000, status: "Active" },
    { name: "The Ring Edit", platform: "Instagram", followers: "580K", type: "Micro", posts: 6, reach: 920000, engagement: 8.4, revenue: 22000, status: "Active" },
    { name: "BridalDreams", platform: "Pinterest", followers: "420K", type: "Micro", posts: 12, reach: 1400000, engagement: 5.2, revenue: 18000, status: "Active" },
    { name: "StyleWithRia", platform: "Instagram", followers: "3.2M", type: "Mega", posts: 2, reach: 2400000, engagement: 4.8, revenue: 40000, status: "Completed" },
  ],
  upcomingCollaborations: [
    { name: "Valentine's Campaign", partners: 6, budget: 45000, status: "Planning" },
    { name: "Spring Bridal Showcase", partners: 4, budget: 32000, status: "Confirmed" },
    { name: "Mother's Day Gift Guide", partners: 8, budget: 38000, status: "Outreach" },
  ],
};

// ---------- LOYALTY & RETENTION ----------
export const loyaltyData = {
  loyaltyMembers: 68000,
  loyaltyGrowth: 22,
  repeatPurchaseRate: 42,
  avgOrdersPerCustomer: 3.4,
  churnRate: 8.2,
  referralRate: 14,
  clvByTier: [
    { tier: "Crystal", customers: 42000, avgCLV: 1200, avgOrders: 1.8, retention: 65 },
    { tier: "Gold", customers: 18000, avgCLV: 3200, avgOrders: 4.2, retention: 78 },
    { tier: "Diamond", customers: 6200, avgCLV: 8400, avgOrders: 8.6, retention: 92 },
    { tier: "Heritage", customers: 1800, avgCLV: 18400, avgOrders: 16.2, retention: 97 },
  ],
  retentionTrend: [
    { month: "Aug", new: 4200, active: 58000, churned: 1200, reactivated: 480 },
    { month: "Sep", new: 4800, active: 59200, churned: 1100, reactivated: 520 },
    { month: "Oct", new: 5200, active: 61000, churned: 980, reactivated: 580 },
    { month: "Nov", new: 5800, active: 63200, churned: 920, reactivated: 620 },
    { month: "Dec", new: 6400, active: 65600, churned: 880, reactivated: 680 },
    { month: "Jan", new: 6800, active: 68000, churned: 820, reactivated: 720 },
  ],
};

// ---------- PRODUCT PERFORMANCE (JEWELRY-SPECIFIC) ----------
export const productData = {
  topCategories: [
    { category: "Rings", revenue: 820000, units: 1689, aov: 485, growth: 14 },
    { category: "Necklaces", revenue: 640000, units: 1318, aov: 486, growth: 18 },
    { category: "Earrings", revenue: 480000, units: 1200, aov: 400, growth: 22 },
    { category: "Bracelets", revenue: 380000, units: 826, aov: 460, growth: 8 },
    { category: "Bridal Sets", revenue: 320000, units: 284, aov: 1127, growth: 28 },
    { category: "Charms & Pendants", revenue: 200000, units: 2000, aov: 100, growth: 35 },
  ],
  materialPerformance: [
    { material: "18K Gold", revenue: 680000, units: 892, aov: 762, margin: 62 },
    { material: "14K Gold", revenue: 540000, units: 1200, aov: 450, margin: 58 },
    { material: "Platinum", revenue: 420000, units: 420, aov: 1000, margin: 55 },
    { material: "Sterling Silver", revenue: 380000, units: 2400, aov: 158, margin: 72 },
    { material: "Lab-Grown Diamond", revenue: 480000, units: 480, aov: 1000, margin: 68 },
    { material: "Natural Diamond", revenue: 340000, units: 200, aov: 1700, margin: 45 },
    { material: "Gemstone", revenue: 200000, units: 880, aov: 227, margin: 64 },
  ],
  bestSellers: [
    { name: "Eternal Hope Engagement Ring", sku: "ER-001", category: "Rings", material: "18K Gold + Diamond", price: 2800, sold: 142, rating: 4.9, revenue: 397600 },
    { name: "Celestial Layered Necklace", sku: "NK-045", category: "Necklaces", material: "14K Gold", price: 485, sold: 312, rating: 4.8, revenue: 151320 },
    { name: "Aurora Drop Earrings", sku: "ER-078", category: "Earrings", material: "18K Gold + Sapphire", price: 620, sold: 248, rating: 4.9, revenue: 153760 },
    { name: "Whisper Chain Bracelet", sku: "BR-023", category: "Bracelets", material: "Platinum + Diamond", price: 1200, sold: 186, rating: 4.7, revenue: 223200 },
    { name: "Destiny Bridal Set", sku: "BS-010", category: "Bridal Sets", material: "Platinum + Diamond", price: 4200, sold: 64, rating: 5.0, revenue: 268800 },
    { name: "Personalized Name Pendant", sku: "PN-002", category: "Charms & Pendants", material: "Sterling Silver", price: 128, sold: 620, rating: 4.6, revenue: 79360 },
  ],
  occasionInsights: [
    { occasion: "Engagement", share: 28, avgSpend: 2400, peakMonth: "Dec", growth: 12 },
    { occasion: "Anniversary", share: 22, avgSpend: 480, peakMonth: "Feb", growth: 8 },
    { occasion: "Self-Gifting", share: 18, avgSpend: 320, peakMonth: "Mar", growth: 32 },
    { occasion: "Birthday Gift", share: 15, avgSpend: 280, peakMonth: "Various", growth: 14 },
    { occasion: "Holiday (Xmas/Valentine)", share: 12, avgSpend: 380, peakMonth: "Dec", growth: 6 },
    { occasion: "Bridal Party", share: 5, avgSpend: 180, peakMonth: "Jun", growth: 18 },
  ],
};

// ---------- REVENUE & CONVERSIONS ----------
export const revenueData = {
  totalRevenue: 2840000,
  revenueGrowth: 12.3,
  totalOrders: 5855,
  conversionRate: 3.2,
  avgOrderValue: 485,
  cartAbandonmentRate: 68,
  monthlyRevenue: [
    { month: "Aug", revenue: 1980000, orders: 4082 },
    { month: "Sep", revenue: 2120000, orders: 4371 },
    { month: "Oct", revenue: 2340000, orders: 4825 },
    { month: "Nov", revenue: 2560000, orders: 5278 },
    { month: "Dec", revenue: 3120000, orders: 6433 },
    { month: "Jan", revenue: 2840000, orders: 5855 },
  ],
  revenueByChannel: [
    { channel: "Direct", revenue: 852000, share: 30 },
    { channel: "Organic Search", revenue: 680000, share: 24 },
    { channel: "Paid Ads", revenue: 540000, share: 19 },
    { channel: "Social", revenue: 398000, share: 14 },
    { channel: "Email", revenue: 256000, share: 9 },
    { channel: "Affiliate", revenue: 114000, share: 4 },
  ],
  funnelData: [
    { stage: "Site Visitors", count: 182000, rate: 100 },
    { stage: "Product Views", count: 68000, rate: 37.4 },
    { stage: "Add to Cart", count: 28000, rate: 15.4 },
    { stage: "Checkout Started", count: 12000, rate: 6.6 },
    { stage: "Purchase", count: 5855, rate: 3.2 },
  ],
};

// ---------- COMPETITIVE INTELLIGENCE ----------
export const competitiveData = {
  marketShare: 8.4,
  shareOfVoice: 18.4,
  competitors: [
    { name: "Lumière Jewels", sov: 18.4, sentiment: 72, pricing: "Premium", strength: "Brand Story", weakness: "Price Perception" },
    { name: "Aurelia Diamonds", sov: 22.1, sentiment: 68, pricing: "Ultra-Premium", strength: "Heritage", weakness: "Digital Presence" },
    { name: "Solstice Studio", sov: 14.8, sentiment: 74, pricing: "Mid-Premium", strength: "Social Media", weakness: "Product Range" },
    { name: "PureGems Co.", sov: 12.2, sentiment: 81, pricing: "Accessible", strength: "Ethical Sourcing", weakness: "Brand Recognition" },
    { name: "The Gold Atelier", sov: 10.6, sentiment: 66, pricing: "Luxury", strength: "Craftsmanship", weakness: "Distribution" },
    { name: "Nova Jewels", sov: 8.9, sentiment: 58, pricing: "Fast Fashion", strength: "Price Point", weakness: "Quality Perception" },
  ],
  pricingBenchmark: [
    { category: "Engagement Rings", us: 2800, market: 3200, position: "Below Market" },
    { category: "Necklaces", us: 485, market: 520, position: "Competitive" },
    { category: "Earrings", us: 400, market: 380, position: "Above Market" },
    { category: "Bracelets", us: 460, market: 440, position: "Above Market" },
    { category: "Custom Pieces", us: 1200, market: 1500, position: "Below Market" },
  ],
};

// ---------- CAMPAIGN CALENDAR (JEWELRY-SPECIFIC) ----------
export const campaignData = {
  activeCampaigns: 4,
  upcomingCampaigns: 6,
  campaigns: [
    {
      name: "Valentine's Day: Love, Illuminated",
      status: "Active",
      startDate: "Jan 15",
      endDate: "Feb 14",
      budget: 85000,
      spent: 32000,
      channels: ["Instagram", "Email", "Google", "TikTok"],
      targetAudience: "Couples, Gift Shoppers",
      kpis: { revenue: 320000, orders: 850, reach: 2400000 },
      progress: 38,
    },
    {
      name: "Spring Bridal Collection Launch",
      status: "Upcoming",
      startDate: "Feb 20",
      endDate: "Mar 31",
      budget: 120000,
      spent: 0,
      channels: ["Instagram", "Pinterest", "Influencer", "Email"],
      targetAudience: "Brides-to-be, Wedding Planners",
      kpis: { revenue: 480000, orders: 420, reach: 3800000 },
      progress: 0,
    },
    {
      name: "Self-Love March: Treat Yourself",
      status: "Upcoming",
      startDate: "Mar 1",
      endDate: "Mar 15",
      budget: 45000,
      spent: 0,
      channels: ["TikTok", "Instagram", "Email"],
      targetAudience: "Women 25-40",
      kpis: { revenue: 180000, orders: 520, reach: 1600000 },
      progress: 0,
    },
    {
      name: "Mother's Day: Her Radiance",
      status: "Planning",
      startDate: "Apr 20",
      endDate: "May 11",
      budget: 95000,
      spent: 0,
      channels: ["Facebook", "Instagram", "Email", "Google"],
      targetAudience: "Adult Children, Husbands",
      kpis: { revenue: 380000, orders: 980, reach: 2800000 },
      progress: 0,
    },
    {
      name: "Summer Solstice: Gold Edit",
      status: "Planning",
      startDate: "Jun 1",
      endDate: "Jun 21",
      budget: 60000,
      spent: 0,
      channels: ["Instagram", "TikTok", "Pinterest"],
      targetAudience: "Fashion-Conscious Women",
      kpis: { revenue: 240000, orders: 640, reach: 2000000 },
      progress: 0,
    },
    {
      name: "Diwali: Festival of Lights",
      status: "Planning",
      startDate: "Oct 10",
      endDate: "Oct 25",
      budget: 110000,
      spent: 0,
      channels: ["Instagram", "Facebook", "Email", "Influencer"],
      targetAudience: "South Asian Diaspora, Gift Market",
      kpis: { revenue: 420000, orders: 1100, reach: 3200000 },
      progress: 0,
    },
    {
      name: "Black Friday / Cyber Monday",
      status: "Planning",
      startDate: "Nov 24",
      endDate: "Nov 30",
      budget: 140000,
      spent: 0,
      channels: ["All Channels"],
      targetAudience: "Deal Seekers, Existing Customers",
      kpis: { revenue: 560000, orders: 1500, reach: 4200000 },
      progress: 0,
    },
    {
      name: "Holiday Gift Guide 2026",
      status: "Planning",
      startDate: "Dec 1",
      endDate: "Dec 24",
      budget: 160000,
      spent: 0,
      channels: ["All Channels"],
      targetAudience: "Holiday Shoppers",
      kpis: { revenue: 680000, orders: 1800, reach: 4800000 },
      progress: 0,
    },
  ],
};

// ---------- INVENTORY INTELLIGENCE (YOUR USP) ----------
export const inventoryData = {
  totalSKUs: 2840,
  totalInventoryValue: 4200000,
  capitalLocked: 3800000,
  turnoverRate: 4.2,
  deadStockValue: 420000,
  deadStockSKUs: 186,
  reorderAlerts: 24,
  fastMovingSKUs: 342,
  slowMovingSKUs: 186,
  avgDaysToSell: 42,
  monthlyInventoryTrend: [
    { month: "Aug", value: 4100000, sold: 3800000, ordered: 3500000 },
    { month: "Sep", value: 3900000, sold: 4000000, ordered: 3200000 },
    { month: "Oct", value: 4000000, sold: 4200000, ordered: 3600000 },
    { month: "Nov", value: 4200000, sold: 4400000, ordered: 3800000 },
    { month: "Dec", value: 4600000, sold: 5000000, ordered: 4200000 },
    { month: "Jan", value: 4200000, sold: 4600000, ordered: 4000000 },
  ],
  categoryHealth: [
    { category: "Rings", skus: 480, avgDaysToSell: 28, stockTurnover: 6.8, status: "Healthy" },
    { category: "Necklaces", skus: 420, avgDaysToSell: 35, stockTurnover: 5.4, status: "Healthy" },
    { category: "Earrings", skus: 560, avgDaysToSell: 22, stockTurnover: 7.2, status: "Fast" },
    { category: "Bracelets", skus: 380, avgDaysToSell: 45, stockTurnover: 3.8, status: "Monitor" },
    { category: "Bridal Sets", skus: 180, avgDaysToSell: 52, stockTurnover: 2.8, status: "Slow" },
    { category: "Charms & Pendants", skus: 820, avgDaysToSell: 18, stockTurnover: 8.4, status: "Fast" },
  ],
  deadStockAlerts: [
    { sku: "BR-089", name: "Vintage Filigree Bangle", category: "Bracelets", stock: 124, daysSinceSale: 142, value: 49600 },
    { sku: "NK-102", name: "Chunky Gold Chain (Discontinued)", category: "Necklaces", stock: 89, daysSinceSale: 198, value: 62300 },
    { sku: "ER-145", name: "Oval Hoop (Mint Green)", category: "Earrings", stock: 312, daysSinceSale: 94, value: 21840 },
    { sku: "PN-038", name: "Zodiac Pendant — Capricorn", category: "Charms & Pendants", stock: 268, daysSinceSale: 186, value: 21440 },
    { sku: "BS-022", name: "Pearl & Crystal Tiara Set", category: "Bridal Sets", stock: 18, daysSinceSale: 210, value: 68400 },
  ],
  reorderAlerts: [
    { sku: "ER-001", name: "Eternal Hope Engagement Ring", stock: 8, reorderPoint: 20, leadTime: "14 days", demand: "Very High" },
    { sku: "NK-045", name: "Celestial Layered Necklace", stock: 12, reorderPoint: 30, leadTime: "10 days", demand: "High" },
    { sku: "ER-078", name: "Aurora Drop Earrings", stock: 5, reorderPoint: 25, leadTime: "12 days", demand: "Very High" },
    { sku: "PN-002", name: "Personalized Name Pendant", stock: 18, reorderPoint: 50, leadTime: "7 days", demand: "High" },
  ],
  liquidationSuggestions: [
    { sku: "BR-089", name: "Vintage Filigree Bangle", currentPrice: 400, suggestedPrice: 249, discount: 38, estimatedDaysToClear: 21 },
    { sku: "NK-102", name: "Chunky Gold Chain", currentPrice: 700, suggestedPrice: 449, discount: 36, estimatedDaysToClear: 18 },
    { sku: "PN-038", name: "Zodiac Pendant — Capricorn", currentPrice: 80, suggestedPrice: 39, discount: 51, estimatedDaysToClear: 14 },
    { sku: "BS-022", name: "Pearl & Crystal Tiara Set", currentPrice: 3800, suggestedPrice: 2499, discount: 34, estimatedDaysToClear: 28 },
  ],
  bundleRecommendations: [
    { slowSKU: "BR-089 Vintage Bangle", fastSKU: "ER-078 Aurora Earrings", bundlePrice: 799, individualPrice: 1020, margin: 58 },
    { slowSKU: "NK-102 Gold Chain", fastSKU: "PN-002 Name Pendant", bundlePrice: 749, individualPrice: 828, margin: 62 },
    { slowSKU: "PN-038 Zodiac Pendant", fastSKU: "ER-145 Oval Hoop (Green)", bundlePrice: 99, individualPrice: 150, margin: 64 },
  ],
};

// ---------- WHATSAPP COMMERCE HUB ----------
export const whatsappData = {
  totalContacts: 142000,
  activeConversations: 18400,
  whatsappRevenue: 486000,
  whatsappRevenueGrowth: 38,
  conversionRate: 12.8,
  avgResponseTime: "4.2 min",
  automatedReplies: 68,
  broadcastCampaigns: [
    { name: "Valentine's Early Access", sent: 82000, delivered: 98, read: 72, replied: 8.4, conversions: 1840, revenue: 124000 },
    { name: "Back-in-Stock: Sapphire Ring", sent: 12400, delivered: 99, read: 88, replied: 14.2, conversions: 620, revenue: 48000 },
    { name: "Diwali Collection Preview", sent: 95000, delivered: 97, read: 65, replied: 6.8, conversions: 1420, revenue: 96000 },
    { name: "Flash Sale: 30% Off Earrings", sent: 142000, delivered: 96, read: 58, replied: 5.2, conversions: 2100, revenue: 84000 },
    { name: "COD Order Confirmation", sent: 6800, delivered: 99, read: 94, replied: 22, conversions: 6800, revenue: 98000 },
    { name: "Post-Purchase Care Tips", sent: 5600, delivered: 98, read: 82, replied: 4.1, conversions: 280, revenue: 36000 },
  ],
  automatedFlows: [
    { name: "Abandoned Cart WhatsApp", active: true, triggered: 4200, converted: 842, conversion: 20, revenue: 142000 },
    { name: "COD Confirmation Flow", active: true, triggered: 6800, converted: 6120, conversion: 90, revenue: 184000 },
    { name: "Back-in-Stock Alert", active: true, triggered: 12400, converted: 620, conversion: 5, revenue: 48000 },
    { name: "Order Shipment Update", active: true, triggered: 18400, converted: 184, conversion: 1, revenue: 22000 },
    { name: "Win-Back (30d Silent)", active: true, triggered: 8900, converted: 445, conversion: 5, revenue: 56000 },
    { name: "Festive Greeting + Offer", active: false, triggered: 0, converted: 0, conversion: 0, revenue: 0 },
  ],
  conversationToSale: {
    totalConversations: 18400,
    convertedToSale: 4260,
    conversionRate: 23.1,
    avgOrderValue: 486,
    topCategories: [
      { category: "Rings", share: 32, avgDealSize: 620 },
      { category: "Necklaces", share: 24, avgDealSize: 520 },
      { category: "Earrings", share: 22, avgDealSize: 380 },
      { category: "Bridal Sets", share: 14, avgDealSize: 2400 },
      { category: "Custom Orders", share: 8, avgDealSize: 1800 },
    ],
  },
  aiReplySuggestions: [
    { customerQuery: "Is this available in rose gold?", aiSuggestion: "Yes! This piece is available in 14K Rose Gold. Would you like me to share the rose gold variant?", confidence: 96 },
    { customerQuery: "Can I get this by Friday?", aiSuggestion: "We offer express delivery (2-3 days) for ₹299. Shall I upgrade your shipping?", confidence: 92 },
    { customerQuery: "What's the return policy?", aiSuggestion: "Easy 30-day returns with free pickup. No questions asked. Want me to share the detailed policy?", confidence: 98 },
    { customerQuery: "Can you show more designs like this?", aiSuggestion: "Absolutely! Here are 3 similar styles you might love: [auto-populate carousel]", confidence: 89 },
  ],
};

// ---------- CREATIVE & BRAND LAYER ----------
export const creativeData = {
  totalCreatives: 248,
  activeTests: 12,
  avgCTR: 2.8,
  topPerformingCreatives: [
    { id: "CR-001", name: "Bridal Close-Up — Ring Hand", type: "Image", ctr: 4.2, conversions: 342, roas: 8.4, style: "Close-up Product", campaign: "Bridal Launch" },
    { id: "CR-002", name: "Model Wearing Layered Necklace", type: "Video", ctr: 3.8, conversions: 286, roas: 6.2, style: "Lifestyle Model", campaign: "Valentine's" },
    { id: "CR-003", name: "Minimal Gold Earrings Carousel", type: "Carousel", ctr: 5.1, conversions: 420, roas: 9.8, style: "Minimal Product Grid", campaign: "Self-Love March" },
    { id: "CR-004", name: "Artisan Crafting Process Reel", type: "Reel", ctr: 6.4, conversions: 186, roas: 4.2, style: "Behind-the-Scenes", campaign: "Brand Awareness" },
    { id: "CR-005", name: "Bridal Shoot — Full Collection", type: "Video", ctr: 2.9, conversions: 198, roas: 5.8, style: "Bridal Editorial", campaign: "Bridal Launch" },
    { id: "CR-006", name: "Flat Lay — Festive Gold Set", type: "Image", ctr: 3.6, conversions: 264, roas: 7.1, style: "Flat Lay", campaign: "Diwali" },
  ],
  visualStyleAnalysis: [
    { style: "Close-up Product Shot", avgCTR: 4.2, avgROAS: 8.4, usage: 32, recommendation: "Scale Up" },
    { style: "Minimal Product Grid", avgCTR: 5.1, avgROAS: 9.8, usage: 18, recommendation: "Scale Up" },
    { style: "Lifestyle Model", avgCTR: 3.4, avgROAS: 6.1, usage: 24, recommendation: "Maintain" },
    { style: "Flat Lay", avgCTR: 3.6, avgROAS: 7.1, usage: 14, recommendation: "Scale Up" },
    { style: "Behind-the-Scenes", avgCTR: 6.2, avgROAS: 3.8, usage: 8, recommendation: "Test More" },
    { style: "Bridal Editorial", avgCTR: 2.8, avgROAS: 5.4, usage: 12, recommendation: "Maintain" },
    { style: "UGC / Customer Photo", avgCTR: 4.8, avgROAS: 7.6, usage: 6, recommendation: "Increase" },
  ],
  designPatterns: [
    { pattern: "Warm gold backgrounds", ctr: "+42% vs white", aov: "+18%", frequency: "High" },
    { pattern: "Hand models (diverse skin tones)", ctr: "+28% vs no model", aov: "+12%", frequency: "Medium" },
    { pattern: "Minimal text overlays", ctr: "+35% vs heavy text", aov: "+8%", frequency: "High" },
    { pattern: "Close-up macro shots", ctr: "+52% vs wide shots", aov: "+24%", frequency: "Medium" },
    { pattern: "Video showing sparkle/light play", ctr: "+64% vs static", aov: "+32%", frequency: "Low" },
    { pattern: "Before/After transformation", ctr: "+38% vs single frame", aov: "+15%", frequency: "Low" },
  ],
  contentThemes: [
    { theme: "Craftsmanship Stories", posts: 42, avgEngagement: 6.8, conversionAssist: 4.2 },
    { theme: "Aspirational Lifestyle", posts: 36, avgEngagement: 5.4, conversionAssist: 3.8 },
    { theme: "Education & Care Tips", posts: 28, avgEngagement: 4.2, conversionAssist: 6.4 },
    { theme: "Customer Stories / UGC", posts: 24, avgEngagement: 7.8, conversionAssist: 5.8 },
    { theme: "Seasonal Collections", posts: 48, avgEngagement: 5.2, conversionAssist: 4.8 },
    { theme: "Sustainability & Ethics", posts: 18, avgEngagement: 4.8, conversionAssist: 2.2 },
  ],
  audienceFatigue: [
    { audience: "Cold Lookalike — Women 25-34", frequency: 4.2, fatigue: 72, ctrTrend: -18, recommendation: "Rotate creatives" },
    { audience: "Retargeting — Cart Abandoners", frequency: 6.8, fatigue: 85, ctrTrend: -24, recommendation: "Reduce frequency cap" },
    { audience: "Engaged — Website Visitors 7d", frequency: 3.1, fatigue: 34, ctrTrend: +5, recommendation: "Healthy — maintain" },
    { audience: "Broad Interest — Jewelry Shoppers", frequency: 5.4, fatigue: 61, ctrTrend: -12, recommendation: "Introduce new creative" },
  ],
};

// ---------- AI GROWTH ENGINE (YOUR REAL MOAT) ----------
export const aiEngineData = {
  lastUpdated: "2 min ago",
  momentumScore: 82,
  momentumTrend: +8,
  dailySuggestions: [
    { id: "D-001", priority: "Critical", category: "Inventory", action: "Restock ER-001 (Eternal Hope Ring) — only 8 units left, 20-day lead time. 340 units demanded in last 30 days.", impact: "est. $96K revenue at risk", status: "pending" },
    { id: "D-002", priority: "High", category: "Ads", action: "Pause Ad Set 'Broad — Jewelry Interest V3' on Meta. CAC spiked to $78 (2x target) with declining CTR.", impact: "Save $4,200/week in wasted spend", status: "pending" },
    { id: "D-003", priority: "High", category: "WhatsApp", action: "Push broadcast to segment 'Diamond Browsers (no purchase)' — 12,400 contacts, est. 620 conversions.", impact: "est. $48K additional revenue", status: "pending" },
    { id: "D-004", priority: "Medium", category: "Creative", action: "Replace 'Lifestyle Model V2' creative in retargeting campaign — CTR dropped 32% this week.", impact: "Improve ROAS by est. 1.2x", status: "pending" },
    { id: "D-005", priority: "Medium", category: "Bundle", action: "Bundle slow-mover BR-089 (Vintage Bangle) with bestseller ER-078 (Aurora Earrings) — target 38% discount.", impact: "Clear $49.6K dead stock", status: "pending" },
    { id: "D-006", priority: "Low", category: "Content", action: "Post 'Behind the Craft' video this Thursday — highest engagement format (6.2% CTR avg).", impact: "est. 180K additional reach", status: "pending" },
  ],
  weeklyPlaybook: [
    { day: "Monday", focus: "Inventory Health", actions: ["Review dead stock alerts", "Approve reorder POs", "Check bundle performance"], kpi: "Turnover rate > 4.0" },
    { day: "Tuesday", focus: "Ad Performance", actions: ["Audit top 5 campaigns", "Pause fatigued ad sets", "Test 2 new creatives"], kpi: "ROAS > 4.0x" },
    { day: "Wednesday", focus: "WhatsApp Growth", actions: ["Send broadcast campaign", "Review flow conversions", "Update AI reply templates"], kpi: "WhatsApp revenue > $40K" },
    { day: "Thursday", focus: "Content & Creative", actions: ["Publish hero content", "Review creative tests", "Plan next week's calendar"], kpi: "Engagement > 5%" },
    { day: "Friday", focus: "Customer Intelligence", actions: ["Review churn risk list", "Trigger win-back campaigns", "Analyze CLV by segment"], kpi: "Churn < 8%" },
    { day: "Weekend", focus: "Automated Monitoring", actions: ["Auto-respond to WhatsApp queries", "Monitor social mentions", "Track flash sale performance"], kpi: "Response time < 5 min" },
  ],
  growthActions: [
    { action: "Launch Refer-a-Friend program", projectedImpact: "+1,200 new customers/quarter", effort: "Medium", timeline: "2 weeks" },
    { action: "Expand to Pinterest Shopping ads", projectedImpact: "+$120K revenue/quarter", effort: "Low", timeline: "1 week" },
    { action: "Introduce try-at-home for bridal sets", projectedImpact: "+28% bridal conversion rate", effort: "High", timeline: "6 weeks" },
    { action: "Create WhatsApp-exclusive early access tier", projectedImpact: "+15% repeat purchase rate", effort: "Medium", timeline: "3 weeks" },
    { action: "Add AR try-on feature for rings", projectedImpact: "-18% return rate, +12% AOV", effort: "High", timeline: "8 weeks" },
    { action: "Start SMS abandon recovery (India)", projectedImpact: "+$84K recovery revenue/quarter", effort: "Low", timeline: "1 week" },
  ],
  predictedInsights: [
    { metric: "Next month revenue", prediction: "$3.1M", confidence: 87, trend: "up" },
    { metric: "Churn risk customers", prediction: "1,240 (7.2%)", confidence: 82, trend: "down" },
    { metric: "Inventory shortage risk", prediction: "8 SKUs at critical level", confidence: 91, trend: "up" },
    { metric: "Best performing category next month", prediction: "Earrings (+22%)", confidence: 76, trend: "up" },
    { metric: "WhatsApp conversion potential", prediction: "$520K (if optimized)", confidence: 84, trend: "up" },
  ],
};
