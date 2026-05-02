// ============================================================
// VARNI JEWELS — Agency Command Center Data
// Mock data for multi-client agency management
// ============================================================

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ClientAccount {
  id: string;
  name: string;
  industry: string;
  brandColor: string;
  status: 'active' | 'paused' | 'trial';
  monthlyRetainer: number;
  totalSpendManaged: number;
  totalRevenue: number;
  avgROAS: number;
  healthScore: number;
  lastAudit: string;
  alertCount: number;
  primaryContact: string;
  email: string;
  phone: string;
}

export interface BulkAuditResult {
  clientName: string;
  accountType: 'google_ads' | 'meta_ads' | 'seo' | 'website';
  auditDate: string;
  overallScore: number;
  issuesFound: number;
  criticalIssues: number;
  warnings: number;
  topRecommendation: string;
  estimatedWasteSaved: number;
}

export interface HealthScoreEntry {
  clientName: string;
  overallHealth: number;
  adPerformance: number;
  seoHealth: number;
  contentHealth: number;
  creativeHealth: number;
  trend: 'up' | 'down' | 'stable';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface WhiteLabelReport {
  id: string;
  clientName: string;
  reportType: 'weekly_performance' | 'monthly_review' | 'quarterly_strategy';
  period: string;
  status: 'generating' | 'ready' | 'sent';
  generatedAt: string;
  sentAt: string;
  deliveryMethod: 'email' | 'slack' | 'portal';
  openRate: number;
  sections: string[];
}

export interface BulkAction {
  id: string;
  action: string;
  affectedClients: string[];
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'approved' | 'rejected' | 'executing' | 'completed';
  impact: string;
  deadline: string;
}

export interface BudgetAllocation {
  clientName: string;
  currentMonthlyBudget: number;
  recommendedBudget: number;
  reallocationAmount: number;
  reason: string;
  projectedImpact: string;
}

export interface AgencyPerformance {
  totalClients: number;
  totalManagedSpend: number;
  averageROAS: number;
  totalRevenueGenerated: number;
  clientRetentionRate: number;
  netNewClientsThisMonth: number;
  churnRiskClients: number;
  upcomingRenewals: number;
}

export interface ClientPortalSetting {
  clientName: string;
  portalEnabled: boolean;
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
  };
  customDomain: string;
  accessibleModules: string[];
  loginLink: string;
  lastClientLogin: string;
}

/* ------------------------------------------------------------------ */
/*  1. Client Accounts                                                 */
/* ------------------------------------------------------------------ */

