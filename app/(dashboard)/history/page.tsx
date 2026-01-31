"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Package,
  User,
  Calendar,
  Filter,
} from "lucide-react";

type MovementType = "IN" | "OUT" | "ADJUST";

interface StockMovement {
  id: number;
  type: MovementType;
  quantity: number;
  reason: string | null;
  beforeQuantity: number;
  afterQuantity: number;
  createdAt: string;
  product: {
    id: number;
    name: string;
    sku: string;
    brand: string | null;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function HistoryPage() {
  const [filterType, setFilterType] = useState<string>("ALL");

  const { data: movements, isLoading } = useQuery({
    queryKey: ["stock-history", filterType],
    queryFn: async () => {
      const res = await fetch(`/api/stock/history?type=${filterType}`);
      if (!res.ok) throw new Error("Failed to load history");
      return res.json() as Promise<StockMovement[]>;
    },
  });

  const getMovementIcon = (type: MovementType) => {
    switch (type) {
      case "IN":
        return <ArrowUpCircle className="h-5 w-5 text-green-500" />;
      case "OUT":
        return <ArrowDownCircle className="h-5 w-5 text-red-500" />;
      case "ADJUST":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
    }
  };

  const getMovementColor = (type: MovementType) => {
    switch (type) {
      case "IN":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "OUT":
        return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
      case "ADJUST":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Stock Movement History
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track all inventory changes and transactions
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <div className="flex gap-2">
          {["ALL", "IN", "OUT", "ADJUST"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filterType === type
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {type === "ALL" ? "All Movements" : type}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {movements && movements.length > 0 ? (
          movements.map((movement) => (
            <div
              key={movement.id}
              className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                {/* Left Side - Movement Info */}
                <div className="flex gap-4 flex-1">
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl border ${getMovementColor(movement.type)}`}
                  >
                    {getMovementIcon(movement.type)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    {/* Product Name & Type Badge */}
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">
                        {movement.product.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getMovementColor(movement.type)}`}
                      >
                        {movement.type}
                      </span>
                    </div>

                    {/* SKU & Brand */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Package className="h-4 w-4" />
                        <span>SKU: {movement.product.sku}</span>
                      </div>
                      {movement.product.brand && (
                        <span>Brand: {movement.product.brand}</span>
                      )}
                    </div>

                    {/* Quantity Change */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-semibold text-foreground">
                          {movement.type === "IN"
                            ? "+"
                            : movement.type === "OUT"
                              ? "-"
                              : "±"}
                          {movement.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {movement.beforeQuantity} → {movement.afterQuantity}
                        </span>
                      </div>
                    </div>

                    {/* Reason */}
                    {movement.reason && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Reason: </span>
                        <span className="text-foreground">
                          {movement.reason}
                        </span>
                      </div>
                    )}

                    {/* User & Date */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span>{movement.user.name || movement.user.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {format(
                            new Date(movement.createdAt),
                            "MMM dd, yyyy 'at' hh:mm a",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No stock movements found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filterType !== "ALL"
                ? `Try changing the filter to see more results`
                : `Stock movements will appear here once you add or remove inventory`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
