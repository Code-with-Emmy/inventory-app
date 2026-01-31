import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.systemSettings.findUnique({ where: { id: "settings" } });
    const lowStockThreshold = settings?.lowStockThreshold || 5;

    const results = await prisma.$transaction([
      prisma.product.count({ where: { status: { not: "ARCHIVED" } } }),
      prisma.product.count({
        where: {
          status: { not: "ARCHIVED" },
          quantity: { lte: lowStockThreshold }
        }
      }),
      prisma.stockMovement.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          product: { select: { name: true } },
          user: { select: { name: true } }
        }
      }),
      prisma.product.findMany({
        where: { status: { not: "ARCHIVED" } },
        select: {
          sellingPrice: true,
          quantity: true
        }
      }),
      prisma.stockMovement.findMany({
        where: {
          type: "OUT",
          createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
        },
        select: {
          createdAt: true,
          quantity: true,
          product: { select: { sellingPrice: true } }
        }
      }),
      prisma.purchase.aggregate({
        _sum: { netAmount: true }
      })
    ]);

    const totalValue = results[3].reduce((acc, curr) => acc + (curr.sellingPrice * curr.quantity), 0);
    const totalExpenses = results[5]._sum.netAmount || 0;

    // Process sales data for chart
    const salesMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        salesMap.set(dayName, 0);
    }

    results[4].forEach((move) => {
        const dayName = new Date(move.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        const amount = move.quantity * (move.product.sellingPrice || 0);
        salesMap.set(dayName, (salesMap.get(dayName) || 0) + amount);
    });

    const salesData = Array.from(salesMap).map(([name, sales]) => ({ name, sales }));

    return NextResponse.json({
      totalProducts: results[0],
      lowStockProducts: results[1],
      recentActivity: results[2],
      totalValue,
      totalExpenses,
      salesData
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
