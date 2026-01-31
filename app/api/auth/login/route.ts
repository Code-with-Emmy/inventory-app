import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { signToken, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const {email, password} = loginSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: {email}
        });
        if (!user) throw new Error("Invalid Credentials");

        const valid = await verifyPassword(password, user.password);
        if(!valid) throw new Error("Invalid Password!! Try Again");

        const token = await signToken({ userId: user.id, role: user.role});

        const res = NextResponse.json({user});
        res.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "strict",
            path: "/"
        });

        return res;

    } catch(error: any){
        const isPublicError = error.message === "Invalid Credentials" || error.message === "Invalid Password!! Try Again";
        const userFacingMessage = isPublicError ? error.message : "Internal Server Error";
        
        // Log sensitive error details on the server ONLY
        if (!isPublicError) {
            console.error("[AUTH_SERVICE_ERROR]:", error);
        }

        return NextResponse.json(
            { error: userFacingMessage },
            { status: isPublicError ? 401 : 500 }
        )
    }
}