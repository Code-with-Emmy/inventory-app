import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_key_change_this_in_prod";
const key = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: { userId: string; role: string }) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload as { userId: string; role: string };
    } catch (error) {
        throw new Error("Invalid token");
    }
}
