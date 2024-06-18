"use server";
import { saveOtp } from "@backend/cache/otp";
import prisma from "@backend/configs/database";
import { sendEmail } from "@backend/mail";


export async function resendOtp({ id }) {
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    await saveOtp(id, randomOtp);
    await sendEmail('WELCOME_MAIL', user, {
        otp: randomOtp
    })

    return {};
}