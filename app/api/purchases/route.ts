import { NextResponse } from "next/server";
import { getPurchases, createPurchase } from "@/app/services/purchase.service";
import { createPurchaseSchema } from "@/lib/validators";

export async function GET() {
    try {
        const purchases = await getPurchases();
        return NextResponse.json(purchases);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching purchases" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Handle dates
        if (body.purchaseDate) body.purchaseDate = new Date(body.purchaseDate);
        if (body.payments) {
            body.payments = body.payments.map((p: any) => ({
                ...p,
                paymentDate: p.paymentDate ? new Date(p.paymentDate) : new Date(),
            }));
        }

        const validated = createPurchaseSchema.parse(body);
        const purchase = await createPurchase(validated as any);
        return NextResponse.json(purchase, { status: 201 });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
        }
        console.error("[PURCHASE_POST_ERROR]:", error);
        return NextResponse.json({ error: "Internal Server Error during purchase recording." }, { status: 500 });
    }
}
