import { prisma } from "@/lib/prisma";
import { MovementType } from "@prisma/client";

export async function handleStockMovement(data: {
    type: MovementType;
    userId: string;
    productId: number;
    quantity: number;
    reason?: string;
    referenceId?: string;
}) {
    return prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: { id: data.productId },
        });

        if (!product) throw new Error("Product not found");

        const beforeQuantity = product.quantity;
        let afterQuantity = beforeQuantity;

        if (data.type === "IN" || data.type === "ADJUST") {
            afterQuantity += data.quantity;
        } else if (data.type === "OUT") {
            if (beforeQuantity < data.quantity) {
                throw new Error("Insufficient stock for this operation");
            }
            afterQuantity -= data.quantity;
        }

        // 1. Update Product Quantity
        const updatedProduct = await tx.product.update({
            where: { id: data.productId },
            data: {
                quantity: afterQuantity,
                status: afterQuantity === 0 ? "OUT_OF_STOCK" : undefined,
            },
        });

        // 2. Record Movement
        const movement = await tx.stockMovement.create({
            data: {
                type: data.type,
                userId: data.userId,
                productId: data.productId,
                quantity: data.quantity,
                reason: data.reason,
                referenceId: data.referenceId,
                beforeQuantity,
                afterQuantity,
            },
        });

        return {
            movement,
            product: updatedProduct,
        };
    });
}

export async function getStockHistory(productId?: number) {
    return prisma.stockMovement.findMany({
        where: productId ? { productId } : undefined,
        include: {
            user: { select: { name: true } },
            product: { select: { name: true, sku: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}