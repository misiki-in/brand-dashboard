"use client";

import { useState } from "react";
import { inventoryData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "./kpi-components";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Cell, AreaChart, Area,
} from "recharts";
import { Package, AlertTriangle, TrendingUp, TrendingDown, RefreshCw, Zap, Tag, Download } from "lucide-react";
import { useAction } from "@/lib/action-context";
import { ActionBar } from "./action-bar";
import { exportToCSV } from "@/lib/real-actions";
import { ConfirmDialog } from "./confirm-dialog";

const statusColors: Record<string, string> = {
  Fast: "bg-emerald-500/10 text-emerald-600",
  Healthy: "bg-blue-500/10 text-blue-600",
  Monitor: "bg-amber-500/10 text-amber-600",
  Slow: "bg-red-500/10 text-red-600",
};

const priorityColors: Record<string, string> = {
  Critical: "bg-red-500 text-white",
  High: "bg-amber-500 text-white",
  Medium: "bg-blue-500 text-white",
};

export function InventoryIntelligence() {
  const { executeAction, automations } = useAction();
  const [confirmReorder, setConfirmReorder] = useState(false);
  const [confirmLiquidate, setConfirmLiquidate] = useState(false);

  const reorderItems = inventoryData.reorderAlerts as Array<{sku: string; name: string; stock: number; reorderPoint: number; leadTime: string; demand: string}>;
  const COLORS = ["oklch(0.65 0.18 65)", "oklch(0.6 0.15 340)", "oklch(0.55 0.12 200)", "oklch(0.7 0.1 140)", "oklch(0.6 0.2 30)", "oklch(0.5 0.15 260)"];

  const inventoryTrendData = inventoryData.monthlyInventoryTrend.map((m) => ({
    ...m,
    value: m.value / 1000000,
    sold: m.sold / 1000000,
    ordered: m.ordered / 1000000,
  }));

  return (
    <div className="space-y-6">
      {/* Hero — Inventory Pulse */}
      <Card className="border-border/50 bg-gradient-to-br from-card via-card to-red-500/5">
        <CardContent className="p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Package className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Inventory Intelligence</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {inventoryData.totalSKUs.toLocaleString()} SKUs tracked · ${((inventoryData.totalInventoryValue) / 1000000).toFixed(1)}M total value
                </p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 lg:ml-auto w-full lg:w-auto">
              {[
                { label: "Capital Locked", value: `$${(inventoryData.capitalLocked / 1000000).toFixed(1)}M`, icon: <TrendingUp className="h-4 w-4 text-amber-500" /> },
                { label: "Dead Stock Value", value: `$${(inventoryData.deadStockValue / 1000).toFixed(0)}K`, icon: <AlertTriangle className="h-4 w-4 text-red-500" /> },
                { label: "Turnover Rate", value: `${inventoryData.turnoverRate}x`, icon: <RefreshCw className="h-4 w-4 text-blue-500" /> },
                { label: "Reorder Alerts", value: `${(inventoryData.reorderAlerts as unknown[]).length}`, icon: <Zap className="h-4 w-4 text-amber-500" /> },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-1">
                    {m.icon}
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</span>
                  </div>
                  <p className="text-lg font-bold tabular-nums">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <ActionBar
        module="inventory"
        primary={{
          label: "Reorder All",
          icon: RefreshCw,
          onClick: () => setConfirmReorder(true),
        }}
        actions={[
          {
            label: "Liquidate Stock",
            icon: Tag,
            onClick: () => setConfirmLiquidate(true),
          },
          {
            label: "Export Alerts",
            icon: Download,
            onClick: () => {
              exportToCSV(
                reorderItems.map((item) => ({
                  SKU: item.sku,
                  Name: item.name,
                  Stock: item.stock,
                  "Reorder Point": item.reorderPoint,
                  "Lead Time": item.leadTime,
                  Demand: item.demand,
                })),
                "inventory-alerts.csv"
              );
              executeAction({
                action: "Export Alerts",
                module: "inventory",
                detail: `Exporting ${reorderItems.length} reorder alerts to CSV`,
                successMsg: `Exported ${reorderItems.length} reorder alerts`,
              });
            },
          },
        ]}
        relevantAutomations={automations.filter(a => a.module === "inventory")}
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <KpiCard label="Fast-Moving SKUs" value={inventoryData.fastMovingSKUs} unit="" change={12} icon="TrendingUp" />
        <KpiCard label="Slow-Moving SKUs" value={inventoryData.slowMovingSKUs} unit="" change={-8} icon="TrendingDown" />
        <KpiCard label="Dead Stock SKUs" value={inventoryData.deadStockSKUs} unit="" change={-14} icon="AlertTriangle" />
        <KpiCard label="Avg Days to Sell" value={inventoryData.avgDaysToSell} unit="days" change={-5} icon="RefreshCw" />
        <KpiCard label="Dead Stock Value" value={inventoryData.deadStockValue} unit="$" change={-18} icon="DollarSign" />
      </div>

      {/* Inventory Trend Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Inventory Movement Trend</CardTitle>
          <p className="text-xs text-muted-foreground">Value, sold, and ordered — last 6 months (in millions)</p>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: { label: "Inventory Value", color: "oklch(0.65 0.18 65)" },
              sold: { label: "Units Sold", color: "oklch(0.55 0.15 150)" },
              ordered: { label: "Units Ordered", color: "oklch(0.55 0.12 200)" },
            }}
            className="h-[200px] sm:h-[240px] lg:h-[280px] w-full"
          >
            <AreaChart data={inventoryTrendData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v.toFixed(1)}M`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="value" stroke="oklch(0.65 0.18 65)" fill="oklch(0.65 0.18 65)" fillOpacity={0.15} strokeWidth={2} />
              <Line type="monotone" dataKey="sold" stroke="oklch(0.55 0.15 150)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="ordered" stroke="oklch(0.55 0.12 200)" strokeWidth={2} strokeDasharray="3 3" dot={false} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Category Health */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Category Health Dashboard</CardTitle>
            <p className="text-xs text-muted-foreground">Stock turnover and days-to-sell by category</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ turnover: { label: "Turnover Rate", color: "oklch(0.65 0.18 65)" } }} className="h-[180px] sm:h-[200px] lg:h-[240px] w-full">
              <BarChart data={inventoryData.categoryHealth}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="stockTurnover" radius={[4, 4, 0, 0]} barSize={32}>
                  {inventoryData.categoryHealth.map((c, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={c.status === "Fast" ? "oklch(0.6 0.15 150)" : c.status === "Healthy" ? "oklch(0.55 0.12 200)" : c.status === "Monitor" ? "oklch(0.7 0.15 75)" : "oklch(0.6 0.2 25)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.entries(statusColors).map(([status, color]) => (
                <span key={status} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color}`}>{status}</span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dead Stock Alerts */}
        <Card className="border-border/50 border-red-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <CardTitle className="text-base font-semibold">Dead Stock Alerts</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">SKUs with no sales in 90+ days — ${inventoryData.deadStockValue.toLocaleString()} capital trapped</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 px-1 text-xs font-medium text-muted-foreground">Product</th>
                    <th className="text-right py-2 px-1 text-xs font-medium text-muted-foreground">Stock</th>
                    <th className="text-right py-2 px-1 text-xs font-medium text-muted-foreground">Days</th>
                    <th className="text-right py-2 px-1 text-xs font-medium text-muted-foreground">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.deadStockAlerts.map((item) => (
                    <tr key={item.sku} className="border-b border-border/30 hover:bg-red-500/5 transition-colors">
                      <td className="py-2 px-1">
                        <p className="font-medium text-xs truncate max-w-[140px]">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.sku}</p>
                      </td>
                      <td className="py-2 px-1 text-right tabular-nums text-red-500 font-medium">{item.stock}</td>
                      <td className="py-2 px-1 text-right tabular-nums text-red-500">{item.daysSinceSale}d</td>
                      <td className="py-2 px-1 text-right tabular-nums font-medium">${(item.value / 1000).toFixed(1)}K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Reorder Alerts */}
        <Card className="border-border/50 border-amber-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base font-semibold">Reorder Alerts</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">Fast-moving SKUs below reorder point — act now to avoid stockouts</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {inventoryData.reorderAlerts.map((item) => (
              <div key={item.sku} className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/30 shrink-0">{item.demand}</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {item.sku} · Lead time: {item.leadTime} · Reorder point: {item.reorderPoint}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-red-500 tabular-nums">{item.stock}</p>
                  <p className="text-[10px] text-muted-foreground">units left</p>
                  <Button
                    size="sm"
                    className="h-7 text-[10px] gap-1"
                    onClick={() => executeAction({
                      action: `Reorder: ${item.name}`,
                      module: "inventory",
                      detail: `Creating PO for ${item.name} (${item.sku}) — Lead time: ${item.leadTime}`,
                      successMsg: `PO created for ${item.name} (SKU: ${item.sku})`,
                    })}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reorder
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Liquidation Suggestions */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">AI Liquidation Suggestions</CardTitle>
            <p className="text-xs text-muted-foreground">AI-recommended markdowns to free up capital from dead stock</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {inventoryData.liquidationSuggestions.map((item) => (
              <div key={item.sku} className="p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <Badge variant="destructive" className="text-[10px]">-{item.discount}%</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="line-through">${item.currentPrice}</span>
                  <span className="font-semibold text-emerald-600">${item.suggestedPrice}</span>
                  <span className="ml-auto">{item.estimatedDaysToClear} days to clear</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] gap-1"
                    onClick={() => executeAction({
                      action: `Apply Markdown: ${item.name}`,
                      module: "inventory",
                      detail: `Applying ${item.discount}% markdown to ${item.name}: $${item.currentPrice} → $${item.suggestedPrice}`,
                      successMsg: `${item.discount}% markdown applied — ${item.name} now $${item.suggestedPrice}`,
                    })}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bundle Recommendations */}
      <Card className="border-border/50 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Smart Bundle Recommendations</CardTitle>
          <p className="text-xs text-muted-foreground">Pair slow-movers with bestsellers to clear inventory and improve margin</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {inventoryData.bundleRecommendations.map((bundle, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{bundle.margin}%</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Bundle Margin</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-3 w-3 text-red-400 shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">{bundle.slowSKU}</span>
                  </div>
                  <p className="text-center text-[10px] text-muted-foreground">+</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span className="text-xs text-muted-foreground truncate">{bundle.fastSKU}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-primary">${bundle.bundlePrice}</p>
                    <p className="text-[10px] text-muted-foreground line-through">${bundle.individualPrice} separate</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">
                    Save {Math.round(((bundle.individualPrice - bundle.bundlePrice) / bundle.individualPrice) * 100)}%
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[10px] w-full mt-3"
                  onClick={() => executeAction({
                    action: `Create Bundle: ${bundle.slowSKU.split(' ').slice(-2).join(' ')} Bundle`,
                    module: "inventory",
                    detail: `Creating smart bundle: ${bundle.slowSKU} + ${bundle.fastSKU} at $${bundle.bundlePrice}`,
                    successMsg: "Bundle created and listed",
                  })}
                >
                  Create Bundle
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmReorder}
        onOpenChange={setConfirmReorder}
        title="Reorder All Low-Stock Items"
        description={`Create purchase orders for ${reorderItems.length} items that have fallen below their reorder point. This will generate POs with estimated delivery based on each item's lead time.`}
        confirmLabel="Create All POs"
        onConfirm={() => {
          executeAction({
            action: "Reorder All",
            module: "inventory",
            detail: `Creating purchase orders for ${reorderItems.length} items below reorder point`,
            successMsg: `Purchase orders created for ${reorderItems.length} items`,
            simulateDelay: 800,
          });
          setConfirmReorder(false);
        }}
      />

      <ConfirmDialog
        open={confirmLiquidate}
        onOpenChange={setConfirmLiquidate}
        title="Liquidate Dead Stock"
        description="Apply AI-suggested markdowns to all dead stock SKUs. This will update prices on your storefront immediately."
        confirmLabel="Apply All Markdowns"
        variant="destructive"
        onConfirm={() => {
          executeAction({
            action: "Liquidate Stock",
            module: "inventory",
            detail: "Applying AI-suggested markdowns to 5 dead stock SKUs",
            successMsg: "Markdowns applied to 5 dead stock SKUs",
            simulateDelay: 800,
          });
          setConfirmLiquidate(false);
        }}
      />
    </div>
  );
}
