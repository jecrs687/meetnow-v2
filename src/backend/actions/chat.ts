"use server";
import prisma from "@backend/configs/database";
import { MessageSend } from "@backend/entity/MessageSend";
import { getUserId } from "@backend/utils/getUserId";
import { Message, ParticipantStatus } from "@prisma/client";




export async function getChatAction() { }

export async function createChatAction({
    groupId
}) {
    const userId = (await getUserId()).id;
    const group = await prisma.group.findFirst({
        where: {
            id: groupId,
        },
        include: {
            participants: true,
            chat: true
        }
    });
    if (!group) {
        throw new Error('Group not found');
    }
    // if (!group.participants.some(p => p.userId === userId && p.status === ParticipantStatus.ACCEPTED)) {
    //     throw new Error('You are not a participant of this group');
    // }
    if (!group.chat)
        return await prisma.chat.create({
            data: {
                group: {
                    connect: {
                        id: groupId
                    }
                }
            }
        });
}
export async function sendMessageAction(messageReceived: string) {
    const userId = (await getUserId()).id;
    const message = JSON.parse(messageReceived) as unknown as MessageSend;
    const chat = await prisma.message.create({
        data: {
            text: message.text,
            medias: {
                create: message.medias
            },
            chat: {
                connect: {
                    id: message.chatId
                }
            },
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
    return chat;

}

export async function getMessagesAction({
    chatId,
    offset,
    limit,
    lastMessageId
}: {
    chatId: string;
    offset?: number;
    limit?: number;
    lastMessageId?: string;
}) {
    const lastMessage = await prisma.message.findFirst({
        where: {
            chatId,
            id: lastMessageId
        }
    });

    return await prisma.message.findMany({
        include: {
            user: true,
            medias: true,
            forwards: true,
            reply: true,
            replies: true,
            reactions: true
        },
        where: {
            chat: {
                id: chatId,
                group: {
                    participants: {
                        some: {
                            userId: (await getUserId()).id,
                            status: ParticipantStatus.ACCEPTED
                        }
                    }
                },
            },
            ...(!!lastMessage && {
                createdAt: {
                    gt: lastMessage.createdAt
                }
            })
        },
        orderBy: {
            createdAt: 'desc'
        },
        skip: offset || 0,
        take: limit || 30
    });
}

export async function forwardMessageAction() { }
export async function deleteMessageAction() { }
export async function editMessageAction() { }
export async function reactMessageAction() { }
