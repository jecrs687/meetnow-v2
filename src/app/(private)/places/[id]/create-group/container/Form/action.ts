"use server";

import prisma from "@backend/configs/database";
import { FormValues } from ".";
import { validateToken } from "@utils/token";
import { TOKEN_KEY } from "@utils/envs";
import { cookies } from "next/headers";
import { getUserId } from "@backend/utils/getUserId";



export async function onSubmit(values: FormValues & { placeId: string }) {
    const user = await prisma.user.findFirst({
        where: {
            id: await getUserId()
        }
    });
    prisma.group.create({
        data: {
            name: values.name,
            description: values.description,
            number: values.quantity,
            place: {
                connect: {
                    id: values.placeId
                }
            },
            participants: {
                connect: {
                    id: user.id
                }
            }
        }
    })
}