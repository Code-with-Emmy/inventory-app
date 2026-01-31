"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "ACCESSORY",
    description: "",
    sellingPrice: 0,
    costPrice: 0,
    minQuantity: 5,
    quantity: 0,
    image: "",
    unitOfMeasure: "pcs",
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to load product");
      return res.json();
    },
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        brand: product.brand || "",
        category: product.category,
        description: product.description || "",
        sellingPrice: product.sellingPrice,
        costPrice: product.costPrice,
        minQuantity: product.minQuantity,
        quantity: product.quantity,
        image: product.images?.[0]?.url || "",
        unitOfMeasure: product.unitOfMeasure || "pcs",
      });
    }
  }, [product]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sellingPrice: Number(formData.sellingPrice),
          costPrice: Number(formData.costPrice),
          minQuantity: Number(formData.minQuantity),
          quantity: Number(formData.quantity),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      router.push("/products");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  if (isLoading) return <div>Loading product...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="col-span-2">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <Input
            label="Item Code (SKU)"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground/80">
              Category
            </label>
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="ACCESSORY">Accessory</option>
              <option value="PHONE">Phone / Device</option>
              <option value="PART">Part</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <Input
            label="Brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            placeholder="e.g. Apple, Samsung"
          />

          <Input
            label="Selling Price (Market)"
            type="number"
            min="0"
            step="0.01"
            value={formData.sellingPrice}
            onChange={(e) =>
              setFormData({ ...formData, sellingPrice: Number(e.target.value) })
            }
            required
          />

          <Input
            label="Cost Price (Buying)"
            type="number"
            min="0"
            step="0.01"
            value={formData.costPrice}
            onChange={(e) =>
              setFormData({ ...formData, costPrice: Number(e.target.value) })
            }
            required
          />

          <Input
            label="Current Stock"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: Number(e.target.value) })
            }
            required
            // Usually stock shouldn't be edited manually here if we want strict tracking,
            // but for simple edits it's allowed.
          />
          <Input
            label="Low Stock Alert at"
            type="number"
            min="0"
            value={formData.minQuantity}
            onChange={(e) =>
              setFormData({ ...formData, minQuantity: Number(e.target.value) })
            }
            required
          />
          <Input
            label="Unit Type"
            value={formData.unitOfMeasure}
            onChange={(e) =>
              setFormData({ ...formData, unitOfMeasure: e.target.value })
            }
            placeholder="pcs, kg, box"
          />

          <div className="col-span-2 space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Product Image
            </label>
            <div className="flex gap-4 items-center">
              {formData.image && (
                <div className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const data = new FormData();
                  data.set("file", file);

                  try {
                    const res = await fetch("/api/upload", {
                      method: "POST",
                      body: data,
                    });
                    if (!res.ok) throw new Error("Upload failed");
                    const json = await res.json();
                    setFormData({ ...formData, image: json.url });
                  } catch (err) {
                    console.error(err);
                    alert("Image upload failed");
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" isLoading={updateMutation.isPending}>
            Update Product
          </Button>
        </div>
      </form>
    </div>
  );
}