export const clientAccounts: ClientAccount[] = [
  {
    id: 'clt-001',
    name: 'Luxe Diamond Co.',
    industry: 'Fine Jewelry',
    brandColor: '#8B5CF6',
    status: 'active',
    monthlyRetainer: 8000,
    totalSpendManaged: 342000,
    totalRevenue: 1860000,
    avgROAS: 5.4,
    healthScore: 92,
    lastAudit: '2026-01-14',
    alertCount: 1,
    primaryContact: 'Anita Sharma',
    email: 'anita@luxediamonds.com',
    phone: '+91 98765 43210',
  },
  {
    id: 'clt-002',
    name: 'Royal Goldsmiths',
    industry: 'Luxury Gold',
    brandColor: '#F59E0B',
    status: 'active',
    monthlyRetainer: 6500,
    totalSpendManaged: 278000,
    totalRevenue: 1245000,
    avgROAS: 4.5,
    healthScore: 85,
    lastAudit: '2026-01-13',
    alertCount: 3,
    primaryContact: 'Rajesh Patel',
    email: 'rajesh@royalgoldsmiths.in',
    phone: '+91 87654 32109',
  },
  {
    id: 'clt-003',
    name: 'Silver Essence',
    industry: 'Sterling Silver',
    brandColor: '#6366F1',
    status: 'active',
    monthlyRetainer: 4500,
    totalSpendManaged: 156000,
    totalRevenue: 624000,
    avgROAS: 4.0,
    healthScore: 78,
    lastAudit: '2026-01-12',
    alertCount: 5,
    primaryContact: 'Priya Kapoor',
    email: 'priya@silveressence.com',
    phone: '+91 76543 21098',
  },
  {
    id: 'clt-004',
    name: 'GemStone Gallery',
    industry: 'Precious Stones',
    brandColor: '#EC4899',
    status: 'trial',
    monthlyRetainer: 3000,
    totalSpendManaged: 45000,
    totalRevenue: 157500,
    avgROAS: 3.5,
    healthScore: 68,
    lastAudit: '2026-01-11',
    alertCount: 7,
    primaryContact: 'Vikram Desai',
    email: 'vikram@gemstonegallery.in',
    phone: '+91 65432 10987',
  },
  {
    id: 'clt-005',
    name: 'Heritage Pearls',
    industry: 'Pearl Jewelry',
    brandColor: '#14B8A6',
    status: 'active',
    monthlyRetainer: 5500,
    totalSpendManaged: 198000,
    totalRevenue: 891000,
    avgROAS: 4.5,
    healthScore: 81,
    lastAudit: '2026-01-10',
    alertCount: 2,
    primaryContact: 'Meera Iyer',
    email: 'meera@heritagepearls.com',
    phone: '+91 54321 09876',
  },
  {
    id: 'clt-006',
    name: 'Modern Bridal',
    industry: 'Bridal Jewelry',
    brandColor: '#F43F5E',
    status: 'active',
    monthlyRetainer: 7000,
    totalSpendManaged: 312000,
    totalRevenue: 1404000,
    avgROAS: 4.5,
    healthScore: 88,
    lastAudit: '2026-01-14',
    alertCount: 2,
    primaryContact: 'Kavita Reddy',
    email: 'kavita@modernbridal.in',
    phone: '+91 43210 98765',
  },
  {
    id: 'clt-007',
    name: 'Platinum Elegance',
    industry: 'Platinum Jewelry',
    brandColor: '#8B8B8B',
    status: 'paused',
    monthlyRetainer: 5000,
    totalSpendManaged: 167000,
    totalRevenue: 668000,
    avgROAS: 4.0,
    healthScore: 55,
    lastAudit: '2025-12-28',
    alertCount: 9,
    primaryContact: 'Arjun Menon',
    email: 'arjun@platinumelegance.com',
    phone: '+91 32109 87654',
  },
  {
    id: 'clt-008',
    name: 'Crystal Aura',
    industry: 'Fashion Jewelry',
    brandColor: '#A855F7',
    status: 'trial',
    monthlyRetainer: 2500,
    totalSpendManaged: 28000,
    totalRevenue: 84000,
    avgROAS: 3.0,
    healthScore: 62,
    lastAudit: '2026-01-09',
    alertCount: 4,
    primaryContact: 'Sneha Nair',
    email: 'sneha@crystalaura.co',
    phone: '+91 21098 76543',
  },
];

/* ------------------------------------------------------------------ */
/*  2. Bulk Audit Results                                              */
/* ------------------------------------------------------------------ */

