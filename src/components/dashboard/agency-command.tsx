'use client';

import React, { useState, useMemo } from 'react';
import {
  Building2, Users, BarChart3, TrendingUp, AlertTriangle, CheckCircle2, XCircle,
  Download, RefreshCw, Clock, Eye, Globe, Mail, MessageSquare, Shield, Settings2,
  Plus, FileText, DollarSign, Heart, Zap, Search, Filter, ChevronRight, ArrowRight,
  ExternalLink, UserCircle, Calendar, Activity, Layers, Send,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAction } from '@/lib/action-context';
import { exportToCSV } from '@/lib/real-actions';
import {
  clientAccounts, bulkAuditResults, healthScores, whiteLabelReports,
  bulkActions, budgetAllocations, agencyPerformance, clientPortalSettings,
  getHealthScoreColor, getHealthScoreBg, getHealthScoreRing, getRiskBadgeClass,
  getTrendIcon, getTrendColor, getPriorityBadge, getStatusBadge,
  getAccountTypeLabel, getReportTypeLabel, getDeliveryMethodIcon, getAuditScoreColor,
  type ClientAccount, type BulkAuditResult, type HealthScoreEntry,
  type WhiteLabelReport, type BulkAction, type BudgetAllocation, type ClientPortalSetting,
} from '@/lib/agency-data';

// ------------------------------------------------------------------
// Sub-components
// ------------------------------------------------------------------

function MiniMetric({ label, value, icon: Icon, subtext, color }: {
  label: string; value: string; icon: React.ElementType; subtext?: string; color?: string;
}) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4 flex items-start gap-3">
        <div className={`p-2 rounded-lg ${color || 'bg-primary/10'}`}>
          <Icon className={`h-4 w-4 ${color ? 'text-white' : 'text-primary'}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xl font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          {subtext && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function TabExportButton({ label, data, filename }: { label: string; data: Record<string, unknown>[]; filename: string }) {
  return (
    <Button
      variant="ghost" size="sm"
      className="h-7 text-[10px] gap-1 ml-auto text-muted-foreground hover:text-foreground"
      onClick={() => {
        exportToCSV(data, filename);
        toast.success('Exported', { description: `${filename} downloaded` });
      }}
    >
      <Download className="h-3 w-3" />
      {label}
    </Button>
  );
}

function HealthScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth="3" className="stroke-muted/30" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth="3"
          className={getHealthScoreRing(score)}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums ${getHealthScoreColor(score)}`}>
        {score}
      </span>
    </div>
  );
}

function HealthBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-semibold tabular-nums ${getHealthScoreColor(value)}`}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getHealthScoreBg(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function CheckboxMark({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      className={`h-4 w-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
        checked ? 'bg-primary border-primary' : 'border-border hover:border-primary/50'
      }`}
      onClick={onChange}
    >
      {checked && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
    </button>
  );
}

// ------------------------------------------------------------------
// Main Component
// ------------------------------------------------------------------

export function AgencyCommand() {
  const { executeAction } = useAction();

  // State
  const [auditRunning, setAuditRunning] = useState(false);
  const [reportsGenerating, setReportsGenerating] = useState(false);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [selectedBulkActions, setSelectedBulkActions] = useState<Set<string>>(new Set());
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportClient, setReportClient] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportDelivery, setReportDelivery] = useState('email');

  // Derived data
  const filteredClients = useMemo(() => {
    let clients = clientAccounts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      clients = clients.filter(c =>
        c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.primaryContact.toLowerCase().includes(q)
      );
    }
    return clients;
  }, [searchQuery]);

  const filteredHealth = useMemo(() => {
    let data = healthScores;
    if (healthFilter === 'at-risk') data = data.filter(h => h.riskLevel === 'high' || h.riskLevel === 'critical');
    if (healthFilter === 'healthy') data = data.filter(h => h.riskLevel === 'low');
    if (healthFilter === 'trending-down') data = data.filter(h => h.trend === 'down');
    return data;
  }, [healthFilter]);

  const filteredBulkActions = useMemo(() => {
    let data = bulkActions;
    if (actionFilter === 'pending') data = data.filter(a => a.status === 'pending');
    if (actionFilter === 'active') data = data.filter(a => ['approved', 'executing'].includes(a.status));
    if (actionFilter === 'completed') data = data.filter(a => a.status === 'completed');
    return data;
  }, [actionFilter]);

  // Handlers
  const handleRunBulkAudit = () => {
    setAuditRunning(true);
    executeAction({
      action: 'Run Bulk Audit',
      module: 'agency-command',
      detail: 'Running comprehensive audits across all 8 client accounts (Google Ads, Meta Ads, SEO, Website)',
      successMsg: 'Bulk audit complete — 13 audits finished, 78 total issues found across all clients',
      simulateDelay: 3500,
    });
    setTimeout(() => setAuditRunning(false), 3500);
  };

  const handleGenerateAllReports = () => {
    setReportsGenerating(true);
    executeAction({
      action: 'Generate All Reports',
      module: 'agency-command',
      detail: 'Generating weekly performance reports for all active clients',
      successMsg: 'All 6 reports generated — 4 sent via email, 2 available in portal',
      simulateDelay: 2500,
    });
    setTimeout(() => setReportsGenerating(false), 2500);
  };

  const handleExportSummary = () => {
    const data = [
      ...clientAccounts.map(c => ({
        Client: c.name, Industry: c.industry, Status: c.status, HealthScore: c.healthScore,
        ROAS: c.avgROAS, MonthlyRetainer: c.monthlyRetainer, TotalSpend: c.totalSpendManaged,
        TotalRevenue: c.totalRevenue, Alerts: c.alertCount, Contact: c.primaryContact,
      })),
    ];
    exportToCSV(data, 'agency-summary.csv');
    toast.success('Agency summary exported');
  };

  const handleGenerateReport = () => {
    if (!reportClient || !reportType) return;
    setReportDialogOpen(false);
    executeAction({
      action: 'Generate Report',
      module: 'agency-command',
      detail: `Generating ${reportType} for ${reportClient}`,
      successMsg: `Report generated for ${reportClient} — ${reportType}`,
      simulateDelay: 1500,
    });
    setReportClient('');
    setReportType('');
    setReportDelivery('email');
  };

  const handleApproveSelected = () => {
    const count = selectedBulkActions.size;
    selectedBulkActions.forEach(id => {
      // mark as approved in toast
    });
    setSelectedBulkActions(new Set());
    toast.success(`${count} actions approved`, { description: 'Actions will begin executing shortly' });
  };

  const handleRejectSelected = () => {
    const count = selectedBulkActions.size;
    setSelectedBulkActions(new Set());
    toast.info(`${count} actions rejected`, { description: 'Actions have been dismissed' });
  };

  const handleApplyBudgetRecommendations = () => {
    executeAction({
      action: 'Apply Budget Recommendations',
      module: 'agency-command',
      detail: 'Applying AI-optimized budget reallocations across 8 client accounts',
      successMsg: 'Budget recommendations applied — $3,000 net increase, projected +$80,400 additional revenue',
      simulateDelay: 2000,
    });
  };

  return (
    <div className="space-y-6">
      {/* ========== Agency KPI Row ========== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MiniMetric
          label="Total Clients" value={`${agencyPerformance.totalClients}`}
          icon={Users} color="bg-violet-500"
          subtext={`${agencyPerformance.netNewClientsThisMonth} new this month`}
        />
        <MiniMetric
          label="Managed Spend" value={`$${(agencyPerformance.totalManagedSpend / 1000000).toFixed(1)}M`}
          icon={DollarSign} color="bg-emerald-500"
          subtext="Across all accounts"
        />
        <MiniMetric
          label="Avg ROAS" value={`${agencyPerformance.averageROAS}x`}
          icon={TrendingUp} color="bg-amber-500"
          subtext="Blended agency-wide"
        />
        <MiniMetric
          label="Revenue Generated" value={`$${(agencyPerformance.totalRevenueGenerated / 1000000).toFixed(1)}M`}
          icon={BarChart3} color="bg-pink-500"
          subtext="Total attributed"
        />
        <MiniMetric
          label="Retention Rate" value={`${agencyPerformance.clientRetentionRate}%`}
          icon={Heart} color="bg-teal-500"
          subtext={`${agencyPerformance.upcomingRenewals} renewals upcoming`}
        />
        <MiniMetric
          label="At-Risk Clients" value={`${agencyPerformance.churnRiskClients}`}
          icon={AlertTriangle} color="bg-red-500"
          subtext="Require immediate attention"
        />
      </div>

      {/* ========== Action Bar ========== */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button
              className="gap-2 shrink-0"
              onClick={handleRunBulkAudit}
              disabled={auditRunning}
            >
              {auditRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              {auditRunning ? 'Auditing...' : 'Run Bulk Audit'}
            </Button>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" className="h-9 text-xs gap-2" onClick={handleGenerateAllReports} disabled={reportsGenerating}>
                {reportsGenerating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                {reportsGenerating ? 'Generating...' : 'Generate All Reports'}
              </Button>
              <Button variant="outline" className="h-9 text-xs gap-2" onClick={handleExportSummary}>
                <Download className="h-3.5 w-3.5" />
                Export Summary
              </Button>
            </div>
            <div className="flex-1" />
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="h-9 text-xs pl-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========== Main Tabs ========== */}
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1 bg-muted/50">
          <TabsTrigger value="clients" className="text-xs gap-1 data-[state=active]:bg-primary"><Users className="h-3 w-3" />Clients</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs gap-1 data-[state=active]:bg-primary"><Shield className="h-3 w-3" />Audit</TabsTrigger>
          <TabsTrigger value="health" className="text-xs gap-1 data-[state=active]:bg-primary"><Activity className="h-3 w-3" />Health</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs gap-1 data-[state=active]:bg-primary"><FileText className="h-3 w-3" />Reports</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs gap-1 data-[state=active]:bg-primary"><Zap className="h-3 w-3" />Actions</TabsTrigger>
          <TabsTrigger value="budget" className="text-xs gap-1 data-[state=active]:bg-primary"><DollarSign className="h-3 w-3" />Budget</TabsTrigger>
          <TabsTrigger value="portal" className="text-xs gap-1 data-[state=active]:bg-primary"><Globe className="h-3 w-3" />Portal</TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/* TAB 1: Client Dashboard                                      */}
        {/* ============================================================ */}
        <TabsContent value="clients">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Client Accounts
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {filteredClients.length} client accounts · {filteredClients.filter(c => c.status === 'active').length} active
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export Clients"
                  data={filteredClients.map(c => ({
                    Name: c.name, Industry: c.industry, Status: c.status, HealthScore: c.healthScore,
                    ROAS: c.avgROAS + 'x', MonthlyRetainer: '$' + c.monthlyRetainer, TotalSpend: '$' + c.totalSpendManaged,
                    Revenue: '$' + c.totalRevenue, Alerts: c.alertCount, Contact: c.primaryContact, Email: c.email,
                  }))}
                  filename="agency-clients.csv"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredClients.map(client => {
                const isExpanded = expandedClient === client.id;
                return (
                  <div key={client.id} className="rounded-lg border border-border/50 overflow-hidden">
                    {/* Client Header */}
                    <div
                      className="p-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: client.brandColor + '20' }}>
                        <Building2 className="h-5 w-5" style={{ color: client.brandColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold">{client.name}</span>
                          <Badge className={`text-[9px] ${getStatusBadge(client.status)}`}>{client.status}</Badge>
                          <span className="text-[10px] text-muted-foreground">{client.industry}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><UserCircle className="h-3 w-3" />{client.primaryContact}</span>
                          <span className="hidden sm:flex items-center gap-1"><DollarSign className="h-3 w-3" />${client.monthlyRetainer.toLocaleString()}/mo</span>
                        </div>
                      </div>
                      <HealthScoreRing score={client.healthScore} />
                      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-sm font-bold tabular-nums ${client.avgROAS >= 4 ? 'text-emerald-500' : client.avgROAS >= 3 ? 'text-amber-500' : 'text-red-500'}`}>
                          {client.avgROAS}x ROAS
                        </span>
                        <span className="text-[10px] text-muted-foreground">${(client.totalSpendManaged / 1000).toFixed(0)}K managed</span>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {client.alertCount > 0 && (
                          <Badge variant="destructive" className="text-[9px] h-5 gap-1">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            {client.alertCount}
                          </Badge>
                        )}
                        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 border-t border-border/30 bg-muted/10">
                        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-[10px] text-muted-foreground">Total Spend Managed</p>
                            <p className="text-sm font-bold tabular-nums">${client.totalSpendManaged.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Total Revenue</p>
                            <p className="text-sm font-bold tabular-nums text-emerald-500">${client.totalRevenue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Last Audit</p>
                            <p className="text-sm font-medium">{client.lastAudit}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground">Contact</p>
                            <p className="text-sm font-medium">{client.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button size="sm" className="h-7 text-[10px] gap-1" onClick={(e) => {
                            e.stopPropagation();
                            toast.success('Opening dashboard', { description: `Viewing ${client.name} analytics` });
                          }}>
                            <Eye className="h-3 w-3" />View Dashboard
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={(e) => {
                            e.stopPropagation();
                            executeAction({
                              action: 'Run Audit',
                              module: 'agency-command',
                              detail: `Running audit for ${client.name}`,
                              successMsg: `Audit complete for ${client.name} — ${Math.floor(Math.random() * 8) + 2} issues found`,
                              simulateDelay: 1500,
                            });
                          }}>
                            <Shield className="h-3 w-3" />Run Audit
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={(e) => {
                            e.stopPropagation();
                            toast.success('Report generated', { description: `Weekly performance report for ${client.name}` });
                          }}>
                            <FileText className="h-3 w-3" />Generate Report
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 2: Bulk Audit                                            */}
        {/* ============================================================ */}
        <TabsContent value="audit">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Cross-Account Audit Results
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {bulkAuditResults.length} audits across {new Set(bulkAuditResults.map(a => a.clientName)).size} clients
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="h-7 text-[10px] gap-1" onClick={handleRunBulkAudit} disabled={auditRunning}>
                    {auditRunning ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                    {auditRunning ? 'Running...' : 'Re-Run All'}
                  </Button>
                  <TabExportButton
                    label="Export"
                    data={bulkAuditResults.map(a => ({
                      Client: a.clientName, AccountType: getAccountTypeLabel(a.accountType), Date: a.auditDate,
                      Score: a.overallScore, Issues: a.issuesFound, Critical: a.criticalIssues, Warnings: a.warnings,
                      TopRecommendation: a.topRecommendation, WasteSaved: '$' + a.estimatedWasteSaved.toLocaleString(),
                    }))}
                    filename="bulk-audit-results.csv"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[520px]">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Client</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Type</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Date</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Score</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Issues</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Critical</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Warnings</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Top Recommendation</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Waste Saved</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...bulkAuditResults].sort((a, b) => a.overallScore - b.overallScore).map((audit, idx) => (
                        <tr key={`${audit.clientName}-${audit.accountType}-${idx}`} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 px-2 font-medium text-xs max-w-[130px] truncate">{audit.clientName}</td>
                          <td className="py-2.5 px-2">
                            <Badge variant="outline" className="text-[9px]">{getAccountTypeLabel(audit.accountType)}</Badge>
                          </td>
                          <td className="py-2.5 px-2 text-xs text-muted-foreground">{audit.auditDate}</td>
                          <td className={`py-2.5 px-2 text-right font-bold tabular-nums text-xs ${getAuditScoreColor(audit.overallScore)}`}>
                            {audit.overallScore}
                          </td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">{audit.issuesFound}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs text-red-500 font-medium">{audit.criticalIssues}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs text-amber-500">{audit.warnings}</td>
                          <td className="py-2.5 px-2 text-[10px] text-muted-foreground max-w-[200px] truncate">{audit.topRecommendation}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">
                            {audit.estimatedWasteSaved > 0 ? (
                              <span className="text-emerald-500 font-medium">${audit.estimatedWasteSaved.toLocaleString()}</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <Button
                              size="sm" variant="outline" className="h-6 text-[9px] gap-1 px-2"
                              onClick={() => toast.success('Audit started', { description: `Re-auditing ${audit.clientName} — ${getAccountTypeLabel(audit.accountType)}` })}
                            >
                              <RefreshCw className="h-2.5 w-2.5" />Run
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 3: Health Scores                                         */}
        {/* ============================================================ */}
        <TabsContent value="health">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Client Health Dashboard
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Per-client health breakdown across ad performance, SEO, content, and creative
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {['all', 'at-risk', 'trending-down', 'healthy'].map(f => (
                      <Button
                        key={f} size="sm" variant={healthFilter === f ? 'default' : 'outline'}
                        className="h-7 text-[10px] capitalize px-2"
                        onClick={() => setHealthFilter(f)}
                      >
                        {f.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                  <TabExportButton
                    label="Export"
                    data={healthScores.map(h => ({
                      Client: h.clientName, Overall: h.overallHealth, AdPerformance: h.adPerformance,
                      SEO: h.seoHealth, Content: h.contentHealth, Creative: h.creativeHealth,
                      Trend: h.trend, RiskLevel: h.riskLevel,
                    }))}
                    filename="health-scores.csv"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredHealth
                .sort((a, b) => a.overallHealth - b.overallHealth)
                .map(health => {
                  const client = clientAccounts.find(c => c.name === health.clientName);
                  return (
                    <div key={health.clientName} className="p-4 rounded-lg border border-border/50 hover:bg-muted/10 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Left: Name + Ring */}
                        <div className="flex items-center gap-3 shrink-0">
                          <HealthScoreRing score={health.overallHealth} size={56} />
                          <div>
                            <p className="text-sm font-semibold">{health.clientName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`text-[9px] ${getRiskBadgeClass(health.riskLevel)}`}>
                                {health.riskLevel.toUpperCase()} RISK
                              </Badge>
                              <span className={`text-[10px] font-medium ${getTrendColor(health.trend)}`}>
                                {getTrendIcon(health.trend)} {health.trend}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Bars */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                          <HealthBar label="Ad Performance" value={health.adPerformance} />
                          <HealthBar label="SEO Health" value={health.seoHealth} />
                          <HealthBar label="Content Health" value={health.contentHealth} />
                          <HealthBar label="Creative Health" value={health.creativeHealth} />
                        </div>

                        {/* Far right: Brand color + Alerts */}
                        <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                          {client && (
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: client.brandColor }} />
                              <span className="text-[10px] text-muted-foreground">{client.alertCount} alerts</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 4: White-Label Reports                                   */}
        {/* ============================================================ */}
        <TabsContent value="reports">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    White-Label Client Reports
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {whiteLabelReports.filter(r => r.status === 'ready').length} ready to send · {whiteLabelReports.filter(r => r.status === 'generating').length} generating
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="h-7 text-[10px] gap-1" onClick={() => setReportDialogOpen(true)}>
                    <Plus className="h-3 w-3" />Generate Report
                  </Button>
                  <TabExportButton
                    label="Export"
                    data={whiteLabelReports.map(r => ({
                      ID: r.id, Client: r.clientName, Type: getReportTypeLabel(r.reportType), Period: r.period,
                      Status: r.status, GeneratedAt: r.generatedAt, SentAt: r.sentAt || 'N/A',
                      DeliveryMethod: r.deliveryMethod, OpenRate: r.openRate + '%', Sections: r.sections.join(', '),
                    }))}
                    filename="white-label-reports.csv"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[500px]">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background z-10">
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Client</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Type</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Period</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Delivery</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Open Rate</th>
                        <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Sections</th>
                        <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {whiteLabelReports.map(report => (
                        <tr key={report.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 px-2 font-medium text-xs">{report.clientName}</td>
                          <td className="py-2.5 px-2">
                            <Badge variant="outline" className="text-[9px]">{getReportTypeLabel(report.reportType)}</Badge>
                          </td>
                          <td className="py-2.5 px-2 text-xs text-muted-foreground max-w-[140px] truncate">{report.period}</td>
                          <td className="py-2.5 px-2">
                            <Badge className={`text-[9px] ${getStatusBadge(report.status)}`}>
                              {report.status === 'generating' ? '⏳ Generating' : report.status === 'ready' ? '✓ Ready' : '✈️ Sent'}
                            </Badge>
                          </td>
                          <td className="py-2.5 px-2 text-xs">{getDeliveryMethodIcon(report.deliveryMethod)} {report.deliveryMethod}</td>
                          <td className="py-2.5 px-2 text-right tabular-nums text-xs">
                            {report.openRate > 0 ? (
                              <span className={report.openRate >= 80 ? 'text-emerald-500' : report.openRate >= 50 ? 'text-amber-500' : 'text-muted-foreground'}>
                                {report.openRate}%
                              </span>
                            ) : '—'}
                          </td>
                          <td className="py-2.5 px-2 text-[10px] text-muted-foreground max-w-[180px] truncate">
                            {report.sections.length} sections
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <div className="flex items-center gap-1 justify-end">
                              {report.status === 'ready' && (
                                <>
                                  <Button
                                    size="sm" variant="outline" className="h-6 text-[9px] gap-1 px-2"
                                    onClick={() => {
                                      toast.success('Report sent', { description: `${report.clientName} report sent via ${report.deliveryMethod}` });
                                    }}
                                  >
                                    <Send className="h-2.5 w-2.5" />Send
                                  </Button>
                                  <Button
                                    size="sm" variant="ghost" className="h-6 text-[9px] gap-1 px-1.5"
                                    onClick={() => toast.success('Preview opened', { description: `Viewing ${report.clientName} report` })}
                                  >
                                    <Eye className="h-2.5 w-2.5" />
                                  </Button>
                                </>
                              )}
                              {report.status === 'sent' && (
                                <Button
                                  size="sm" variant="ghost" className="h-6 text-[9px] gap-1 px-1.5"
                                  onClick={() => toast.info('Opening report', { description: `${report.clientName} — ${report.period}` })}
                                >
                                  <Eye className="h-2.5 w-2.5" />View
                                </Button>
                              )}
                              {report.status === 'generating' && (
                                <Badge variant="secondary" className="text-[9px] gap-1">
                                  <RefreshCw className="h-2.5 w-2.5 animate-spin" />Processing
                                </Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 5: Bulk Actions                                          */}
        {/* ============================================================ */}
        <TabsContent value="actions">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Cross-Account Actions
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {bulkActions.filter(a => a.status === 'pending').length} pending · {bulkActions.filter(a => a.status === 'executing').length} executing
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {selectedBulkActions.size > 0 && (
                    <>
                      <Button size="sm" className="h-7 text-[10px] gap-1" onClick={handleApproveSelected}>
                        <CheckCircle2 className="h-3 w-3" />Approve Selected ({selectedBulkActions.size})
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={handleRejectSelected}>
                        <XCircle className="h-3 w-3" />Reject Selected
                      </Button>
                    </>
                  )}
                  <div className="flex items-center gap-1">
                    {['all', 'pending', 'active', 'completed'].map(f => (
                      <Button
                        key={f} size="sm" variant={actionFilter === f ? 'default' : 'outline'}
                        className="h-7 text-[10px] capitalize px-2"
                        onClick={() => setActionFilter(f)}
                      >
                        {f}
                      </Button>
                    ))}
                  </div>
                  <TabExportButton
                    label="Export"
                    data={bulkActions.map(a => ({
                      ID: a.id, Action: a.action, AffectedClients: a.affectedClients.join('; '),
                      Category: a.category, Priority: a.priority, Status: a.status, Impact: a.impact, Deadline: a.deadline,
                    }))}
                    filename="bulk-actions.csv"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredBulkActions.map(action => {
                const isSelected = selectedBulkActions.has(action.id);
                const isActionable = action.status === 'pending';
                return (
                  <div key={action.id} className="p-3 rounded-lg border border-border/50 hover:bg-muted/10 transition-colors">
                    <div className="flex items-start gap-3">
                      {isActionable && (
                        <CheckboxMark
                          checked={isSelected}
                          onChange={() => {
                            setSelectedBulkActions(prev => {
                              const next = new Set(prev);
                              if (next.has(action.id)) next.delete(action.id);
                              else next.add(action.id);
                              return next;
                            });
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`text-[9px] ${getPriorityBadge(action.priority)}`}>{action.priority}</Badge>
                          <Badge variant="outline" className="text-[9px]">{action.category}</Badge>
                          <Badge className={`text-[9px] ${getStatusBadge(action.status)}`}>{action.status}</Badge>
                        </div>
                        <p className="text-xs font-medium mt-1.5">{action.action}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{action.affectedClients.length} clients</span>
                          <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{action.impact}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{action.deadline}</span>
                        </div>
                      </div>
                      {isActionable && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="sm" variant="outline" className="h-6 text-[9px] gap-1 px-2 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                            onClick={() => {
                              toast.info('Action rejected', { description: action.action });
                            }}
                          >
                            <XCircle className="h-2.5 w-2.5" />
                          </Button>
                          <Button
                            size="sm" className="h-6 text-[9px] gap-1 px-2"
                            onClick={() => {
                              toast.success('Action approved', { description: `${action.action} — executing now` });
                            }}
                          >
                            <CheckCircle2 className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 6: Budget Reallocation                                   */}
        {/* ============================================================ */}
        <TabsContent value="budget">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Budget Reallocation
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    AI-optimized budget recommendations across all client accounts
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="h-7 text-[10px] gap-1" onClick={handleApplyBudgetRecommendations}>
                    <CheckCircle2 className="h-3 w-3" />Apply Recommendations
                  </Button>
                  <TabExportButton
                    label="Export"
                    data={budgetAllocations.map(b => ({
                      Client: b.clientName, CurrentBudget: '$' + b.currentMonthlyBudget.toLocaleString(),
                      RecommendedBudget: '$' + b.recommendedBudget.toLocaleString(),
                      Reallocation: (b.reallocationAmount > 0 ? '+$' : '-$') + Math.abs(b.reallocationAmount).toLocaleString(),
                      Reason: b.reason, ProjectedImpact: b.projectedImpact,
                    }))}
                    filename="budget-reallocation.csv"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {budgetAllocations.map(budget => {
                const client = clientAccounts.find(c => c.name === budget.clientName);
                const isIncrease = budget.reallocationAmount > 0;
                const pctChange = Math.round((Math.abs(budget.reallocationAmount) / budget.currentMonthlyBudget) * 100);
                return (
                  <div key={budget.clientName} className="p-4 rounded-lg border border-border/50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Client */}
                      <div className="flex items-center gap-3 shrink-0 sm:w-44">
                        {client && (
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: client.brandColor + '20' }}>
                            <Building2 className="h-4 w-4" style={{ color: client.brandColor }} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold">{budget.clientName}</p>
                          {client && (
                            <Badge className={`text-[8px] mt-0.5 ${getStatusBadge(client.status)}`}>{client.status}</Badge>
                          )}
                        </div>
                      </div>

                      {/* Budget Comparison */}
                      <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                        <div>
                          <p className="text-[10px] text-muted-foreground">Current</p>
                          <p className="text-sm font-bold tabular-nums">${budget.currentMonthlyBudget.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isIncrease ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {isIncrease ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
                            {isIncrease ? '+' : ''}{pctChange}% (${Math.abs(budget.reallocationAmount).toLocaleString()})
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground">Recommended</p>
                          <p className={`text-sm font-bold tabular-nums ${isIncrease ? 'text-emerald-500' : 'text-red-500'}`}>
                            ${budget.recommendedBudget.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Impact */}
                      <div className="sm:w-64 shrink-0">
                        <p className="text-[10px] text-muted-foreground mb-1">Projected Impact</p>
                        <p className="text-xs font-medium text-emerald-600">{budget.projectedImpact}</p>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <p className="text-[10px] text-muted-foreground">{budget.reason}</p>
                  </div>
                );
              })}

              {/* Summary */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-xs text-primary font-medium">
                    Net Budget Change: {budgetAllocations.reduce((s, b) => s + b.reallocationAmount, 0) >= 0 ? '+' : ''}
                    ${budgetAllocations.reduce((s, b) => s + b.reallocationAmount, 0).toLocaleString()}/month
                    {' '}· Projected additional revenue: ~$80,400/month across optimized accounts
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/* TAB 7: Client Portal                                         */}
        {/* ============================================================ */}
        <TabsContent value="portal">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Client Portal Configuration
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {clientPortalSettings.filter(p => p.portalEnabled).length} portals active · {clientPortalSettings.filter(p => p.customDomain).length} custom domains
                  </CardDescription>
                </div>
                <TabExportButton
                  label="Export"
                  data={clientPortalSettings.map(p => ({
                    Client: p.clientName, PortalEnabled: p.portalEnabled, CustomDomain: p.customDomain || 'None',
                    Modules: p.accessibleModules.join(', '), LastLogin: p.lastClientLogin || 'Never',
                    PrimaryColor: p.branding.primaryColor,
                  }))}
                  filename="client-portal-settings.csv"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {clientPortalSettings.map(portal => {
                const client = clientAccounts.find(c => c.name === portal.clientName);
                return (
                  <div key={portal.clientName} className="p-4 rounded-lg border border-border/50">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Client Info */}
                      <div className="flex items-center gap-3 shrink-0 sm:w-48">
                        {client && (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: client.brandColor + '20' }}>
                            <Building2 className="h-5 w-5" style={{ color: client.brandColor }} />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold">{portal.clientName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {portal.portalEnabled ? (
                              <Badge className={`text-[9px] bg-emerald-500/15 text-emerald-500 border-emerald-500/30 gap-1`}>
                                <CheckCircle2 className="h-2.5 w-2.5" />Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[9px] gap-1">
                                <XCircle className="h-2.5 w-2.5" />Inactive
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Branding */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: portal.branding.primaryColor, borderColor: portal.branding.primaryColor }} />
                            <span className="text-[10px] text-muted-foreground">{portal.branding.primaryColor}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: portal.branding.secondaryColor, borderColor: portal.branding.secondaryColor }} />
                            <span className="text-[10px] text-muted-foreground">{portal.branding.secondaryColor}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {portal.customDomain || 'Agency subdomain'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Layers className="h-3 w-3" />
                            {portal.accessibleModules.length} modules
                          </span>
                          {portal.lastClientLogin && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last login: {new Date(portal.lastClientLogin).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {/* Modules */}
                        <div className="flex items-center gap-1 flex-wrap mt-1">
                          {portal.accessibleModules.map(mod => (
                            <Badge key={mod} variant="outline" className="text-[9px] capitalize">{mod}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {portal.portalEnabled && portal.loginLink && (
                          <Button
                            size="sm" variant="outline" className="h-7 text-[10px] gap-1"
                            onClick={() => toast.success('Login link copied', { description: portal.loginLink })}
                          >
                            <ExternalLink className="h-3 w-3" />Copy Link
                          </Button>
                        )}
                        <Button
                          size="sm" variant={portal.portalEnabled ? 'outline' : 'default'}
                          className="h-7 text-[10px] gap-1"
                          onClick={() => {
                            toast.success(
                              portal.portalEnabled ? 'Portal disabled' : 'Portal enabled',
                              { description: `${portal.clientName} client portal ${portal.portalEnabled ? 'disabled' : 'activated'}` }
                            );
                          }}
                        >
                          <Settings2 className="h-3 w-3" />
                          {portal.portalEnabled ? 'Disable Portal' : 'Enable Portal'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ========== Report Generation Dialog ========== */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Generate Client Report
            </DialogTitle>
            <DialogDescription className="text-xs">
              Create a white-labeled report for a client. It will be generated with your agency branding.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-medium">Client</label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={reportClient}
                onChange={e => setReportClient(e.target.value)}
              >
                <option value="">Select client...</option>
                {clientAccounts.filter(c => c.status === 'active').map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Report Type</label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={reportType}
                onChange={e => setReportType(e.target.value)}
              >
                <option value="">Select type...</option>
                <option value="weekly_performance">Weekly Performance</option>
                <option value="monthly_review">Monthly Review</option>
                <option value="quarterly_strategy">Quarterly Strategy</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Delivery Method</label>
              <div className="flex items-center gap-2">
                {[
                  { value: 'email', label: '📧 Email', desc: 'Send via email' },
                  { value: 'slack', label: '💬 Slack', desc: 'Post to channel' },
                  { value: 'portal', label: '🌐 Portal', desc: 'Publish to portal' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    className={`flex-1 p-3 rounded-lg border text-center transition-colors ${
                      reportDelivery === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50 hover:border-primary/30'
                    }`}
                    onClick={() => setReportDelivery(opt.value)}
                  >
                    <p className="text-xs font-medium">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setReportDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleGenerateReport} disabled={!reportClient || !reportType}>
              <FileText className="h-3.5 w-3.5" />
              Generate Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
