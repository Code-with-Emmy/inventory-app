import { NextResponse } from "next/server";
import { handleStockMovement } from "@/app/services/stock.service";
import { stockMovementSchema } from "@/lib/validators";
import { MovementType } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";


export async function POST(req: Request){
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized - Please log in" },
            { status: 401 }
        );
    }

    try {
        const { userId, role } = await verifyToken(token);
        
        if (!userId) {
            return NextResponse.json(
                { error: "Invalid session - Please log out and log back in" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validated = stockMovementSchema.parse(body);
        

        

        const result = await handleStockMovement({
            type: validated.type as MovementType,
            productId: validated.productId,
            quantity: validated.quantity,
            userId,
            reason: validated.reason,
            referenceId: validated.referenceId,
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error("[STOCK_MOVEMENT_ERROR]:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