export const bulkAuditResults: BulkAuditResult[] = [
  {
    clientName: 'Luxe Diamond Co.',
    accountType: 'google_ads',
    auditDate: '2026-01-14',
    overallScore: 94,
    issuesFound: 3,
    criticalIssues: 0,
    warnings: 1,
    topRecommendation: 'Add negative keywords for "cheap" and "discount" search terms',
    estimatedWasteSaved: 2400,
  },
  {
    clientName: 'Luxe Diamond Co.',
    accountType: 'meta_ads',
    auditDate: '2026-01-14',
    overallScore: 91,
    issuesFound: 4,
    criticalIssues: 1,
    warnings: 2,
    topRecommendation: 'Refresh creative assets showing fatigue signals (freq > 3.5)',
    estimatedWasteSaved: 3800,
  },
  {
    clientName: 'Royal Goldsmiths',
    accountType: 'google_ads',
    auditDate: '2026-01-13',
    overallScore: 82,
    issuesFound: 7,
    criticalIssues: 2,
    warnings: 3,
    topRecommendation: 'Fix conversion tracking mismatch on checkout page',
    estimatedWasteSaved: 5600,
  },
  {
    clientName: 'Royal Goldsmiths',
    accountType: 'seo',
    auditDate: '2026-01-13',
    overallScore: 76,
    issuesFound: 12,
    criticalIssues: 1,
    warnings: 5,
    topRecommendation: 'Fix 4 broken product pages returning 404 errors',
    estimatedWasteSaved: 0,
  },
  {
    clientName: 'Silver Essence',
    accountType: 'google_ads',
    auditDate: '2026-01-12',
    overallScore: 71,
    issuesFound: 9,
    criticalIssues: 2,
    warnings: 4,
    topRecommendation: 'Reallocate $2K from Display to Shopping campaigns',
    estimatedWasteSaved: 4100,
  },
  {
    clientName: 'Silver Essence',
    accountType: 'website',
    auditDate: '2026-01-12',
    overallScore: 65,
    issuesFound: 14,
    criticalIssues: 3,
    warnings: 6,
    topRecommendation: 'Fix Core Web Vitals — LCP > 4s on product pages',
    estimatedWasteSaved: 0,
  },
  {
    clientName: 'GemStone Gallery',
    accountType: 'meta_ads',
    auditDate: '2026-01-11',
    overallScore: 58,
    issuesFound: 18,
    criticalIssues: 5,
    warnings: 8,
    topRecommendation: 'Restructure ad campaigns — overlapping audiences detected',
    estimatedWasteSaved: 7200,
  },
  {
    clientName: 'GemStone Gallery',
    accountType: 'seo',
    auditDate: '2026-01-11',
    overallScore: 52,
    issuesFound: 22,
    criticalIssues: 4,
    warnings: 10,
    topRecommendation: 'Complete site migration cleanup — 16 redirect chains found',
    estimatedWasteSaved: 0,
  },
  {
    clientName: 'Heritage Pearls',
    accountType: 'google_ads',
    auditDate: '2026-01-10',
    overallScore: 85,
    issuesFound: 5,
    criticalIssues: 0,
    warnings: 3,
    topRecommendation: 'Enable Performance Max for seasonal pearl collection',
    estimatedWasteSaved: 1800,
  },
  {
    clientName: 'Modern Bridal',
    accountType: 'meta_ads',
    auditDate: '2026-01-14',
    overallScore: 89,
    issuesFound: 4,
    criticalIssues: 0,
    warnings: 2,
    topRecommendation: 'Scale winning "Wedding Season" campaign by 30%',
    estimatedWasteSaved: 1200,
  },
  {
    clientName: 'Modern Bridal',
    accountType: 'seo',
    auditDate: '2026-01-14',
    overallScore: 83,
    issuesFound: 8,
    criticalIssues: 1,
    warnings: 4,
    topRecommendation: 'Add FAQ schema to top 10 product pages',
    estimatedWasteSaved: 0,
  },
  {
    clientName: 'Platinum Elegance',
    accountType: 'google_ads',
    auditDate: '2025-12-28',
    overallScore: 48,
    issuesFound: 24,
    criticalIssues: 7,
    warnings: 11,
    topRecommendation: 'Complete account restructuring needed — campaigns misaligned with goals',
    estimatedWasteSaved: 12000,
  },
  {
    clientName: 'Crystal Aura',
    accountType: 'website',
    auditDate: '2026-01-09',
    overallScore: 55,
    issuesFound: 16,
    criticalIssues: 3,
    warnings: 7,
    topRecommendation: 'Implement lazy loading and optimize images on collection pages',
    estimatedWasteSaved: 0,
  },
];

/* ------------------------------------------------------------------ */
/*  3. Health Scores                                                   */
/* ------------------------------------------------------------------ */

