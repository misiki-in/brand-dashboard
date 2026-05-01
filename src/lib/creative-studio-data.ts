// ============================================================
// VARNI JEWELS — AI Creative Studio Data
// Comprehensive mock data for the Ryze AI Creative Generation module
// ============================================================

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type CreativeType = 'static_image' | 'ugc' | 'video_script' | 'carousel' | 'reel' | 'story';
export type CreativeStatus = 'active' | 'paused' | 'rejected' | 'in_review' | 'generating';
export type Platform = 'Instagram' | 'Facebook' | 'TikTok' | 'Pinterest' | 'YouTube';
export type TrendDirection = 'up' | 'down' | 'stable';
export type SuggestedFormat = 'ugc' | 'before_after' | 'testimonial' | 'product' | 'lifestyle' | 'flat_lay' | 'close_up';
export type AISuggestionStatus = 'pending_review' | 'approved' | 'rejected';
export type Recommendation = 'scale_up' | 'maintain' | 'test_more' | 'stop';
export type TestAction = 'scale_challenger' | 'continue_test' | 'stop';
export type TaskStatus = 'queued' | 'generating' | 'ready' | 'reviewed';

export interface CreativeItem {
  id: string;
  name: string;
  type: CreativeType;
  platform: Platform;
  status: CreativeStatus;
  dimensions: string;
  campaign: string;
  ctr: number;
  conversionRate: number;
  roas: number;
  impressions: number;
  clicks: number;
  createdAt: string;
  trend: TrendDirection;
}

export interface AIGeneratedCreative {
  id: string;
  name: string;
  type: CreativeType;
  platform: Platform;
  suggestedFormat: SuggestedFormat;
  hook_text: string;
  body_text: string;
  cta_text: string;
  visual_description: string;
  targetAudience: string;
  confidence_score: number;
  status: AISuggestionStatus;
  generatedAt: string;
}

export interface PerformanceByType {
  type: CreativeType;
  avgCTR: number;
  avgConversionRate: number;
  avgROAS: number;
  totalSpend: number;
  totalConversions: number;
  sampleSize: number;
}

export interface PerformanceByHook {
  hook: string;
  avgCTR: number;
  avgConversionRate: number;
  topPlatform: Platform;
  usageCount: number;
}

export interface PerformanceByFormat {
  format: string;
  avgCTR: number;
  avgROAS: number;
  recommendation: Recommendation;
}

export interface ReviewQueueItem {
  id: string;
  creativeId: string;
  thumbnailDescription: string;
  aiRationale: string;
  similarityToTopPerformers: number;
  platform: Platform;
  suggestedFormat: SuggestedFormat;
}

export interface TestResult {
  id: string;
  testName: string;
  challengerCreative: string;
  controlCreative: string;
  metricTested: string;
  challengerPerformance: number;
  controlPerformance: number;
  improvement: number;
  statisticalSignificance: boolean;
  winner: 'challenger' | 'control' | 'inconclusive';
  actionTaken: TestAction;
  date: string;
}

export interface TopPerformerPattern {
  category: string;
  pattern: string;
  correlationCTR: number;
  correlationConversions: number;
  usageFrequency: number;
  recommendation: string;
}

export interface CreativeGenerationTask {
  id: string;
  requestedType: CreativeType;
  platform: Platform[];
  targetCampaign: string;
  briefDescription: string;
  priority: 'high' | 'medium' | 'low';
  status: TaskStatus;
  estimatedCompletion: string;
}

export interface PlatformGuide {
  platform: Platform;
  recommendedFormats: string[];
  optimalDimensions: { name: string; size: string }[];
  bestPerformingHooks: string[];
  trendingStyles: string[];
  dos: string[];
  donts: string[];
}

// ------------------------------------------------------------------
// 1. Creative Library
// ------------------------------------------------------------------

