import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) { // Allow any logged in user to export for now, or restrict to Admin
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
        orderBy: { name: 'asc' }
    });

    // Define CSV Headers
    const headers = ["ID", "Name", "SKU", "Category", "Brand", "Quantity", "Price", "Min Quantity", "Total Value"];
    
    // Generate CSV Rows
    const rows = products.map(p => [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`, // Escape quotes
        p.sku,
        p.category,
        p.brand || "",
        p.quantity,
        p.sellingPrice,
        p.minQuantity,
        (p.quantity * p.sellingPrice).toFixed(2)
    ]);

    // Combine
    const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
    ].join("\n");

    return new NextResponse(csvContent, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="inventory_export_${new Date().toISOString().split('T')[0]}.csv"`
        }
    });

  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
