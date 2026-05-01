"use client";

import { productData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie,
} from "recharts";

const COLORS = ["oklch(0.65 0.18 65)", "oklch(0.6 0.15 340)", "oklch(0.55 0.12 200)", "oklch(0.7 0.1 140)", "oklch(0.6 0.2 30)", "oklch(0.5 0.15 260)"];

export function ProductPerformance() {
  const categoryPieData = productData.topCategories.map((c) => ({
    name: c.category,
    value: c.revenue,
    fill: COLORS[productData.topCategories.indexOf(c) % COLORS.length],
  }));

  const occasionPieData = productData.occasionInsights.map((o) => ({
    name: o.occasion,
    value: o.share,
    fill: COLORS[productData.occasionInsights.indexOf(o) % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Best Sellers */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Best Selling Products</CardTitle>
          <p className="text-xs text-muted-foreground">Top performing SKUs this quarter</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-2 px-2 text-xs font-medium text-muted-foreground">Material</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Price</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Sold</th>
                  <th className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">Rating</th>
                  <th className="text-right py-2 px-2 text-xs font-medium text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {productData.bestSellers.map((p) => (
                  <tr key={p.sku} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 px-2">
                      <p className="font-medium text-xs max-w-[160px] truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.sku}</p>
                    </td>
                    <td className="py-2.5 px-2">
                      <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                    </td>
                    <td className="py-2.5 px-2 text-xs text-muted-foreground max-w-[120px] truncate">{p.material}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums">${p.price.toLocaleString()}</td>
                    <td className="py-2.5 px-2 text-right tabular-nums">{p.sold}</td>
                    <td className="py-2.5 px-2 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium">{p.rating}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums font-medium">${(p.revenue / 1000).toFixed(1)}K</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Category Revenue */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ revenue: { label: "Revenue", color: "oklch(0.65 0.18 65)" } }} className="h-[260px] w-full">
              <BarChart data={productData.topCategories}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} barSize={32}>
                  {productData.topCategories.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Material Performance */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Revenue by Material</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ revenue: { label: "Revenue", color: "oklch(0.65 0.18 65)" } }} className="h-[260px] w-full">
              <BarChart data={productData.materialPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <YAxis dataKey="material" type="category" tick={{ fontSize: 10 }} width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="oklch(0.65 0.18 65)" radius={[0, 4, 4, 0]} barSize={22} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Occasion Insights */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Purchase Occasion Insights</CardTitle>
          <p className="text-xs text-muted-foreground">Jewelry-specific purchase occasion analysis</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {productData.occasionInsights.map((o, i) => (
              <div key={o.occasion} className="p-3 rounded-lg bg-muted/20 text-center hover:bg-muted/40 transition-colors">
                <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${COLORS[i % COLORS.length]}20` }}>
                  <span className="text-xs font-bold" style={{ color: COLORS[i % COLORS.length] }}>{o.share}%</span>
                </div>
                <p className="text-sm font-medium">{o.occasion}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Avg ${o.avgSpend}</p>
                <p className="text-[10px] text-muted-foreground">Peak: {o.peakMonth}</p>
                <Badge variant={o.growth >= 20 ? "default" : "outline"} className="text-[10px] mt-1">
                  +{o.growth}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