export const creativeLibrary: CreativeItem[] = [
  {
    id: 'CR-001',
    name: 'Diamond Solitaire Ring Hero',
    type: 'static_image',
    platform: 'Instagram',
    status: 'active',
    dimensions: '1080×1080',
    campaign: 'Valentine Collection',
    ctr: 4.8,
    conversionRate: 3.2,
    roas: 8.4,
    impressions: 245000,
    clicks: 11760,
    createdAt: '2025-12-15',
    trend: 'up',
  },
  {
    id: 'CR-002',
    name: 'Gold Necklace Unboxing UGC',
    type: 'ugc',
    platform: 'TikTok',
    status: 'active',
    dimensions: '1080×1920',
    campaign: 'Spring Collection',
    ctr: 6.2,
    conversionRate: 4.1,
    roas: 9.8,
    impressions: 890000,
    clicks: 55180,
    createdAt: '2026-01-08',
    trend: 'up',
  },
  {
    id: 'CR-003',
    name: 'Bridal Set Carousel',
    type: 'carousel',
    platform: 'Facebook',
    status: 'active',
    dimensions: '1080×1080',
    campaign: 'Wedding Collection',
    ctr: 3.9,
    conversionRate: 2.8,
    roas: 6.2,
    impressions: 320000,
    clicks: 12480,
    createdAt: '2025-11-20',
    trend: 'stable',
  },
  {
    id: 'CR-004',
    name: 'Behind The Scenes Workshop',
    type: 'video_script',
    platform: 'YouTube',
    status: 'active',
    dimensions: '1920×1080',
    campaign: 'Brand Story',
    ctr: 2.8,
    conversionRate: 1.9,
    roas: 4.5,
    impressions: 156000,
    clicks: 4368,
    createdAt: '2026-01-02',
    trend: 'down',
  },
  {
    id: 'CR-005',
    name: 'Silver Anklet Try-On Reel',
    type: 'reel',
    platform: 'Instagram',
    status: 'active',
    dimensions: '1080×1920',
    campaign: 'Summer Essentials',
    ctr: 7.1,
    conversionRate: 4.5,
    roas: 11.2,
    impressions: 1240000,
    clicks: 88040,
    createdAt: '2026-01-18',
    trend: 'up',
  },
  {
    id: 'CR-006',
    name: 'Temple Jewelry Story',
    type: 'story',
    platform: 'Instagram',
    status: 'active',
    dimensions: '1080×1920',
    campaign: 'Heritage Collection',
    ctr: 5.4,
    conversionRate: 3.6,
    roas: 7.8,
    impressions: 680000,
    clicks: 36720,
    createdAt: '2026-01-12',
    trend: 'up',
  },
  {
    id: 'CR-007',
    name: 'Pearl Earrings Close-Up',
    type: 'static_image',
    platform: 'Pinterest',
    status: 'active',
    dimensions: '1000×1500',
    campaign: 'Gift Collection',
    ctr: 3.2,
    conversionRate: 2.4,
    roas: 5.6,
    impressions: 198000,
    clicks: 6336,
    createdAt: '2025-12-28',
    trend: 'stable',
  },
  {
    id: 'CR-008',
    name: 'Mens Gold Chain Flat Lay',
    type: 'static_image',
    platform: 'Instagram',
    status: 'paused',
    dimensions: '1080×1080',
    campaign: 'Mens Collection',
    ctr: 2.1,
    conversionRate: 1.5,
    roas: 3.2,
    impressions: 145000,
    clicks: 3045,
    createdAt: '2025-10-15',
    trend: 'down',
  },
  {
    id: 'CR-009',
    name: 'Kundan Set Customer Testimonial',
    type: 'ugc',
    platform: 'Facebook',
    status: 'active',
    dimensions: '1080×1080',
    campaign: 'Festive Collection',
    ctr: 5.8,
    conversionRate: 3.9,
    roas: 9.1,
    impressions: 410000,
    clicks: 23780,
    createdAt: '2026-01-05',
    trend: 'up',
  },
  {
    id: 'CR-010',
    name: 'Emerald Ring Product Showcase',
    type: 'carousel',
    platform: 'Instagram',
    status: 'in_review',
    dimensions: '1080×1080',
    campaign: 'Gemstone Collection',
    ctr: 0,
    conversionRate: 0,
    roas: 0,
    impressions: 0,
    clicks: 0,
    createdAt: '2026-01-25',
    trend: 'stable',
  },
  {
    id: 'CR-011',
    name: 'Bangle Before & After',
    type: 'ugc',
    platform: 'TikTok',
    status: 'active',
    dimensions: '1080×1920',
    campaign: 'Transformation Series',
    ctr: 6.8,
    conversionRate: 4.3,
    roas: 10.5,
    impressions: 920000,
    clicks: 62560,
    createdAt: '2026-01-15',
    trend: 'up',
  },
  {
    id: 'CR-012',
    name: 'Engagement Ring Reveal Reel',
    type: 'reel',
    platform: 'Instagram',
    status: 'generating',
    dimensions: '1080×1920',
    campaign: 'Valentine Collection',
    ctr: 0,
    conversionRate: 0,
    roas: 0,
    impressions: 0,
    clicks: 0,
    createdAt: '2026-01-28',
    trend: 'stable',
  },
  {
    id: 'CR-013',
    name: 'Wedding Band Story Poll',
    type: 'story',
    platform: 'Instagram',
    status: 'rejected',
    dimensions: '1080×1920',
    campaign: 'Wedding Collection',
    ctr: 1.2,
    conversionRate: 0.6,
    roas: 1.4,
    impressions: 89000,
    clicks: 1068,
    createdAt: '2025-12-20',
    trend: 'down',
  },
  {
    id: 'CR-014',
    name: 'Gold Necklace Lifestyle Video',
    type: 'video_script',
    platform: 'YouTube',
    status: 'active',
    dimensions: '1920×1080',
    campaign: 'Spring Collection',
    ctr: 3.4,
    conversionRate: 2.2,
    roas: 5.1,
    impressions: 210000,
    clicks: 7140,
    createdAt: '2026-01-10',
    trend: 'stable',
  },
  {
    id: 'CR-015',
    name: 'DIY Jewelry Pinterest Pin',
    type: 'static_image',
    platform: 'Pinterest',
    status: 'active',
    dimensions: '1000×1500',
    campaign: 'DIY Collection',
    ctr: 2.9,
    conversionRate: 2.0,
    roas: 4.8,
    impressions: 178000,
    clicks: 5162,
    createdAt: '2025-12-10',
    trend: 'down',
  },
];

// ------------------------------------------------------------------
// 2. AI-Generated Creatives
// ------------------------------------------------------------------

