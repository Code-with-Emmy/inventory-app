"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  ShoppingCart,
  Calendar,
  User,
  ArrowRight,
  MoreHorizontal,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

interface Purchase {
  id: string;
  invoiceNumber?: string;
  purchaseDate: string;
  supplier: { name: string };
  user: { name: string };
  totalAmount: number;
  netAmount: number;
  status: string;
  _count: { items: number };
}

export default function PurchasesPage() {
  const { data: purchases, isLoading } = useQuery<Purchase[]>({
    queryKey: ["purchases"],
    queryFn: async () => {
      const res = await fetch("/api/purchases");
      if (!res.ok) throw new Error("Failed to fetch purchases");
      return res.json();
    },
  });

  if (isLoading)
    return (
      <div className="p-8 text-center text-muted-foreground font-medium">
        Loading purchases...
      </div>
    );

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
            Purchase <span className="text-primary text-gradient">History</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Track items bought for your shop.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 font-bold ring-offset-background"
          >
            <Download className="h-4 w-4" /> Export List
          </Button>
          <Link href="/purchases/new">
            <Button className="gap-2 font-black shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" /> Add Purchase
            </Button>
          </Link>
        </div>
      </div>

      <div className="glass rounded-4xl p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full relative">
          <input
            placeholder="Search reference # or supplier..."
            className="w-full bg-transparent pl-4 pr-4 py-3 text-sm font-medium outline-none placeholder:text-muted-foreground/50 border-none focus:ring-0"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 font-bold px-4"
          >
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="hidden md:block rounded-4xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Date
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Supplier
              </th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Items
              </th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Total Cost
              </th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Status
              </th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {purchases?.map((purchase) => (
              <tr
                key={purchase.id}
                className="group hover:bg-muted/20 transition-all"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">
                        {new Date(purchase.purchaseDate).toLocaleString()}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                        By {purchase.user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="font-black text-foreground text-sm uppercase tracking-tight">
                    {purchase.supplier.name}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                    Ref: {purchase.invoiceNumber || "-"}
                  </div>
                </td>
                <td className="px-8 py-6 text-right font-black text-foreground">
                  {purchase._count.items} Products
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="font-black text-emerald-600 text-lg">
                    ₦{purchase.netAmount.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest line-through decoration-destructive/30">
                    ₦{purchase.totalAmount.toLocaleString()}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <span
                    className={`inline-flex rounded-lg px-2.5 py-1 text-[10px] font-black tracking-widest uppercase ${
                      purchase.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-orange-500/10 text-orange-600"
                    }`}
                  >
                    {purchase.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <Link href={`/purchases/${purchase.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 rounded-xl"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {purchases?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <ShoppingCart className="h-16 w-16 text-muted/20 mx-auto mb-4" />
                  <p className="text-muted-foreground font-black uppercase tracking-widest">
                    No purchases found
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {purchases?.map((purchase) => (
          <div key={purchase.id} className="glass p-6 rounded-4xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="font-black text-foreground uppercase tracking-tight leading-tight">
                {purchase.supplier.name}
              </div>
              <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-lg uppercase tracking-widest">
                {purchase.status}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  Total Paid
                </p>
                <p className="font-black text-emerald-600 text-xl">
                  ₦{purchase.netAmount.toLocaleString()}
                </p>
              </div>
              <Link href={`/purchases/${purchase.id}`}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest"
                >
                  Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
