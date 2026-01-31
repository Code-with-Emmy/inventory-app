import { NextResponse } from "next/server";
import { getSuppliers, createSupplier } from "@/app/services/supplier.service";
import { supplierSchema } from "@/lib/validators";

export async function GET() {
    try {
        const suppliers = await getSuppliers();
        return NextResponse.json(suppliers);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching suppliers" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validated = supplierSchema.parse(body);
        const supplier = await createSupplier(validated);
        return NextResponse.json(supplier, { status: 201 });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
        }
        console.error("[SUPPLIER_POST_ERROR]:", error);
        return NextResponse.json({ error: "Failed to create supplier. Internal Server Error." }, { status: 500 });
    }
}