export const aiGeneratedCreatives: AIGeneratedCreative[] = [
  {
    id: 'AI-001',
    name: 'Valentine Diamond Sparkle Reel',
    type: 'reel',
    platform: 'Instagram',
    suggestedFormat: 'lifestyle',
    hook_text: 'She said YES. Now say it with Varni 💎',
    body_text: 'Our Valentine Collection features GIA-certified diamonds set in 18K gold. Each piece tells a love story.',
    cta_text: 'Shop the Collection',
    visual_description: 'Close-up of a diamond solitaire ring catching golden hour light, soft bokeh background with rose petals, gradual zoom-in reveal, text overlay: "This or This?" split screen with two ring options',
    targetAudience: 'Men 25-40, engaged or recently married, mid-to-high income',
    confidence_score: 94,
    status: 'pending_review',
    generatedAt: '2026-01-28T14:30:00Z',
  },
  {
    id: 'AI-002',
    name: 'Temple Jewelry Heritage UGC',
    type: 'ugc',
    platform: 'TikTok',
    suggestedFormat: 'ugc',
    hook_text: 'POV: Your grandmother sees you wearing this 🙈✨',
    body_text: 'Modern temple jewelry that bridges generations. Gold-plated, lightweight, certified quality.',
    cta_text: 'Get Yours Now',
    visual_description: 'Gen Z creator trying on a layered temple jewelry set in front of a traditional mirror, transition to street-style shot, trending audio overlay',
    targetAudience: 'Women 18-30, South Indian heritage, fashion-forward',
    confidence_score: 91,
    status: 'pending_review',
    generatedAt: '2026-01-28T13:15:00Z',
  },
  {
    id: 'AI-003',
    name: 'Silver Anklet Transformation Carousel',
    type: 'carousel',
    platform: 'Facebook',
    suggestedFormat: 'before_after',
    hook_text: 'One anklet. Five outfits. Zero doubts.',
    body_text: 'Sterling silver anklets that complement every look — from casual to bridal. 50+ designs under ₹2,999.',
    cta_text: 'Explore Designs',
    visual_description: '5-slide carousel: Slide 1 - anklet on casual jeans outfit, Slide 2 - with ethnic kurta, Slide 3 - at beach, Slide 4 - with saree, Slide 5 - close-up product shot with price',
    targetAudience: 'Women 22-35, value-conscious, multi-occasion buyers',
    confidence_score: 88,
    status: 'pending_review',
    generatedAt: '2026-01-28T11:45:00Z',
  },
  {
    id: 'AI-004',
    name: 'Gold Bangle Before & After Reel',
    type: 'reel',
    platform: 'TikTok',
    suggestedFormat: 'before_after',
    hook_text: 'Wait for the glow-up... ⏳✨',
    body_text: '22K hallmarked gold bangles that transform any look. Lifetime exchange guarantee.',
    cta_text: 'Shop Now',
    visual_description: 'Split-screen transformation: plain outfit on left, same outfit with 4 stacked gold bangles on right. Slow-motion hand reveal with ASMR bracelet clink sound.',
    targetAudience: 'Women 25-45, aspirational luxury buyers',
    confidence_score: 92,
    status: 'pending_review',
    generatedAt: '2026-01-28T10:20:00Z',
  },
  {
    id: 'AI-005',
    name: 'Mens Chain Testimonial Static',
    type: 'static_image',
    platform: 'Instagram',
    suggestedFormat: 'testimonial',
    hook_text: '"Best quality chain I have ever owned." — Raj, Mumbai',
    body_text: 'Premium 22K gold chains for men. Cuban, rope, and box chain styles. BIS hallmarked.',
    cta_text: 'See Collection',
    visual_description: 'Lifestyle photo of a well-dressed man wearing a gold chain, overlaid with customer quote in elegant typography, 5-star review badge, trust badges (BIS, lifetime exchange)',
    targetAudience: 'Men 25-50, gift buyers, self-purchase occasions',
    confidence_score: 85,
    status: 'pending_review',
    generatedAt: '2026-01-27T16:00:00Z',
  },
  {
    id: 'AI-006',
    name: 'Pearl Earrings Flat Lay Pin',
    type: 'static_image',
    platform: 'Pinterest',
    suggestedFormat: 'flat_lay',
    hook_text: 'The earrings that go with EVERYTHING',
    body_text: 'Freshwater pearl earrings from ₹1,499. Everyday elegance, bridal beauty.',
    cta_text: 'Save for Later',
    visual_description: 'Aesthetic flat lay on cream linen: pearl earrings surrounded by dried flowers, a book, and coffee cup. Minimalist color palette with soft shadows.',
    targetAudience: 'Women 20-40, Pinterest browsers, gift shoppers',
    confidence_score: 82,
    status: 'pending_review',
    generatedAt: '2026-01-27T14:30:00Z',
  },
  {
    id: 'AI-007',
    name: 'Engagement Ring Video Script',
    type: 'video_script',
    platform: 'YouTube',
    suggestedFormat: 'product',
    hook_text: 'How to pick the PERFECT engagement ring in 60 seconds',
    body_text: 'Diamond shape guide, setting options, and budget tips from Varni Jewels gemologists.',
    cta_text: 'Book Free Consultation',
    visual_description: '60-second educational video: quick cuts between diamond shapes (round, princess, oval, emerald), hand model trying each, pricing comparison overlay, CTA screen with consultation booking',
    targetAudience: 'Men 25-40, recently engaged, researching diamonds',
    confidence_score: 89,
    status: 'pending_review',
    generatedAt: '2026-01-27T12:00:00Z',
  },
  {
    id: 'AI-008',
    name: 'Wedding Set Story Countdown',
    type: 'story',
    platform: 'Instagram',
    suggestedFormat: 'product',
    hook_text: 'Wedding season is HERE. Are you ready? 👰',
    body_text: 'Complete bridal sets starting ₹24,999. Necklace + earrings + maang tikka + bangles.',
    cta_text: 'Swipe Up to Shop',
    visual_description: '3-story sequence: Story 1 - countdown sticker with wedding date, Story 2 - quick showcase of full bridal set on model, Story 3 - price reveal with "limited stock" urgency',
    targetAudience: 'Women 22-35, upcoming brides, wedding season shoppers',
    confidence_score: 86,
    status: 'pending_review',
    generatedAt: '2026-01-27T09:15:00Z',
  },
];

