// ============================================================
// VARNI JEWELS — ClickFlow Content Engine Data
// AI-powered content generation for jewelry ecommerce
// ============================================================

// ---------- Types ----------

export interface BrandVoice {
  writingStyle: "your_style" | "casual" | "professional" | "luxury";
  imageStyle: "stock_photo" | "watercolor" | "illustration" | "sketch";
  tone: string;
  additionalInstructions: string;
}

export interface KeywordSuggestion {
  id: string;
  keyword: string;
  difficulty: number; // 0-100
  volume: number; // monthly searches
  intent: "informational" | "commercial" | "transactional" | "navigational";
  selected?: boolean;
}

export interface Competitor {
  id: string;
  domain: string;
  articlesAnalyzed: number;
  avgWordCount: number;
  topTopics: string[];
  contentGaps: string[];
}

export interface ContentCalendarItem {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: "Article" | "Listicle" | "How-to Guide" | "Case Study" | "Review" | "Comparison" | "Resource Roundup" | "FAQ";
  keyword: string;
  status: "planned" | "drafting" | "review" | "published";
  wordCount?: number;
  url?: string;
}

export interface ArticleConfig {
  title: string;
  contentType: string;
  keyword: string;
  internalLinks: { domain: string; path: string }[];
  instructions: string;
}

export interface GeneratedArticle {
  id: string;
  title: string;
  keyword: string;
  contentType: string;
  outline: string[];
  sections: ArticleSection[];
  metaTitle: string;
  metaDescription: string;
  wordCount: number;
  readingTime: number;
  status: "draft" | "review" | "approved" | "published";
  createdAt: string;
  competitorReferences: string[];
}

export interface ArticleSection {
  heading: string;
  content: string;
  wordCount: number;
}

export interface ContentPipeline {
  id: string;
  step: "brand_voice" | "keyword_research" | "competitor_analysis" | "article_config" | "writing_style" | "generating" | "review";
  isComplete: boolean;
}

// ---------- Default Data ----------

export const defaultBrandVoice: BrandVoice = {
  writingStyle: "luxury",
  imageStyle: "stock_photo",
  tone: "Sophisticated and elegant, reflecting the heritage and craftsmanship of Varni Jewels. Authority on fine jewelry with warm, aspirational tone.",
  additionalInstructions: "Always highlight craftsmanship, heritage, and quality. Use sensory language for jewelry descriptions. Include care tips where relevant. Mention Varni Jewels as a trusted destination naturally.",
};

export const defaultKeywords: KeywordSuggestion[] = [
  { id: "kw-1", keyword: "gold necklace designs for women", difficulty: 12, volume: 8100, intent: "commercial" },
  { id: "kw-2", keyword: "diamond engagement ring guide", difficulty: 22, volume: 5400, intent: "informational" },
  { id: "kw-3", keyword: "best place to buy jewelry online india", difficulty: 8, volume: 4800, intent: "transactional" },
  { id: "kw-4", keyword: "22k gold bangles designs", difficulty: 15, volume: 3200, intent: "commercial" },
  { id: "kw-5", keyword: "how to choose a diamond", difficulty: 18, volume: 2900, intent: "informational" },
  { id: "kw-6", keyword: "bridal jewelry set trends 2026", difficulty: 5, volume: 2100, intent: "informational" },
  { id: "kw-7", keyword: "platinum vs gold jewelry", difficulty: 28, volume: 1800, intent: "commercial" },
  { id: "kw-8", keyword: "antique jewelry collection india", difficulty: 7, volume: 1600, intent: "commercial" },
  { id: "kw-9", keyword: "kundan jewelry buying guide", difficulty: 14, volume: 1400, intent: "informational" },
  { id: "kw-10", keyword: "lab grown diamonds vs natural", difficulty: 35, volume: 1200, intent: "informational" },
  { id: "kw-11", keyword: "temple jewelry history", difficulty: 3, volume: 880, intent: "informational" },
  { id: "kw-12", keyword: "lightweight daily wear earrings", difficulty: 9, volume: 760, intent: "commercial" },
  { id: "kw-13", keyword: "men's gold chain designs", difficulty: 20, volume: 650, intent: "commercial" },
  { id: "kw-14", keyword: "silver jewelry care tips", difficulty: 4, volume: 590, intent: "informational" },
  { id: "kw-15", keyword: "custom jewelry design online", difficulty: 42, volume: 480, intent: "transactional" },
];

