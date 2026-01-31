import { NextResponse } from "next/server";
import { readdir, unlink } from "fs/promises";
import path from "path";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const uploadDir = path.join(process.cwd(), "public/uploads");
        try {
            const files = await readdir(uploadDir);
            // Filter for image extensions if desired, or return all
            const images = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file)).map(file => ({
                name: file,
                url: `/uploads/${file}`,
            }));
            return NextResponse.json(images);
        } catch (error) {
            // If dir doesn't exist, return empty
            return NextResponse.json([]);
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { role } = await verifyToken(token);
        if (role !== "ADMIN" && role !== "MANAGER") {
             return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const filename = searchParams.get("filename");

        if (!filename) {
            return NextResponse.json({ error: "Filename required" }, { status: 400 });
        }

        // Basic path traversal protection
        const safeFilename = path.basename(filename);
        const filepath = path.join(process.cwd(), "public/uploads", safeFilename);

        await unlink(filepath);

        return NextResponse.json({ message: "File deleted" });
    } catch (error) {
        console.error("Delete File Error:", error);
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}
