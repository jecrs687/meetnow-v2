import prisma from "@backend/configs/database";
import { getUserId } from "@backend/utils/getUserId";
import { ROUTES } from "@constants/ROUTES";
import { redirect } from "next/navigation";



export const getUser = async () => {
    return await prisma.user.findFirst({
        where: {
            id: await getUserId()
        }
    });
}