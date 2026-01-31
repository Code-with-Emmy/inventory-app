"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Save,
  ChevronLeft,
  ShoppingCart,
  CreditCard,
  Truck,
  Package,
  ArrowRight,
} from "lucide-react";
import { useUser } from "@/app/hooks/useUser";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

interface Product {
  id: number;
  name: string;
  sku: string;
  costPrice: number;
}

interface Supplier {
  id: string;
  name: string;
}

export default function NewPurchasePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [supplierId, setSupplierId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);

  const [items, setItems] = useState<
    { productId: number; quantity: number; unitCost: number }[]
  >([]);
  const [payments, setPayments] = useState<
    { amount: number; method: string; reference?: string; bankName?: string }[]
  >([]);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => fetch("/api/products").then((res) => res.json()),
  });

  const { data: suppliers } = useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: () => fetch("/api/suppliers").then((res) => res.json()),
  });

  const { data: session } = useUser();

  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.unitCost,
    0,
  );
  const netAmount = subtotal - discount + tax;
  const paidAmount = payments.reduce((acc, p) => acc + p.amount, 0);
  const balance = netAmount - paidAmount;

  const addItem = () => {
    setItems([...items, { productId: 0, quantity: 1, unitCost: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;

    // Auto-fill unit cost if product matches
    if (field === "productId" && value !== 0) {
      const product = products?.find((p) => p.id === Number(value));
      if (product) newItems[index].unitCost = product.costPrice;
    }

    setItems(newItems);
  };

  const addPayment = () => {
    setPayments([
      ...payments,
      { amount: balance > 0 ? balance : 0, method: "CASH" },
    ]);
  };

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const updatePayment = (index: number, field: string, value: any) => {
    const newPayments = [...payments];
    (newPayments[index] as any)[field] = value;
    setPayments(newPayments);
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to record purchase");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/purchases");
    },
  });

  const handleSubmit = () => {
    if (!supplierId || items.length === 0) {
      alert("Please select a supplier and add at least one item.");
      return;
    }

    createMutation.mutate({
      invoiceNumber,
      supplierId,
      userId: session?.user?.id,
      totalAmount: subtotal,
      discount,
      tax,
      netAmount,
      items: items.map((i) => ({
        productId: Number(i.productId),
        quantity: Number(i.quantity),
        unitCost: Number(i.unitCost),
        totalCost: i.quantity * i.unitCost,
      })),
      payments: payments.map((p) => ({
        ...p,
        amount: Number(p.amount),
      })),
      notes,
    });
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="h-10 w-10 p-0 rounded-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
              Acquisition{" "}
              <span className="text-primary text-gradient">Flow</span>
            </h1>
            <p className="text-muted-foreground font-medium text-xs">
              Record incoming stock and finalize procurement financials.
            </p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          isLoading={createMutation.isPending}
          className="gap-2 font-black shadow-lg shadow-primary/20"
        >
          <Save className="h-5 w-5" /> Commit Transaction
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-4xl p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tight">
                Inventory Items
              </h2>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-wrap gap-4 items-end p-4 rounded-3xl bg-muted/20 border border-border/50 group"
                >
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-1 block">
                      Product
                    </label>
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        updateItem(index, "productId", e.target.value)
                      }
                      className="w-full bg-background border-2 border-input rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary transition-all"
                    >
                      <option value={0}>Select Product...</option>
                      {products?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <Input
                      label="Qty"
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      label="Unit Cost"
                      type="number"
                      value={item.unitCost}
                      onChange={(e) =>
                        updateItem(index, "unitCost", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-32 hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-1">
                      Total
                    </p>
                    <p className="font-black text-foreground pt-3 px-1">
                      ₦{(item.quantity * item.unitCost).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => removeItem(index)}
                    className="h-10 w-10 p-0 text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}

              <Button
                onClick={addItem}
                variant="outline"
                className="w-full h-14 border-dashed rounded-3xl font-bold gap-2 text-muted-foreground hover:text-primary"
              >
                <Plus className="h-5 w-5" /> Add Another Product
              </Button>
            </div>
          </div>

          <div className="glass rounded-4xl p-8 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-emerald-500" />
              <h2 className="text-xl font-black uppercase tracking-tight">
                Payment Schedule
              </h2>
            </div>

            <div className="space-y-4">
              {payments.map((payment, index) => (
                <div
                  key={index}
                  className="flex flex-wrap gap-4 items-end p-4 rounded-3xl bg-emerald-500/5 border border-emerald-500/20"
                >
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-1 block">
                      Method
                    </label>
                    <select
                      value={payment.method}
                      onChange={(e) =>
                        updatePayment(index, "method", e.target.value)
                      }
                      className="w-full bg-background border-2 border-input rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-emerald-500 transition-all"
                    >
                      {[
                        "CASH",
                        "TRANSFER",
                        "POS",
                        "MOBILE_MONEY",
                        "CREDIT_CARD",
                        "DEBIT_CARD",
                        "CHEQUE",
                      ].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <Input
                      label="Amount"
                      type="number"
                      value={payment.amount}
                      onChange={(e) =>
                        updatePayment(index, "amount", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <Input
                      label="Ref / Bank Name"
                      placeholder="e.g. GTBank Ref"
                      value={payment.reference}
                      onChange={(e) =>
                        updatePayment(index, "reference", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => removePayment(index)}
                    className="h-10 w-10 p-0 text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}

              <Button
                onClick={addPayment}
                variant="outline"
                className="w-full h-14 border-dashed rounded-3xl font-bold gap-2 text-muted-foreground hover:text-emerald-500"
              >
                <Plus className="h-5 w-5" /> Add Payment Method
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-8">
          <div className="glass rounded-4xl p-8 space-y-6 sticky top-10">
            <div className="flex items-center gap-3 mb-2">
              <Truck className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-tight">
                Vendor Details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">
                  Source Supplier
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-background border-2 border-input rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                >
                  <option value="">Select Supplier...</option>
                  {suppliers?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Invoice Number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. INV-2024-001"
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground/80 ml-1">
                  Internal Notes
                </label>
                <textarea
                  className="w-full rounded-xl border-2 bg-background px-4 py-3 text-sm font-medium outline-none transition-all duration-300 border-input hover:border-muted-foreground/30 focus:border-primary"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe transaction context..."
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-muted-foreground uppercase tracking-tight">
                  Subtotal
                </span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
                <Input
                  label="Tax Impact"
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-between items-center bg-primary/5 p-4 rounded-2xl">
                <span className="text-sm font-black uppercase tracking-tight text-primary">
                  Total Commitment
                </span>
                <span className="text-2xl font-black text-primary">
                  ₦{netAmount.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted-foreground">
                    Amount Liquidated
                  </span>
                  <span className="text-emerald-600">
                    ₦{paidAmount.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((paidAmount / (netAmount || 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
                {balance > 0 && (
                  <div className="flex justify-between text-[10px] font-black uppercase text-destructive tracking-widest pt-1">
                    <span>Outstanding Debt</span>
                    <span>₦{balance.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
