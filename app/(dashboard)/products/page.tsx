"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import {
  Plus,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  Package,
  Layers,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  brand?: string;
  category: "PHONE" | "ACCESSORY" | "PART" | "OTHER";
  quantity: number;
  sellingPrice: number;
  createdAt: string;
  images: Array<{ url: string }>;
}

export default function ProductsPage() {
  const queryClient = useQueryClient();
  // ... (rest of component)
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Layers className="h-10 w-10 animate-pulse text-primary" />
          <p className="text-muted-foreground font-semibold">
            Loading your catalog...
          </p>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="rounded-3xl bg-destructive/5 border border-destructive/10 p-12 text-center">
        <p className="text-destructive font-bold text-lg">
          Failed to sync product catalog
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry Sync
        </Button>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
            Product <span className="text-primary text-gradient">List</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            View and manage items in your shop.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/api/reports/export" target="_blank" rel="noreferrer">
            <Button
              variant="outline"
              className="gap-2 font-bold ring-offset-background"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </a>
          <Link href="/products/new">
            <Button className="gap-2 font-black shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" /> New Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="glass rounded-4xl p-4 flex flex-col md:flex-row gap-4 items-center mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            placeholder="Search by name, code, or category..."
            className="w-full bg-transparent pl-12 pr-4 py-3 text-sm font-medium outline-none placeholder:text-muted-foreground/50 border-none focus:ring-0"
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
          {/* <Button variant="secondary" size="sm" className="font-bold px-4">Sort</Button> */}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-4xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Product Information
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Category / Brand
              </th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Price
              </th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                In Stock
              </th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {products?.map((product) => (
              <tr
                key={product.id}
                className="group hover:bg-muted/20 transition-all"
              >
                <td className="px-8 py-6">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex items-center gap-4"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform overflow-hidden">
                      {product.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="font-black text-foreground text-sm uppercase tracking-tight">
                        {product.name}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground/70 tracking-widest">
                        Code: {product.sku}
                      </div>
                      <div className="text-[10px] font-normal text-muted-foreground mt-1">
                        Added: {new Date(product.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1.5">
                    <span
                      className={`inline-flex w-fit rounded-lg px-2.5 py-1 text-[10px] font-black tracking-widest uppercase ${
                        product.category === "PHONE"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-foreground/70"
                      }`}
                    >
                      {product.category}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {product.brand || "Generic"}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="font-black text-foreground">
                    ₦{product.sellingPrice.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">
                    each
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div
                    className={`text-lg font-black ${product.quantity > 10 ? "text-foreground" : "text-destructive animate-pulse"}`}
                  >
                    {product.quantity}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">
                    Available
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/products/${product.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10 hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this product?",
                          )
                        ) {
                          deleteMutation.mutate(product.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {products?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <Package className="h-16 w-16 text-muted/20 mx-auto mb-4" />
                  <p className="text-muted-foreground font-black uppercase tracking-widest">
                    No products found
                  </p>
                  <Link href="/products/new" className="mt-4 inline-block">
                    <Button variant="outline">Add First Product</Button>
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {products?.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="glass p-6 rounded-4xl space-y-4 active:scale-[0.98] transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground uppercase tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground tracking-widest">
                      Code: {product.sku} | Added:{" "}
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex rounded-lg px-2 py-1 text-[10px] font-black tracking-widest uppercase ${
                    product.category === "PHONE"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-foreground/70"
                  }`}
                >
                  {product.category}
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Price
                  </p>
                  <p className="font-black text-foreground text-lg">
                    ₦{product.sellingPrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Quantity
                  </p>
                  <p
                    className={`font-black text-lg ${product.quantity > 0 ? "text-emerald-600" : "text-destructive"}`}
                  >
                    {product.quantity}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {products?.length === 0 && (
          <div className="glass p-12 rounded-4xl text-center">
            <Package className="h-12 w-12 text-muted/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-black tracking-widest uppercase">
              Catalog is empty
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
