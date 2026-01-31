"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

interface Product {
  id: number;
  name: string;
  sku: string;
  sellingPrice: number;
  category: "PHONE" | "ACCESSORY" | "PART" | "OTHER";
  quantity: number;
}

export default function StockPage() {
  const queryClient = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [quantity, setQuantity] = useState(1);
  const [identifiers, setIdentifiers] = useState<string>(""); // Textarea for IMEIs

  // Transaction Fields
  const [salePrice, setSalePrice] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [supplier, setSupplier] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentReference, setPaymentReference] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: products } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const selectedProduct = products?.find(
    (p) => p.id.toString() === selectedProductId,
  );
  const isPhone = selectedProduct?.category === "PHONE";

  // Auto-fill price when product selected
  useEffect(() => {
    if (selectedProduct && type === "OUT") {
      setSalePrice(selectedProduct.sellingPrice);
    }
  }, [selectedProduct, type]);

  const stockMutation = useMutation({
    mutationFn: async () => {
      const idList = isPhone
        ? identifiers.split("\n").filter((s) => s.trim().length > 0)
        : [];

      const payload = {
        type,
        productId: Number(selectedProductId),
        quantity: isPhone ? idList.length : quantity,
        identifiers: isPhone ? idList : undefined,
        // New Fields
        salePrice: type === "OUT" ? salePrice : undefined,
        costPrice: type === "IN" ? costPrice : undefined,
        supplier: type === "IN" ? supplier : undefined,
        paymentMethod,
        paymentReference: paymentReference || undefined,
      };

      const res = await fetch("/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Stock update failed");
      }
      return res.json();
    },
    onSuccess: () => {
      setSuccess("Transaction recorded successfully");
      setError("");
      setIdentifiers("");
      setQuantity(1);
      setSupplier("");
      setPaymentReference("");
      // Reset Prices isn't always desired, but safe default
      if (type === "IN") setCostPrice(0);

      queryClient.invalidateQueries({ queryKey: ["products"] });
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: (err: Error) => {
      setError(err.message);
      setSuccess("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      setError("Please select a product");
      return;
    }
    stockMutation.mutate();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {type === "IN" ? "Add Stock" : "Sell Item"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        {/* Type Toggles */}
        <div className="flex rounded-lg border border-border bg-muted p-1 mb-6">
          <button
            type="button"
            onClick={() => setType("IN")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              type === "IN"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Add Stock (IN)
          </button>
          <button
            type="button"
            onClick={() => setType("OUT")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              type === "OUT"
                ? "bg-background text-emerald-500 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sell Stock (OUT)
          </button>
        </div>

        {/* Product Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground/80">
            Select Product
          </label>
          <select
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
          >
            <option value="">-- Choose Product --</option>
            {products?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (SKU: {p.sku}) - Stock: {p.quantity} - ₦
                {p.sellingPrice}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quantity / Identifiers */}
          <div>
            {selectedProduct && isPhone ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">
                  {type === "IN"
                    ? "Enter IMEIs (One per line)"
                    : "Select/Enter IMEIs to Sell"}
                </label>
                <textarea
                  className="w-full h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono text-foreground"
                  placeholder="ENTER IMEI..."
                  value={identifiers}
                  onChange={(e) => setIdentifiers(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Lines count:{" "}
                  {identifiers.split("\n").filter((s) => s.trim()).length}
                </p>
              </div>
            ) : (
              <Input
                label="Quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="mt-0!"
              />
            )}
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            {type === "IN" && (
              <>
                <Input
                  label="Cost Price (each)"
                  type="number"
                  min="0"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  placeholder="0.00"
                  className="mt-0!"
                />
                <Input
                  label="Supplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Vendor Name"
                  className="mt-0!"
                />
              </>
            )}

            {type === "OUT" && (
              <Input
                label="Selling Price (each)"
                type="number"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                placeholder="0.00"
                className="mt-0!"
              />
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-border">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">
              Payment Method
            </label>
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary text-foreground"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="CASH">Cash</option>
              <option value="IsTRANSFER">Transfer</option>
              {/* Typo fix in manual entry if needed, but value matches Enum */}
              <option value="TRANSFER">Transfer</option>
              <option value="POS">POS</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <Input
              label="Payment Reference (Optional)"
              placeholder={type === "IN" ? "Invoice #" : "Receipt #"}
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              className="mt-0!"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-500 font-medium">
            {success}
          </div>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full"
            variant={type === "IN" ? "primary" : "success"}
            isLoading={stockMutation.isPending}
          >
            {type === "IN" ? "Add Stock" : "Complete Sale"}
          </Button>
        </div>
      </form>
    </div>
  );
}