export const healthScores: HealthScoreEntry[] = [
  {
    clientName: 'Luxe Diamond Co.',
    overallHealth: 92,
    adPerformance: 95,
    seoHealth: 90,
    contentHealth: 91,
    creativeHealth: 93,
    trend: 'up',
    riskLevel: 'low',
  },
  {
    clientName: 'Modern Bridal',
    overallHealth: 88,
    adPerformance: 90,
    seoHealth: 83,
    contentHealth: 92,
    creativeHealth: 86,
    trend: 'stable',
    riskLevel: 'low',
  },
  {
    clientName: 'Royal Goldsmiths',
    overallHealth: 85,
    adPerformance: 82,
    seoHealth: 76,
    contentHealth: 88,
    creativeHealth: 94,
    trend: 'down',
    riskLevel: 'medium',
  },
  {
    clientName: 'Heritage Pearls',
    overallHealth: 81,
    adPerformance: 85,
    seoHealth: 78,
    contentHealth: 80,
    creativeHealth: 81,
    trend: 'stable',
    riskLevel: 'low',
  },
  {
    clientName: 'Silver Essence',
    overallHealth: 78,
    adPerformance: 71,
    seoHealth: 82,
    contentHealth: 79,
    creativeHealth: 80,
    trend: 'down',
    riskLevel: 'medium',
  },
  {
    clientName: 'GemStone Gallery',
    overallHealth: 68,
    adPerformance: 58,
    seoHealth: 52,
    contentHealth: 74,
    creativeHealth: 88,
    trend: 'down',
    riskLevel: 'high',
  },
  {
    clientName: 'Crystal Aura',
    overallHealth: 62,
    adPerformance: 60,
    seoHealth: 55,
    contentHealth: 68,
    creativeHealth: 65,
    trend: 'stable',
    riskLevel: 'high',
  },
  {
    clientName: 'Platinum Elegance',
    overallHealth: 55,
    adPerformance: 48,
    seoHealth: 52,
    contentHealth: 58,
    creativeHealth: 62,
    trend: 'down',
    riskLevel: 'critical',
  },
];

/* ------------------------------------------------------------------ */
/*  4. White-Label Reports                                             */
/* ------------------------------------------------------------------ */

