"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";

/**
 * Get user's direct chats
 */
export async function getDirectChats() {
    const user = await getCurrentUser();

    // Find all direct chats where user is a participant
    return prisma.directChat.findMany({
        where: {
            users: {
                some: {
                    id: user.id
                }
            },
            isBlocked: false
        },
        include: {
            users: {
                where: {
                    id: { not: user.id } // Get the other participants
                },
                select: {
                    id: true,
                    name: true,
                    lastActive: true,
                    media: {
                        where: { entityType: 'USER' },
                        take: 1
                    }
                }
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                select: {
                    id: true,
                    text: true,
                    createdAt: true,
                    isRead: true,
                    senderId: true
                }
            }
        },
        orderBy: {
            lastActivity: 'desc'
        }
    });
}

/**
 * Create a direct chat with another user
 */
export async function createDirectChat(targetUserId: string) {
    const user = await getCurrentUser();

    // Prevent creating chat with self
    if (targetUserId === user.id) {
        throw new Error('Cannot create chat with yourself');
    }

    // Check if users already have a chat
    const existingChat = await prisma.directChat.findFirst({
        where: {
            users: {
                every: {
                    id: { in: [user.id, targetUserId] }
                }
            }
        }
    });

    if (existingChat) {
        return existingChat;
    }

    // Create new chat
    return prisma.directChat.create({
        data: {
            users: {
                connect: [
                    { id: user.id },
                    { id: targetUserId }
                ]
            }
        }
    });
}

/**
 * Get direct chat details
 */
export async function getDirectChatById(chatId: string) {
    const user = await getCurrentUser();

    // Get the chat with details
    const chat = await prisma.directChat.findUnique({
        where: { id: chatId },
        include: {
            users: {
                select: {
                    id: true,
                    name: true,
                    lastActive: true,
                    media: {
                        where: { entityType: 'USER' },
                        take: 1
                    }
                }
            }
        }
    });

    if (!chat) {
        throw new Error('Chat not found');
    }

    // Check if user is a participant
    if (!chat.users.some(u => u.id === user.id)) {
        throw new Error('You do not have access to this chat');
    }

    return chat;
}

/**
 * Get messages for a direct chat
 */
export async function getDirectMessages({
    chatId,
    cursor,
    limit = 20
}: {
    chatId: string;
    cursor?: string;
    limit?: number;
}) {
    const user = await getCurrentUser();

    // Check if user is a participant
    const isParticipant = await prisma.directChat.findFirst({
        where: {
            id: chatId,
            users: {
                some: {
                    id: user.id
                }
            }
        }
    });

    if (!isParticipant) {
        throw new Error('You do not have access to this chat');
    }

    // Build cursor condition
    const cursorCondition = cursor ? {
        cursor: { id: cursor },
        skip: 1
    } : {};

    // Get messages
    const messages = await prisma.directMessage.findMany({
        where: {
            chatId,
            deletedAt: null
        },
        include: {
            // Include any additional data needed
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        ...cursorCondition
    });

    // Update read status for messages sent by others
    const unreadMessages = messages.filter(m =>
        m.senderId !== user.id && !m.isRead
    );

    if (unreadMessages.length > 0) {
        await prisma.directMessage.updateMany({
            where: {
                id: { in: unreadMessages.map(m => m.id) }
            },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });

        // Update the chat's last activity
        await prisma.directChat.update({
            where: { id: chatId },
            data: { lastActivity: new Date() }
        });
    }

    // Get the next cursor
    const nextCursor = messages.length === limit ? messages[messages.length - 1].id : null;

    return {
        messages,
        nextCursor
    };
}

/**
 * Send a direct message
 */
export async function sendDirectMessage({
    chatId,
    text,
    media
}: {
    chatId: string;
    text?: string;
    media?: string[];
}) {
    const user = await getCurrentUser();

    // Check if user is a participant
    const chat = await prisma.directChat.findFirst({
        where: {
            id: chatId,
            users: {
                some: {
                    id: user.id
                }
            }
        }
    });

    if (!chat) {
        throw new Error('You do not have access to this chat');
    }

    // Validate message content
    if (!text && (!media || media.length === 0)) {
        throw new Error('Message must have text or media');
    }

    // Create the message
    const message = await prisma.directMessage.create({
        data: {
            chatId,
            senderId: user.id,
            text,
            media: media || []
        }
    });

    // Update chat's last activity
    await prisma.directChat.update({
        where: { id: chatId },
        data: { lastActivity: new Date() }
    });

    return message;
}

/**
 * Delete a direct message (soft delete)
 */
export async function deleteDirectMessage(messageId: string) {
    const user = await getCurrentUser();

    // Get the message
    const message = await prisma.directMessage.findUnique({
        where: { id: messageId }
    });

    if (!message) {
        throw new Error('Message not found');
    }

    // Ensure user is the sender
    if (message.senderId !== user.id) {
        throw new Error('You can only delete your own messages');
    }

    // Soft delete the message
    return prisma.directMessage.update({
        where: { id: messageId },
        data: {
            deletedAt: new Date()
        }
    });
}

/**
 * Block a direct chat
 */
export async function blockDirectChat(chatId: string) {
    const user = await getCurrentUser();

    // Check if user is a participant
    const chat = await prisma.directChat.findFirst({
        where: {
            id: chatId,
            users: {
                some: {
                    id: user.id
                }
            }
        }
    });

    if (!chat) {
        throw new Error('Chat not found');
    }

    // Block the chat
    return prisma.directChat.update({
        where: { id: chatId },
        data: { isBlocked: true }
    });
}

/**
 * Unblock a direct chat
 */
export async function unblockDirectChat(chatId: string) {
    const user = await getCurrentUser();

    // Check if user is a participant
    const chat = await prisma.directChat.findFirst({
        where: {
            id: chatId,
            users: {
                some: {
                    id: user.id
                }
            }
        }
    });

    if (!chat) {
        throw new Error('Chat not found');
    }

    // Unblock the chat
    return prisma.directChat.update({
        where: { id: chatId },
        data: { isBlocked: false }
    });
}
