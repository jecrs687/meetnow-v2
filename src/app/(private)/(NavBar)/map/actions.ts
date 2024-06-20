"use server"

import prisma from "@backend/configs/database"
import { Address, Place } from "@prisma/client"

export const getPlaces = async (
): Promise<Array<Place & { address: Address }>> => {
    return await prisma.place.findMany({
        include: {
            address: true
        }
    })

}