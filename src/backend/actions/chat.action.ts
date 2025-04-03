"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";
import { ChatType, MembershipStatus, RoleType } from "@prisma/client";

// Get chat for a group or event
export async function getChatByEntityId({
    groupId,
    eventId
}: {
    groupId?: string;
    eventId?: string;
}) {
    if (!groupId && !eventId) {
        throw new Error('Either groupId or eventId is required');
    }

    const user = await getCurrentUser();

    // First check if user has access to the entity
    if (groupId) {
        const membership = await prisma.membership.findUnique({
            where: {
                userId_groupId: {
                    userId: user.id,
                    groupId
                }
            }
        });

        if (!membership || membership.status !== MembershipStatus.ACCEPTED) {
            throw new Error('You do not have access to this group chat');
        }
    } else if (eventId) {
        const membership = await prisma.membership.findUnique({
            where: {
                userId_eventId: {
                    userId: user.id,
                    eventId
                }
            }
        });

        if (!membership || membership.status !== MembershipStatus.ACCEPTED) {
            throw new Error('You do not have access to this event chat');
        }
    }

    // Get or create the chat
    let chat = await prisma.chat.findFirst({
        where: groupId ? { groupId } : { eventId },
        include: {
            participants: {
                where: { userId: user.id }
            }
        }
    });

    // If chat doesn't exist, create it
    if (!chat) {
        chat = await prisma.chat.create({
            data: {
                type: groupId ? ChatType.GROUP : ChatType.EVENT,
                ...(groupId ? { groupId } : { eventId }),
                participants: {
                    create: {
                        userId: user.id,
                        role: RoleType.MEMBER
                    }
                }
            },
            include: {
                participants: {
                    where: { userId: user.id }
                }
            }
        });
    }

    // If user is not a chat participant yet, add them
    if (chat.participants.length === 0) {
        await prisma.chatParticipant.create({
            data: {
                chatId: chat.id,
                userId: user.id,
                role: RoleType.MEMBER
            }
        });
    }

    return chat;
}

// Get all chat participants
export async function getChatParticipants(chatId: string) {
    const user = await getCurrentUser();

    // Ensure user is a participant
    const participant = await prisma.chatParticipant.findUnique({
        where: {
            chatId_userId: {
                chatId,
                userId: user.id
            }
        }
    });

    if (!participant) {
        throw new Error('You are not a participant in this chat');
    }

    return prisma.chatParticipant.findMany({
        where: { chatId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    media: {
                        where: { entityType: 'USER' },
                        take: 1
                    }
                }
            }
        }
    });
}

// Send a message to a chat
export async function sendMessage({
    chatId,
    text,
    mediaIds,
    parentId
}: {
    chatId: string;
    text?: string;
    mediaIds?: string[];
    parentId?: string;
}) {
    const user = await getCurrentUser();

    // Ensure user is a participant
    const participant = await prisma.chatParticipant.findUnique({
        where: {
            chatId_userId: {
                chatId,
                userId: user.id
            }
        }
    });

    if (!participant) {
        throw new Error('You are not a participant in this chat');
    }

    if (!text && (!mediaIds || mediaIds.length === 0)) {
        throw new Error('Message must have text or media');
    }

    return prisma.$transaction(async (tx) => {
        // Create the message
        const message = await tx.message.create({
            data: {
                chatId,
                senderId: user.id,
                text,
                ...(parentId && { parentId }),
                // Track delivery status
                readBy: {
                    connect: { id: user.id } // Mark as read by sender
                },
                deliveredTo: {
                    connect: { id: user.id } // Mark as delivered to sender
                }
            }
        });

        // Attach media if provided
        if (mediaIds?.length) {
            await tx.media.updateMany({
                where: { id: { in: mediaIds } },
                data: {
                    messageId: message.id,
                    entityType: 'MESSAGE'
                }
            });
        }

        // Update the chat participant's lastReadAt
        await tx.chatParticipant.update({
            where: {
                chatId_userId: {
                    chatId,
                    userId: user.id
                }
            },
            data: { lastReadAt: new Date() }
        });

        // Get the message with its relationships
        return tx.message.findUnique({
            where: { id: message.id },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        media: {
                            where: { entityType: 'USER' },
                            take: 1
                        }
                    }
                },
                media: true,
                parent: parentId ? {
                    select: {
                        id: true,
                        text: true,
                        senderId: true,
                        sender: {
                            select: {
                                name: true
                            }
                        }
                    }
                } : undefined
            }
        });
    });
}

