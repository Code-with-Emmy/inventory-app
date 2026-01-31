
import { prisma } from "@/lib/prisma";
import { PaymentStatus, PurchaseStatus } from "@prisma/client";

export async function getPurchases() {
  return prisma.purchase.findMany({
    include: {
      supplier: true,
      user: { select: { name: true } },
      items: {
          include: { product: true }
      },
      payments: true,
    },
    orderBy: { purchaseDate: "desc" },
  });
}

// Separate type definition if needed, or inline
type CreatePurchaseInput = {
    userId: string;
    supplierId: string;
    invoiceNumber?: string;
    purchaseDate?: Date;
    items: { productId: number; quantity: number; unitCost: number }[];
    payments: { amount: number; method: any; reference?: string; bankName?: string }[];
    totalAmount: number;
    discount: number;
    tax: number;
    netAmount: number;
    notes?: string;
};

export async function createPurchase(data: CreatePurchaseInput) {
  return prisma.$transaction(async (tx) => {
    // 1. Create Purchase Record
    const purchase = await tx.purchase.create({
      data: {
        userId: data.userId,
        supplierId: data.supplierId,
        invoiceNumber: data.invoiceNumber,
        purchaseDate: data.purchaseDate || new Date(),
        totalAmount: data.totalAmount,
        discount: data.discount,
        tax: data.tax,
        netAmount: data.netAmount,
        status: PurchaseStatus.COMPLETED, // Assuming immediate completion for now
        notes: data.notes,
      },
    });

    // 2. Create Items & Update Stock
    for (const item of data.items) {
      // Create Purchase Item
      await tx.purchaseItem.create({
        data: {
          purchaseId: purchase.id,
          productId: item.productId,
          quantity: item.quantity,
          unitCost: item.unitCost,
          totalCost: item.quantity * item.unitCost,
        },
      });

      // Update Product Stock (IN)
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const newQty = product.quantity + item.quantity;
      
      // Update product quantity and Weighted Average Cost (optional, but good practice)
      // New Cost = ((Old Qty * Old Cost) + (New Qty * New Unit Cost)) / Total Qty
      // For simplicity, we might just update Cost Price to latest or weighted. 
      // Let's stick to simple stock increment for now.
      
      await tx.product.update({
        where: { id: product.id },
        data: { 
            quantity: newQty,
            status: newQty > 0 ? "ACTIVE" : undefined 
        },
      });

      // Record Stock Movement
      await tx.stockMovement.create({
        data: {
            type: "IN",
            userId: data.userId,
            productId: product.id,
            quantity: item.quantity,
            beforeQuantity: product.quantity,
            afterQuantity: newQty,
            reason: "Purchase",
            referenceId: purchase.id
        }
      });
    }

    // 3. Create Payments
    for (const payment of data.payments) {
      await tx.payment.create({
        data: {
          purchaseId: purchase.id,
          amount: payment.amount,
          method: payment.method,
          reference: payment.reference,
          bankName: payment.bankName,
          status: PaymentStatus.SUCCESS,
          paymentDate: new Date(),
        },
      });
    }

    return purchase;
  });
}
