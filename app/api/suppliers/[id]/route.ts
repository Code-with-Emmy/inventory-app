import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        purchases: {
            include: {
                user: { select: { name: true } },
                 _count: { select: { items: true } }
            },
            orderBy: { purchaseDate: "desc" }
        }
      }
    });

    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }

    return NextResponse.json(supplier);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching supplier" }, { status: 500 });
  }
}
