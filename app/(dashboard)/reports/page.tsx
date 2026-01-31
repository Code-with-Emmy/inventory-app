"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/app/components/ui/Button";

export default function ReportsPage() {
  const [filterMethod, setFilterMethod] = useState("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["purchase-reports", filterMethod],
    queryFn: async () => {
      const res = await fetch(
        `/api/reports/purchases?paymentMethod=${filterMethod}`,
      );
      if (!res.ok) throw new Error("Failed to load reports");
      return res.json();
    },
  });

  if (isLoading) return <div>Loading reports...</div>;

  const { transactions, spendingSummary } = data || {
    transactions: [],
    spendingSummary: [],
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Purchase Reports</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {spendingSummary.map((item: any) => (
          <div
            key={item.paymentMethod || "UNKNOWN"}
            className="bg-card p-4 rounded-xl shadow-sm border border-border"
          >
            <div className="text-sm text-muted-foreground font-medium">
              {item.paymentMethod || "Other"} Total Spent
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              ₦{item.total.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
          <h2 className="font-semibold text-foreground">Purchase List</h2>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="rounded-lg border-input bg-background text-foreground text-sm p-2 border outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Payment Methods</option>
            <option value="CASH">Cash</option>
            <option value="TRANSFER">Transfer</option>
            <option value="POS">POS</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Qty
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Price (Each)
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Reference
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {transactions.map((tx: any) => (
              <tr key={tx.id} className="hover:bg-muted/30">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {tx.product?.name}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({tx.product?.sku})
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    IN
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-muted-foreground">
                  {tx.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-muted-foreground">
                  ₦{(tx.costPrice || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-foreground font-medium">
                  ₦{(tx.quantity * (tx.costPrice || 0)).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {tx.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {tx.paymentReference || "-"}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
