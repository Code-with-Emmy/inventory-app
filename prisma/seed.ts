import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🗑️  Clearing existing data...");
  await prisma.serializedUnit.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemSettings.deleteMany();

  // Create Admin User
  console.log("👤 Creating admin user...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@fluxstock.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create Staff User
  const staffPassword = await bcrypt.hash("staff123", 10);
  const staff = await prisma.user.create({
    data: {
      email: "staff@fluxstock.com",
      name: "Staff Member",
      password: staffPassword,
      role: "STAFF",
    },
  });

  console.log("✅ Users created");
  console.log("   Admin: admin@fluxstock.com / admin123");
  console.log("   Staff: staff@fluxstock.com / staff123");

  // Create System Settings
  await prisma.systemSettings.create({
    data: {
      id: "settings",
      siteName: "FluxStock",
      currency: "₦",
      lowStockThreshold: 5,
      allowNegativeStock: false,
    },
  });

  // Create Suppliers
  console.log("🏢 Creating suppliers...");
  const supplier1 = await prisma.supplier.create({
    data: {
      name: "TechHub Distributors",
      contactName: "John Doe",
      email: "john@techhub.com",
      phone: "+234 801 234 5678",
      address: "123 Tech Street, Lagos, Nigeria",
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: "Mobile World Suppliers",
      contactName: "Jane Smith",
      email: "jane@mobileworld.com",
      phone: "+234 802 345 6789",
      address: "456 Mobile Avenue, Abuja, Nigeria",
    },
  });

  console.log("✅ Suppliers created");

  // Create Products with Colors and IMEIs
  console.log("📦 Creating products...");

  // iPhone 15 Pro - Space Black
  const iphone15ProBlack = await prisma.product.create({
    data: {
      name: "iPhone 15 Pro",
      sku: "IPH15P-BLK-256",
      description: "Latest iPhone 15 Pro with A17 Pro chip, 256GB storage",
      brand: "Apple",
      color: "Space Black",
      category: "PHONE",
      condition: "NEW",
      quantity: 5,
      minQuantity: 3,
      costPrice: 850000,
      sellingPrice: 1050000,
      unitOfMeasure: "pcs",
      status: "ACTIVE",
    },
  });

  // iPhone 15 Pro - Natural Titanium
  const iphone15ProTitanium = await prisma.product.create({
    data: {
      name: "iPhone 15 Pro",
      sku: "IPH15P-TIT-256",
      description: "Latest iPhone 15 Pro with A17 Pro chip, 256GB storage",
      brand: "Apple",
      color: "Natural Titanium",
      category: "PHONE",
      condition: "NEW",
      quantity: 3,
      minQuantity: 3,
      costPrice: 850000,
      sellingPrice: 1050000,
      unitOfMeasure: "pcs",
      status: "ACTIVE",
    },
  });

  // Samsung Galaxy S24 Ultra - Titanium Gray
  const galaxyS24Gray = await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24 Ultra",
      sku: "SAM-S24U-GRY-512",
      description: "Samsung flagship with S Pen, 512GB storage",
      brand: "Samsung",
      color: "Titanium Gray",
      category: "PHONE",
      condition: "NEW",
      quantity: 4,
      minQuantity: 2,
      costPrice: 780000,
      sellingPrice: 950000,
      unitOfMeasure: "pcs",
      status: "ACTIVE",
    },
  });

  // Samsung Galaxy S24 Ultra - Titanium Violet
  const galaxyS24Violet = await prisma.product.create({
    data: {
      name: "Samsung Galaxy S24 Ultra",
      sku: "SAM-S24U-VIO-512",
      description: "Samsung flagship with S Pen, 512GB storage",
      brand: "Samsung",
      color: "Titanium Violet",
      category: "PHONE",
      condition: "NEW",
      quantity: 2,
      minQuantity: 2,
      costPrice: 780000,
      sellingPrice: 950000,
      unitOfMeasure: "pcs",
      status: "ACTIVE",
    },
  });

  // Accessories
  const airpodsPro = await prisma.product.create({
    data: {
      name: "AirPods Pro (2nd Gen)",
      sku: "APP-PRO2-WHT",
      description: "Active Noise Cancellation, USB-C charging",
      brand: "Apple",
      color: "White",
      category: "ACCESSORY",
      condition: "NEW",
      quantity: 15,
      minQuantity: 5,
      costPrice: 180000,
      sellingPrice: 220000,
      unitOfMeasure: "pcs",
      status: "ACTIVE",
    },
  });

  const samsungBuds = await prisma.product.create({
    data: {
      name: "Galaxy Buds2 Pro",
      sku: "SAM-BUDS2P-BLK",
      description: "Premium wireless earbuds with ANC",
      brand: "Samsung",
      color: "Graphite",
      category: "ACCESSORY",
      condition: "NEW",
      quantity: 10,
      minQuantity: 5,
      costPrice: 120000,
      sellingPrice: 155000,
      unitOfMeasure: "pcs",
      status: "ACTIVE",
    },
  });

  // Phone Cases
  const iphoneCase = await prisma.product.create({
    data: {
      name: "iPhone 15 Pro Silicone Case",
      sku: "CASE-IPH15P-BLK",
      description: "Official Apple silicone case",
      brand: "Apple",
      color: "Black",
      category: "ACCESSORY",
      condition: "NEW",
      quantity: 25,
      minQuantity: 10,
      costPrice: 8000,
      sellingPrice: 15000,
      unitOfMeasure: "pcs",
      status: "ACTIVE",
    },
  });

  console.log("✅ Products created");

  // Create Serialized Units (IMEIs) for phones
  console.log("🔢 Creating IMEI numbers...");

  const imeis = [
    // iPhone 15 Pro Black
    { productId: iphone15ProBlack.id, imei: "356789012345678", status: "IN_STOCK" },
    { productId: iphone15ProBlack.id, imei: "356789012345679", status: "IN_STOCK" },
    { productId: iphone15ProBlack.id, imei: "356789012345680", status: "IN_STOCK" },
    { productId: iphone15ProBlack.id, imei: "356789012345681", status: "IN_STOCK" },
    { productId: iphone15ProBlack.id, imei: "356789012345682", status: "SOLD" },

    // iPhone 15 Pro Titanium
    { productId: iphone15ProTitanium.id, imei: "356789012345690", status: "IN_STOCK" },
    { productId: iphone15ProTitanium.id, imei: "356789012345691", status: "IN_STOCK" },
    { productId: iphone15ProTitanium.id, imei: "356789012345692", status: "IN_STOCK" },

    // Galaxy S24 Gray
    { productId: galaxyS24Gray.id, imei: "357890123456789", status: "IN_STOCK" },
    { productId: galaxyS24Gray.id, imei: "357890123456790", status: "IN_STOCK" },
    { productId: galaxyS24Gray.id, imei: "357890123456791", status: "IN_STOCK" },
    { productId: galaxyS24Gray.id, imei: "357890123456792", status: "SOLD" },

    // Galaxy S24 Violet
    { productId: galaxyS24Violet.id, imei: "357890123456800", status: "IN_STOCK" },
    { productId: galaxyS24Violet.id, imei: "357890123456801", status: "IN_STOCK" },
  ];

  for (const imei of imeis) {
    await prisma.serializedUnit.create({
      data: {
        productId: imei.productId,
        identifier: imei.imei,
        status: imei.status as any,
        soldDate: imei.status === "SOLD" ? new Date() : null,
        salePrice: imei.status === "SOLD" ? 1050000 : null,
      },
    });
  }

  console.log("✅ IMEI numbers created");

  // Create some stock movements
  console.log("📊 Creating stock movements...");

  await prisma.stockMovement.create({
    data: {
      type: "IN",
      userId: admin.id,
      productId: iphone15ProBlack.id,
      quantity: 5,
      reason: "Initial Stock",
      beforeQuantity: 0,
      afterQuantity: 5,
    },
  });

  await prisma.stockMovement.create({
    data: {
      type: "IN",
      userId: admin.id,
      productId: galaxyS24Gray.id,
      quantity: 4,
      reason: "Initial Stock",
      beforeQuantity: 0,
      afterQuantity: 4,
    },
  });

  await prisma.stockMovement.create({
    data: {
      type: "OUT",
      userId: staff.id,
      productId: iphone15ProBlack.id,
      quantity: 1,
      reason: "Sale",
      beforeQuantity: 5,
      afterQuantity: 4,
    },
  });

  console.log("✅ Stock movements created");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📝 Summary:");
  console.log("   - 2 users (1 admin, 1 staff)");
  console.log("   - 2 suppliers");
  console.log("   - 7 products (4 phones with colors, 3 accessories)");
  console.log("   - 14 IMEI numbers for phones");
  console.log("   - Sample stock movements");
  console.log("\n🔐 Login credentials:");
  console.log("   Admin: admin@fluxstock.com / admin123");
  console.log("   Staff: staff@fluxstock.com / staff123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
