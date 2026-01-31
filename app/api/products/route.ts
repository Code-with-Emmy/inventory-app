import { NextResponse } from "next/server";
import { getProducts } from "@/app/services/product.service";
import {createProduct} from "@/app/services/product.service";
import { createProductSchema } from "@/lib/validators";

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(products);
    } catch (error){
        console.error("Error fetching products", error);
        return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Handle dates
        if (body.expiryDate) {
            body.expiryDate = new Date(body.expiryDate);
        }

        const validated = createProductSchema.parse(body);

        const product = await createProduct(validated as any);
        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
        }
        console.error("[PRODUCT_POST_ERROR]:", error);
        return NextResponse.json({ error: "Internal Server Error during product creation." }, { status: 500 });
    }
}

