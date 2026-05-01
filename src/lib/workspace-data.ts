// ============================================================
// VARNI JEWELS — Workspace Data: Types & Mock Data
// Multi-project and team management system
// ============================================================

// Types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string; // initials like "AK", "RS" etc.
  role: "owner" | "admin" | "editor" | "analyst" | "viewer";
  status: "online" | "away" | "offline";
  projects: string[]; // project IDs this member belongs to
  lastActive?: string; // e.g. "2 min ago"
}

export interface Project {
  id: string;
  name: string;
  shortName: string; // 2-3 letter abbreviation for avatar, e.g. "VJ", "VD"
  industry: string;
  description: string;
  brandColor: string; // hex color for the project's theme accent
  members: string[]; // team member IDs
  createdAt: string;
  modules: string[]; // which dashboard modules this project has access to (all by default)
  status: "active" | "paused" | "archived";
  monthlyBudget?: number;
}

export interface TeamActivity {
  id: string;
  memberId: string;
  projectId: string;
  action: string;
  module: string;
  detail: string;
  timestamp: Date;
}

export interface RolePermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canManageTeam: boolean;
  canManageAutomations: boolean;
  canViewAllModules: boolean;
}

// Role permissions map
export const rolePermissions: Record<string, RolePermissions> = {
  owner: { canCreate: true, canEdit: true, canDelete: true, canExport: true, canManageTeam: true, canManageAutomations: true, canViewAllModules: true },
  admin: { canCreate: true, canEdit: true, canDelete: true, canExport: true, canManageTeam: true, canManageAutomations: true, canViewAllModules: true },
  editor: { canCreate: true, canEdit: true, canDelete: false, canExport: true, canManageTeam: false, canManageAutomations: false, canViewAllModules: true },
  analyst: { canCreate: false, canEdit: false, canDelete: false, canExport: true, canManageTeam: false, canManageAutomations: false, canViewAllModules: true },
  viewer: { canCreate: false, canEdit: false, canDelete: false, canExport: false, canManageTeam: false, canManageAutomations: false, canViewAllModules: false },
};

// Mock team members (8 people)
export const defaultTeamMembers: TeamMember[] = [
  { id: "tm-1", name: "Arjun Mehta", email: "arjun@varnijewels.com", avatar: "AM", role: "owner", status: "online", projects: ["proj-1", "proj-2", "proj-3"], lastActive: "Now" },
  { id: "tm-2", name: "Priya Sharma", email: "priya@varnijewels.com", avatar: "PS", role: "admin", status: "online", projects: ["proj-1", "proj-2"], lastActive: "1 min ago" },
  { id: "tm-3", name: "Rahul Kapoor", email: "rahul@varnijewels.com", avatar: "RK", role: "editor", status: "away", projects: ["proj-1"], lastActive: "15 min ago" },
  { id: "tm-4", name: "Sneha Patel", email: "sneha@varnijewels.com", avatar: "SP", role: "editor", status: "online", projects: ["proj-1", "proj-3"], lastActive: "3 min ago" },
  { id: "tm-5", name: "Vikram Singh", email: "vikram@varnijewels.com", avatar: "VS", role: "analyst", status: "online", projects: ["proj-1"], lastActive: "5 min ago" },
  { id: "tm-6", name: "Ananya Gupta", email: "ananya@varnijewels.com", avatar: "AG", role: "analyst", status: "offline", projects: ["proj-2"], lastActive: "2 hours ago" },
  { id: "tm-7", name: "Dev Iyer", email: "dev@varnijewels.com", avatar: "DI", role: "viewer", status: "away", projects: ["proj-1", "proj-3"], lastActive: "45 min ago" },
  { id: "tm-8", name: "Kavita Reddy", email: "kavita@varnijewels.com", avatar: "KR", role: "editor", status: "offline", projects: ["proj-1", "proj-2", "proj-3"], lastActive: "1 day ago" },
];

// Mock projects (4 projects)
export const defaultProjects: Project[] = [
  {
    id: "proj-1",
    name: "Varni Jewels",
    shortName: "VJ",
    industry: "Fine Jewelry",
    description: "Primary luxury jewelry brand — bridal, everyday, and occasion wear",
    brandColor: "#D4A843", // gold
    members: ["tm-1", "tm-2", "tm-3", "tm-4", "tm-5", "tm-7", "tm-8"],
    createdAt: "Jan 2025",
    status: "active",
    monthlyBudget: 185000,
    modules: ["all"],
  },
  {
    id: "proj-2",
    name: "Varni Diamonds",
    shortName: "VD",
    industry: "Diamond Retail",
    description: "Premium diamond retail — engagement rings, solitaires, and custom pieces",
    brandColor: "#8B5CF6", // purple
    members: ["tm-1", "tm-2", "tm-6", "tm-8"],
    createdAt: "Mar 2025",
    status: "active",
    monthlyBudget: 120000,
    modules: ["all"],
  },
  {
    id: "proj-3",
    name: "Varni Watches",
    shortName: "VW",
    industry: "Luxury Watches",
    description: "Luxury watch retail and after-sales service",
    brandColor: "#0EA5E9", // blue
    members: ["tm-1", "tm-4", "tm-7", "tm-8"],
    createdAt: "Jul 2025",
    status: "active",
    monthlyBudget: 65000,
    modules: ["all"],
  },
  {
    id: "proj-4",
    name: "Varni Home",
    shortName: "VH",
    industry: "Home Decor",
    description: "Premium home decor and lifestyle products (pilot project)",
    brandColor: "#10B981", // emerald
    members: ["tm-1"],
    createdAt: "Dec 2025",
    status: "paused",
    monthlyBudget: 25000,
    modules: ["overview", "social", "content", "email", "revenue"],
  },
];

