import { z } from "zod";

export const createProductSchema = z.object({
    name: z.string().min(2, "Name is required"),
    sku: z.string().min(2, "SKU is required"),
    description: z.string().optional(),
    brand: z.string().optional(),
    category: z.enum(["PHONE", "ACCESSORY", "PART", "OTHER"]).default("ACCESSORY"),
    subCategory: z.string().optional(),
    unitOfMeasure: z.string().default("pcs"),
    condition: z.enum(["NEW", "USED", "DAMAGED"]).default("NEW"),
    
    quantity: z.number().int().min(0).default(0),
    minQuantity: z.number().int().min(0).default(5),
    
    costPrice: z.number().min(0).default(0),
    sellingPrice: z.number().min(0).default(0),
    taxApplicable: z.boolean().default(false),
    
    expiryDate: z.string().optional().nullable(),
    batchNumber: z.string().optional().nullable(),
    
    status: z.enum(["ACTIVE", "OUT_OF_STOCK", "DISCONTINUED", "ARCHIVED"]).default("ACTIVE"),
    images: z.array(z.string()).optional(),
});

export const supplierSchema = z.object({
    name: z.string().min(2, "Supplier name is required"),
    contactName: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    address: z.string().optional(),
});

export const purchaseItemSchema = z.object({
    productId: z.number(),
    quantity: z.number().int().min(1),
    unitCost: z.number().min(0),
});

export const paymentSchema = z.object({
    amount: z.number().min(0),
    method: z.enum(["CASH", "TRANSFER", "POS", "MOBILE_MONEY", "CREDIT_CARD", "DEBIT_CARD", "CHEQUE", "OTHER"]),
    reference: z.string().optional(),
    bankName: z.string().optional(),
    status: z.enum(["PENDING", "SUCCESS", "FAILED"]).default("SUCCESS"),
});

export const createPurchaseSchema = z.object({
    invoiceNumber: z.string().optional(),
    purchaseDate: z.string().optional(),
    supplierId: z.string(),
    userId: z.string(),
    
    totalAmount: z.number().min(0),
    discount: z.number().min(0).default(0),
    tax: z.number().min(0).default(0),
    netAmount: z.number().min(0),
    
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).default("COMPLETED"),
    notes: z.string().optional(),
    attachmentUrl: z.string().optional(),
    
    items: z.array(purchaseItemSchema),
    payments: z.array(paymentSchema),
});

export const stockMovementSchema = z.object({
    type: z.enum(["IN", "OUT", "ADJUST"]),
    userId: z.string(),
    productId: z.number(),
    quantity: z.number().int().min(1),
    reason: z.string().optional(),
    referenceId: z.string().optional(),
});

export const registerSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["STAFF", "MANAGER", "ADMIN"]),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