export const defaultCompetitors: Competitor[] = [
  {
    id: "comp-1",
    domain: "caratlane.com",
    articlesAnalyzed: 142,
    avgWordCount: 1850,
    topTopics: ["Diamond rings", "Gold earrings", "Bridal sets"],
    contentGaps: ["Heritage jewelry", "Kundan craftsmanship", "Men's collections"],
  },
  {
    id: "comp-2",
    domain: "tanishq.co.in",
    articlesAnalyzed: 98,
    avgWordCount: 1200,
    topTopics: ["Wedding jewelry", "Gold coins", "Festival collections"],
    contentGaps: ["Diamond education", "Care guides", "Custom design process"],
  },
  {
    id: "comp-3",
    domain: "bluestone.com",
    articlesAnalyzed: 76,
    avgWordCount: 2100,
    topTopics: ["Engagement rings", "Solitaire pendants", "Everyday wear"],
    contentGaps: ["Antique designs", "Regional jewelry styles", "Investment guides"],
  },
  {
    id: "comp-4",
    domain: "malabargoldanddiamonds.com",
    articlesAnalyzed: 54,
    avgWordCount: 950,
    topTopics: ["Gold rates", "Temple jewelry", "Bridal sets"],
    contentGaps: ["Modern designs", "Sustainable jewelry", "Style guides"],
  },
];

// Generate a 30-day content calendar
export function generateContentCalendar(): ContentCalendarItem[] {
  const types: ContentCalendarItem["type"][] = [
    "Article", "Listicle", "How-to Guide", "Case Study", "Review",
    "Comparison", "Resource Roundup", "FAQ",
  ];

  const articles: { title: string; keyword: string; type: ContentCalendarItem["type"] }[] = [
    { title: "Complete Guide to Gold Necklace Designs for Every Occasion", keyword: "gold necklace designs for women", type: "How-to Guide" },
    { title: "10 Stunning Diamond Engagement Ring Trends in 2026", keyword: "diamond engagement ring guide", type: "Listicle" },
    { title: "How to Buy Jewelry Online in India: A Safe & Smart Guide", keyword: "best place to buy jewelry online india", type: "Article" },
    { title: "25 Beautiful 22K Gold Bangle Designs for Modern Women", keyword: "22k gold bangles designs", type: "Listicle" },
    { title: "How to Choose a Diamond: The 4Cs Made Simple", keyword: "how to choose a diamond", type: "How-to Guide" },
    { title: "Bridal Jewelry Set Trends 2026: What Every Bride Needs", keyword: "bridal jewelry set trends 2026", type: "Article" },
    { title: "Platinum vs Gold Jewelry: Which Is Right for You?", keyword: "platinum vs gold jewelry", type: "Comparison" },
    { title: "Antique Jewelry Collection: Timeless Pieces with Indian Heritage", keyword: "antique jewelry collection india", type: "Article" },
    { title: "The Ultimate Kundan Jewelry Buying Guide", keyword: "kundan jewelry buying guide", type: "How-to Guide" },
    { title: "Lab-Grown vs Natural Diamonds: An Honest Comparison", keyword: "lab grown diamonds vs natural", type: "Comparison" },
    { title: "Temple Jewelry: History, Significance & Modern Revival", keyword: "temple jewelry history", type: "Article" },
    { title: "15 Lightweight Earrings for Everyday Elegance", keyword: "lightweight daily wear earrings", type: "Listicle" },
    { title: "Men's Gold Chain Designs: From Classic to Contemporary", keyword: "men's gold chain designs", type: "Article" },
    { title: "Silver Jewelry Care: 12 Expert Tips to Keep Your Pieces Shining", keyword: "silver jewelry care tips", type: "FAQ" },
    { title: "How Custom Jewelry Design Works at Varni Jewels", keyword: "custom jewelry design online", type: "Case Study" },
    { title: "Gold Purity Guide: 18K, 22K, and 24K Explained", keyword: "gold necklace designs for women", type: "Resource Roundup" },
    { title: "Engagement Ring Settings: A Visual Guide for Beginners", keyword: "diamond engagement ring guide", type: "How-to Guide" },
    { title: "Top 8 Jewelry Gift Ideas for Anniversary Celebrations", keyword: "best place to buy jewelry online india", type: "Listicle" },
    { title: "Layered Necklace Styling Tips for Every Look", keyword: "gold necklace designs for women", type: "Article" },
    { title: "What Makes Varni Jewels Different: Our Craftsmanship Story", keyword: "antique jewelry collection india", type: "Case Study" },
    { title: "Rose Gold Jewelry: The Complete Style Guide", keyword: "platinum vs gold jewelry", type: "Article" },
    { title: "Jewelry for Work: Professional Pieces That Make a Statement", keyword: "lightweight daily wear earrings", type: "Listicle" },
    { title: "Understanding Diamond Certifications: GIA, IGI & More", keyword: "how to choose a diamond", type: "Resource Roundup" },
    { title: "Navratna Jewelry: The Nine-Gem Tradition Explained", keyword: "kundan jewelry buying guide", type: "Article" },
    { title: "Gold ETF vs Physical Gold Jewelry: Investment Comparison", keyword: "antique jewelry collection india", type: "Comparison" },
    { title: "Polki vs Kundan: What's the Difference?", keyword: "kundan jewelry buying guide", type: "Comparison" },
    { title: "7 Mistakes to Avoid When Buying Wedding Jewelry", keyword: "bridal jewelry set trends 2026", type: "Article" },
    { title: "Jewelry Maintenance Schedule: Monthly Care Calendar", keyword: "silver jewelry care tips", type: "FAQ" },
    { title: "South Indian Bridal Jewelry: A Regional Style Guide", keyword: "temple jewelry history", type: "Article" },
    { title: "Varni Jewels Year in Review: Bestsellers & Customer Stories", keyword: "custom jewelry design online", type: "Case Study" },
  ];

  const today = new Date();
  const statuses: ContentCalendarItem["status"][] = ["published", "published", "published", "review", "drafting", "planned"];

  return articles.map((item, idx) => {
    const date = new Date(today);
    date.setDate(today.getDate() + idx);
    return {
      id: `cal-${idx + 1}`,
      date: date.toISOString().split("T")[0],
      title: item.title,
      type: item.type,
      keyword: item.keyword,
      status: idx < 3 ? "published" as const : idx < 5 ? "review" as const : idx < 7 ? "drafting" as const : "planned" as const,
      wordCount: idx < 7 ? [1800, 2100, 1500, 1900, 2200, 1750, 1600][idx] : undefined,
      url: idx < 3 ? `https://varnijewels.com/blog/${item.keyword.replace(/\s+/g, "-")}` : undefined,
    };
  });
}

