"use server";

import { getOtp } from "@backend/cache/otp";
import prisma from "@backend/configs/database";
import { TOKEN_KEY } from "@utils/envs";
import { generateToken } from "@utils/token";

import { cookies } from "next/headers";


export async function submit(currentState, form: FormData) {
    const otp = form.get('otp') as string;

    const id = form.get('id') as string;

    if (!otp) {
        return { errors: { otp: 'O campo é obrigatório' } };
    }
    if (otp.length !== 4) {
        return { errors: { otp: 'O campo deve conter 4 caracteres' } };
    }
    const otpCache = await getOtp(id);

    if (otp != otpCache) {
        return { errors: { otp: 'O código de verificação é inválido' } };
    }

    // deleteOtp(id);
    await prisma.user.update({
        where: {
            id
        },
        data: {
            activatedAt: new Date()
        }
    });
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    if (!user) {
        return { errors: { otp: 'Usuário não encontrado' } };
    }

    const token = generateToken(user);
    if (!token) {
        return { errors: { otp: 'Erro ao gerar token' } };
    }
    if (token)
        cookies().set(TOKEN_KEY, token)


    return { token };
}