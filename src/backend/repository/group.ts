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
                    user: true
                }
            },
            chat: {
                include: {
                    messages: {
                        include: {
                            medias: true,
                            user: true,
                            reply: true,
                        }
                    }
                }
            },
            photos: true,
            place: true
        }
    })
}