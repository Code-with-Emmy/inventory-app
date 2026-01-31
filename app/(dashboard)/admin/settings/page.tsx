"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Save, Shield, MinusCircle, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    siteName: "",
    currency: "₦",
    lowStockThreshold: 5,
    allowNegativeStock: false,
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings");
      if (!res.ok) throw new Error("Failed to load settings");
      return res.json();
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName,
        currency: settings.currency,
        lowStockThreshold: settings.lowStockThreshold,
        allowNegativeStock: settings.allowNegativeStock,
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save settings");
      }
      return res.json();
    },
    onSuccess: () => {
        alert("Settings saved successfully");
        queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (err: Error) => {
        alert(err.message);
    }
  });

  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Shield className="h-6 w-6" />
        </div>
        <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">System Settings</h1>
             <p className="text-muted-foreground font-medium text-sm">Configure application behavior and defaults.</p>
        </div>
      </div>

      <div className="glass rounded-4xl p-8 space-y-8">
        <div className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight border-b border-border/50 pb-2">General</h3>
            <Input 
                label="Application Name" 
                value={formData.siteName} 
                onChange={e => setFormData({...formData, siteName: e.target.value})}
                placeholder="FluxStock"
            />
            <Input 
                label="Currency Symbol" 
                value={formData.currency} 
                onChange={e => setFormData({...formData, currency: e.target.value})}
                placeholder="₦"
            />
        </div>

        <div className="space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight border-b border-border/50 pb-2">Inventory Rules</h3>
            <Input 
                label="Global Low Stock Alert Threshold" 
                type="number"
                value={formData.lowStockThreshold} 
                onChange={e => setFormData({...formData, lowStockThreshold: Number(e.target.value)})}
            />
            
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/50">
                <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600">
                        <MinusCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">Allow Negative Stock</p>
                        <p className="text-xs text-muted-foreground">If enabled, sales can proceed even if stock is 0.</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        className="toggle toggle-primary"
                        checked={formData.allowNegativeStock}
                        onChange={e => setFormData({...formData, allowNegativeStock: e.target.checked})}
                    />
                </div>
            </div>
             {formData.allowNegativeStock && (
                <div className="flex items-center gap-2 text-destructive text-xs font-bold p-3 bg-destructive/5 rounded-xl">
                    <AlertTriangle className="h-4 w-4" />
                    Warning: Negative stock usage can cause accounting discrepancies.
                </div>
            )}
        </div>

        <div className="pt-4 flex justify-end">
            <Button onClick={() => saveMutation.mutate()} isLoading={saveMutation.isPending} className="gap-2 font-black">
                <Save className="h-4 w-4" /> Save Configuration
            </Button>
        </div>
      </div>
    </div>
  );
}
