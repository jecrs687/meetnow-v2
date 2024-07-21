"use server";

import prisma from "@backend/configs/database";
import { getUser } from "@backend/repository/user";
import { ParticipantStatus } from "@prisma/client";


type RequestInsertProps = {
    id: string
}

export const requestParticipateAction = async ({
    id
}: RequestInsertProps) => {
    const user = await getUser();
    const participant = await prisma.participant.create({
        data: {
            group: {
                connect: {
                    id: id
                }
            },
            user: {
                connect: {
                    id: user.id
                }
            },
            status: ParticipantStatus.PENDING
        }
    })
    return participant;
}

export const declineParticipateAction = async ({
    id
}: RequestInsertProps) => {
    const user = await getUser();
    const participant = await prisma.participant.create({
        data: {
            group: {
                connect: {
                    id: id
                }
            },
            user: {
                connect: {
                    id: user.id
                }
            },
            status: ParticipantStatus.DECLINED
        }
    })
    return participant;
}

export const getGroupByUser = async () => {
    const user = await getUser();
    const groups = await prisma.group.findMany({
        orderBy: {
            date: 'asc'
        },
        where: {
            participants: {
                some: {
                    AND: [
                        {
                            user: {
                                id: user.id
                            }
                        },
                        {
                            OR: [
                                {
                                    status: ParticipantStatus.ACCEPTED
                                },
                                {
                                    status: ParticipantStatus.PENDING
                                }
                            ]
                        }
                    ]
                }
            },
        },
        include: {
            participants: true,
            photos: true,
            place: true
        }
    })
    return groups;
}