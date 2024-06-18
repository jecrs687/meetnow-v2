"use server";

import prisma from "@backend/configs/database";
import { sendEmail } from "@backend/mail";
import { encryptPassword } from "@utils/encrypt";
import { retry } from "@utils/retry";
import { generateToken } from "@utils/token";
import z from "zod";
const schema = z.object({
    email: z.string().email("O email deve ser válido").min(6, "O email deve conter no mínimo 6 caracteres").max(100, "O email deve conter no máximo 100 caracteres"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres")
        .max(100,
            "A senha deve conter no máximo 100 caracteres"
        )
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d.!@#$%^&*˜"'-ˆ]{6,}$/,
    //     {
    //         message: "A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e um caractere especial"
    //     })
    ,
    name: z.string().min(2, "O nome deve conter no mínimo 2 caracteres").max(100, "O nome deve conter no máximo 100 caracteres"),
    passwordConfirmation: z.string().min(6, "A confirmação de senha deve conter no mínimo 6 caracteres").max(100, "A confirmação de senha deve conter no máximo 100 caracteres"),
    bio: z.string().optional(),
}).superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'A senha e a confirmação de senha devem ser iguais',
            path: ['passwordConfirmation']
        })
    }
});

export async function submit(currentState, form: FormData) {

    const forms = {
        email: form.get('email').toString().toLowerCase().trim(),
        password: form.get('password').toString(),
        name: form.get('name').toString(),
        bio: form.get('bio').toString(),
        passwordConfirmation: form.get('passwordConfirmation').toString(),
    }
    const validate = schema.safeParse(forms) as typeof forms & { error: z.ZodError, success: boolean }

    const verifyEmail = await prisma.user.findFirst({
        where: {
            email: forms.email
        }
    });
    if (verifyEmail) {
        return {
            errors: {
                email: 'Email já cadastrado'
            }
        }
    }

    if (!validate.success && validate?.error) {
        const errors = validate?.error?.flatten()?.fieldErrors
        return ({ errors });
    }
    const { passwordConfirmation, ...rest } = forms;
    rest.password = encryptPassword(rest.password)
    try {
        const user = await prisma.user.create({
            data: {
                ...rest
            }
        });

        try {
            await retry(sendEmail('WELCOME_MAIL', user), 3)
            try {
                await retry(sendEmail('REPORT_MAIL', user, { to: 'emanuelcascone@gmail.com, samuelssan28@gmail.com' }), 3)
            } catch (error) {
                console.log({ error })
            }
        }
        catch (error) {
            console.log({ error })
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    activatedAt: new Date()
                }
            })
            return { token: generateToken(user) }
        }
        return { success: true, user: user };
    } catch (error) {
        console.log({ error })
        return { error: error.message }
    }
}