"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, use } from "react";
import Link from "next/link";
import {
  Plus,
  ArrowLeft,
  Package,
  Tag,
  DollarSign,
  AlertTriangle,
  History,
  ShieldCheck,
  Calendar,
  Layers,
  Info,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { Button } from "@/app/components/ui/Button";

interface ProductDetail {
  id: number;
  name: string;
  sku: string;
  brand?: string;
  category: string;
  subCategory?: string;
  unitOfMeasure: string;
  condition: string;
  quantity: number;
  minQuantity: number;
  costPrice: number;
  sellingPrice: number;
  taxApplicable: boolean;
  expiryDate?: string;
  batchNumber?: string;
  status: string;
  description?: string;
  images: Array<{ url: string }>;
  stockMovement: Array<{
    id: number;
    type: string;
    quantity: number;
    reason?: string;
    beforeQuantity: number;
    afterQuantity: number;
    createdAt: string;
    user: { name: string };
  }>;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: product, isLoading } = useQuery<ProductDetail>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to load product");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Package className="h-10 w-10 animate-bounce text-primary" />
          <p className="text-muted-foreground font-semibold">
            Retrieving asset data...
          </p>
        </div>
      </div>
    );
  }

  if (!product)
    return (
      <div className="p-8 text-center text-destructive font-bold">
        Product not found in registry
      </div>
    );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header & Navigation */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          <a
            href="/products"
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
            Back to Products
          </a>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
              {product.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                {product.sku}
              </span>
              <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {product.category}
              </span>
              <span
                className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                  product.status === "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-orange-500/10 text-orange-600"
                }`}
              >
                {product.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="font-bold">
            History
          </Button>
          <Link href={`/products/${id}/edit`}>
            <Button className="font-black">Edit Product</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left: Visuals & Core Specs */}
        <div className="lg:col-span-2 space-y-8">
          {product.images?.length > 0 && (
            <div className="glass rounded-4xl p-2 relative group overflow-hidden md:min-h-[300px] flex items-center justify-center bg-white/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full max-h-[500px] object-contain rounded-3xl"
              />
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Main Stats */}
            <div className="glass rounded-4xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <Layers className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Current Stock
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Current Inventory
                    </p>
                    <p
                      className={`text-5xl font-black ${product.quantity <= product.minQuantity ? "text-destructive" : "text-foreground"}`}
                    >
                      {product.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Threshold
                    </p>
                    <p className="font-bold">
                      {product.minQuantity} {product.unitOfMeasure}
                    </p>
                  </div>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${product.quantity <= product.minQuantity ? "bg-destructive" : "bg-primary"}`}
                    style={{
                      width: `${Math.min((product.quantity / (product.minQuantity * 3)) * 100, 100)}%`,
                    }}
                  />
                </div>
                {product.quantity <= product.minQuantity && (
                  <div className="flex items-center gap-2 text-destructive font-bold text-xs p-3 bg-destructive/5 rounded-xl border border-destructive/10">
                    <AlertTriangle className="h-4 w-4" /> REORDER REQUIRED
                    IMMEDIATELY
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-4xl p-8 space-y-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-6 w-6 text-emerald-500" />
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Price Info
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-border/50 pb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Cost Price
                  </span>
                  <span className="font-black text-foreground">
                    ₦{product.costPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Selling Price
                  </span>
                  <span className="font-black text-emerald-600">
                    ₦{product.sellingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between bg-emerald-500/5 p-4 rounded-2xl">
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                    Total Value
                  </span>
                  <span className="font-black text-emerald-700">
                    ₦{(product.quantity * product.costPrice).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Attributes */}
          <div className="glass rounded-4xl p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Info className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tight">
                Product Details
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  label: "Sub-Category",
                  value: product.subCategory || "Generic",
                  icon: Tag,
                },
                {
                  label: "Condition",
                  value: product.condition,
                  icon: ShieldCheck,
                },
                {
                  label: "Unit Type",
                  value: product.unitOfMeasure,
                  icon: Layers,
                },
                {
                  label: "Tax System",
                  value: product.taxApplicable ? "Taxable" : "Exempt",
                  icon: CreditCard,
                },
                {
                  label: "Batch/Lot",
                  value: product.batchNumber || "Unassigned",
                  icon: Package,
                },
                {
                  label: "Expiry Date",
                  value: product.expiryDate
                    ? new Date(product.expiryDate).toLocaleDateString()
                    : "No Expiry",
                  icon: Calendar,
                },
              ].map((attr, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <attr.icon className="h-3 w-3" /> {attr.label}
                  </div>
                  <p className="font-black text-sm uppercase tracking-tight">
                    {attr.value}
                  </p>
                </div>
              ))}
            </div>

            {product.description && (
              <div className="pt-8 border-t border-border/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                  Product Description
                </p>
                <p className="text-sm font-medium text-foreground/80 leading-relaxed bg-muted/20 p-6 rounded-3xl">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Activity Audit */}
        <div className="space-y-8">
          <div className="glass rounded-4xl overflow-hidden">
            <div className="bg-muted/50 p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-black uppercase tracking-tight text-sm">
                Recent Activity
              </h3>
              <History className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="divide-y divide-border/50">
              {product.stockMovement.map((move) => (
                <div
                  key={move.id}
                  className="p-6 hover:bg-muted/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        move.type === "IN"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : move.type === "OUT"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-orange-500/10 text-orange-600"
                      }`}
                    >
                      {move.type} {move.reason && `• ${move.reason}`}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {new Date(move.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-black text-sm text-foreground">
                      {move.type === "OUT" ? "-" : "+"}
                      {move.quantity} Units
                    </p>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Inventory
                      </p>
                      <p className="text-xs font-bold">
                        {move.beforeQuantity} → {move.afterQuantity}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-2">
                    User: {move.user.name}
                  </p>
                </div>
              ))}
              {product.stockMovement.length === 0 && (
                <div className="p-10 text-center text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">
                    No activity found
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="secondary"
              className="w-full rounded-none border-t border-border font-black uppercase tracking-widest text-[10px] py-4"
            >
              View Full History <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
