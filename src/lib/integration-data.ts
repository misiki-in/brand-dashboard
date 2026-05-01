// ============================================================
// VARNI JEWELS — Integration Data
// Mock data for Slack/Teams Bot & Free Audit modules
// ============================================================

// ===================================================================
// SECTION 1: Slack/Teams Bot
// ===================================================================

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type BotPlatform = 'slack' | 'teams';
export type ChannelType = 'performance_alerts' | 'daily_summary' | 'weekly_review' | 'action_approvals' | 'general';
export type MessageIntent = 'performance_query' | 'action_request' | 'report_generation' | 'account_info' | 'general';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type AutomationFrequency = 'daily' | 'weekly' | 'monthly';
export type AutomationStatus = 'active' | 'paused';

export interface ConnectedChannel {
  id: string;
  platform: BotPlatform;
  channelName: string;
  type: ChannelType;
  memberCount: number;
  lastActivity: string;
  messageCount: number;
  activeMembers: number;
}

export interface ConversationEntry {
  id: string;
  timestamp: string;
  user: string;
  message: string;
  botResponse: string;
  intent: MessageIntent;
  confidence: number;
  actionTaken: string;
}

export interface AutomatedMessage {
  id: string;
  type: string;
  frequency: AutomationFrequency;
  channels: string[];
  contentPreview: string;
  lastSent: string;
  nextScheduled: string;
  status: AutomationStatus;
  engagement: {
    avgReactions: number;
    avgReplies: number;
  };
}

export interface QuickCommand {
  command: string;
  description: string;
  example: string;
  category: string;
  requiresAuth: boolean;
}

export interface ActionApproval {
  id: string;
  action: string;
  detail: string;
  requestedBy: string;
  requestedAt: string;
  platform: BotPlatform;
  status: ApprovalStatus;
  channel: string;
}

// ------------------------------------------------------------------
// 1. Connected Channels
// ------------------------------------------------------------------

export const connectedChannels: ConnectedChannel[] = [
  { id: 'CH-001', platform: 'slack', channelName: '#perf-alerts', type: 'performance_alerts', memberCount: 8, lastActivity: '2 min ago', messageCount: 342, activeMembers: 6 },
  { id: 'CH-002', platform: 'slack', channelName: '#daily-digest', type: 'daily_summary', memberCount: 12, lastActivity: '8 hours ago', messageCount: 89, activeMembers: 9 },
  { id: 'CH-003', platform: 'slack', channelName: '#weekly-review', type: 'weekly_review', memberCount: 15, lastActivity: '3 days ago', messageCount: 156, activeMembers: 12 },
  { id: 'CH-004', platform: 'slack', channelName: '#action-approvals', type: 'action_approvals', memberCount: 5, lastActivity: '15 min ago', messageCount: 67, activeMembers: 4 },
  { id: 'CH-005', platform: 'slack', channelName: '#general', type: 'general', memberCount: 24, lastActivity: '1 hour ago', messageCount: 1204, activeMembers: 18 },
  { id: 'CH-006', platform: 'teams', channelName: 'Marketing Alerts', type: 'performance_alerts', memberCount: 10, lastActivity: '30 min ago', messageCount: 198, activeMembers: 7 },
  { id: 'CH-007', platform: 'teams', channelName: 'Daily Standup', type: 'daily_summary', memberCount: 8, lastActivity: '10 hours ago', messageCount: 42, activeMembers: 5 },
  { id: 'CH-008', platform: 'teams', channelName: 'Budget Approvals', type: 'action_approvals', memberCount: 4, lastActivity: '45 min ago', messageCount: 28, activeMembers: 3 },
];

// ------------------------------------------------------------------
// 2. Conversation History
// ------------------------------------------------------------------

