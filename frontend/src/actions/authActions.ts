"use server"
import { User } from "@/lib/types"
import { LoginSchemaType } from "@/lib/validators"
import { cookies } from "next/headers"
import { SignJWT, decodeJwt } from "jose"

export const loginUser = async ({ email, password }: LoginSchemaType) => {
    const response = await fetch(`${process.env.BACKEND_URL}/login`, {
        cache: "no-store",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) throw new Error("Invalid credentials")

    const user = (await response.json()) as User

    const token = await new SignJWT(user)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET!))

    const cookieStore = await cookies()
    cookieStore.set("jwtToken", token, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
    })

    return user
}

export const getUser = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwtToken")?.value
    if (!token) return null
    const user = decodeJwt(token) as User
    return user
}

export const logoutUser = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwtToken")?.value
    if (!token) return { ok: false }
    cookieStore.delete("jwtToken")
    return { ok: true }
}