export const whiteLabelReports: WhiteLabelReport[] = [
  {
    id: 'rpt-001',
    clientName: 'Luxe Diamond Co.',
    reportType: 'weekly_performance',
    period: 'Jan 8 — Jan 14, 2026',
    status: 'sent',
    generatedAt: '2026-01-14T09:00:00',
    sentAt: '2026-01-14T09:15:00',
    deliveryMethod: 'email',
    openRate: 78,
    sections: ['executive_summary', 'ad_performance', 'seo_update', 'content_report', 'recommendations'],
  },
  {
    id: 'rpt-002',
    clientName: 'Royal Goldsmiths',
    reportType: 'weekly_performance',
    period: 'Jan 8 — Jan 14, 2026',
    status: 'sent',
    generatedAt: '2026-01-14T09:05:00',
    sentAt: '2026-01-14T09:10:00',
    deliveryMethod: 'email',
    openRate: 92,
    sections: ['executive_summary', 'ad_performance', 'recommendations'],
  },
  {
    id: 'rpt-003',
    clientName: 'Modern Bridal',
    reportType: 'monthly_review',
    period: 'December 2025',
    status: 'ready',
    generatedAt: '2026-01-13T14:00:00',
    sentAt: '',
    deliveryMethod: 'portal',
    openRate: 0,
    sections: ['executive_summary', 'ad_performance', 'seo_update', 'content_report', 'recommendations'],
  },
  {
    id: 'rpt-004',
    clientName: 'Silver Essence',
    reportType: 'monthly_review',
    period: 'December 2025',
    status: 'ready',
    generatedAt: '2026-01-13T14:30:00',
    sentAt: '',
    deliveryMethod: 'slack',
    openRate: 0,
    sections: ['executive_summary', 'ad_performance', 'content_report'],
  },
  {
    id: 'rpt-005',
    clientName: 'Luxe Diamond Co.',
    reportType: 'quarterly_strategy',
    period: 'Q4 2025',
    status: 'sent',
    generatedAt: '2026-01-02T10:00:00',
    sentAt: '2026-01-02T10:30:00',
    deliveryMethod: 'email',
    openRate: 100,
    sections: ['executive_summary', 'ad_performance', 'seo_update', 'content_report', 'recommendations'],
  },
  {
    id: 'rpt-006',
    clientName: 'Heritage Pearls',
    reportType: 'weekly_performance',
    period: 'Jan 8 — Jan 14, 2026',
    status: 'generating',
    generatedAt: '2026-01-14T09:30:00',
    sentAt: '',
    deliveryMethod: 'email',
    openRate: 0,
    sections: ['executive_summary', 'ad_performance', 'recommendations'],
  },
  {
    id: 'rpt-007',
    clientName: 'GemStone Gallery',
    reportType: 'monthly_review',
    period: 'December 2025',
    status: 'ready',
    generatedAt: '2026-01-12T11:00:00',
    sentAt: '',
    deliveryMethod: 'portal',
    openRate: 0,
    sections: ['executive_summary', 'ad_performance', 'seo_update', 'content_report', 'recommendations'],
  },
  {
    id: 'rpt-008',
    clientName: 'Crystal Aura',
    reportType: 'weekly_performance',
    period: 'Jan 8 — Jan 14, 2026',
    status: 'generating',
    generatedAt: '2026-01-14T09:45:00',
    sentAt: '',
    deliveryMethod: 'slack',
    openRate: 0,
    sections: ['executive_summary', 'ad_performance'],
  },
  {
    id: 'rpt-009',
    clientName: 'Platinum Elegance',
    reportType: 'quarterly_strategy',
    period: 'Q4 2025',
    status: 'ready',
    generatedAt: '2026-01-05T16:00:00',
    sentAt: '',
    deliveryMethod: 'email',
    openRate: 0,
    sections: ['executive_summary', 'ad_performance', 'recommendations'],
  },
  {
    id: 'rpt-010',
    clientName: 'Modern Bridal',
    reportType: 'weekly_performance',
    period: 'Jan 8 — Jan 14, 2026',
    status: 'sent',
    generatedAt: '2026-01-14T08:50:00',
    sentAt: '2026-01-14T09:00:00',
    deliveryMethod: 'portal',
    openRate: 65,
    sections: ['executive_summary', 'ad_performance', 'seo_update', 'content_report'],
  },
];

/* ------------------------------------------------------------------ */
/*  5. Bulk Actions                                                    */
/* ------------------------------------------------------------------ */