// ------------------------------------------------------------------
// 3. Creative Performance Analysis
// ------------------------------------------------------------------

export const performanceByType: PerformanceByType[] = [
  {
    type: 'static_image',
    avgCTR: 3.4,
    avgConversionRate: 2.2,
    avgROAS: 5.8,
    totalSpend: 14200,
    totalConversions: 890,
    sampleSize: 42,
  },
  {
    type: 'ugc',
    avgCTR: 6.0,
    avgConversionRate: 4.1,
    avgROAS: 9.8,
    totalSpend: 28400,
    totalConversions: 2340,
    sampleSize: 28,
  },
  {
    type: 'carousel',
    avgCTR: 3.7,
    avgConversionRate: 2.6,
    avgROAS: 6.4,
    totalSpend: 9800,
    totalConversions: 620,
    sampleSize: 18,
  },
  {
    type: 'video_script',
    avgCTR: 3.1,
    avgConversionRate: 2.0,
    avgROAS: 4.8,
    totalSpend: 7600,
    totalConversions: 380,
    sampleSize: 12,
  },
  {
    type: 'reel',
    avgCTR: 6.9,
    avgConversionRate: 4.4,
    avgROAS: 10.8,
    totalSpend: 31200,
    totalConversions: 2890,
    sampleSize: 22,
  },
];

export const performanceByHook: PerformanceByHook[] = [
  {
    hook: 'discount_urgency',
    avgCTR: 4.2,
    avgConversionRate: 3.1,
    topPlatform: 'Facebook',
    usageCount: 34,
  },
  {
    hook: 'social_proof',
    avgCTR: 5.8,
    avgConversionRate: 3.8,
    topPlatform: 'TikTok',
    usageCount: 28,
  },
  {
    hook: 'educational',
    avgCTR: 3.4,
    avgConversionRate: 2.4,
    topPlatform: 'YouTube',
    usageCount: 18,
  },
  {
    hook: 'emotional',
    avgCTR: 5.2,
    avgConversionRate: 3.5,
    topPlatform: 'Instagram',
    usageCount: 42,
  },
  {
    hook: 'question',
    avgCTR: 4.8,
    avgConversionRate: 3.2,
    topPlatform: 'TikTok',
    usageCount: 22,
  },
  {
    hook: 'lifestyle',
    avgCTR: 5.5,
    avgConversionRate: 3.6,
    topPlatform: 'Instagram',
    usageCount: 38,
  },
  {
    hook: 'before_after',
    avgCTR: 7.2,
    avgConversionRate: 4.8,
    topPlatform: 'TikTok',
    usageCount: 16,
  },
];

export const performanceByFormat: PerformanceByFormat[] = [
  {
    format: 'close_up',
    avgCTR: 4.1,
    avgROAS: 6.2,
    recommendation: 'maintain',
  },
  {
    format: 'model_shot',
    avgCTR: 5.4,
    avgROAS: 8.1,
    recommendation: 'scale_up',
  },
  {
    format: 'flat_lay',
    avgCTR: 3.8,
    avgROAS: 5.4,
    recommendation: 'maintain',
  },
  {
    format: 'lifestyle',
    avgCTR: 5.9,
    avgROAS: 9.2,
    recommendation: 'scale_up',
  },
  {
    format: 'behind_scenes',
    avgCTR: 3.2,
    avgROAS: 4.1,
    recommendation: 'test_more',
  },
  {
    format: 'ugc_customer',
    avgCTR: 6.8,
    avgROAS: 10.4,
    recommendation: 'scale_up',
  },
];

// ------------------------------------------------------------------
// 4. Approve/Deny Workflow — Review Queue
// ------------------------------------------------------------------

export const reviewQueueItems: ReviewQueueItem[] = [
  {
    id: 'RQ-001',
    creativeId: 'AI-001',
    thumbnailDescription: 'Diamond ring golden hour close-up with rose petal bokeh',
    aiRationale: 'Similar to CR-005 (our top reel at 11.2x ROAS). Uses the same golden-hour lighting technique that generated 88K clicks. Hook pattern matches our top-performing emotional hooks.',
    similarityToTopPerformers: 87,
    platform: 'Instagram',
    suggestedFormat: 'lifestyle',
  },
  {
    id: 'RQ-002',
    creativeId: 'AI-002',
    thumbnailDescription: 'Gen Z creator trying on temple jewelry with mirror transition',
    aiRationale: 'UGC format with heritage angle has 9.8x avg ROAS. The POV-style hook on TikTok consistently achieves 2x higher CTR than product-only creatives.',
    similarityToTopPerformers: 82,
    platform: 'TikTok',
    suggestedFormat: 'ugc',
  },
  {
    id: 'RQ-003',
    creativeId: 'AI-003',
    thumbnailDescription: '5-slide carousel showing silver anklet with different outfits',
    aiRationale: 'Carousel format with outfit pairing follows the proven "5 ways to style" pattern. Similar to CR-003 (6.2x ROAS) but with better audience targeting.',
    similarityToTopPerformers: 74,
    platform: 'Facebook',
    suggestedFormat: 'before_after',
  },
  {
    id: 'RQ-004',
    creativeId: 'AI-004',
    thumbnailDescription: 'Split-screen bangle transformation with ASMR audio',
    aiRationale: 'Before/after format has highest avg CTR (7.2%) across all hooks. Combined with trending ASMR audio on TikTok, expected to outperform current best reel by 15%.',
    similarityToTopPerformers: 91,
    platform: 'TikTok',
    suggestedFormat: 'before_after',
  },
  {
    id: 'RQ-005',
    creativeId: 'AI-005',
    thumbnailDescription: 'Lifestyle photo with customer testimonial overlay and trust badges',
    aiRationale: 'Testimonial creatives on Instagram have 5.8x avg ROAS. Trust badges (BIS, lifetime exchange) increase conversion rate by 28% based on A/B test results.',
    similarityToTopPerformers: 68,
    platform: 'Instagram',
    suggestedFormat: 'testimonial',
  },
  {
    id: 'RQ-006',
    creativeId: 'AI-006',
    thumbnailDescription: 'Aesthetic pearl earring flat lay on cream linen with dried flowers',
    aiRationale: 'Pinterest flat lays with lifestyle props have 3.8x avg ROAS. Pearl category is trending +34% this month on Pinterest.',
    similarityToTopPerformers: 71,
    platform: 'Pinterest',
    suggestedFormat: 'flat_lay',
  },
];

