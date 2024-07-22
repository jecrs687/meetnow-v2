"use server";
import { generateToken } from "@utils/token";
import prisma from "@backend/configs/database";
import { cookies } from "next/headers";
import { TOKEN_KEY } from "@utils/envs";
import { encryptPassword } from "@utils/encrypt";

export async function submit(currentState: any, form: FormData) {
    "use server";
    const payload = {
        email: form.get('email')?.toString().toLocaleLowerCase(),
        password: form.get('password')?.toString()
    };
    const encryptedPassword = encryptPassword(payload.password);
    const login = await prisma.user.findFirst({
        where: {
            email: payload.email,
            password: encryptedPassword
        }
    });

    if (!login)
        return {
            errors: {
                email: 'Email ou senha inválidos'
            }
        };

    const response = {
        token: generateToken(login)
    };

    if (response?.token)
        cookies().set(TOKEN_KEY, response?.token)
    return response;
}