// Mock team activity feed (recent 15 actions)
export const defaultTeamActivity: TeamActivity[] = [
  { id: "ta-1", memberId: "tm-2", projectId: "proj-1", action: "Exported Campaign Report", module: "paid-media", detail: "Downloaded paid-media-report.csv with 12 entries", timestamp: new Date(Date.now() - 2 * 60000) },
  { id: "ta-2", memberId: "tm-3", projectId: "proj-1", action: "Approved AI Suggestion", module: "paid-media", detail: "Applied: Pause Ad Set 'Broad — Jewelry Interest V3'", timestamp: new Date(Date.now() - 8 * 60000) },
  { id: "ta-3", memberId: "tm-5", projectId: "proj-1", action: "Ran SEO Audit", module: "seo", detail: "Full site audit completed — 3 issues, 12 improvements", timestamp: new Date(Date.now() - 15 * 60000) },
  { id: "ta-4", memberId: "tm-4", projectId: "proj-1", action: "Scheduled Post", module: "social", detail: "Instagram Reel: 'Behind the Craft — Ring Making' for Thursday 6PM", timestamp: new Date(Date.now() - 22 * 60000) },
  { id: "ta-5", memberId: "tm-1", projectId: "proj-2", action: "Created Campaign", module: "paid-media", detail: "New campaign 'Diamond Season Launch' — budget $45K", timestamp: new Date(Date.now() - 35 * 60000) },
  { id: "ta-6", memberId: "tm-2", projectId: "proj-1", action: "Fixed Content Decay", module: "content", detail: "Updated: 'Engagement Ring Buying Guide' — added 3 new sections", timestamp: new Date(Date.now() - 45 * 60000) },
  { id: "ta-7", memberId: "tm-8", projectId: "proj-3", action: "Exported Analytics", module: "social", detail: "Downloaded social-analytics.csv for Varni Watches", timestamp: new Date(Date.now() - 60 * 60000) },
  { id: "ta-8", memberId: "tm-3", projectId: "proj-1", action: "Sent Broadcast", module: "whatsapp", detail: "Valentine's Early Access sent to 82K contacts", timestamp: new Date(Date.now() - 90 * 60000) },
  { id: "ta-9", memberId: "tm-5", projectId: "proj-1", action: "Reordered Stock", module: "inventory", detail: "PO created for ER-001 (Eternal Hope Ring) — 50 units", timestamp: new Date(Date.now() - 120 * 60000) },
  { id: "ta-10", memberId: "tm-4", projectId: "proj-1", action: "Created Creative Brief", module: "creative", detail: "Brief: 'Bridal Close-Up Series' for Bridal Collection campaign", timestamp: new Date(Date.now() - 180 * 60000) },
  { id: "ta-11", memberId: "tm-1", projectId: "proj-1", action: "Toggled Automation", module: "ai-engine", detail: "Enabled 'Budget Auto-Adjust' rule", timestamp: new Date(Date.now() - 240 * 60000) },
  { id: "ta-12", memberId: "tm-6", projectId: "proj-2", action: "Exported Report", module: "revenue", detail: "Revenue report for Varni Diamonds — Q1 2026", timestamp: new Date(Date.now() - 300 * 60000) },
  { id: "ta-13", memberId: "tm-2", projectId: "proj-1", action: "Launched A/B Test", module: "creative", detail: "Testing 'Close-up Product' vs 'Lifestyle Model' — 50/50 split", timestamp: new Date(Date.now() - 360 * 60000) },
  { id: "ta-14", memberId: "tm-7", projectId: "proj-1", action: "Viewed Dashboard", module: "overview", detail: "Accessed Brand Overview", timestamp: new Date(Date.now() - 420 * 60000) },
  { id: "ta-15", memberId: "tm-1", projectId: "proj-3", action: "Created Project", module: "settings", detail: "Created 'Varni Watches' workspace", timestamp: new Date(Date.now() - 86400000) },
];

// Helper: get status color
export function getStatusColor(status: string): string {
  switch (status) {
    case "online": return "bg-emerald-500";
    case "away": return "bg-amber-500";
    case "offline": return "bg-gray-400";
    default: return "bg-gray-400";
  }
}

// Helper: get role badge color/style
export function getRoleBadgeVariant(role: string): "default" | "secondary" | "outline" {
  switch (role) {
    case "owner": return "default";
    case "admin": return "secondary";
    default: return "outline";
  }
}

// Helper: format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}
