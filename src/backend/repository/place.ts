"use server";
import prisma from "@backend/configs/database";
import { ParticipantStatus } from "@prisma/client";

export const getPlaceWithUsersById = (id: string) => prisma.place.findFirst({
    where: {
        id
    },
    include: {
        photos: true,
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
        }
    }
})