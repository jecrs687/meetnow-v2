"use server";
import { TOKEN_KEY } from "@utils/envs"
import { validateToken } from "@utils/token"
import { cookies, headers } from "next/headers"

export async function getUserId(): Promise<
    ReturnType<typeof validateToken>['decoded']
    | null
> {
    const cookie = cookies().get(TOKEN_KEY)
    if (cookie) return validateToken(cookie.value).decoded
    const header = headers().get('Authorization')
    if (header) return validateToken(header).decoded
    return null
}