// ------------------------------------------------------------------
// 5. Continuous Testing Results
// ------------------------------------------------------------------

export const testResults: TestResult[] = [
  {
    id: 'AB-001',
    testName: 'Valentine Hook Test: Emotional vs Question',
    challengerCreative: 'AI-001 Valentine Diamond Sparkle Reel',
    controlCreative: 'CR-012 Engagement Ring Reveal Reel',
    metricTested: 'CTR',
    challengerPerformance: 5.4,
    controlPerformance: 3.8,
    improvement: 42.1,
    statisticalSignificance: true,
    winner: 'challenger',
    actionTaken: 'scale_challenger',
    date: '2026-01-25',
  },
  {
    id: 'AB-002',
    testName: 'UGC Creator Test: Gen Z vs Millennial',
    challengerCreative: 'AI-002 Temple Jewelry Heritage UGC',
    controlCreative: 'CR-009 Kundan Set Customer Testimonial',
    metricTested: 'Conversion Rate',
    challengerPerformance: 4.3,
    controlPerformance: 3.9,
    improvement: 10.3,
    statisticalSignificance: true,
    winner: 'challenger',
    actionTaken: 'scale_challenger',
    date: '2026-01-24',
  },
  {
    id: 'AB-003',
    testName: 'Carousel Length: 5-slide vs 3-slide',
    challengerCreative: 'AI-003 Silver Anklet Transformation Carousel',
    controlCreative: 'CR-003 Bridal Set Carousel',
    metricTested: 'ROAS',
    challengerPerformance: 6.8,
    controlPerformance: 6.2,
    improvement: 9.7,
    statisticalSignificance: false,
    winner: 'inconclusive',
    actionTaken: 'continue_test',
    date: '2026-01-22',
  },
  {
    id: 'AB-004',
    testName: 'Audio Type: ASMR vs Trending Music',
    challengerCreative: 'AI-004 Gold Bangle Before & After Reel',
    controlCreative: 'CR-005 Silver Anklet Try-On Reel',
    metricTested: 'CTR',
    challengerPerformance: 8.1,
    controlPerformance: 7.1,
    improvement: 14.1,
    statisticalSignificance: true,
    winner: 'challenger',
    actionTaken: 'scale_challenger',
    date: '2026-01-20',
  },
  {
    id: 'AB-005',
    testName: 'Testimonial: Quote vs Video',
    challengerCreative: 'AI-005 Mens Chain Testimonial Static',
    controlCreative: 'CR-008 Mens Gold Chain Flat Lay',
    metricTested: 'Conversion Rate',
    challengerPerformance: 2.8,
    controlPerformance: 1.5,
    improvement: 86.7,
    statisticalSignificance: true,
    winner: 'challenger',
    actionTaken: 'scale_challenger',
    date: '2026-01-18',
  },
  {
    id: 'AB-006',
    testName: 'Flat Lay: Minimalist vs Decorative',
    challengerCreative: 'AI-006 Pearl Earrings Flat Lay Pin',
    controlCreative: 'CR-007 Pearl Earrings Close-Up',
    metricTested: 'ROAS',
    challengerPerformance: 5.2,
    controlPerformance: 5.6,
    improvement: -7.1,
    statisticalSignificance: false,
    winner: 'control',
    actionTaken: 'stop',
    date: '2026-01-16',
  },
  {
    id: 'AB-007',
    testName: 'Reel Hook: POV vs Direct Product',
    challengerCreative: 'CR-002 Gold Necklace Unboxing UGC',
    controlCreative: 'CR-011 Bangle Before & After',
    metricTested: 'CTR',
    challengerPerformance: 6.2,
    controlPerformance: 6.8,
    improvement: -8.8,
    statisticalSignificance: true,
    winner: 'control',
    actionTaken: 'stop',
    date: '2026-01-14',
  },
  {
    id: 'AB-008',
    testName: 'Story Poll: Interactive vs Static',
    challengerCreative: 'CR-006 Temple Jewelry Story',
    controlCreative: 'CR-013 Wedding Band Story Poll',
    metricTested: 'Conversion Rate',
    challengerPerformance: 3.6,
    controlPerformance: 0.6,
    improvement: 500.0,
    statisticalSignificance: true,
    winner: 'challenger',
    actionTaken: 'scale_challenger',
    date: '2026-01-12',
  },
];

// ------------------------------------------------------------------
// 6. Top Performer Patterns
// ------------------------------------------------------------------

