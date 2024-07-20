"use server"

import prisma from "@backend/configs/database"
import { Address, Place } from "@prisma/client"

export const getPlaces = async (
) => {
    return await prisma.place.findMany({
        include: {
            address: true,
            photos: true,
            _count: {
                select: {
                    groups: true
                }
            }
        }
    })
}

