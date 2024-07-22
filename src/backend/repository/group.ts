"use server";

import prisma from "@backend/configs/database";



export async function getGroup(id: string) {
    return await prisma.group.findUnique({
        where: {
            id
        },
        include: {
            participants: {
                include: {
                    user: {
                        include: {
                            photos: true
                        }
                    }
                }
            },
            chat: true,
            photos: true,
            place: true
        }
    })
}