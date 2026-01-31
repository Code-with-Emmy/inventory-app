
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { createProductSchema } from "@/lib/validators";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        serializedUnits: {
            where: { status: "IN_STOCK" },
            select: { identifier: true, status: true }
        },
        stockMovement: {
            take: 10,
            orderBy: { createdAt: "desc" },
            include: { 
                user: { select: { name: true } }
            },
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching product" }, { status: 500 });
  }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await verifyToken(token); // Ensure logged in
        const { id: idParam } = await params;
        const id = parseInt(idParam);
        const body = await req.json();

        // Separate id/createdAt/updatedAt/image from body if present to avoid schema update errors
        const { id: _, createdAt, updatedAt, stockMovement, purchaseItems, images, serializedUnits, image, ...updateData } = body;
        
        // Basic validation - reusing create schema but making things optional logic might be needed
        // For now, let's just straight update but casting standard fields
        
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...updateData,
                // Ensure specific numeric fields are numbers
                quantity: Number(updateData.quantity),
                minQuantity: Number(updateData.minQuantity),
                costPrice: Number(updateData.costPrice),
                sellingPrice: Number(updateData.sellingPrice),
                // Handle image update if provided (assuming single image for this UI)
                // Handle image update if provided (assuming single image for this UI)
                images: (image !== undefined) ? {
                    deleteMany: {},
                    ...(image ? { create: { url: String(image) } } : {})
                } : undefined
            }
        });

        return NextResponse.json(product);
    } catch (error: any) {
        console.error("Update Product Error:", error);
        return NextResponse.json({ error: "Failed to update product. Please check your input." }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { role } = await verifyToken(token);
        if (role !== "ADMIN" && role !== "MANAGER") {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        const { id: idParam } = await params;
        const id = parseInt(idParam);

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
