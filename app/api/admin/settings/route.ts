import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { role } = await verifyToken(token);
        if (role !== "ADMIN" && role !== "MANAGER") {
             // Optional: Allow staff to read settings but not write? 
             // Usually settings like 'SiteName' are public-ish.
        }

        let settings = await prisma.systemSettings.findFirst();
        if (!settings) {
            settings = await prisma.systemSettings.create({ data: { id: "settings" } });
        }
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { role } = await verifyToken(token);
        if (role !== "ADMIN") {
            return NextResponse.json({ error: "Only admins can change system settings" }, { status: 403 });
        }

        const body = await req.json();
        const settings = await prisma.systemSettings.upsert({
            where: { id: "settings" },
            update: {
                siteName: body.siteName,
                currency: body.currency,
                lowStockThreshold: Number(body.lowStockThreshold),
                allowNegativeStock: body.allowNegativeStock,
            },
            create: {
                id: "settings",
                siteName: body.siteName,
                currency: body.currency,
                lowStockThreshold: Number(body.lowStockThreshold),
                allowNegativeStock: body.allowNegativeStock,
            }
        });

        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
