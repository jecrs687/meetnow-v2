"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";
import { NotificationType } from "@prisma/client";

/**
 * Get user's notifications with pagination
 */
export async function getNotifications({
    page = 1,
    limit = 20,
    unreadOnly = false
}: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
} = {}) {
    const user = await getCurrentUser();

    const where = {
        userId: user.id,
        ...(unreadOnly ? { isRead: false } : {})
    };

    // Get total count for pagination
    const totalCount = await prisma.notification.count({ where });

    // Get notifications
    const notifications = await prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
    });

    return {
        notifications,
        pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
        }
    };
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
    const user = await getCurrentUser();

    // Find the notification
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId }
    });

    if (!notification) {
        throw new Error('Notification not found');
    }

    // Check if this notification belongs to the user
    if (notification.userId !== user.id) {
        throw new Error('You do not have permission to update this notification');
    }

    // Mark as read
    return prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    });
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
    const user = await getCurrentUser();

    // Update all unread notifications
    const { count } = await prisma.notification.updateMany({
        where: {
            userId: user.id,
            isRead: false
        },
        data: { isRead: true }
    });

    return { count };
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
    const user = await getCurrentUser();

    // Find the notification
    const notification = await prisma.notification.findUnique({
        where: { id: notificationId }
    });

    if (!notification) {
        throw new Error('Notification not found');
    }

    // Check if this notification belongs to the user
    if (notification.userId !== user.id) {
        throw new Error('You do not have permission to delete this notification');
    }

    // Delete the notification
    return prisma.notification.delete({
        where: { id: notificationId }
    });
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount() {
    const user = await getCurrentUser();

    return prisma.notification.count({
        where: {
            userId: user.id,
            isRead: false
        }
    });
}

/**
 * Create a notification (admin/system use)
 */
export async function createNotification({
    userId,
    type,
    content,
    relatedId,
    expiresAt
}: {
    userId: string;
    type: NotificationType;
    content: string;
    relatedId?: string;
    expiresAt?: Date;
}) {
    // This should only be called from other server actions,
    // not directly exposed to the client

    // Create the notification
    return prisma.notification.create({
        data: {
            userId,
            type,
            content,
            relatedId,
            expiresAt
        }
    });
}

/**
 * Create a system notification for multiple users (admin only)
 */
export async function createSystemNotification({
    userIds,
    content,
    relatedId,
    expiresAt
}: {
    userIds: string[];
    content: string;
    relatedId?: string;
    expiresAt?: Date;
}) {
    const currentUser = await getCurrentUser();

    // Check if current user is admin
    if (currentUser.role !== 'ADMIN') {
        throw new Error('Only admins can send system notifications');
    }

    // Create notifications in bulk
    const notifications = await Promise.all(
        userIds.map(userId =>
            prisma.notification.create({
                data: {
                    userId,
                    type: 'SYSTEM',
                    content,
                    relatedId,
                    expiresAt
                }
            })
        )
    );

    return { count: notifications.length };
}