// Get messages for a chat with pagination
export async function getMessages({
    chatId,
    cursor,
    limit = 20
}: {
    chatId: string;
    cursor?: string; // ID of the last message fetched
    limit?: number;
}) {
    const user = await getCurrentUser();

    // Ensure user is a participant
    const participant = await prisma.chatParticipant.findUnique({
        where: {
            chatId_userId: {
                chatId,
                userId: user.id
            }
        }
    });

    if (!participant) {
        throw new Error('You are not a participant in this chat');
    }

    // Get messages
    const messages = await prisma.message.findMany({
        where: {
            chatId,
            deletedAt: null
        },
        include: {
            sender: {
                select: {
                    id: true,
                    name: true,
                    media: {
                        where: { entityType: 'USER' },
                        take: 1
                    }
                }
            },
            media: true,
            reactions: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            parent: {
                select: {
                    id: true,
                    text: true,
                    senderId: true,
                    sender: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    replies: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        ...(cursor ? {
            cursor: { id: cursor },
            skip: 1 // Skip the cursor message
        } : {})
    });

    // Mark messages as read
    const messageIds = messages
        .filter(m => m.senderId !== user.id) // Only mark others' messages
        .map(m => m.id);

    if (messageIds.length > 0) {
        await prisma.$transaction([
            // Mark messages as read by current user
            ...messageIds.map(messageId =>
                prisma.message.update({
                    where: { id: messageId },
                    data: {
                        readBy: {
                            connect: { id: user.id }
                        }
                    }
                })
            ),

            // Update the lastReadAt timestamp
            prisma.chatParticipant.update({
                where: {
                    chatId_userId: {
                        chatId,
                        userId: user.id
                    }
                },
                data: { lastReadAt: new Date() }
            })
        ]);
    }

    // Get the next cursor
    const nextCursor = messages.length === limit ? messages[messages.length - 1].id : null;

    return {
        messages,
        nextCursor
    };
}

// Add reaction to a message
export async function addReaction({
    messageId,
    type
}: {
    messageId: string;
    type: string;
}) {
    const user = await getCurrentUser();

    // Get the message to check permissions
    const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: {
            chat: {
                include: {
                    participants: {
                        where: { userId: user.id }
                    }
                }
            }
        }
    });

    if (!message) {
        throw new Error('Message not found');
    }

    if (message.chat.participants.length === 0) {
        throw new Error('You do not have access to this message');
    }

    // Create or update reaction
    return prisma.reaction.upsert({
        where: {
            messageId_userId_type: {
                messageId,
                userId: user.id,
                type
            }
        },
        update: {}, // No update needed
        create: {
            messageId,
            userId: user.id,
            type
        }
    });
}

// Remove reaction from a message
export async function removeReaction({
    messageId,
    type
}: {
    messageId: string;
    type: string;
}) {
    const user = await getCurrentUser();

    return prisma.reaction.delete({
        where: {
            messageId_userId_type: {
                messageId,
                userId: user.id,
                type
            }
        }
    });
}

// Delete a message (soft delete)
export async function deleteMessage(messageId: string) {
    const user = await getCurrentUser();

    // Get the message to check permissions
    const message = await prisma.message.findUnique({
        where: { id: messageId },
        include: {
            chat: {
                include: {
                    participants: {
                        where: { userId: user.id }
                    }
                }
            }
        }
    });

    if (!message) {
        throw new Error('Message not found');
    }

    // Check if user is the sender or has admin/moderator role
    const participant = message.chat.participants[0];
    if (
        message.senderId !== user.id &&
        !['ADMIN', 'OWNER', 'MODERATOR'].includes(participant?.role || '')
    ) {
        throw new Error('You do not have permission to delete this message');
    }

    // Soft delete the message
    return prisma.message.update({
        where: { id: messageId },
        data: { deletedAt: new Date() }
    });
}

// Mark all messages in a chat as read
export async function markChatAsRead(chatId: string) {
    const user = await getCurrentUser();

    // Get all unread messages in the chat (that weren't sent by the user)
    const unreadMessages = await prisma.message.findMany({
        where: {
            chatId,
            senderId: { not: user.id },
            readBy: {
                none: { id: user.id }
            }
        },
        select: { id: true }
    });

    if (unreadMessages.length === 0) {
        return { count: 0 };
    }

    // Update the read status for all messages
    await prisma.$transaction([
        // Mark all messages as read
        ...unreadMessages.map(msg =>
            prisma.message.update({
                where: { id: msg.id },
                data: {
                    readBy: {
                        connect: { id: user.id }
                    }
                }
            })
        ),

        // Update the lastReadAt timestamp
        prisma.chatParticipant.update({
            where: {
                chatId_userId: {
                    chatId,
                    userId: user.id
                }
            },
            data: { lastReadAt: new Date() }
        })
    ]);

    return { count: unreadMessages.length };
}
