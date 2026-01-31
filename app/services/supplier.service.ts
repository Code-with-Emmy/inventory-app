import { prisma } from "@/lib/prisma";

export async function getSuppliers() {
    return prisma.supplier.findMany({
        orderBy: { name: "asc" },
    });
}

export async function getSupplierById(id: string) {
    return prisma.supplier.findUnique({
        where: { id },
        include: {
            purchases: {
                orderBy: { purchaseDate: "desc" },
                take: 5,
            },
        },
    });
}

export async function createSupplier(data: {
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
}) {
    return prisma.supplier.create({
        data,
    });
}

export async function updateSupplier(id: string, data: Partial<{
    name: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
}>) {
    return prisma.supplier.update({
        where: { id },
        data,
    });
}

export async function deleteSupplier(id: string) {
    return prisma.supplier.delete({
        where: { id },
    });
}