export const conversationHistory: ConversationEntry[] = [
  {
    id: 'CONV-001',
    timestamp: '2026-01-15T09:12:00Z',
    user: 'Priya Sharma',
    message: "What's our Google Ads ROAS today?",
    botResponse: 'Google Ads ROAS for today stands at **4.2x**, up 8% from yesterday. Top-performing campaign: "Diamond Rings — Shopping" at 6.1x ROAS. Total conversions: 142 (+$18,900 revenue). Would you like a detailed breakdown?',
    intent: 'performance_query',
    confidence: 0.96,
    actionTaken: 'Retrieved real-time Google Ads performance data',
  },
  {
    id: 'CONV-002',
    timestamp: '2026-01-15T09:45:00Z',
    user: 'Rahul Verma',
    message: 'Pause the TikTok TopView campaign, budget is overspending',
    botResponse: 'I\'ve found the TikTok TopView campaign. It\'s currently 109% over budget ($9,800 of $9,000 monthly limit). To pause this campaign, please confirm by clicking "Approve" below. This will immediately stop all ad delivery.',
    intent: 'action_request',
    confidence: 0.92,
    actionTaken: 'Awaiting approval to pause TikTok TopView campaign',
  },
  {
    id: 'CONV-003',
    timestamp: '2026-01-15T10:30:00Z',
    user: 'Anita Desai',
    message: 'Generate this week\'s paid media report',
    botResponse: 'Weekly Paid Media Report (Jan 8–15) is ready! **Total Spend**: $24,850 | **Blended ROAS**: 3.4x | **Conversions**: 1,247 | **Revenue**: $84,490. I\'ve uploaded the full PDF report. Key highlight: Meta retargeting outperformed by 42% vs last week.',
    intent: 'report_generation',
    confidence: 0.98,
    actionTaken: 'Generated and uploaded weekly paid media report PDF',
  },
  {
    id: 'CONV-004',
    timestamp: '2026-01-15T11:15:00Z',
    user: 'Vikram Patel',
    message: 'How many cart abandonment recovery messages went out today?',
    botResponse: 'Today\'s cart abandonment recovery stats: **WhatsApp**: 347 messages sent (12% conversion, 42 recovered) | **Email**: 892 emails sent (8.2% conversion, 73 recovered) | **Total Revenue Recovered**: $6,840. Open rate: WhatsApp 89%, Email 42%.',
    intent: 'account_info',
    confidence: 0.94,
    actionTaken: 'Retrieved cart abandonment recovery statistics',
  },
  {
    id: 'CONV-005',
    timestamp: '2026-01-15T14:00:00Z',
    user: 'Neha Gupta',
    message: 'Which products are running low on stock?',
    botResponse: '⚠️ **3 products** below reorder point: 1) Gold Bangle Set SKU-GB-042 — 12 units left (reorder at 20) 2) Pearl Necklace SKU-PN-018 — 8 units left (reorder at 15) 3) Silver Anklet SKU-SA-067 — 3 units left (reorder at 25). Should I create purchase orders for these?',
    intent: 'performance_query',
    confidence: 0.97,
    actionTaken: 'Checked inventory levels against reorder thresholds',
  },
  {
    id: 'CONV-006',
    timestamp: '2026-01-15T15:20:00Z',
    user: 'Arjun Mehta',
    message: 'Schedule a budget increase for Valentine campaign to $200/day',
    botResponse: 'Valentine Collection campaign budget increase requested: **Current**: $120/day → **New**: $200/day (+67%). This will require approval from a team admin. I\'ve sent the approval request to #action-approvals channel. Estimated additional spend: $2,800 over remaining 14 days.',
    intent: 'action_request',
    confidence: 0.91,
    actionTaken: 'Budget increase request sent for admin approval',
  },
  {
    id: 'CONV-007',
    timestamp: '2026-01-15T16:10:00Z',
    user: 'Deepa Nair',
    message: 'Show me the top 5 performing creatives this month',
    botResponse: 'Top 5 Creatives by ROAS (January): 1) 💍 "Everlasting Diamond Ring" — ROAS 7.2x, 89K impressions 2) ✨ "Gold Necklace Close-up" — ROAS 5.8x, 142K impressions 3) 🌹 "Valentine Proposal" — ROAS 5.1x, 210K impressions 4) 👑 "Temple Collection" — ROAS 4.6x, 67K impressions 5) 💫 "Silver Sparkle" — ROAS 4.2x, 95K impressions',
    intent: 'performance_query',
    confidence: 0.95,
    actionTaken: 'Ranked creatives by ROAS for current month',
  },
  {
    id: 'CONV-008',
    timestamp: '2026-01-15T17:00:00Z',
    user: 'Karthik Reddy',
    message: 'What time are we getting the most conversions?',
    botResponse: 'Peak conversion windows (last 30 days): 🕐 **6 PM – 9 PM IST**: 38% of daily conversions, avg CPA $14.20 | 🕐 **12 PM – 2 PM IST**: 22% of daily conversions, avg CPA $18.60 | 🕐 **9 PM – 11 PM IST**: 15% of daily conversions, avg CPA $16.80. Recommendation: Increase bids by 30% during 6-9 PM window.',
    intent: 'performance_query',
    confidence: 0.93,
    actionTaken: 'Analyzed conversion patterns by time of day',
  },
];

// ------------------------------------------------------------------
// 3. Automated Messages
// ------------------------------------------------------------------