export const topPerformerPatterns: TopPerformerPattern[] = [
  {
    category: 'Color Palette',
    pattern: 'Warm gold tones (#D4AF37, #C5A028) on dark backgrounds (#1A1A2E)',
    correlationCTR: 34,
    correlationConversions: 28,
    usageFrequency: 68,
    recommendation: 'Use in 80% of hero creatives — strongest correlation with CTR',
  },
  {
    category: 'Color Palette',
    pattern: 'Soft pastel backgrounds (blush pink, cream) for bridal content',
    correlationCTR: 22,
    correlationConversions: 41,
    usageFrequency: 45,
    recommendation: 'Apply to all wedding/bridal campaigns — highest conversion lift',
  },
  {
    category: 'Composition',
    pattern: 'Product centered with rule-of-thirds positioning',
    correlationCTR: 18,
    correlationConversions: 15,
    usageFrequency: 82,
    recommendation: 'Standard baseline composition — maintain for all static images',
  },
  {
    category: 'Composition',
    pattern: 'Human hand/wrist wearing jewelry in natural lighting',
    correlationCTR: 31,
    correlationConversions: 35,
    usageFrequency: 56,
    recommendation: 'Scale up in all video and UGC creatives — strong emotional connection',
  },
  {
    category: 'Text Overlay Style',
    pattern: 'Minimalist white text with subtle shadow, no more than 6 words',
    correlationCTR: 26,
    correlationConversions: 19,
    usageFrequency: 74,
    recommendation: 'Default text style for all formats — clean and readable',
  },
  {
    category: 'Text Overlay Style',
    pattern: 'Customer quote in cursive font with 5-star badge',
    correlationCTR: 15,
    correlationConversions: 38,
    usageFrequency: 32,
    recommendation: 'High conversion impact — use more in retargeting and testimonial creatives',
  },
  {
    category: 'Product Angle',
    pattern: '45-degree angle showcasing both front and side of jewelry',
    correlationCTR: 24,
    correlationConversions: 22,
    usageFrequency: 61,
    recommendation: 'Best for close-up product shots — shows depth and craftsmanship',
  },
  {
    category: 'Product Angle',
    pattern: 'Flat lay overhead shot with lifestyle props',
    correlationCTR: 19,
    correlationConversions: 16,
    usageFrequency: 48,
    recommendation: 'Effective for Pinterest and Instagram feed posts',
  },
  {
    category: 'Model Demographics',
    pattern: 'South Asian female model, 25-30 age, in traditional attire',
    correlationCTR: 29,
    correlationConversions: 33,
    usageFrequency: 52,
    recommendation: 'Primary model selection for Indian market campaigns',
  },
  {
    category: 'Model Demographics',
    pattern: 'Diverse models (mixed ethnicity) for global audience targeting',
    correlationCTR: 12,
    correlationConversions: 18,
    usageFrequency: 28,
    recommendation: 'Test more for US/UK audience — positive early signals',
  },
  {
    category: 'Background Type',
    pattern: 'Blurred golden hour bokeh with warm tones',
    correlationCTR: 32,
    correlationConversions: 25,
    usageFrequency: 58,
    recommendation: 'Highest CTR correlation — use for all hero/launch creatives',
  },
  {
    category: 'Background Type',
    pattern: 'Clean white studio background for product detail shots',
    correlationCTR: 14,
    correlationConversions: 21,
    usageFrequency: 42,
    recommendation: 'Best for carousel product slides and catalog ads',
  },
];

// ------------------------------------------------------------------
// 7. Creative Generation Queue
// ------------------------------------------------------------------

export const creativeGenerationQueue: CreativeGenerationTask[] = [
  {
    id: 'GQ-001',
    requestedType: 'reel',
    platform: ['TikTok', 'Instagram'],
    targetCampaign: 'Valentine Collection',
    briefDescription: '15-second unboxing experience of diamond ring with ASMR sound design. Emotional reveal moment with "Will you marry me?" text overlay.',
    priority: 'high',
    status: 'generating',
    estimatedCompletion: '2026-01-28T16:00:00Z',
  },
  {
    id: 'GQ-002',
    requestedType: 'carousel',
    platform: ['Facebook', 'Instagram'],
    targetCampaign: 'Spring Collection',
    briefDescription: '7-slide carousel featuring gold necklace styles for different occasions: office, party, casual, wedding, festive, travel, everyday.',
    priority: 'high',
    status: 'queued',
    estimatedCompletion: '2026-01-29T10:00:00Z',
  },
  {
    id: 'GQ-003',
    requestedType: 'ugc',
    platform: ['TikTok'],
    targetCampaign: 'Transformation Series',
    briefDescription: 'POV-style reel: "My mom thought I bought real gold 😂" — showing gold-plated temple jewelry that looks authentic.',
    priority: 'medium',
    status: 'queued',
    estimatedCompletion: '2026-01-29T14:00:00Z',
  },
  {
    id: 'GQ-004',
    requestedType: 'static_image',
    platform: ['Pinterest'],
    targetCampaign: 'Gift Collection',
    briefDescription: 'Gift guide flat lay: 5 jewelry pieces arranged in a heart shape with personalized gift tags and ribbon.',
    priority: 'medium',
    status: 'ready',
    estimatedCompletion: '2026-01-28T12:00:00Z',
  },
  {
    id: 'GQ-005',
    requestedType: 'video_script',
    platform: ['YouTube'],
    targetCampaign: 'Brand Story',
    briefDescription: '2-minute brand documentary: from artisan workshop to customer unboxing. Voiceover about craftsmanship and heritage.',
    priority: 'low',
    status: 'reviewed',
    estimatedCompletion: '2026-01-27T18:00:00Z',
  },
  {
    id: 'GQ-006',
    requestedType: 'story',
    platform: ['Instagram'],
    targetCampaign: 'Summer Essentials',
    briefDescription: '3-story sequence: "Beach jewelry checklist" with interactive poll on favorite piece.',
    priority: 'low',
    status: 'queued',
    estimatedCompletion: '2026-01-30T10:00:00Z',
  },
];

