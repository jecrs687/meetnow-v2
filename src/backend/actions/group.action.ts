"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";
import { GroupStatus, MembershipStatus, RoleType, Visibility } from "@prisma/client";

// Get user's groups (both participating and created)
export const getUserGroups = async () => {
    const user = await getCurrentUser();

    return prisma.group.findMany({
        where: {
            memberships: {
                some: {
                    userId: user.id,
                    status: { in: ['ACCEPTED', 'PENDING'] }
                }
            }
        },
        include: {
            place: {
                include: {
                    address: true
                }
            },
            memberships: {
                where: {
                    status: 'ACCEPTED'
                },
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
                take: 5
            },
            media: {
                where: { entityType: 'GROUP' },
                take: 3
            },
            _count: {
                select: {
                    memberships: {
                        where: { status: 'ACCEPTED' }
                    }
                }
            }
        },
        orderBy: [
            { startTime: 'asc' }
        ]
    });
}

// Get single group with all details
export const getGroupDetails = async (groupId: string) => {
    const user = await getCurrentUser();

    const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
            place: {
                include: {
                    address: true
                }
            },
            memberships: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            bio: true,
                            media: {
                                where: { entityType: 'USER' },
                                take: 3
                            }
                        }
                    }
                }
            },
            media: {
                where: { entityType: 'GROUP' }
            },
            events: {
                where: { status: { in: ['SCHEDULED', 'ACTIVE'] } },
                include: {
                    media: {
                        where: { entityType: 'EVENT' },
                        take: 1
                    }
                },
                orderBy: { startDate: 'asc' }
            },
            galleries: {
                include: {
                    media: {
                        take: 5
                    }
                },
                take: 1
            },
            chat: true
        }
    });

    if (!group) {
        throw new Error(`Group with ID ${groupId} not found`);
    }

    // Check if user can view this group
    const userMembership = group.memberships.find(m => m.userId === user.id);
    const isPublic = group.visibility === Visibility.PUBLIC;

    if (!isPublic && !userMembership) {
        throw new Error('You do not have permission to view this group');
    }

    // Add user's membership status
    return {
        ...group,
        userMembership
    };
}

// Join a group (request to join)
export const joinGroup = async (groupId: string) => {
    const user = await getCurrentUser();

    // Check if user already has a membership
    const existingMembership = await prisma.membership.findUnique({
        where: {
            userId_groupId: {
                userId: user.id,
                groupId
            }
        }
    });

    if (existingMembership) {
        // If previously declined/canceled/rejected, update status
        if (['DECLINED', 'CANCELED', 'REJECTED'].includes(existingMembership.status)) {
            return prisma.membership.update({
                where: { id: existingMembership.id },
                data: {
                    status: MembershipStatus.PENDING,
                    joinedAt: new Date()
                }
            });
        }

        throw new Error('You already have a membership for this group');
    }

    // Get group to check if it's open
    const group = await prisma.group.findUnique({
        where: { id: groupId },
        select: {
            visibility: true,
            status: true
        }
    });

    if (!group) {
        throw new Error('Group not found');
    }

    if (group.status !== GroupStatus.ACTIVE) {
        throw new Error('This group is not active');
    }

    // For public groups, auto-accept if public
    const initialStatus = group.visibility === Visibility.PUBLIC
        ? MembershipStatus.ACCEPTED
        : MembershipStatus.PENDING;

    // Create membership
    return prisma.membership.create({
        data: {
            userId: user.id,
            groupId,
            status: initialStatus,
            role: RoleType.MEMBER
        }
    });
}

// Leave group
export const leaveGroup = async (groupId: string) => {
    const user = await getCurrentUser();

    const membership = await prisma.membership.findUnique({
        where: {
            userId_groupId: {
                userId: user.id,
                groupId
            }
        },
        include: {
            group: {
                select: {
                    memberships: {
                        where: {
                            role: RoleType.OWNER
                        }
                    }
                }
            }
        }
    });

    if (!membership) {
        throw new Error('You are not a member of this group');
    }

    // If user is the owner and only owner, they can't leave
    if (
        membership.role === RoleType.OWNER &&
        membership.group.memberships.length === 1
    ) {
        throw new Error('As the only owner, you cannot leave the group. Transfer ownership first or delete the group.');
    }

    // If status is PENDING, delete the membership
    if (membership.status === MembershipStatus.PENDING) {
        return prisma.membership.delete({
            where: { id: membership.id }
        });
    }

    // Otherwise, update status to CANCELED
    return prisma.membership.update({
        where: { id: membership.id },
        data: { status: MembershipStatus.CANCELED }
    });
}

