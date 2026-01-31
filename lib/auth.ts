import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { verifyToken } from "./token";

export * from "./token";


export function hashPassword(password: string) {
    return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hashed: string) {
    return bcrypt.compare(password, hashed);
}



export async function getAuthSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    try {
        return await verifyToken(token);
    } catch (error) {
        return null;
    }
}