export const automatedMessages: AutomatedMessage[] = [
  {
    id: 'AUTO-001',
    type: 'Performance Alert',
    frequency: 'daily',
    channels: ['#perf-alerts', 'Marketing Alerts'],
    contentPreview: '📊 Daily Performance Summary — ROAS 3.4x, $24.8K spend, 1,247 conversions across all platforms',
    lastSent: '2026-01-15T09:00:00Z',
    nextScheduled: '2026-01-16T09:00:00Z',
    status: 'active',
    engagement: { avgReactions: 4.2, avgReplies: 1.8 },
  },
  {
    id: 'AUTO-002',
    type: 'Budget Overspend Alert',
    frequency: 'daily',
    channels: ['#action-approvals'],
    contentPreview: '⚠️ Budget Alert: TikTok TopView is at 109% of monthly budget ($9.8K / $9K). Recommend pausing.',
    lastSent: '2026-01-15T08:30:00Z',
    nextScheduled: '2026-01-16T08:30:00Z',
    status: 'active',
    engagement: { avgReactions: 2.1, avgReplies: 3.4 },
  },
  {
    id: 'AUTO-003',
    type: 'Weekly Marketing Review',
    frequency: 'weekly',
    channels: ['#weekly-review', 'Daily Standup'],
    contentPreview: '📋 Weekly Review: Revenue $84.5K (+12% WoW), Top Channel: Google Shopping, Issues: 3 critical findings',
    lastSent: '2026-01-13T10:00:00Z',
    nextScheduled: '2026-01-20T10:00:00Z',
    status: 'active',
    engagement: { avgReactions: 6.8, avgReplies: 4.2 },
  },
  {
    id: 'AUTO-004',
    type: 'Inventory Reorder Alert',
    frequency: 'daily',
    channels: ['#perf-alerts'],
    contentPreview: '📦 3 products below reorder point: Gold Bangle Set (12 left), Pearl Necklace (8 left), Silver Anklet (3 left)',
    lastSent: '2026-01-15T07:00:00Z',
    nextScheduled: '2026-01-16T07:00:00Z',
    status: 'active',
    engagement: { avgReactions: 1.5, avgReplies: 0.8 },
  },
  {
    id: 'AUTO-005',
    type: 'Creative Fatigue Warning',
    frequency: 'weekly',
    channels: ['#perf-alerts'],
    contentPreview: '🎨 4 creatives showing frequency > 4.0x in Valentine campaign. CTR dropped 42%. Recommend rotation.',
    lastSent: '2026-01-14T11:00:00Z',
    nextScheduled: '2026-01-21T11:00:00Z',
    status: 'active',
    engagement: { avgReactions: 3.2, avgReplies: 2.1 },
  },
  {
    id: 'AUTO-006',
    type: 'Monthly KPI Report',
    frequency: 'monthly',
    channels: ['#weekly-review', '#general'],
    contentPreview: '📈 January KPI Report: Revenue $342K, ROAS 3.8x, 5,420 conversions, 12,890 new leads generated',
    lastSent: '2025-12-31T10:00:00Z',
    nextScheduled: '2026-01-31T10:00:00Z',
    status: 'active',
    engagement: { avgReactions: 8.4, avgReplies: 5.6 },
  },
  {
    id: 'AUTO-007',
    type: 'Competitor Price Alert',
    frequency: 'weekly',
    channels: ['#perf-alerts', 'Marketing Alerts'],
    contentPreview: '🔍 CaratLane launched 15% discount on diamond rings. BlueStone running free shipping campaign.',
    lastSent: '2026-01-12T14:00:00Z',
    nextScheduled: '2026-01-19T14:00:00Z',
    status: 'paused',
    engagement: { avgReactions: 5.1, avgReplies: 3.8 },
  },
  {
    id: 'AUTO-008',
    type: 'New Audit Request Summary',
    frequency: 'daily',
    channels: ['#general'],
    contentPreview: '📩 4 new free audit requests today: 2 jewelry brands, 1 fashion, 1 home decor. Avg lead score: 72/100',
    lastSent: '2026-01-15T18:00:00Z',
    nextScheduled: '2026-01-16T18:00:00Z',
    status: 'active',
    engagement: { avgReactions: 2.8, avgReplies: 1.2 },
  },
];

// ------------------------------------------------------------------
// 4. Quick Commands
// ------------------------------------------------------------------