// Create a new group
export type CreateGroupInput = {
    name: string;
    description: string;
    placeId: string;
    startTime?: Date;
    endTime?: Date;
    maxCapacity?: number;
    visibility: Visibility;
    tags?: string[];
    dietaryOptions?: string[];
    costEstimate?: number;
    dress?: string;
    mediaIds?: string[];
}

export const createGroup = async (input: CreateGroupInput) => {
    const user = await getCurrentUser();

    // Create the group and owner membership in a transaction
    return prisma.$transaction(async (tx) => {
        // Create the group
        const group = await tx.group.create({
            data: {
                name: input.name,
                description: input.description,
                placeId: input.placeId,
                startTime: input.startTime,
                endTime: input.endTime,
                maxCapacity: input.maxCapacity,
                visibility: input.visibility,
                tags: input.tags || [],
                dietaryOptions: input.dietaryOptions || [],
                costEstimate: input.costEstimate ? parseFloat(input.costEstimate.toString()) : null,
                dress: input.dress as any,
            }
        });

        // Link any provided media
        if (input.mediaIds?.length) {
            await tx.media.updateMany({
                where: { id: { in: input.mediaIds } },
                data: {
                    groupId: group.id,
                    entityType: 'GROUP'
                }
            });
        }

        // Create owner membership
        await tx.membership.create({
            data: {
                userId: user.id,
                groupId: group.id,
                status: MembershipStatus.ACCEPTED,
                role: RoleType.OWNER
            }
        });

        // Create chat for the group
        await tx.chat.create({
            data: {
                groupId: group.id,
                type: 'GROUP',
                participants: {
                    create: {
                        userId: user.id,
                        role: RoleType.OWNER
                    }
                }
            }
        });

        return group;
    });
}

// Update group details (only for owner/admin)
export const updateGroup = async (groupId: string, input: Partial<CreateGroupInput>) => {
    const user = await getCurrentUser();

    // Check user's permission
    const membership = await prisma.membership.findUnique({
        where: {
            userId_groupId: {
                userId: user.id,
                groupId
            }
        }
    });

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
        throw new Error('You do not have permission to update this group');
    }

    // Update the group
    return prisma.$transaction(async (tx) => {
        // Update group properties
        const group = await tx.group.update({
            where: { id: groupId },
            data: {
                ...(input.name && { name: input.name }),
                ...(input.description && { description: input.description }),
                ...(input.startTime && { startTime: input.startTime }),
                ...(input.endTime && { endTime: input.endTime }),
                ...(input.maxCapacity && { maxCapacity: input.maxCapacity }),
                ...(input.visibility && { visibility: input.visibility }),
                ...(input.tags && { tags: input.tags }),
                ...(input.dietaryOptions && { dietaryOptions: input.dietaryOptions }),
                ...(input.costEstimate && { costEstimate: parseFloat(input.costEstimate.toString()) }),
                ...(input.dress && { dress: input.dress as any }),
            }
        });

        // Add new media if provided
        if (input.mediaIds?.length) {
            await tx.media.updateMany({
                where: { id: { in: input.mediaIds } },
                data: {
                    groupId: group.id,
                    entityType: 'GROUP'
                }
            });
        }

        return group;
    });
}

// Approve or reject a member's request to join
export const updateMembershipStatus = async (
    membershipId: string,
    status: MembershipStatus
) => {
    const user = await getCurrentUser();

    // Get the membership
    const membership = await prisma.membership.findUnique({
        where: { id: membershipId },
        include: {
            group: {
                include: {
                    memberships: {
                        where: {
                            userId: user.id,
                            role: { in: ['OWNER', 'ADMIN'] }
                        }
                    }
                }
            }
        }
    });

    if (!membership) {
        throw new Error('Membership not found');
    }

    // Check if user has permission to update the status
    if (membership.group.memberships.length === 0) {
        throw new Error('You do not have permission to update this membership');
    }

    // Update membership status
    return prisma.membership.update({
        where: { id: membershipId },
        data: { status }
    });
}