export const bulkActions: BulkAction[] = [
  {
    id: 'act-001',
    action: 'Pause underperforming Display campaigns across accounts',
    affectedClients: ['Silver Essence', 'GemStone Gallery', 'Crystal Aura'],
    category: 'Budget Optimization',
    priority: 'high',
    status: 'pending',
    impact: 'Estimated $8,400/month savings',
    deadline: '2026-01-16',
  },
  {
    id: 'act-002',
    action: 'Apply negative keyword lists to all Google Ads accounts',
    affectedClients: ['Luxe Diamond Co.', 'Royal Goldsmiths', 'Silver Essence', 'Heritage Pearls', 'Modern Bridal'],
    category: 'Keyword Management',
    priority: 'medium',
    status: 'approved',
    impact: 'Reduce wasted spend by ~$15,000/month',
    deadline: '2026-01-17',
  },
  {
    id: 'act-003',
    action: 'Fix conversion tracking pixel duplication on checkout pages',
    affectedClients: ['Royal Goldsmiths', 'Platinum Elegance'],
    category: 'Tracking & Analytics',
    priority: 'critical',
    status: 'pending',
    impact: 'Accurate attribution for ~2,400 monthly conversions',
    deadline: '2026-01-15',
  },
  {
    id: 'act-004',
    action: 'Refresh creative assets for campaigns with frequency > 3.5',
    affectedClients: ['Luxe Diamond Co.', 'Modern Bridal', 'Heritage Pearls'],
    category: 'Creative',
    priority: 'medium',
    status: 'executing',
    impact: 'Projected 18% CTR improvement',
    deadline: '2026-01-20',
  },
  {
    id: 'act-005',
    action: 'Update all Meta pixel to latest API version (v19.0)',
    affectedClients: ['Luxe Diamond Co.', 'Royal Goldsmiths', 'GemStone Gallery', 'Modern Bridal', 'Heritage Pearls', 'Crystal Aura'],
    category: 'Technical',
    priority: 'high',
    status: 'completed',
    impact: 'Prevents data loss from deprecated API',
    deadline: '2026-01-14',
  },
  {
    id: 'act-006',
    action: 'Implement automated bid strategy for top 5 ROAS campaigns',
    affectedClients: ['Luxe Diamond Co.', 'Modern Bridal', 'Heritage Pearls'],
    category: 'Bid Management',
    priority: 'medium',
    status: 'pending',
    impact: 'Estimate 12% efficiency improvement',
    deadline: '2026-01-22',
  },
  {
    id: 'act-007',
    action: 'Launch Performance Max campaigns for seasonal collections',
    affectedClients: ['Heritage Pearls', 'Modern Bridal', 'Silver Essence'],
    category: 'Campaign Launch',
    priority: 'low',
    status: 'pending',
    impact: 'Projected $45,000 additional revenue in Q1',
    deadline: '2026-01-25',
  },
  {
    id: 'act-008',
    action: 'Complete website speed optimization for mobile LCP > 3s',
    affectedClients: ['Silver Essence', 'GemStone Gallery', 'Crystal Aura'],
    category: 'Website Performance',
    priority: 'critical',
    status: 'pending',
    impact: 'Estimate 25% improvement in mobile conversion rate',
    deadline: '2026-01-18',
  },
  {
    id: 'act-009',
    action: 'Consolidate duplicate ad groups in Google Ads accounts',
    affectedClients: ['GemStone Gallery', 'Platinum Elegance'],
    category: 'Account Structure',
    priority: 'high',
    status: 'pending',
    impact: 'Improve Quality Score by avg 1.2 points',
    deadline: '2026-01-19',
  },
  {
    id: 'act-010',
    action: 'Set up automated weekly report delivery for all active clients',
    affectedClients: ['Luxe Diamond Co.', 'Royal Goldsmiths', 'Silver Essence', 'Heritage Pearls', 'Modern Bridal'],
    category: 'Reporting',
    priority: 'low',
    status: 'completed',
    impact: 'Save 4 hours/week in manual reporting',
    deadline: '2026-01-13',
  },
];

/* ------------------------------------------------------------------ */
/*  6. Budget Allocation                                               */
/* ------------------------------------------------------------------ */

export const budgetAllocations: BudgetAllocation[] = [
  {
    clientName: 'Luxe Diamond Co.',
    currentMonthlyBudget: 28000,
    recommendedBudget: 32000,
    reallocationAmount: 4000,
    reason: 'Q1 bridal season demand — strong ROAS trends (5.4x) justify increased spend',
    projectedImpact: '+$21,600 estimated additional revenue',
  },
  {
    clientName: 'Royal Goldsmiths',
    currentMonthlyBudget: 24000,
    recommendedBudget: 20000,
    reallocationAmount: -4000,
    reason: 'Display campaigns underperforming (ROAS 1.8x) — reallocate to Shopping',
    projectedImpact: '+$7,200 savings, reinvest in Shopping for +$14,400 revenue',
  },
  {
    clientName: 'Silver Essence',
    currentMonthlyBudget: 14000,
    recommendedBudget: 12000,
    reallocationAmount: -2000,
    reason: 'Website speed issues reducing conversion rate — fix first, then scale',
    projectedImpact: 'Fix performance issues first for better ROI on spend',
  },
  {
    clientName: 'GemStone Gallery',
    currentMonthlyBudget: 6000,
    recommendedBudget: 4000,
    reallocationAmount: -2000,
    reason: 'Trial phase — focus on account structure fixes before scaling spend',
    projectedImpact: '+$2,400 savings while fixing critical account issues',
  },
  {
    clientName: 'Heritage Pearls',
    currentMonthlyBudget: 18000,
    recommendedBudget: 22000,
    reallocationAmount: 4000,
    reason: 'Seasonal pearl demand in Q1 — Performance Max showing strong early signals',
    projectedImpact: '+$18,000 estimated additional revenue',
  },
  {
    clientName: 'Modern Bridal',
    currentMonthlyBudget: 26000,
    recommendedBudget: 30000,
    reallocationAmount: 4000,
    reason: 'Wedding season approaching — scale winning campaigns by 15%',
    projectedImpact: '+$27,000 estimated additional revenue',
  },
  {
    clientName: 'Platinum Elegance',
    currentMonthlyBudget: 12000,
    recommendedBudget: 5000,
    reallocationAmount: -7000,
    reason: 'Account paused — minimize spend while onboarding new team contact',
    projectedImpact: '$7,000 savings during transition period',
  },
  {
    clientName: 'Crystal Aura',
    currentMonthlyBudget: 4000,
    recommendedBudget: 5000,
    reallocationAmount: 1000,
    reason: 'Trial phase showing promise — small increase to validate full potential',
    projectedImpact: '+$3,000 estimated additional revenue',
  },
];

