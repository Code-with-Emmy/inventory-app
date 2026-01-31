"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Truck,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useState } from "react";

interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function SuppliersPage() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: suppliers, isLoading } = useQuery<Supplier[]>({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const res = await fetch("/api/suppliers");
      if (!res.ok) throw new Error("Failed to fetch suppliers");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newSupplier: Partial<Supplier>) => {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier),
      });
      if (!res.ok) throw new Error("Failed to create supplier");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setIsAdding(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      name: formData.get("name") as string,
      contactName: formData.get("contactName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    });
  };

  const filteredSuppliers = suppliers?.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contactName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading)
    return <div className="p-8 text-center">Loading suppliers...</div>;

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
            Suppliers <span className="text-primary text-gradient">List</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Manage who you buy from.
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2 font-black">
          <Plus className="h-5 w-5" /> Add Supplier
        </Button>
      </div>

      <div className="glass rounded-4xl p-6 flex items-center gap-4">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          placeholder="Search suppliers..."
          className="bg-transparent border-none outline-none w-full text-sm font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="glass rounded-4xl w-full max-w-xl p-10 shadow-2xl relative animate-fade-in">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8">
              Add New Supplier
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Input
                  label="Company Name"
                  name="name"
                  required
                  placeholder="Acme Corp"
                />
                <Input
                  label="Contact Person"
                  name="contactName"
                  placeholder="John Doe"
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="john@acme.com"
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  placeholder="+234 ..."
                />
              </div>
              <Input
                label="Business Address"
                name="address"
                placeholder="123 Main St, Lagos"
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={createMutation.isPending}
                  className="font-black px-8"
                >
                  Add Supplier
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers?.map((supplier) => (
          <div
            key={supplier.id}
            className="group relative overflow-hidden rounded-4xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-12 translate-y--12 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />
            <div className="relative space-y-6">
              <div className="flex items-start justify-between">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Truck className="h-7 w-7" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 rounded-xl"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>

              <div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">
                  {supplier.name}
                </h3>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  Contact: {supplier.contactName || "N/A"}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/50">
                {supplier.email && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                    <Mail className="h-4 w-4 text-primary" /> {supplier.email}
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                    <Phone className="h-4 w-4 text-primary" /> {supplier.phone}
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                    <MapPin className="h-4 w-4 text-primary" />{" "}
                    {supplier.address}
                  </div>
                )}
              </div>

              <Link
                href={`/suppliers/${supplier.id}`}
                className="block w-full mt-2"
              >
                <Button
                  variant="secondary"
                  className="w-full font-black uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                >
                  View Purchases
                </Button>
              </Link>
            </div>
          </div>
        ))}

        {filteredSuppliers?.length === 0 && (
          <div className="col-span-full py-20 text-center glass rounded-4xl">
            <Truck className="h-20 w-20 text-muted/20 mx-auto mb-6" />
            <p className="text-muted-foreground font-black uppercase tracking-widest">
              No suppliers found
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setIsAdding(true)}
            >
              Add First Supplier
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
