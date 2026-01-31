import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const paymentMethod = searchParams.get("paymentMethod");
        
        // Build filter
        // Get Transaction List (Purchases)
        const transactions = await prisma.purchase.findMany({
            include: {
                supplier: { select: { name: true } },
                user: { select: { name: true } },
                _count: { select: { items: true } }
            },
            orderBy: { purchaseDate: "desc" },
            take: 50
        });

        // Get Spending Summary by Payment Method (from all time)
        const payments = await prisma.payment.groupBy({
            by: ['method'],
            _sum: {
                amount: true
            }
        });

        const spendingSummary = payments.map(p => ({
            paymentMethod: p.method,
            total: p._sum.amount || 0
        }));

        return NextResponse.json({
            transactions,
            spendingSummary
        });
    } catch (error) {
        console.error("Reports Error:", error);
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}
