"use server";

import prisma from "@backend/configs/database";
import { FormValues } from ".";
import { validateToken } from "@utils/token";
import { TOKEN_KEY } from "@utils/envs";
import { cookies } from "next/headers";
import { getUserId } from "@backend/utils/getUserId";
import { ParticipantRole, ParticipantStatus, Status } from "@prisma/client";
import { getUser } from "@backend/repository/user";



export async function onSubmit(values: FormValues & { placeId: string }) {
    const user = await getUser();
    const group = await prisma.group.create({
        data: {
            name: values.name,
            description: values.description,
            number: values.quantity,
            duration: values.duration,
            date: new Date(values.date),
            chat: {
                create: {}
            },
            place: {
                connect: {
                    id: values.placeId
                }
            },
            participants: {
                create: {
                    role: ParticipantRole.OWNER,
                    userId: user.id,
                    status: ParticipantStatus.ACCEPTED
                }
            }
        }
    })
    return group
}