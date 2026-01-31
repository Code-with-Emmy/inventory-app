"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Package,
  AlertTriangle,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Plus,
  ArrowRightLeft,
  ChevronRight,
} from "lucide-react";
import { SalesChart } from "@/app/components/dashboard/SalesChart";
import { Button } from "@/app/components/ui/Button";

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalValue: number;
  totalExpenses: number;
  recentActivity: Array<{
    id: number;
    type: "IN" | "OUT" | "ADJUST";
    quantity: number;
    createdAt: string;
    product: { name: string };
    user: { name: string };
  }>;
  salesData: Array<{ name: string; sales: number }>;
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">
            {" "}
            Analyzing stock data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
            Overview
          </h1>
          <p className="text-muted-foreground font-medium">
            Welcome to your shop dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-xl border border-border/50">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-sm font-bold text-foreground/70 tracking-tight">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Products",
            value: stats?.totalProducts ?? 0,
            icon: Package,
            color: "primary",
            sub: "Active items",
          },
          {
            label: "Low Stock",
            value: stats?.lowStockProducts ?? 0,
            icon: AlertTriangle,
            color:
              (stats?.lowStockProducts ?? 0) > 0 ? "destructive" : "emerald",
            sub: "Attention needed",
          },
          {
            label: "Inventory Value",
            value: `₦${stats?.totalValue?.toLocaleString() ?? "0"}`,
            icon: DollarSign,
            color: "emerald",
            sub: "Market asset value",
          },
          {
            label: "Expenses",
            value: `₦${stats?.totalExpenses?.toLocaleString() ?? "0"}`,
            icon: ArrowDownRight,
            color: "orange",
            sub: "Total acquisition cost",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div
              className={`absolute top-0 right-0 h-32 w-32 translate-x-8 translate-y--8 rounded-full bg-${item.color}/5 blur-3xl group-hover:bg-${item.color}/10 transition-colors`}
            />
            <div className="relative flex flex-col gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-${item.color === "primary" ? "primary" : item.color === "destructive" ? "destructive" : item.color === "orange" ? "orange-500" : "emerald-500"}/10 text-${item.color === "primary" ? "primary" : item.color === "destructive" ? "destructive" : item.color === "orange" ? "orange-600" : "emerald-600"}`}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  {item.label}
                </p>
                <h3 className="text-2xl font-black tracking-tight text-foreground truncate">
                  {item.value}
                </h3>
                <p className="mt-1 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                  {item.sub}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-4xl border border-border bg-card p-8 shadow-sm overflow-hidden relative">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative z-10">
              <div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
                  Sales Overview
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Sales over time
                </p>
              </div>
              <select className="rounded-xl border border-border bg-muted/50 px-4 py-2 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="relative z-10 h-[300px]">
              <SalesChart data={stats?.salesData || []} />
            </div>
            {/* Background design */}
            <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 blur-[100px] pointer-events-none" />
          </div>

          <div className="rounded-4xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border px-8 py-6 flex justify-between items-center bg-muted/20">
              <div>
                <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                  Recent Activity
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  Live updates
                </p>
              </div>
              <Button variant="ghost" size="sm" className="font-bold gap-2">
                History <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="divide-y divide-border/50">
              {stats?.recentActivity?.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted/20 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">
                    No movement recorded yet
                  </p>
                </div>
              ) : (
                stats?.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between px-8 py-5 hover:bg-muted/30 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${
                          activity.type === "IN"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : activity.type === "OUT"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-orange-500/10 text-orange-600"
                        }`}
                      >
                        {activity.type === "IN" && (
                          <ArrowDownRight className="h-6 w-6" />
                        )}
                        {activity.type === "OUT" && (
                          <ArrowUpRight className="h-6 w-6" />
                        )}
                        {activity.type === "ADJUST" && (
                          <RefreshCw className="h-6 w-6" />
                        )}
                      </span>
                      <div>
                        <p className="font-bold text-foreground">
                          {activity.product.name}
                        </p>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                          {activity.user?.name || "System"} •{" "}
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-lg font-black ${activity.type === "OUT" ? "text-destructive" : "text-emerald-600"}`}
                      >
                        {activity.type === "OUT" ? "-" : "+"}
                        {activity.quantity}
                      </span>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">
                        Units
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="rounded-4xl border border-primary/20 bg-linear-to-br from-primary via-primary to-indigo-700 p-8 text-primary-foreground shadow-[0_20px_50px_rgba(var(--primary),0.2)] relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] h-64 w-64 rounded-full bg-white/10 blur-3xl group-hover:bg-white/20 transition-all duration-700" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                Quick Actions
              </h3>
              <p className="text-primary-foreground/70 font-medium text-sm mb-8 leading-relaxed">
                Manage your shop efficiently.
              </p>
              <div className="space-y-4">
                <Link href="/products/new" className="block">
                  <button className="w-full rounded-2xl bg-white text-primary px-6 py-4 text-sm font-black hover:bg-white/90 transition-all flex items-center justify-between group/btn shadow-xl shadow-black/10">
                    Add Inventory{" "}
                    <Plus className="h-5 w-5 transition-transform group-hover/btn:rotate-90" />
                  </button>
                </Link>
                <Link href="/stock" className="block">
                  <button className="w-full rounded-2xl bg-white/10 border border-white/20 px-6 py-4 text-sm font-black hover:bg-white/20 transition-all flex items-center justify-between group/btn">
                    Manage Stock{" "}
                    <ArrowRightLeft className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-border bg-card p-6 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
              Inventory Status
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground/80">
                  Storage Usage
                </span>
                <span className="text-sm font-black text-primary">84%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[84%]" />
              </div>
              <p className="text-[10px] font-medium text-muted-foreground leading-tight">
                Your inventory is currently optimized.{" "}
                {stats?.lowStockProducts || 0} items are approaching low stock
                limits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