/* ------------------------------------------------------------------ */
/*  7. Agency Performance                                              */
/* ------------------------------------------------------------------ */

export const agencyPerformance: AgencyPerformance = {
  totalClients: 8,
  totalManagedSpend: 1525000,
  averageROAS: 4.2,
  totalRevenueGenerated: 6938000,
  clientRetentionRate: 87.5,
  netNewClientsThisMonth: 2,
  churnRiskClients: 2,
  upcomingRenewals: 3,
};

/* ------------------------------------------------------------------ */
/*  8. Client Portal Settings                                          */
/* ------------------------------------------------------------------ */

export const clientPortalSettings: ClientPortalSetting[] = [
  {
    clientName: 'Luxe Diamond Co.',
    portalEnabled: true,
    branding: { logo: '/logos/luxe-diamonds.svg', primaryColor: '#8B5CF6', secondaryColor: '#A78BFA' },
    customDomain: 'reports.luxediamonds.com',
    accessibleModules: ['dashboard', 'analytics', 'campaigns', 'reports', 'invoices'],
    loginLink: 'https://reports.luxediamonds.com/login',
    lastClientLogin: '2026-01-14T08:45:00',
  },
  {
    clientName: 'Royal Goldsmiths',
    portalEnabled: true,
    branding: { logo: '/logos/royal-goldsmiths.svg', primaryColor: '#F59E0B', secondaryColor: '#FBBF24' },
    customDomain: 'portal.royalgoldsmiths.in',
    accessibleModules: ['dashboard', 'analytics', 'reports'],
    loginLink: 'https://portal.royalgoldsmiths.in/login',
    lastClientLogin: '2026-01-14T07:30:00',
  },
  {
    clientName: 'Silver Essence',
    portalEnabled: true,
    branding: { logo: '/logos/silver-essence.svg', primaryColor: '#6366F1', secondaryColor: '#818CF8' },
    customDomain: '',
    accessibleModules: ['dashboard', 'reports'],
    loginLink: 'https://agency.varnijewels.com/portal/silver-essence',
    lastClientLogin: '2026-01-12T14:20:00',
  },
  {
    clientName: 'GemStone Gallery',
    portalEnabled: true,
    branding: { logo: '/logos/gemstone-gallery.svg', primaryColor: '#EC4899', secondaryColor: '#F472B6' },
    customDomain: '',
    accessibleModules: ['dashboard', 'analytics', 'reports', 'invoices'],
    loginLink: 'https://agency.varnijewels.com/portal/gemstone-gallery',
    lastClientLogin: '2026-01-10T11:15:00',
  },
  {
    clientName: 'Heritage Pearls',
    portalEnabled: false,
    branding: { logo: '/logos/heritage-pearls.svg', primaryColor: '#14B8A6', secondaryColor: '#2DD4BF' },
    customDomain: '',
    accessibleModules: ['dashboard', 'reports'],
    loginLink: '',
    lastClientLogin: '',
  },
  {
    clientName: 'Modern Bridal',
    portalEnabled: true,
    branding: { logo: '/logos/modern-bridal.svg', primaryColor: '#F43F5E', secondaryColor: '#FB7185' },
    customDomain: 'dashboard.modernbridal.in',
    accessibleModules: ['dashboard', 'analytics', 'campaigns', 'reports', 'invoices', 'support'],
    loginLink: 'https://dashboard.modernbridal.in/login',
    lastClientLogin: '2026-01-14T09:10:00',
  },
  {
    clientName: 'Platinum Elegance',
    portalEnabled: false,
    branding: { logo: '/logos/platinum-elegance.svg', primaryColor: '#8B8B8B', secondaryColor: '#A3A3A3' },
    customDomain: '',
    accessibleModules: ['dashboard'],
    loginLink: '',
    lastClientLogin: '2025-12-28T16:00:00',
  },
  {
    clientName: 'Crystal Aura',
    portalEnabled: false,
    branding: { logo: '/logos/crystal-aura.svg', primaryColor: '#A855F7', secondaryColor: '#C084FC' },
    customDomain: '',
    accessibleModules: ['dashboard', 'reports'],
    loginLink: '',
    lastClientLogin: '',
  },
];

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                   */
/* ------------------------------------------------------------------ */

