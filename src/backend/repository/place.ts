import prisma from "@backend/configs/database";

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
                    }
                }
            }
        }
    }
})