// ------------------------------------------------------------------
// 8. Platform-Specific Suggestions
// ------------------------------------------------------------------

export const platformGuides: PlatformGuide[] = [
  {
    platform: 'Instagram',
    recommendedFormats: ['Reels (15-30s)', 'Carousels (5-10 slides)', 'Stories with polls', 'Single image with bold text'],
    optimalDimensions: [
      { name: 'Feed Post', size: '1080×1080' },
      { name: 'Reel', size: '1080×1920' },
      { name: 'Story', size: '1080×1920' },
      { name: 'Carousel', size: '1080×1080' },
    ],
    bestPerformingHooks: ['Emotional storytelling', 'Before/After transformations', '"Wait for it..." suspense', 'Customer testimonials', 'POV-style relatable content'],
    trendingStyles: ['Golden hour product photography', 'ASMR jewelry sounds', 'Stacking/mixing jewelry layers', 'Heritage meets modern aesthetic', 'Minimalist product on dark background'],
    dos: [
      'Use Reels for maximum reach — 67% more engagement than static posts',
      'Include captions on all videos — 85% watch without sound',
      'Post between 6-9 PM IST for highest engagement',
      'Use 5-8 relevant hashtags per post',
      'Leverage interactive Story features (polls, quizzes, sliders)',
    ],
    donts: [
      'Avoid low-resolution images — minimum 1080px width',
      'Do not use watermarked stock photos',
      'Avoid overly long captions on feed posts (keep under 2200 chars)',
      'Do not post more than 3-4 times per day',
      'Avoid generic product-only shots without lifestyle context',
    ],
  },
  {
    platform: 'Facebook',
    recommendedFormats: ['Carousel ads (5-7 cards)', 'Video ads (15-45s)', 'Collection ads', 'Lead generation forms with creative'],
    optimalDimensions: [
      { name: 'Feed Image', size: '1200×1200' },
      { name: 'Feed Video', size: '1280×720' },
      { name: 'Carousel', size: '1080×1080' },
      { name: 'Right Column', size: '1200×1200' },
    ],
    bestPerformingHooks: ['Social proof (reviews, ratings)', 'Discount urgency (limited time)', 'Educational content (buying guides)', 'Family/gift messaging'],
    trendingStyles: ['User-generated content style', 'Product bundles/sets', 'Comparison charts (before/after)', 'Trust badge overlays', 'Seasonal campaign themes'],
    dos: [
      'Use carousel format for multi-product campaigns — 34% lower CPC',
      'A/B test headlines and images independently',
      'Target lookalike audiences of top purchasers',
      'Include clear CTA buttons on all ad formats',
      'Use video thumbnails that spark curiosity',
    ],
    donts: [
      'Avoid text-heavy images (keep text under 20% of image area)',
      'Do not target audiences broader than your actual market',
      'Avoid using competitor names in ad copy',
      'Do not reuse creatives beyond 2-3 weeks without refresh',
      'Avoid misleading before/after images',
    ],
  },
  {
    platform: 'TikTok',
    recommendedFormats: ['UGC-style Reels (15-60s)', 'Before/After transitions', 'POV/skit format', 'Sound-on product showcases'],
    optimalDimensions: [
      { name: 'TikTok Video', size: '1080×1920' },
      { name: 'TikTok Ad', size: '1080×1920' },
      { name: 'Spark Ad', size: '1080×1920' },
    ],
    bestPerformingHooks: ['POV format ("POV: your friend notices your new ring")', 'Before/After transformations', 'Trending sound + product reveal', '"Wait for it..." suspense', 'Educational quick tips ("3 ways to style...")'],
    trendingStyles: ['ASMR jewelry sounds (clinking, unboxing)', 'Get ready with me (GRWM) + jewelry', 'Day-to-night jewelry transitions', 'Heritage jewelry cultural content', 'Sustainable/ethical jewelry messaging'],
    dos: [
      'Hook viewers in first 1-2 seconds — most users decide to scroll in 0.3s',
      'Use trending sounds and hashtags',
      'Keep videos between 15-30 seconds for best completion rate',
      'Show product being worn, not just product shots',
      'Add captions — 60% of TikTok users watch with sound on but captions help',
    ],
    donts: [
      'Do not use overly polished/branded content — TikTok rewards authenticity',
      'Avoid long intros — get to the point immediately',
      'Do not use watermarked content from other platforms',
      'Avoid posting more than 1-3 times per day',
      'Do not ignore comment engagement — reply to boost algorithm',
    ],
  },
  {
    platform: 'Pinterest',
    recommendedFormats: ['Standard Pin (2:3 ratio)', 'Idea Pins (multi-page)', 'Carousel Pins', 'Video Pins (15-30s)'],
    optimalDimensions: [
      { name: 'Standard Pin', size: '1000×1500' },
      { name: 'Idea Pin', size: '1080×1920' },
      { name: 'Carousel Pin', size: '1000×1500' },
      { name: 'Video Pin', size: '1080×1920' },
    ],
    bestPerformingHooks: ['Aesthetic flat lays', 'Gift guides and roundups', 'Seasonal trend boards', 'DIY/styling tutorials', 'Mood board collections'],
    trendingStyles: ['Warm tone aesthetic photography', 'Lifestyle flat lays with props', 'Sustainable jewelry content', 'Minimalist product photography', 'Bridal/wedding inspiration boards'],
    dos: [
      'Create evergreen content — Pinterest has 4x longer content lifespan',
      'Use keyword-rich descriptions (SEO matters)',
      'Design vertical images (2:3 ratio) for best visibility',
      'Include brand name in all Pin titles',
      'Create boards organized by occasion/style',
    ],
    donts: [
      'Avoid landscape or square images — vertical only',
      'Do not use low-quality or pixelated images',
      'Avoid product-only images without lifestyle context',
      'Do not ignore seasonal planning (plan 45 days ahead)',
      'Avoid linking to generic homepage — deep link to product pages',
    ],
  },
  {
    platform: 'YouTube',
    recommendedFormats: ['Shorts (15-60s)', 'Pre-roll ads (6-15s)', 'Mid-roll product placements', 'Tutorial/informational videos'],
    optimalDimensions: [
      { name: 'Standard Video', size: '1920×1080' },
      { name: 'Shorts', size: '1080×1920' },
      { name: 'Thumbnail', size: '1280×720' },
      { name: 'Channel Art', size: '2560×1440' },
    ],
    bestPerformingHooks: ['Educational (how-to, guides)', 'Behind-the-scenes craftsmanship', 'Expert/gemologist content', 'Comparison and review format', 'Storytelling brand narrative'],
    trendingStyles: ['Artisan workshop footage', 'Diamond education content', 'Customer story testimonials', 'ASMR jewelry making', 'Seasonal trend forecast videos'],
    dos: [
      'Invest in high-quality thumbnails — 90% of click-through decision',
      'Front-load value in first 5 seconds',
      'Use YouTube Shorts for discovery — fastest growing format',
      'Include end screens and cards for next steps',
      'Optimize titles with searchable keywords',
    ],
    donts: [
      'Do not create ads over 15 seconds for pre-roll (skip rate skyrockets)',
      'Avoid clickbait thumbnails that do not match content',
      'Do not neglect video SEO (tags, description, chapters)',
      'Avoid inconsistent posting schedule',
      'Do not use copyrighted music without license',
    ],
  },
];