export function getHealthScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
}

export function getHealthScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

export function getHealthScoreRing(score: number): string {
  if (score >= 80) return 'stroke-emerald-500';
  if (score >= 60) return 'stroke-amber-500';
  return 'stroke-red-500';
}

export function getRiskBadgeClass(level: string): string {
  switch (level) {
    case 'low': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
    case 'medium': return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
    case 'high': return 'bg-orange-500/15 text-orange-500 border-orange-500/30';
    case 'critical': return 'bg-red-500/15 text-red-500 border-red-500/30';
    default: return '';
  }
}

export function getTrendIcon(trend: string): string {
  switch (trend) {
    case 'up': return '↑';
    case 'down': return '↓';
    default: return '→';
  }
}

export function getTrendColor(trend: string): string {
  switch (trend) {
    case 'up': return 'text-emerald-500';
    case 'down': return 'text-red-500';
    default: return 'text-muted-foreground';
  }
}

export function getPriorityBadge(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-500/15 text-red-500 border-red-500/30';
    case 'high': return 'bg-orange-500/15 text-orange-500 border-orange-500/30';
    case 'medium': return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
    case 'low': return 'bg-sky-500/15 text-sky-500 border-sky-500/30';
    default: return '';
  }
}

export function getStatusBadge(status: string): string {
  switch (status) {
    case 'active': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
    case 'paused': return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
    case 'trial': return 'bg-sky-500/15 text-sky-500 border-sky-500/30';
    case 'generating': return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
    case 'ready': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
    case 'sent': return 'bg-sky-500/15 text-sky-500 border-sky-500/30';
    case 'pending': return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
    case 'approved': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
    case 'rejected': return 'bg-red-500/15 text-red-500 border-red-500/30';
    case 'executing': return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
    case 'completed': return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
    default: return '';
  }
}

export function getAccountTypeLabel(type: string): string {
  switch (type) {
    case 'google_ads': return 'Google Ads';
    case 'meta_ads': return 'Meta Ads';
    case 'seo': return 'SEO';
    case 'website': return 'Website';
    default: return type;
  }
}

export function getReportTypeLabel(type: string): string {
  switch (type) {
    case 'weekly_performance': return 'Weekly Performance';
    case 'monthly_review': return 'Monthly Review';
    case 'quarterly_strategy': return 'Quarterly Strategy';
    default: return type;
  }
}

export function getDeliveryMethodIcon(method: string): string {
  switch (method) {
    case 'email': return '📧';
    case 'slack': return '💬';
    case 'portal': return '🌐';
    default: return '📋';
  }
}

export function getAuditScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
}