// Get pending membership requests for a group (owner/admin only)
export const getPendingMembershipRequests = async (groupId: string) => {
    const user = await getCurrentUser();

    // Check if user is owner/admin
    const membership = await prisma.membership.findUnique({
        where: {
            userId_groupId: {
                userId: user.id,
                groupId
            }
        }
    });

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
        throw new Error('You do not have permission to view membership requests');
    }

    // Get pending requests
    return prisma.membership.findMany({
        where: {
            groupId,
            status: MembershipStatus.PENDING
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
        orderBy: { joinedAt: 'asc' }
    });
}

// Find relevant groups for the user based on interests and location
export const discoverGroups = async (
    page: number = 1,
    limit: number = 20,
    filters?: {
        query?: string;
        startAfter?: Date;
        maxDistance?: number;
        categories?: string[];
    }
) => {
    const user = await getCurrentUser();

    // Build where conditions
    const whereConditions: any = {
        status: GroupStatus.ACTIVE,
        // Don't show groups the user is already a member of
        NOT: {
            memberships: {
                some: {
                    userId: user.id,
                    status: { in: ['ACCEPTED', 'PENDING'] }
                }
            }
        }
    };

    // Add time filter
    if (filters?.startAfter) {
        whereConditions.startTime = { gte: filters.startAfter };
    } else {
        // Default to future events
        whereConditions.startTime = { gte: new Date() };
    }

    // Add keyword search
    if (filters?.query) {
        whereConditions.OR = [
            { name: { contains: filters.query, mode: 'insensitive' } },
            { description: { contains: filters.query, mode: 'insensitive' } },
            { tags: { has: filters.query } }
        ];
    }

    // Add category filter
    if (filters?.categories?.length) {
        whereConditions.place = {
            categories: { hasSome: filters.categories }
        };
    }

    // Get user's interests for better recommendations
    const userInterests = await prisma.userInterest.findMany({
        where: { userId: user.id },
        select: { interest: true }
    });

    const interestKeywords = userInterests.map(ui => ui.interest.name.toLowerCase());

    // Get total count
    const totalCount = await prisma.group.count({
        where: whereConditions
    });

    // Get groups
    const groups = await prisma.group.findMany({
        where: whereConditions,
        include: {
            place: {
                include: {
                    address: true
                }
            },
            memberships: {
                where: {
                    status: 'ACCEPTED'
                },
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
                take: 5
            },
            media: {
                where: { entityType: 'GROUP' },
                take: 3
            },
            _count: {
                select: {
                    memberships: {
                        where: { status: 'ACCEPTED' }
                    }
                }
            }
        },
        orderBy: [
            { isFeatured: 'desc' },
            { startTime: 'asc' }
        ],
        skip: (page - 1) * limit,
        take: limit
    });

    // Calculate relevance score for each group
    const groupsWithRelevance = groups.map(group => {
        // Start with base score
        let relevanceScore = 0;

        // Check if group tags match user interests
        const groupTags = group.tags.map(t => t.toLowerCase());
        const interestMatch = interestKeywords.some(interest =>
            groupTags.includes(interest) ||
            group.name?.toLowerCase().includes(interest) ||
            group.description.toLowerCase().includes(interest)
        );

        if (interestMatch) {
            relevanceScore += 10;
        }

        // Factor in group popularity
        relevanceScore += Math.min(10, group._count.memberships);

        // Factor in time proximity
        if (group.startTime) {
            const daysUntilStart = Math.max(0, Math.floor((group.startTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
            if (daysUntilStart < 3) {
                relevanceScore += 5;
            } else if (daysUntilStart < 7) {
                relevanceScore += 3;
            }
        }

        return {
            ...group,
            relevanceScore
        };
    });

    return {
        groups: groupsWithRelevance.sort((a, b) => b.relevanceScore - a.relevanceScore),
        pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
        }
    };
}