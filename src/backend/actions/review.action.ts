"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";

/**
 * Create or update a review for a place
 */
export async function createOrUpdateReview({
    placeId,
    rating,
    comment,
    photos
}: {
    placeId: string;
    rating: number;
    comment?: string;
    photos?: string[];
}) {
    const user = await getCurrentUser();

    // Validate rating
    if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }

    // Check if user already has a review for this place
    const existingReview = await prisma.review.findUnique({
        where: {
            userId_placeId: {
                userId: user.id,
                placeId
            }
        }
    });

    // Create or update the review
    if (existingReview) {
        // Update existing review
        return prisma.review.update({
            where: { id: existingReview.id },
            data: {
                rating,
                comment,
                photos: photos || []
            }
        });
    } else {
        // Create new review
        return prisma.review.create({
            data: {
                userId: user.id,
                placeId,
                rating,
                comment,
                photos: photos || []
            }
        });
    }
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string) {
    const user = await getCurrentUser();

    // Get the review
    const review = await prisma.review.findUnique({
        where: { id: reviewId }
    });

    if (!review) {
        throw new Error('Review not found');
    }

    // Check if user is the author
    if (review.userId !== user.id) {
        throw new Error('You can only delete your own reviews');
    }

    // Delete the review
    return prisma.review.delete({
        where: { id: reviewId }
    });
}

/**
 * Get reviews for a place
 */
export async function getPlaceReviews({
    placeId,
    page = 1,
    limit = 10
}: {
    placeId: string;
    page?: number;
    limit?: number;
}) {
    // Get total count
    const totalCount = await prisma.review.count({
        where: { placeId }
    });

    // Get reviews with pagination
    const reviews = await prisma.review.findMany({
        where: { placeId },
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
        },
        orderBy: [
            { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
    });

    // Calculate average rating
    const averageRating = totalCount > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalCount
        : 0;

    return {
        reviews,
        averageRating,
        pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
        }
    };
}

/**
 * Get user's reviews
 */
export async function getUserReviews({
    page = 1,
    limit = 10
}: {
    page?: number;
    limit?: number;
} = {}) {
    const user = await getCurrentUser();

    // Get total count
    const totalCount = await prisma.review.count({
        where: { userId: user.id }
    });

    // Get reviews
    const reviews = await prisma.review.findMany({
        where: { userId: user.id },
        include: {
            place: {
                select: {
                    id: true,
                    name: true,
                    media: {
                        where: { entityType: 'PLACE' },
                        take: 1
                    }
                }
            }
        },
        orderBy: [
            { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
    });

    return {
        reviews,
        pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
        }
    };
}
