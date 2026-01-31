import { prisma } from "@/lib/prisma";
import { Category, ProductCondition, ProductStatus } from "@prisma/client";

export async function getProducts(filters?: { 
    category?: Category, 
    status?: ProductStatus,
    search?: string 
}) {
    return prisma.product.findMany({
        where: {
            category: filters?.category,
            status: filters?.status ?? { not: "ARCHIVED" },
            OR: filters?.search ? [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { sku: { contains: filters.search, mode: 'insensitive' } },
                { brand: { contains: filters.search, mode: 'insensitive' } },
            ] : undefined,
        },
        include: {
            images: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getProductById(id: number) {
    return prisma.product.findUnique({
        where: { id },
        include: {
            images: true,
            stockMovement: {
                orderBy: { createdAt: "desc" },
                take: 10,
                include: { user: { select: { name: true } } }
            },
        },
    });
}

export async function createProduct(data: {
    name: string;
    sku: string;
    description?: string;
    brand?: string;
    category?: Category;
    subCategory?: string;
    unitOfMeasure?: string;
    condition?: ProductCondition;
    quantity: number;
    minQuantity: number;
    costPrice: number;
    sellingPrice: number;
    taxApplicable: boolean;
    expiryDate?: Date | null;
    batchNumber?: string | null;
    status?: ProductStatus;
    images?: string[];
}) {
    return prisma.product.create({
        data: {
            name: data.name,
            sku: data.sku,
            description: data.description,
            brand: data.brand,
            category: data.category ?? "ACCESSORY",
            subCategory: data.subCategory,
            unitOfMeasure: data.unitOfMeasure ?? "pcs",
            condition: data.condition ?? "NEW",
            quantity: data.quantity,
            minQuantity: data.minQuantity ?? 0,
            costPrice: data.costPrice,
            sellingPrice: data.sellingPrice,
            taxApplicable: data.taxApplicable,
            expiryDate: data.expiryDate,
            batchNumber: data.batchNumber,
            status: data.status ?? "ACTIVE",
            images: {
                create: data.images?.map((url) => ({ url })) ?? [],
            },
        },
    });
}

export async function updateProduct(id: number, data: any) {
    return prisma.$transaction(async (tx) => {
        // If images are provided, we might want to replace them
        if (data.images) {
            await tx.productImage.deleteMany({ where: { productId: id } });
        }

        const { images, ...otherData } = data;

        return tx.product.update({
            where: { id },
            data: {
                ...otherData,
                images: images ? {
                    create: images.map((url: string) => ({ url }))
                } : undefined,
            },
        });
    });
}

export async function archiveProduct(id: number) {
    return prisma.product.update({
        where: { id },
        data: { status: "ARCHIVED" },
    });
}