export const quickCommands: QuickCommand[] = [
  { command: '/roas', description: 'Get current ROAS across all platforms', example: '/roas today', category: 'Performance', requiresAuth: false },
  { command: '/spend', description: 'View ad spend breakdown by channel', example: '/spend this week', category: 'Performance', requiresAuth: false },
  { command: '/conversions', description: 'Show conversion count and trend', example: '/conversions google', category: 'Performance', requiresAuth: false },
  { command: '/inventory', description: 'Check stock levels and reorder alerts', example: '/inventory low', category: 'Operations', requiresAuth: false },
  { command: '/report', description: 'Generate and share a report', example: '/report weekly paid-media', category: 'Reports', requiresAuth: false },
  { command: '/pause', description: 'Pause a campaign or ad group', example: '/pause TikTok TopView', category: 'Actions', requiresAuth: true },
  { command: '/resume', description: 'Resume a paused campaign', example: '/resume Valentine Collection', category: 'Actions', requiresAuth: true },
  { command: '/budget', description: 'View or modify campaign budgets', example: '/budget set Valentine $200/day', category: 'Actions', requiresAuth: true },
  { command: '/creative', description: 'View top-performing creatives', example: '/creative top 5', category: 'Creative', requiresAuth: false },
  { command: '/sentiment', description: 'Get brand sentiment overview', example: '/sentiment this week', category: 'Brand', requiresAuth: false },
  { command: '/seo', description: 'Quick SEO health check', example: '/seo keywords', category: 'SEO', requiresAuth: false },
  { command: '/audits', description: 'View free audit requests', example: '/audits pending', category: 'Sales', requiresAuth: true },
];

// ------------------------------------------------------------------
// 5. Action Approvals via Chat
// ------------------------------------------------------------------

export const actionApprovals: ActionApproval[] = [
  {
    id: 'APR-001',
    action: 'Pause Campaign',
    detail: 'Pause TikTok TopView campaign — overspending at 109% of monthly budget ($9.8K / $9K)',
    requestedBy: 'Rahul Verma',
    requestedAt: '2026-01-15T09:45:00Z',
    platform: 'slack',
    status: 'pending',
    channel: '#action-approvals',
  },
  {
    id: 'APR-002',
    action: 'Increase Budget',
    detail: 'Increase Valentine Collection daily budget from $120 to $200/day (+67%) for remaining 14 days',
    requestedBy: 'Arjun Mehta',
    requestedAt: '2026-01-15T15:20:00Z',
    platform: 'teams',
    status: 'pending',
    channel: 'Budget Approvals',
  },
  {
    id: 'APR-003',
    action: 'Create Purchase Order',
    detail: 'Auto-reorder 3 items below reorder point: Gold Bangle Set (50 units), Pearl Necklace (30 units), Silver Anklet (40 units)',
    requestedBy: 'Bot (Auto-reorder)',
    requestedAt: '2026-01-15T07:05:00Z',
    platform: 'slack',
    status: 'pending',
    channel: '#action-approvals',
  },
  {
    id: 'APR-004',
    action: 'Apply Bid Recommendation',
    detail: 'Apply AI bid recommendation: Diamond Rings Shopping — increase bid from $4.50 to $6.80 (estimated +35% conversions)',
    requestedBy: 'Bot (AI Suggestion)',
    requestedAt: '2026-01-15T08:00:00Z',
    platform: 'teams',
    status: 'pending',
    channel: 'Budget Approvals',
  },
  {
    id: 'APR-005',
    action: 'Rotate Creative',
    detail: 'Rotate 4 fatigued creatives in Valentine campaign (frequency > 4.0x, CTR dropped 42%)',
    requestedBy: 'Priya Sharma',
    requestedAt: '2026-01-15T11:30:00Z',
    platform: 'slack',
    status: 'approved',
    channel: '#action-approvals',
  },
  {
    id: 'APR-006',
    action: 'Add Negative Keywords',
    detail: 'Bulk add 15 negative keywords across Google Ads (est. savings $1,850/month)',
    requestedBy: 'Neha Gupta',
    requestedAt: '2026-01-14T16:00:00Z',
    platform: 'slack',
    status: 'approved',
    channel: '#action-approvals',
  },
  {
    id: 'APR-007',
    action: 'Enable Cross-Platform Tracking',
    detail: 'Enable Google Ads enhanced conversions + TikTok ViewThrough attribution (fix 30% missing attribution)',
    requestedBy: 'Vikram Patel',
    requestedAt: '2026-01-13T10:00:00Z',
    platform: 'teams',
    status: 'rejected',
    channel: 'Budget Approvals',
  },
  {
    id: 'APR-008',
    action: 'Launch Win-Back Campaign',
    detail: 'Activate win-back sequence for 2,340 dormant customers (90+ days inactive) via WhatsApp + Email',
    requestedBy: 'Deepa Nair',
    requestedAt: '2026-01-12T14:00:00Z',
    platform: 'slack',
    status: 'expired',
    channel: '#action-approvals',
  },
];

// ------------------------------------------------------------------
// Helper Functions — Slack/Teams Bot
// ------------------------------------------------------------------

