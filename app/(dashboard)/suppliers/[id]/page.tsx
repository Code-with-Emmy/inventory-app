"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Truck, Mail, Phone, MapPin, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

interface SupplierDetail {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  purchases: Array<{
    id: string;
    invoiceNumber?: string;
    purchaseDate: string;
    totalAmount: number;
    netAmount: number;
    status: string;
    user: { name: string };
    _count: { items: number };
  }>;
}

export default function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: supplier, isLoading } = useQuery<SupplierDetail>({
    queryKey: ["supplier", id],
    queryFn: async () => {
      const res = await fetch(`/api/suppliers/${id}`);
      if (!res.ok) throw new Error("Failed to load supplier");
      return res.json();
    },
  });

  if (isLoading) return <div className="p-10 text-center">Loading vendor profile...</div>;
  if (!supplier) return <div className="p-10 text-center">Supplier not found</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/suppliers" className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest w-fit">
            <ArrowLeft className="h-4 w-4" /> Back to Suppliers
        </Link>
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">{supplier.name}</h1>
                <p className="text-muted-foreground font-medium flex items-center gap-2 mt-1">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded textxs font-bold uppercase tracking-wider">Active Vendor</span>
                </p>
            </div>
            <Link href="/purchases/new">
                <Button className="font-black gap-2">
                    <ShoppingCart className="h-4 w-4" /> New Purchase
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Info Card */}
        <div className="glass rounded-4xl p-8 h-fit space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <Truck className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-black uppercase tracking-tight">Contact Profile</h2>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Person</label>
                    <p className="font-bold text-lg">{supplier.contactName || "N/A"}</p>
                </div>
                <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</label>
                        <p className="font-medium">{supplier.email || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone</label>
                        <p className="font-medium">{supplier.phone || "N/A"}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Address</label>
                        <p className="font-medium max-w-[200px]">{supplier.address || "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Purchase History */}
        <div className="lg:col-span-2 space-y-6">
             <div className="glass rounded-4xl overflow-hidden">
                <div className="bg-muted/50 p-6 border-b border-border flex items-center justify-between">
                    <h3 className="font-black uppercase tracking-tight text-sm">Purchase History</h3>
                    <span className="text-xs font-bold bg-muted px-2 py-1 rounded-lg text-muted-foreground">
                        {supplier.purchases.length} Transactions
                    </span>
                </div>
                <div className="divide-y divide-border/50">
                    {supplier.purchases.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest">No purchases recorded yet</p>
                        </div>
                    ) : (
                        supplier.purchases.map(purchase => (
                            <div key={purchase.id} className="p-6 hover:bg-muted/30 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-foreground">
                                            {new Date(purchase.purchaseDate).toLocaleDateString()}
                                        </span>
                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                                            purchase.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'
                                        }`}>
                                            {purchase.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        Ref: {purchase.invoiceNumber || "N/A"} • By {purchase.user.name}
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Items</p>
                                        <p className="font-bold">{purchase._count.items}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</p>
                                        <p className="font-black text-emerald-600">₦{purchase.netAmount.toLocaleString()}</p>
                                    </div>
                                    <Link href={`/purchases/${purchase.id}`}>
                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg">
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
