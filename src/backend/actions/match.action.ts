"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";
import { MatchStatus } from "@prisma/client";

/**
 * Find potential matches for the current user
 */
export async function findPotentialMatches(
    limit: number = 10,
    includeInterests: boolean = true
) {
    const user = await getCurrentUser();

    // Check if user has completed their profile
    if (user.profileCompleteness < 50) {
        throw new Error('Please complete your profile to find matches');
    }

    // Check if user allows matching
    const privacySettings = await prisma.userPrivacySetting.findUnique({
        where: { userId: user.id }
    });

    if (privacySettings && !privacySettings.allowMatching) {
        throw new Error('You have disabled matching in your privacy settings');
    }

    // Get user's interests for better matching
    const userInterests = includeInterests ?
        await prisma.userInterest.findMany({
            where: { userId: user.id },
            include: { interest: true }
        }) : [];

    const interestIds = userInterests.map(ui => ui.interestId);

    // Fetch a list of potential matches
    // This query finds users who:
    // 1. Are active
    // 2. Have matching interests (if includeInterests is true)
    // 3. Are not already matched or rejected
    const potentialMatches = await prisma.user.findMany({
        where: {
            id: { not: user.id },
            status: 'ACTIVE',
            // Don't show users that the current user already matched with or rejected
            NOT: {
                OR: [
                    {
                        matchesReceived: {
                            some: {
                                userId: user.id
                            }
                        }
                    },
                    {
                        matches: {
                            some: {
                                targetId: user.id
                            }
                        }
                    }
                ]
            },
            // Only include users who allow matching
            privacySettings: {
                allowMatching: true
            },
            // Filter by shared interests if requested
            ...(includeInterests && interestIds.length > 0 ? {
                interests: {
                    some: {
                        interestId: { in: interestIds }
                    }
                }
            } : {})
        },
        include: {
            media: {
                where: { entityType: 'USER' },
                take: 3
            },
            interests: {
                include: { interest: true },
                take: 5
            },
            address: true
        },
        take: limit
    });

    // Calculate compatibility scores
    return potentialMatches.map(match => {
        // Base compatibility score
        let compatibilityScore = 0.5;

        // Increase score based on shared interests
        if (includeInterests) {
            const sharedInterests = match.interests.filter(
                i => interestIds.includes(i.interestId)
            );

            if (sharedInterests.length > 0) {
                // More shared interests = higher score
                compatibilityScore += Math.min(0.5, sharedInterests.length * 0.1);
            }
        }

        // Add other factors like location proximity, etc. if needed

        return {
            user: match,
            compatibilityScore: parseFloat(compatibilityScore.toFixed(2))
        };
    });
}

/**
 * Create a match (like or reject a potential match)
 */
export async function createMatch(
    targetId: string,
    status: MatchStatus = MatchStatus.PENDING,
    compatibilityScore: number = 0.5
) {
    const user = await getCurrentUser();

    // Prevent matching with self
    if (targetId === user.id) {
        throw new Error('Cannot match with yourself');
    }

    // Check if match already exists
    const existingMatch = await prisma.match.findUnique({
        where: {
            userId_targetId: {
                userId: user.id,
                targetId
            }
        }
    });

    if (existingMatch) {
        // Update existing match if status is different
        if (existingMatch.status !== status) {
            return prisma.match.update({
                where: { id: existingMatch.id },
                data: { status }
            });
        }
        return existingMatch;
    }

    // Create new match
    const match = await prisma.match.create({
        data: {
            userId: user.id,
            targetId,
            status,
            compatibilityScore
        }
    });

    // Check if it's a mutual match (both users have liked each other)
    if (status === MatchStatus.ACCEPTED) {
        const mutualMatch = await prisma.match.findUnique({
            where: {
                userId_targetId: {
                    userId: targetId,
                    targetId: user.id
                }
            }
        });

        if (mutualMatch?.status === MatchStatus.ACCEPTED) {
            // Create a notification for both users
            await Promise.all([
                prisma.notification.create({
                    data: {
                        userId: user.id,
                        type: 'MATCH_ACCEPTED',
                        content: `You have a new match!`,
                        relatedId: targetId
                    }
                }),
                prisma.notification.create({
                    data: {
                        userId: targetId,
                        type: 'MATCH_ACCEPTED',
                        content: `You have a new match!`,
                        relatedId: user.id
                    }
                })
            ]);

            // Optionally create a direct chat for matched users
            await prisma.directChat.create({
                data: {
                    users: {
                        connect: [
                            { id: user.id },
                            { id: targetId }
                        ]
                    }
                }
            });
        }
    }

    return match;
}

/**
 * Get user's matches
 */
export async function getUserMatches(status?: MatchStatus) {
    const user = await getCurrentUser();

    // Define the base query
    const baseQuery = {
        include: {
            target: {
                select: {
                    id: true,
                    name: true,
                    bio: true,
                    media: {
                        where: { entityType: 'USER' },
                        take: 1
                    }
                }
            }
        },
        orderBy: { updatedAt: 'desc' } as const
    };

    // Get matches initiated by the user
    const sentMatches = await prisma.match.findMany({
        where: {
            userId: user.id,
            ...(status && { status })
        },
        ...baseQuery
    });

    // Get matches where the user is the target
    const receivedMatches = await prisma.match.findMany({
        where: {
            targetId: user.id,
            ...(status && { status })
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    bio: true,
                    media: {
                        where: { entityType: 'USER' },
                        take: 1
                    }
                }
            }
        },
        orderBy: { updatedAt: 'desc' }
    });

    // Process mutual matches (both users have liked each other)
    const mutualMatches = [];

    for (const sentMatch of sentMatches) {
        if (sentMatch.status === MatchStatus.ACCEPTED) {
            const corresponding = receivedMatches.find(
                rm => rm.userId === sentMatch.targetId && rm.status === MatchStatus.ACCEPTED
            );

            if (corresponding) {
                mutualMatches.push({
                    matchId: sentMatch.id,
                    user: sentMatch.target,
                });
            }
        }
    }

    return {
        sent: sentMatches,
        received: receivedMatches,
        mutual: mutualMatches
    };
}

/**
 * Update match status
 */
export async function updateMatchStatus(
    matchId: string,
    status: MatchStatus
) {
    const user = await getCurrentUser();

    // Get the match
    const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: {
            user: {
                select: { id: true }
            },
            target: {
                select: { id: true }
            }
        }
    });

    if (!match) {
        throw new Error('Match not found');
    }

    // Ensure the user is involved in the match
    if (match.user.id !== user.id && match.target.id !== user.id) {
        throw new Error('You do not have permission to update this match');
    }

    // Update the match status
    return prisma.match.update({
        where: { id: matchId },
        data: { status }
    });
}
