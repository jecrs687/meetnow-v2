"use server";
import { TOKEN_KEY } from "@utils/envs"
import { validateToken } from "@utils/token"
import { cookies } from "next/headers"

export async function getUserId(): Promise<string> {
    const cookie = cookies().get(TOKEN_KEY)
    if (!cookie) return ""
    const { decoded } = validateToken(cookie.value)
    return decoded.id
}