"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";

/**
 * Get all interests with optional filtering
 */
export async function getInterests({
    category,
    search,
    page = 1,
    limit = 50
}: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
} = {}) {
    const where = {
        ...(category ? { category } : {}),
        ...(search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        } : {})
    };

    // Get total count
    const totalCount = await prisma.interest.count({ where });

    // Get interests
    const interests = await prisma.interest.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit
    });

    return {
        interests,
        pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
        }
    };
}

/**
 * Get available interest categories
 */
export async function getInterestCategories() {
    const categories = await prisma.interest.groupBy({
        by: ['category'],
        _count: {
            category: true
        }
    });

    return categories.map(c => ({
        name: c.category,
        count: c._count.category
    }));
}

/**
 * Get a user's interests
 */
export async function getUserInterests() {
    const user = await getCurrentUser();

    return prisma.userInterest.findMany({
        where: { userId: user.id },
        include: {
            interest: true
        },
        orderBy: {
            level: 'desc'
        }
    });
}

/**
 * Add an interest to the user's profile
 */
export async function addUserInterest({
    interestId,
    level = 5
}: {
    interestId: string;
    level?: number;
}) {
    const user = await getCurrentUser();

    // Validate level
    if (level < 1 || level > 10) {
        throw new Error('Interest level must be between 1 and 10');
    }

    // Check if interest exists
    const interest = await prisma.interest.findUnique({
        where: { id: interestId }
    });

    if (!interest) {
        throw new Error('Interest not found');
    }

    // Check if user already has this interest
    const existingInterest = await prisma.userInterest.findUnique({
        where: {
            userId_interestId: {
                userId: user.id,
                interestId
            }
        }
    });

    if (existingInterest) {
        // Update level if different
        if (existingInterest.level !== level) {
            return prisma.userInterest.update({
                where: { id: existingInterest.id },
                data: { level },
                include: { interest: true }
            });
        }
        return existingInterest;
    }

    // Add new interest
    return prisma.userInterest.create({
        data: {
            userId: user.id,
            interestId,
            level
        },
        include: { interest: true }
    });
}

/**
 * Remove an interest from the user's profile
 */
export async function removeUserInterest(interestId: string) {
    const user = await getCurrentUser();

    // Check if user has this interest
    const userInterest = await prisma.userInterest.findUnique({
        where: {
            userId_interestId: {
                userId: user.id,
                interestId
            }
        }
    });

    if (!userInterest) {
        throw new Error('Interest not found in your profile');
    }

    // Remove the interest
    return prisma.userInterest.delete({
        where: { id: userInterest.id }
    });
}

/**
 * Get interests shared with another user
 */
export async function getSharedInterests(otherUserId: string) {
    const user = await getCurrentUser();

    // Get current user's interests
    const userInterests = await prisma.userInterest.findMany({
        where: { userId: user.id },
        select: { interestId: true }
    });

    const userInterestIds = userInterests.map(ui => ui.interestId);

    // Get other user's matching interests
    const sharedInterests = await prisma.userInterest.findMany({
        where: {
            userId: otherUserId,
            interestId: { in: userInterestIds }
        },
        include: {
            interest: true
        }
    });

    return sharedInterests;
}

/**
 * Create a new interest (admin only)
 */
export async function createInterest({
    name,
    category,
    description
}: {
    name: string;
    category: string;
    description?: string;
}) {
    const user = await getCurrentUser();

    // Only admins can create interests
    if (user.role !== 'ADMIN') {
        throw new Error('Only admins can create interests');
    }

    // Check if interest already exists
    const existingInterest = await prisma.interest.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } }
    });

    if (existingInterest) {
        throw new Error('An interest with this name already exists');
    }

    // Create the interest
    return prisma.interest.create({
        data: {
            name,
            category,
            description
        }
    });
}
