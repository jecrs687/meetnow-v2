import { TOKEN_KEY } from "@utils/envs"
import { validateToken } from "@utils/token"
import { cookies } from "next/headers"

export const getUserId = async (): Promise<string> => {
    return validateToken(cookies().get(TOKEN_KEY).value).decoded.id
}