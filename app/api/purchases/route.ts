import { NextResponse } from "next/server";
import { getPurchases, createPurchase } from "@/app/services/purchase.service";
import { createPurchaseSchema } from "@/lib/validators";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

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
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        
        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - Please log in" },
                { status: 401 }
            );
        }

        const { userId } = await verifyToken(token);
        
        if (!userId) {
            return NextResponse.json(
                { error: "Invalid session - Please log out and log back in" },
                { status: 401 }
            );
        }

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
        
        // Add userId from token
        const purchase = await createPurchase({
            ...validated,
            userId,
        } as any);
        
        return NextResponse.json(purchase, { status: 201 });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
        }
        console.error("[PURCHASE_POST_ERROR]:", error);
        return NextResponse.json({ error: "Internal Server Error during purchase recording." }, { status: 500 });
    }
}
