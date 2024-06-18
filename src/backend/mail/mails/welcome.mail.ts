import welcome from "@assets/templates/welcome.html";
import { saveOtp } from "@backend/cache/otp";
import { User } from "@prisma/client";
export const WELCOME_MAIL = (user: User, _: any) => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    saveOtp(user.id, otp);
    const htmlFormatted = eval('`' + welcome + '`');
    return {
        subject: `Bem vindo ao meetnow, ${user.name} !!!`,
        from: 'panda@wordpanda.app',
        attachments: [{
            filename: 'meetnow.png',
            path: 'https://meetnow-v2.vercel.app/assets/logo.png',
            cid: 'panda'
        }],
        html: htmlFormatted,
    }
}