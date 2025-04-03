"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser, isAdmin } from "@backend/utils/auth";
import { UserStatus } from "@prisma/client";

/**
 * Ensure the current user is an admin
 */
async function ensureAdmin() {
    const currentUser = await getCurrentUser();
    if (currentUser.role !== 'ADMIN') {
        throw new Error('Unauthorized: Admin access required');
    }
    return currentUser;
}

/**
 * Get system statistics for admin dashboard
 */
export async function getSystemStats() {
    await ensureAdmin();

    // Run queries in parallel
    const [
        userStats,
        groupStats,
        eventStats,
        placeStats,
        messageStats,
        reviewStats
    ] = await Promise.all([
        // User statistics
        prisma.user.groupBy({
            by: ['status'],
            _count: true
        }),

        // Group statistics
        prisma.group.groupBy({
            by: ['status'],
            _count: true
        }),

        // Event statistics
        prisma.event.count(),

        // Place statistics
        prisma.place.count(),

        // Message statistics
        prisma.message.count(),

        // Review statistics
        prisma.review.count()
    ]);

    // Calculate active users in last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const activeUsersCount = await prisma.user.count({
        where: {
            lastActive: {
                gte: oneWeekAgo
            }
        }
    });

    // Process user stats by status
    const userStatsByStatus = Object.fromEntries(
        userStats.map(stat => [stat.status, stat._count])
    );

    // Process group stats by status
    const groupStatsByStatus = Object.fromEntries(
        groupStats.map(stat => [stat.status, stat._count])
    );

    // Return compiled statistics
    return {
        users: {
            total: Object.values(userStatsByStatus).reduce((sum, count) => sum + count, 0),
            active: activeUsersCount,
            byStatus: userStatsByStatus
        },
        groups: {
            total: Object.values(groupStatsByStatus).reduce((sum, count) => sum + count, 0),
            byStatus: groupStatsByStatus
        },
        events: eventStats,
        places: placeStats,
        messages: messageStats,
        reviews: reviewStats
    };
}

/**
 * Get users with pagination and filtering for admin
 */
export async function getUsers({
    status,
    search,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortDirection = 'desc'
}: {
    status?: UserStatus;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
} = {}) {
    await ensureAdmin();

    const where = {
        ...(status ? { status } : {}),
        ...(search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ]
        } : {})
    };

    // Get total count
    const totalCount = await prisma.user.count({ where });

    // Get users
    const users = await prisma.user.findMany({
        where,
        include: {
            address: true,
            media: {
                where: { entityType: 'USER' },
                take: 1
            },
            _count: {
                select: {
                    memberships: true,
                    reviews: true
                }
            }
        },
        orderBy: {
            [sortBy]: sortDirection
        },
        skip: (page - 1) * limit,
        take: limit
    });

    return {
        users,
        pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
        }
    };
}

/**
 * Update user status (suspend/activate)
 */
export async function updateUserStatus(
    userId: string,
    status: UserStatus,
    reason?: string
) {
    await ensureAdmin();

    // Cannot update your own status
    const currentUser = await getCurrentUser();
    if (userId === currentUser.id) {
        throw new Error('You cannot modify your own account status');
    }

    // Update user status
    return prisma.user.update({
        where: { id: userId },
        data: {
            status,
            customFields: reason ? { suspensionReason: reason } : undefined
        }
    });
}

/**
 * Update user role
 */
export async function updateUserRole(
    userId: string,
    role: string
) {
    await ensureAdmin();

    // Cannot update your own role
    const currentUser = await getCurrentUser();
    if (userId === currentUser.id) {
        throw new Error('You cannot modify your own role');
    }

    // Update user role
    return prisma.user.update({
        where: { id: userId },
        data: { role: role as any }
    });
}

/**
 * Get reported content for moderation
 */
export async function getReportedContent({
    contentType,
    page = 1,
    limit = 20
}: {
    contentType?: string;
    page?: number;
    limit?: number;
} = {}) {
    await ensureAdmin();

    // This is a placeholder - in a real app you would have a Report model
    // Since we don't have one in the schema, this is just an example

    return {
        reports: [],
        pagination: {
            total: 0,
            page,
            limit,
            pages: 0
        }
    };
}

/**
 * Feature or unfeature a group
 */
export async function toggleGroupFeatured(
    groupId: string,
    isFeatured: boolean
) {
    await ensureAdmin();

    return prisma.group.update({
        where: { id: groupId },
        data: { isFeatured }
    });
}

/**
 * Delete a place (admin only)
 */
export async function deletePlace(placeId: string) {
    await ensureAdmin();

    // Delete the place
    return prisma.place.delete({
        where: { id: placeId }
    });
}

/**
 * Delete a group (admin only)
 */
export async function deleteGroup(groupId: string) {
    await ensureAdmin();

    // Delete the group
    return prisma.group.delete({
        where: { id: groupId }
    });
}

/**
 * Clean up expired data
 */
export async function cleanupExpiredData() {
    await ensureAdmin();

    const now = new Date();

    // Delete expired notifications
    const { count: notificationsDeleted } = await prisma.notification.deleteMany({
        where: {
            expiresAt: {
                lt: now
            }
        }
    });

    // Update waitlist entries older than a certain time to EXPIRED
    const expiryThreshold = new Date();
    expiryThreshold.setMonth(expiryThreshold.getMonth() - 1); // 1 month old

    const { count: waitlistExpired } = await prisma.waitlistEntry.updateMany({
        where: {
            status: 'WAITING',
            joinedAt: {
                lt: expiryThreshold
            }
        },
        data: {
            status: 'EXPIRED'
        }
    });

    return {
        notificationsDeleted,
        waitlistExpired
    };
}