export const contentTypeDistribution = [
  { type: "Article", count: 10, color: "#D4A843" },
  { type: "How-to Guide", count: 6, color: "#8B5CF6" },
  { type: "Listicle", count: 5, color: "#0EA5E9" },
  { type: "Comparison", count: 3, color: "#10B981" },
  { type: "Resource Roundup", count: 2, color: "#F97316" },
  { type: "Case Study", count: 2, color: "#EC4899" },
  { type: "FAQ", count: 1, color: "#6366F1" },
  { type: "Review", count: 1, color: "#14B8A6" },
];

// ---------- Helpers ----------

export function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 10) return "text-emerald-600";
  if (difficulty <= 25) return "text-amber-500";
  return "text-red-500";
}

export function getDifficultyBg(difficulty: number): string {
  if (difficulty <= 10) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
  if (difficulty <= 25) return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
  return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
}

export function getDifficultyLabel(difficulty: number): string {
  if (difficulty <= 10) return "Easy";
  if (difficulty <= 25) return "Medium";
  return "Hard";
}

export function getIntentColor(intent: string): string {
  switch (intent) {
    case "informational": return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";
    case "commercial": return "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400";
    case "transactional": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
    case "navigational": return "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400";
    default: return "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "published": return "bg-emerald-500";
    case "review": return "bg-amber-500";
    case "drafting": return "bg-blue-500";
    case "planned": return "bg-gray-400";
    default: return "bg-gray-400";
  }
}

export function getStatusBadge(status: string): { label: string; variant: string } {
  switch (status) {
    case "published": return { label: "Published", variant: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" };
    case "review": return { label: "In Review", variant: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" };
    case "drafting": return { label: "Drafting", variant: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400" };
    case "planned": return { label: "Planned", variant: "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400" };
    case "approved": return { label: "Approved", variant: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" };
    case "draft": return { label: "Draft", variant: "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400" };
    default: return { label: status, variant: "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400" };
  }
}