export function getChannelTypeBadge(type: ChannelType): { label: string; color: string } {
  const map: Record<ChannelType, { label: string; color: string }> = {
    performance_alerts: { label: 'Alerts', color: 'text-red-400 bg-red-500/15 border-red-500/30' },
    daily_summary: { label: 'Daily', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
    weekly_review: { label: 'Weekly', color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' },
    action_approvals: { label: 'Approvals', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
    general: { label: 'General', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  };
  return map[type];
}

export function getIntentBadge(intent: MessageIntent): { label: string; color: string } {
  const map: Record<MessageIntent, { label: string; color: string }> = {
    performance_query: { label: 'Query', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' },
    action_request: { label: 'Action', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
    report_generation: { label: 'Report', color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' },
    account_info: { label: 'Info', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
    general: { label: 'General', color: 'text-muted-foreground bg-muted border-muted-foreground/30' },
  };
  return map[intent];
}

export function getApprovalStatusColor(status: ApprovalStatus): string {
  const map: Record<ApprovalStatus, string> = {
    pending: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    approved: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    rejected: 'text-red-400 bg-red-500/15 border-red-500/30',
    expired: 'text-muted-foreground bg-muted border-muted-foreground/30',
  };
  return map[status];
}

export function getFrequencyLabel(freq: AutomationFrequency): string {
  const map: Record<AutomationFrequency, string> = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
  };
  return map[freq];
}

export function getCommandCategoryColor(cat: string): string {
  const map: Record<string, string> = {
    Performance: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    Operations: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    Reports: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    Actions: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    Creative: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
    Brand: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
    SEO: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
    Sales: 'text-teal-400 bg-teal-500/15 border-teal-500/30',
  };
  return map[cat] || 'text-muted-foreground bg-muted border-muted-foreground/30';
}

export function getPlatformBadge(platform: BotPlatform): { label: string; color: string } {
  if (platform === 'slack') {
    return { label: 'Slack', color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' };
  }
  return { label: 'Teams', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' };
}


// ===================================================================
// SECTION 2: Free Audit
// ===================================================================

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type AuditRequestStatus = 'pending' | 'processing' | 'completed' | 'delivered';
export type AuditType = 'full' | 'ads_only' | 'seo_only' | 'website_only';
export type FindingSeverity = 'critical' | 'warning' | 'info';
export type LeadRecommendation = 'high_priority' | 'nurture' | 'low_priority';

export interface AuditRequest {
  id: string;
  email: string;
  company: string;
  website: string;
  requestDate: string;
  status: AuditRequestStatus;
  auditType: AuditType;
  completionDate?: string;
  deliveredVia?: string;
}

export interface AuditFinding {
  category: string;
  severity: FindingSeverity;
  title: string;
  description: string;
  recommendation: string;
  estImpact: string;
}

export interface AuditResult {
  requestId: string;
  overallScore: number;
  categoryScores: {
    ads_health: number;
    seo_health: number;
    site_health: number;
    tracking_health: number;
  };
  topFindings: AuditFinding[];
  wastedSpend: number;
  totalIssues: number;
}

export interface ConversionFunnelStage {
  stage: string;
  count: number;
  conversionRate: number;
}

export interface LeadSignal {
  company_size: string;
  industry_fit: string;
  budget_indicator: string;
  urgency: string;
}

export interface LeadScore {
  requestId: string;
  leadScore: number;
  signals: LeadSignal;
  recommendation: LeadRecommendation;
  followUpAction: string;
}

// ------------------------------------------------------------------
// 1. Audit Requests
// ------------------------------------------------------------------

export const auditRequests: AuditRequest[] = [
  { id: 'AUD-R001', email: 'sarah@bluerosejewelry.com', company: 'Blue Rose Jewelry', website: 'bluerosejewelry.com', requestDate: '2026-01-10', status: 'delivered', auditType: 'full', completionDate: '2026-01-12', deliveredVia: 'email' },
  { id: 'AUD-R002', email: 'contact@diamondcrown.in', company: 'Diamond Crown', website: 'diamondcrown.in', requestDate: '2026-01-11', status: 'delivered', auditType: 'full', completionDate: '2026-01-13', deliveredVia: 'email' },
  { id: 'AUD-R003', email: 'hello@golden threads.com', company: 'Golden Threads', website: 'goldenthreads.in', requestDate: '2026-01-12', status: 'completed', auditType: 'ads_only', completionDate: '2026-01-14' },
  { id: 'AUD-R004', email: 'info@jewelvista.com', company: 'Jewel Vista', website: 'jewelvista.com', requestDate: '2026-01-13', status: 'processing', auditType: 'full' },
  { id: 'AUD-R005', email: 'admin@sparklehouse.co', company: 'Sparkle House', website: 'sparklehouse.co', requestDate: '2026-01-13', status: 'processing', auditType: 'seo_only' },
  { id: 'AUD-R006', email: 'hi@luxeornaments.com', company: 'Luxe Ornaments', website: 'luxeornaments.com', requestDate: '2026-01-14', status: 'pending', auditType: 'full' },
  { id: 'AUD-R007', email: 'sales@pearlparadise.in', company: 'Pearl Paradise', website: 'pearlparadise.in', requestDate: '2026-01-14', status: 'pending', auditType: 'website_only' },
  { id: 'AUD-R008', email: 'support@radiantgems.co.uk', company: 'Radiant Gems', website: 'radiantgems.co.uk', requestDate: '2026-01-14', status: 'pending', auditType: 'ads_only' },
  { id: 'AUD-R009', email: 'hello@chicaccessories.com', company: 'Chic Accessories', website: 'chicaccessories.com', requestDate: '2026-01-15', status: 'pending', auditType: 'full' },
  { id: 'AUD-R010', email: 'info@royalcrafts.com', company: 'Royal Crafts', website: 'royalcrafts.com', requestDate: '2026-01-15', status: 'pending', auditType: 'seo_only' },
  { id: 'AUD-R011', email: 'contact@shimmerstone.com', company: 'Shimmer Stone', website: 'shimmerstone.com', requestDate: '2026-01-15', status: 'pending', auditType: 'full' },
  { id: 'AUD-R012', email: 'hello@fashionnova-jewels.com', company: 'Fashion Nova Jewels', website: 'fashionnova-jewels.com', requestDate: '2026-01-15', status: 'pending', auditType: 'ads_only' },
];

// ------------------------------------------------------------------
// 2. Audit Results
// ------------------------------------------------------------------

export const auditResults: AuditResult[] = [
  {
    requestId: 'AUD-R001',
    overallScore: 42,
    categoryScores: { ads_health: 38, seo_health: 45, site_health: 52, tracking_health: 33 },
    topFindings: [
      { category: 'Ads Health', severity: 'critical', title: 'Google Shopping feed missing 40% of products', description: 'Product feed has not been updated in 3 weeks. 120 of 300 products are missing from Shopping campaigns.', recommendation: 'Refresh product feed and set up automated daily feed updates', estImpact: '$8,200/month in missed sales' },
      { category: 'Ads Health', severity: 'critical', title: 'No negative keywords on any campaign', description: 'Google and Meta campaigns have zero negative keywords. 34% of ad spend is on irrelevant clicks.', recommendation: 'Import negative keyword list and add top 50 irrelevant terms', estImpact: '$3,400/month savings' },
      { category: 'SEO Health', severity: 'warning', title: 'No schema markup on product pages', description: 'Product pages lack structured data, resulting in no rich snippets in Google search results.', recommendation: 'Implement Product schema with price, availability, and review markup', estImpact: '+18% CTR from search results' },
      { category: 'Tracking Health', severity: 'critical', title: 'Purchase conversion pixel misconfigured', description: 'GA4 and ad platform pixels are not tracking purchases correctly. Only 60% of transactions are recorded.', recommendation: 'Fix pixel implementation and enable server-side tracking', estImpact: '40% ROAS data currently inaccurate' },
      { category: 'Site Health', severity: 'warning', title: 'Mobile page speed score: 34/100', description: 'Product page load time on mobile averages 6.2 seconds. Product images are not optimized.', recommendation: 'Compress images, implement lazy loading, and defer non-critical JS', estImpact: '+25% mobile conversion rate' },
    ],
    wastedSpend: 11600,
    totalIssues: 23,
  },
  {
    requestId: 'AUD-R002',
    overallScore: 58,
    categoryScores: { ads_health: 62, seo_health: 55, site_health: 60, tracking_health: 55 },
    topFindings: [
      { category: 'Ads Health', severity: 'warning', title: 'Meta retargeting audience too small', description: 'Cart abandoner audience has only 340 users — below minimum for effective delivery.', recommendation: 'Expand retargeting window to 30 days and add website visitors audience', estImpact: '+45% retargeting reach' },
      { category: 'SEO Health', severity: 'warning', title: '12 pages with duplicate meta descriptions', description: 'Category and product pages share identical meta descriptions, diluting SEO effectiveness.', recommendation: 'Write unique meta descriptions for each page with primary keyword', estImpact: '+8% organic CTR' },
      { category: 'Site Health', severity: 'info', title: 'Missing HTTPS on 3 subdomains', description: 'Blog, support, and careers subdomains still use HTTP.', recommendation: 'Install SSL certificates on all subdomains and force HTTPS redirect', estImpact: 'Improved security and trust signals' },
      { category: 'Tracking Health', severity: 'warning', title: 'Enhanced conversions not enabled', description: 'Google Ads missing enhanced conversion data, losing cross-device attribution.', recommendation: 'Enable enhanced conversions in Google Ads settings', estImpact: '+30% attributed conversions' },
    ],
    wastedSpend: 4800,
    totalIssues: 14,
  },
  {
    requestId: 'AUD-R003',
    overallScore: 31,
    categoryScores: { ads_health: 28, seo_health: 0, site_health: 0, tracking_health: 65 },
    topFindings: [
      { category: 'Ads Health', severity: 'critical', title: 'Google Ads ROAS below 1.0x', description: 'All active campaigns have ROAS of 0.7x, meaning the business is losing money on every sale through ads.', recommendation: 'Pause all campaigns, audit keyword targeting, and rebuild with tCPA strategy', estImpact: '$12,000/month currently being lost' },
      { category: 'Ads Health', severity: 'critical', title: 'Max CPC set to $45 on branded terms', description: 'Branded keyword bids are extremely high with no competitors bidding on brand terms.', recommendation: 'Reduce branded CPC to $2-3 and allocate budget to non-brand campaigns', estImpact: '$6,800/month savings' },
      { category: 'Tracking Health', severity: 'info', title: 'Conversion value not tracked', description: 'Google Ads tracks conversions but not revenue value, preventing ROAS optimization.', recommendation: 'Set up dynamic conversion value tracking', estImpact: 'Enable Smart Bidding strategies' },
    ],
    wastedSpend: 18800,
    totalIssues: 9,
  },
];

// ------------------------------------------------------------------
// 3. Conversion Funnel
// ------------------------------------------------------------------

export const conversionFunnel: ConversionFunnelStage[] = [
  { stage: 'Audit Requested', count: 247, conversionRate: 100 },
  { stage: 'Audit Delivered', count: 198, conversionRate: 80.2 },
  { stage: 'Follow-up Sent', count: 156, conversionRate: 63.2 },
  { stage: 'Demo Scheduled', count: 68, conversionRate: 27.5 },
  { stage: 'Demo Completed', count: 52, conversionRate: 21.1 },
  { stage: 'Client Converted', count: 34, conversionRate: 13.8 },
];

// ------------------------------------------------------------------
// 4. Lead Scoring
// ------------------------------------------------------------------

export const leadScores: LeadScore[] = [
  {
    requestId: 'AUD-R001',
    leadScore: 92,
    signals: { company_size: 'Medium (50-200 employees)', industry_fit: 'Exact Match — Jewelry', budget_indicator: 'High — Spending $15K+/mo on ads', urgency: 'High — Active ad campaigns running' },
    recommendation: 'high_priority',
    followUpAction: 'Schedule demo within 24 hours — show audit results with personalized improvement roadmap',
  },
  {
    requestId: 'AUD-R002',
    leadScore: 87,
    signals: { company_size: 'Medium (50-200 employees)', industry_fit: 'Exact Match — Jewelry', budget_indicator: 'High — Spending $12K+/mo on ads', urgency: 'High — Expanding to new markets' },
    recommendation: 'high_priority',
    followUpAction: 'Schedule demo within 48 hours — highlight expansion opportunity and ROI projections',
  },
  {
    requestId: 'AUD-R003',
    leadScore: 74,
    signals: { company_size: 'Small (10-50 employees)', industry_fit: 'Close Match — Fashion Accessories', budget_indicator: 'Medium — Spending $5K+/mo on ads', urgency: 'High — Currently losing money on ads' },
    recommendation: 'high_priority',
    followUpAction: 'Schedule emergency call — present urgent fix plan for negative ROAS campaigns',
  },
  {
    requestId: 'AUD-R004',
    leadScore: 68,
    signals: { company_size: 'Small (10-50 employees)', industry_fit: 'Exact Match — Jewelry', budget_indicator: 'Medium — Spending $4K+/mo on ads', urgency: 'Medium — Steady growth phase' },
    recommendation: 'nurture',
    followUpAction: 'Send educational content weekly — case studies, ROI calculators, industry benchmarks',
  },
  {
    requestId: 'AUD-R005',
    leadScore: 52,
    signals: { company_size: 'Micro (1-10 employees)', industry_fit: 'Partial Match — Fashion', budget_indicator: 'Low — Spending <$1K/mo on ads', urgency: 'Low — Exploring options' },
    recommendation: 'nurture',
    followUpAction: 'Add to email drip campaign — share free tips, templates, and audit summary',
  },
  {
    requestId: 'AUD-R006',
    leadScore: 81,
    signals: { company_size: 'Medium (50-200 employees)', industry_fit: 'Exact Match — Jewelry', budget_indicator: 'High — Spending $10K+/mo on ads', urgency: 'Medium — Reviewing agencies' },
    recommendation: 'high_priority',
    followUpAction: 'Send competitive analysis — show how Varni outperforms current agency benchmarks',
  },
  {
    requestId: 'AUD-R007',
    leadScore: 38,
    signals: { company_size: 'Micro (1-10 employees)', industry_fit: 'Close Match — Pearls', budget_indicator: 'Low — No ad spend detected', urgency: 'Low — Just starting out' },
    recommendation: 'low_priority',
    followUpAction: 'Add to long-term nurture — quarterly check-in with free resources',
  },
  {
    requestId: 'AUD-R008',
    leadScore: 45,
    signals: { company_size: 'Small (10-50 employees)', industry_fit: 'Partial Match — Gems', budget_indicator: 'Low — Spending $2K/mo on ads', urgency: 'Low — Not actively seeking' },
    recommendation: 'low_priority',
    followUpAction: 'Send automated follow-up in 2 weeks — offer mini audit for specific channel',
  },
  {
    requestId: 'AUD-R009',
    leadScore: 78,
    signals: { company_size: 'Medium (50-200 employees)', industry_fit: 'Close Match — Fashion Jewelry', budget_indicator: 'High — Spending $8K+/mo on ads', urgency: 'High — Switching agencies next month' },
    recommendation: 'high_priority',
    followUpAction: 'Schedule priority demo — showcase migration plan and 90-day guarantee',
  },
  {
    requestId: 'AUD-R010',
    leadScore: 55,
    signals: { company_size: 'Small (10-50 employees)', industry_fit: 'Partial Match — Crafts', budget_indicator: 'Medium — Spending $3K/mo', urgency: 'Medium — Considering SEO services' },
    recommendation: 'nurture',
    followUpAction: 'Send SEO-specific case study — highlight keyword ranking improvements and organic traffic gains',
  },
  {
    requestId: 'AUD-R011',
    leadScore: 84,
    signals: { company_size: 'Medium (50-200 employees)', industry_fit: 'Exact Match — Jewelry', budget_indicator: 'High — Spending $11K+/mo on ads', urgency: 'High — Recently lost agency' },
    recommendation: 'high_priority',
    followUpAction: 'Immediate outreach — propose interim management and full audit deep-dive demo',
  },
  {
    requestId: 'AUD-R012',
    leadScore: 42,
    signals: { company_size: 'Small (10-50 employees)', industry_fit: 'Partial Match — Fashion', budget_indicator: 'Low — Spending $1.5K/mo', urgency: 'Low — Price-sensitive' },
    recommendation: 'low_priority',
    followUpAction: 'Add to automated drip — focus on value-first content, budget-friendly entry packages',
  },
];

// ------------------------------------------------------------------
// Helper Functions — Free Audit
// ------------------------------------------------------------------

export function getAuditStatusColor(status: AuditRequestStatus): string {
  const map: Record<AuditRequestStatus, string> = {
    pending: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    processing: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    completed: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
    delivered: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  };
  return map[status];
}

export function getAuditTypeLabel(type: AuditType): string {
  const map: Record<AuditType, string> = {
    full: 'Full Audit',
    ads_only: 'Ads Only',
    seo_only: 'SEO Only',
    website_only: 'Website Only',
  };
  return map[type];
}

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  if (score >= 30) return 'text-orange-400';
  return 'text-red-400';
}

export function getScoreBgColor(score: number): string {
  if (score >= 70) return 'bg-emerald-500/15 border-emerald-500/30';
  if (score >= 50) return 'bg-amber-500/15 border-amber-500/30';
  if (score >= 30) return 'bg-orange-500/15 border-orange-500/30';
  return 'bg-red-500/15 border-red-500/30';
}

export function getFindingSeverityColor(severity: FindingSeverity): string {
  const map: Record<FindingSeverity, string> = {
    critical: 'text-red-400 bg-red-500/15 border-red-500/30',
    warning: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    info: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
  };
  return map[severity];
}

export function getLeadRecommendationColor(rec: LeadRecommendation): { label: string; color: string } {
  const map: Record<LeadRecommendation, { label: string; color: string }> = {
    high_priority: { label: 'High Priority', color: 'text-red-400 bg-red-500/15 border-red-500/30' },
    nurture: { label: 'Nurture', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
    low_priority: { label: 'Low Priority', color: 'text-muted-foreground bg-muted border-muted-foreground/30' },
  };
  return map[rec];
}
