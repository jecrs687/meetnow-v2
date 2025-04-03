"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";
import { UserPrivacySetting, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

/**
 * Get the current user profile with all relevant information
 */
export async function getUserProfile() {
    const user = await getCurrentUser();

    return prisma.user.findUnique({
        where: { id: user.id },
        include: {
            media: {
                where: { entityType: 'USER' },
                orderBy: { createdAt: 'desc' }
            },
            address: true,
            interests: {
                include: {
                    interest: true
                }
            },
            privacySettings: true,
            dietaryPreferences: true,
            points: true
        }
    });
}

/**
 * Update user profile information
 */
export async function updateUserProfile(data: {
    name?: string;
    bio?: string;
    gender?: string;
    birthday?: Date | null;
    phoneNumber?: string;
}) {
    const user = await getCurrentUser();

    // Update the user
    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            ...data,
            // Recalculate profile completeness
            profileCompleteness: calculateProfileCompleteness({
                ...user,
                ...data
            })
        }
    });

    return updatedUser;
}

/**
 * Update user password
 */
export async function updatePassword(
    currentPassword: string,
    newPassword: string
) {
    const user = await getCurrentUser();

    // Get the actual password from database
    const userWithPassword = await prisma.user.findUnique({
        where: { id: user.id },
        select: { password: true }
    });

    if (!userWithPassword) {
        throw new Error('User not found');
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(
        currentPassword,
        userWithPassword.password
    );

    if (!passwordValid) {
        throw new Error('Current password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    });

    return { success: true };
}

/**
 * Update user address
 */
export async function updateUserAddress(addressData: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
}) {
    const user = await getCurrentUser();

    // Check if user already has an address
    if (user.addressId) {
        // Update existing address
        return prisma.address.update({
            where: { id: user.addressId },
            data: addressData
        });
    } else {
        // Create new address and connect to user
        return prisma.$transaction(async (tx) => {
            const address = await tx.address.create({
                data: addressData
            });

            await tx.user.update({
                where: { id: user.id },
                data: { addressId: address.id }
            });

            return address;
        });
    }
}

/**
 * Update privacy settings
 */
export async function updatePrivacySettings(
    settings: Partial<UserPrivacySetting>
) {
    const user = await getCurrentUser();

    return prisma.userPrivacySetting.upsert({
        where: { userId: user.id },
        update: settings,
        create: {
            userId: user.id,
            ...settings
        }
    });
}

/**
 * Deactivate user account (soft delete)
 */
export async function deactivateAccount(reason?: string) {
    const user = await getCurrentUser();

    // Set status to INACTIVE
    await prisma.user.update({
        where: { id: user.id },
        data: {
            status: UserStatus.INACTIVE,
            // Store deactivation reason in customFields if needed
        }
    });

    // You might want to clear sessions, etc.

    return { success: true };
}

/**
 * Add interest to user profile
 */
export async function addUserInterest(
    interestId: string,
    level: number = 5
) {
    const user = await getCurrentUser();

    return prisma.userInterest.upsert({
        where: {
            userId_interestId: {
                userId: user.id,
                interestId
            }
        },
        update: { level },
        create: {
            userId: user.id,
            interestId,
            level
        }
    });
}

/**
 * Remove interest from user profile
 */
export async function removeUserInterest(interestId: string) {
    const user = await getCurrentUser();

    return prisma.userInterest.delete({
        where: {
            userId_interestId: {
                userId: user.id,
                interestId
            }
        }
    });
}

/**
 * Add dietary preference
 */
export async function addDietaryPreference(data: {
    preference: any; // DietaryOption enum
    severity?: any; // PreferenceSeverity enum
    notes?: string;
}) {
    const user = await getCurrentUser();

    return prisma.userDietaryPreference.upsert({
        where: {
            userId_preference: {
                userId: user.id,
                preference: data.preference
            }
        },
        update: {
            severity: data.severity,
            notes: data.notes
        },
        create: {
            userId: user.id,
            preference: data.preference,
            severity: data.severity,
            notes: data.notes
        }
    });
}

/**
 * Remove dietary preference
 */
export async function removeDietaryPreference(preference: any) {
    const user = await getCurrentUser();

    return prisma.userDietaryPreference.delete({
        where: {
            userId_preference: {
                userId: user.id,
                preference
            }
        }
    });
}

/**
 * Get all user notifications with pagination
 */
export async function getUserNotifications(
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
) {
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
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
    const user = await getCurrentUser();

    return prisma.notification.update({
        where: {
            id: notificationId,
            userId: user.id // Ensure the notification belongs to the user
        },
        data: { isRead: true }
    });
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
    const user = await getCurrentUser();

    await prisma.notification.updateMany({
        where: {
            userId: user.id,
            isRead: false
        },
        data: { isRead: true }
    });

    return { success: true };
}

// Helper function to calculate profile completeness
function calculateProfileCompleteness(user: any): number {
    const fields = [
        'name',
        'bio',
        'gender',
        'birthday',
        'phoneNumber',
        'address',
        'media' // profile photo
    ];

    const filledFields = fields.filter(field => {
        if (field === 'media') {
            return user.media && user.media.length > 0;
        }
        return user[field] !== null && user[field] !== undefined;
    });

    return Math.round((filledFields.length / fields.length) * 100);
}