// ------------------------------------------------------------------
// Helper Functions
// ------------------------------------------------------------------

export function getStatusColor(status: CreativeStatus): string {
  switch (status) {
    case 'active': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    case 'paused': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
    case 'in_review': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    case 'generating': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
    default: return 'text-muted-foreground';
  }
}

export function getStatusLabel(status: CreativeStatus): string {
  switch (status) {
    case 'active': return 'Active';
    case 'paused': return 'Paused';
    case 'rejected': return 'Rejected';
    case 'in_review': return 'In Review';
    case 'generating': return 'Generating';
    default: return status;
  }
}

export function getTypeBadgeVariant(type: CreativeType): 'default' | 'secondary' | 'outline' {
  switch (type) {
    case 'reel': return 'default';
    case 'ugc': return 'default';
    case 'static_image': return 'secondary';
    case 'carousel': return 'secondary';
    case 'video_script': return 'outline';
    case 'story': return 'outline';
    default: return 'outline';
  }
}

export function getTypeLabel(type: CreativeType): string {
  switch (type) {
    case 'static_image': return 'Image';
    case 'ugc': return 'UGC';
    case 'video_script': return 'Video';
    case 'carousel': return 'Carousel';
    case 'reel': return 'Reel';
    case 'story': return 'Story';
    default: return type;
  }
}

export function getTrendIcon(trend: TrendDirection): '↑' | '↓' | '→' {
  switch (trend) {
    case 'up': return '↑';
    case 'down': return '↓';
    case 'stable': return '→';
    default: return '→';
  }
}

export function getTrendColor(trend: TrendDirection): string {
  switch (trend) {
    case 'up': return 'text-emerald-500';
    case 'down': return 'text-red-500';
    case 'stable': return 'text-muted-foreground';
    default: return 'text-muted-foreground';
  }
}

export function getRecommendationBadge(rec: Recommendation): { label: string; color: string } {
  switch (rec) {
    case 'scale_up': return { label: 'Scale Up', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' };
    case 'maintain': return { label: 'Maintain', color: 'bg-blue-500/10 text-blue-600 border-blue-500/30' };
    case 'test_more': return { label: 'Test More', color: 'bg-amber-500/10 text-amber-600 border-amber-500/30' };
    case 'stop': return { label: 'Stop', color: 'bg-red-500/10 text-red-600 border-red-500/30' };
    default: return { label: rec, color: 'bg-muted text-muted-foreground' };
  }
}

export function getConfidenceColor(score: number): string {
  if (score >= 90) return 'text-emerald-500';
  if (score >= 80) return 'text-blue-500';
  if (score >= 70) return 'text-amber-500';
  return 'text-red-500';
}

export function getConfidenceBg(score: number): string {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 80) return 'bg-blue-500';
  if (score >= 70) return 'bg-amber-500';
  return 'bg-red-500';
}

export function getPlatformIcon(platform: Platform): string {
  switch (platform) {
    case 'Instagram': return '📷';
    case 'Facebook': return '👤';
    case 'TikTok': return '🎵';
    case 'Pinterest': return '📌';
    case 'YouTube': return '▶️';
    default: return '📱';
  }
}

export function getPlatformBadgeColor(platform: Platform): string {
  switch (platform) {
    case 'Instagram': return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
    case 'Facebook': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'TikTok': return 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20';
    case 'Pinterest': return 'bg-red-500/10 text-red-600 border-red-500/20';
    case 'YouTube': return 'bg-red-500/10 text-red-500 border-red-500/20';
    default: return 'bg-muted text-muted-foreground';
  }
}
