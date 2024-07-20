"use server";
import prisma from "@backend/configs/database";
import { getUserId } from "@backend/utils/getUserId";
import { ROUTES } from "@constants/ROUTES";
import { redirect } from "next/navigation";



export const getUser = async () => {
    return await prisma.user.findFirst({
        where: {
            id: await getUserId()
        },
        include: {
            address: true,
            photos: true
        }
    });
}

export const setUserPosition = async (lat: number, lng: number) => {
    await prisma.user.update({
        where: {
            id: await getUserId()
        },
        data: {
            address: {
                upsert: {
                    create: {
                        lat,
                        lng
                    },
                    update: {
                        lat,
                        lng
                    }
                }
            }
        }
    })
}