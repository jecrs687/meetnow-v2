"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";
import { MembershipStatus, RoleType, WaitlistStatus } from "@prisma/client";

/**
 * Join a waitlist for a group
 */
export async function joinWaitlist(groupId: string) {
    const user = await getCurrentUser();

    // Check if user is already in the group
    const membership = await prisma.membership.findUnique({
        where: {
            userId_groupId: {
                userId: user.id,
                groupId
            }
        }
    });

    if (membership && ![MembershipStatus.DECLINED, MembershipStatus.REJECTED].includes(membership.status)) {
        throw new Error('You are already a member or pending member of this group');
    }

    // Check if user is already on the waitlist
    const existingEntry = await prisma.waitlistEntry.findFirst({
        where: {
            waitlist: { groupId },
            userId: user.id
        }
    });

    if (existingEntry) {
        // If status is anything other than EXPIRED or DECLINED, can't join again
        if (![WaitlistStatus.EXPIRED, WaitlistStatus.DECLINED].includes(existingEntry.status)) {
            throw new Error('You are already on the waitlist for this group');
        }

        // Update existing entry
        return prisma.waitlistEntry.update({
            where: { id: existingEntry.id },
            data: {
                status: WaitlistStatus.WAITING,
                joinedAt: new Date()
            }
        });
    }

    // Get or create waitlist
    const waitlist = await prisma.waitlist.upsert({
        where: { groupId },
        update: {}, // No update needed
        create: { groupId }
    });

    // Get current highest position
    const highestPosition = await prisma.waitlistEntry.findFirst({
        where: { waitlistId: waitlist.id },
        orderBy: { position: 'desc' },
        select: { position: true }
    });

    const nextPosition = (highestPosition?.position || 0) + 1;

    // Add user to waitlist
    return prisma.waitlistEntry.create({
        data: {
            waitlistId: waitlist.id,
            userId: user.id,
            position: nextPosition,
            status: WaitlistStatus.WAITING
        }
    });
}

/**
 * Leave a waitlist
 */
export async function leaveWaitlist(waitlistId: string) {
    const user = await getCurrentUser();

    // Find the user's entry
    const entry = await prisma.waitlistEntry.findFirst({
        where: {
            waitlistId,
            userId: user.id
        }
    });

    if (!entry) {
        throw new Error('You are not on this waitlist');
    }

    // If user was invited, mark as declined
    if (entry.status === WaitlistStatus.INVITED) {
        return prisma.waitlistEntry.update({
            where: { id: entry.id },
            data: { status: WaitlistStatus.DECLINED }
        });
    }

    // Otherwise, delete the entry
    return prisma.waitlistEntry.delete({
        where: { id: entry.id }
    });
}

/**
 * Accept an invitation from the waitlist
 */
export async function acceptWaitlistInvitation(waitlistId: string) {
    const user = await getCurrentUser();

    // Find the user's entry
    const entry = await prisma.waitlistEntry.findFirst({
        where: {
            waitlistId,
            userId: user.id,
            status: WaitlistStatus.INVITED
        },
        include: {
            waitlist: {
                select: { groupId: true }
            }
        }
    });

    if (!entry) {
        throw new Error('You do not have a pending invitation for this waitlist');
    }

    // Create membership and remove from waitlist in a transaction
    return prisma.$transaction(async (tx) => {
        // Create group membership
        await tx.membership.create({
            data: {
                userId: user.id,
                groupId: entry.waitlist.groupId,
                status: MembershipStatus.ACCEPTED,
                role: RoleType.MEMBER
            }
        });

        // Remove from waitlist
        return tx.waitlistEntry.delete({
            where: { id: entry.id }
        });
    });
}

/**
 * Decline an invitation from the waitlist
 */
export async function declineWaitlistInvitation(waitlistId: string) {
    const user = await getCurrentUser();

    // Find the user's entry
    const entry = await prisma.waitlistEntry.findFirst({
        where: {
            waitlistId,
            userId: user.id,
            status: WaitlistStatus.INVITED
        }
    });

    if (!entry) {
        throw new Error('You do not have a pending invitation for this waitlist');
    }

    // Update status to declined
    return prisma.waitlistEntry.update({
        where: { id: entry.id },
        data: { status: WaitlistStatus.DECLINED }
    });
}

/**
 * Get waitlist for a group (admin function)
 */
export async function getGroupWaitlist(groupId: string) {
    const user = await getCurrentUser();

    // Check if user is group admin
    const membership = await prisma.membership.findUnique({
        where: {
            userId_groupId: {
                userId: user.id,
                groupId
            }
        }
    });

    if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
        throw new Error('You do not have permission to view the waitlist');
    }

    // Get the waitlist
    const waitlist = await prisma.waitlist.findUnique({
        where: { groupId },
        include: {
            entries: {
                where: {
                    status: WaitlistStatus.WAITING
                },
                orderBy: { position: 'asc' },
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
                }
            }
        }
    });

    if (!waitlist) {
        return { entries: [] };
    }

    return waitlist;
}

/**
 * Invite user from waitlist to join the group (admin function)
 */
export async function inviteFromWaitlist(entryId: string) {
    const user = await getCurrentUser();

    // Get the waitlist entry
    const entry = await prisma.waitlistEntry.findUnique({
        where: { id: entryId },
        include: {
            waitlist: {
                include: {
                    group: {
                        select: {
                            id: true,
                            name: true,
                            memberships: {
                                where: {
                                    userId: user.id,
                                    role: { in: ['OWNER', 'ADMIN'] }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!entry) {
        throw new Error('Waitlist entry not found');
    }

    // Check if user is group admin
    if (entry.waitlist.group.memberships.length === 0) {
        throw new Error('You do not have permission to invite users');
    }

    // Update entry status to invited
    const updatedEntry = await prisma.waitlistEntry.update({
        where: { id: entryId },
        data: { status: WaitlistStatus.INVITED }
    });

    // Create notification for invited user
    await prisma.notification.create({
        data: {
            userId: entry.userId,
            type: 'GROUP_INVITATION',
            content: `You've been invited to join ${entry.waitlist.group.name}`,
            relatedId: entry.waitlist.groupId
        }
    });

    return updatedEntry;
}

/**
 * Remove user from waitlist (admin function)
 */
export async function removeFromWaitlist(entryId: string) {
    const user = await getCurrentUser();

    // Get the waitlist entry
    const entry = await prisma.waitlistEntry.findUnique({
        where: { id: entryId },
        include: {
            waitlist: {
                include: {
                    group: {
                        select: {
                            memberships: {
                                where: {
                                    userId: user.id,
                                    role: { in: ['OWNER', 'ADMIN'] }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!entry) {
        throw new Error('Waitlist entry not found');
    }

    // Check if user is group admin
    if (entry.waitlist.group.memberships.length === 0) {
        throw new Error('You do not have permission to remove users from the waitlist');
    }

    // Delete the entry
    return prisma.waitlistEntry.delete({
        where: { id: entryId }
    });
}

/**
 * Get user's waitlist entries
 */
export async function getUserWaitlistEntries() {
    const user = await getCurrentUser();

    return prisma.waitlistEntry.findMany({
        where: {
            userId: user.id
        },
        include: {
            waitlist: {
                include: {
                    group: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            place: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            media: {
                                where: { entityType: 'GROUP' },
                                take: 1
                            }
                        }
                    }
                }
            }
        },
        orderBy: { joinedAt: 'desc' }
    });
}
