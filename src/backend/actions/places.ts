"use server"

import prisma from "@backend/configs/database"
import { getUser } from "@backend/repository/user"
import { Address, ParticipantStatus, Place } from "@prisma/client"

export const getPlaces = async (
) => {
    const user = await getUser()
    return await prisma.place.findMany({
        include: {
            address: true,
            photos: true,
            _count: {
                select: {
                    groups: true
                }
            },
            groups: {
                include: {
                    participants: {
                        include: {
                            user: {
                                include: {
                                    photos: true
                                }
                            }
                        },
                        where: {
                            status: ParticipantStatus.ACCEPTED
                        }
                    }
                }
            },

        },
        where: {
            address: {
                lat: {
                    gte: user.address.lat - 2.5,
                    lte: user.address.lat + 2.5
                },
                lng: {
                    gte: user.address.lng - 2.5,
                    lte: user.address.lng + 2.5
                }
            }
        }
    })
}

