"use server"

import prisma from "@backend/configs/database"
import { Address, Places } from "@prisma/client"

export const getPlaces = async (
): Promise<Array<Places & { address: Address }>> => {
    return await prisma.places.findMany({
        include: {
            address: true
        }
    })

}