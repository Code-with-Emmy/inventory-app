import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/token";

const protectedRoutes = ["/dashboard", "/products", "/stock"];

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    const isProtected = protectedRoutes.some((path) =>
        req.nextUrl.pathname.startsWith(path)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
        await verifyToken(token);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

// See "matching paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/products/:path*', '/stock/:path*'],
};
