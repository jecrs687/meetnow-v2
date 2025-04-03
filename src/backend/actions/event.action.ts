"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";
import {
    EventCategory,
    EventStatus,
    MembershipStatus,
    RoleType,
    Visibility
} from "@prisma/client";

/**
 * Get all events with pagination and filtering
 */
export async function getEvents({
    page = 1,
    limit = 20,
    status = [EventStatus.SCHEDULED, EventStatus.ACTIVE],
    categories,
    startAfter = new Date(),
    query,
    groupId
}: {
    page?: number;
    limit?: number;
    status?: EventStatus[];
    categories?: EventCategory[];
    startAfter?: Date;
    query?: string;
    groupId?: string;
} = {}) {
    // Build where conditions
    const where: any = {
        status: { in: status },
        startDate: { gte: startAfter },
        ...(groupId ? { groupId } : {}),
    };

    // Add category filter
    if (categories?.length) {
        where.categories = { hasSome: categories };
    }

    // Add search query
    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
        ];
    }

    // Get total count
    const totalCount = await prisma.event.count({ where });

    // Get events
    const events = await prisma.event.findMany({
        where,
        include: {
            location: true,
            group: {
                select: {
                    id: true,
                    name: true
                }
            },
            media: {
                where: { entityType: 'EVENT' },
                take: 3
            },
            _count: {
                select: {
                    memberships: {
                        where: { status: MembershipStatus.ACCEPTED }
                    }
                }
            }
        },
        orderBy: [
            { startDate: 'asc' }
        ],
        skip: (page - 1) * limit,
        take: limit
    });

    return {
        events,
        pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
        }
    };
}

/**
 * Get a single event by ID with all details
 */
export async function getEventDetails(eventId: string) {
    const user = await getCurrentUser();

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: {
            location: true,
            group: {
                select: {
                    id: true,
                    name: true,
                    place: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            memberships: {
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
            },
            media: {
                where: { entityType: 'EVENT' }
            },
            galleries: {
                include: {
                    media: { take: 5 }
                },
                take: 1
            },
            chat: true
        }
    });

    if (!event) {
        throw new Error(`Event with ID ${eventId} not found`);
    }

    // Check if event is visible to user
    const userMembership = event.memberships.find(m => m.userId === user.id);
    const isPublic = event.visibility === Visibility.PUBLIC;

    if (!isPublic && !userMembership) {
        throw new Error('You do not have permission to view this event');
    }

    // Add user's membership status
    return {
        ...event,
        userMembership
    };
}

/**
 * Create a new event
 */
export type CreateEventInput = {
    title: string;
    description: string;
    groupId?: string;
    locationId: string;
    startDate: Date;
    endDate: Date;
    maxAttendees?: number;
    visibility: Visibility;
    isRecurring?: boolean;
    recurrencePattern?: string;
    ticketRequired?: boolean;
    ticketPrice?: number;
    ticketCurrency?: string;
    categories: EventCategory[];
    mediaIds?: string[];
};

export async function createEvent(input: CreateEventInput) {
    const user = await getCurrentUser();

    // If event is for a group, check if user has permission
    if (input.groupId) {
        const membership = await prisma.membership.findUnique({
            where: {
                userId_groupId: {
                    userId: user.id,
                    groupId: input.groupId
                }
            }
        });

        // Only group members with appropriate roles can create events
        if (
            !membership ||
            membership.status !== MembershipStatus.ACCEPTED ||
            !['OWNER', 'ADMIN', 'ORGANIZER'].includes(membership.role)
        ) {
            throw new Error('You do not have permission to create events for this group');
        }
    }

    // Create the event in a transaction
    return prisma.$transaction(async (tx) => {
        // Create the event
        const event = await tx.event.create({
            data: {
                title: input.title,
                description: input.description,
                groupId: input.groupId,
                locationId: input.locationId,
                startDate: input.startDate,
                endDate: input.endDate,
                maxAttendees: input.maxAttendees,
                visibility: input.visibility,
                isRecurring: input.isRecurring || false,
                recurrencePattern: input.recurrencePattern,
                ticketRequired: input.ticketRequired || false,
                ticketPrice: input.ticketPrice ? parseFloat(input.ticketPrice.toString()) : null,
                ticketCurrency: input.ticketCurrency || 'USD',
                categories: input.categories,
                organizerId: user.id
            }
        });

        // Link any provided media
        if (input.mediaIds?.length) {
            await tx.media.updateMany({
                where: { id: { in: input.mediaIds } },
                data: {
                    eventId: event.id,
                    entityType: 'EVENT'
                }
            });
        }

        // Create creator's membership
        await tx.membership.create({
            data: {
                userId: user.id,
                eventId: event.id,
                status: MembershipStatus.ACCEPTED,
                role: RoleType.ORGANIZER
            }
        });

        // Create chat for the event
        await tx.chat.create({
            data: {
                eventId: event.id,
                type: 'EVENT',
                participants: {
                    create: {
                        userId: user.id,
                        role: RoleType.ORGANIZER
                    }
                }
            }
        });

        return event;
    });
}

/**
 * Update an event
 */
export async function updateEvent(
    eventId: string,
    data: Partial<CreateEventInput>
) {
    const user = await getCurrentUser();

    // Check if user has permission to update
    const membership = await prisma.membership.findUnique({
        where: {
            userId_eventId: {
                userId: user.id,
                eventId
            }
        }
    });

    if (!membership || !['ORGANIZER', 'ADMIN'].includes(membership.role)) {
        throw new Error('You do not have permission to update this event');
    }

    // Update the event
    return prisma.$transaction(async (tx) => {
        // Update event properties
        const event = await tx.event.update({
            where: { id: eventId },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.description && { description: data.description }),
                ...(data.locationId && { locationId: data.locationId }),
                ...(data.startDate && { startDate: data.startDate }),
                ...(data.endDate && { endDate: data.endDate }),
                ...(data.maxAttendees !== undefined && { maxAttendees: data.maxAttendees }),
                ...(data.visibility && { visibility: data.visibility }),
                ...(data.isRecurring !== undefined && { isRecurring: data.isRecurring }),
                ...(data.recurrencePattern && { recurrencePattern: data.recurrencePattern }),
                ...(data.ticketRequired !== undefined && { ticketRequired: data.ticketRequired }),
                ...(data.ticketPrice !== undefined && {
                    ticketPrice: data.ticketPrice ? parseFloat(data.ticketPrice.toString()) : null
                }),
                ...(data.ticketCurrency && { ticketCurrency: data.ticketCurrency }),
                ...(data.categories && { categories: data.categories })
            }
        });

        // Add new media if provided
        if (data.mediaIds?.length) {
            await tx.media.updateMany({
                where: { id: { in: data.mediaIds } },
                data: {
                    eventId: event.id,
                    entityType: 'EVENT'
                }
            });
        }

        return event;
    });
}

/**
 * Join an event
 */
export async function joinEvent(eventId: string) {
    const user = await getCurrentUser();

    // Check if user already has a membership
    const existingMembership = await prisma.membership.findUnique({
        where: {
            userId_eventId: {
                userId: user.id,
                eventId
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

        throw new Error('You already have a membership for this event');
    }

    // Get event to check status and visibility
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
            visibility: true,
            status: true,
            maxAttendees: true,
            _count: {
                select: {
                    memberships: {
                        where: { status: MembershipStatus.ACCEPTED }
                    }
                }
            }
        }
    });

    if (!event) {
        throw new Error('Event not found');
    }

    if (event.status !== EventStatus.SCHEDULED && event.status !== EventStatus.ACTIVE) {
        throw new Error('This event is not open for registration');
    }

    // Check if event is at capacity
    if (
        event.maxAttendees &&
        event._count.memberships >= event.maxAttendees
    ) {
        throw new Error('This event has reached maximum capacity');
    }

    // For public events, auto-accept if public
    const initialStatus = event.visibility === Visibility.PUBLIC
        ? MembershipStatus.ACCEPTED
        : MembershipStatus.PENDING;

    // Create membership
    return prisma.membership.create({
        data: {
            userId: user.id,
            eventId,
            status: initialStatus,
            role: RoleType.ATTENDEE
        }
    });
}

/**
 * Leave an event
 */
export async function leaveEvent(eventId: string) {
    const user = await getCurrentUser();

    const membership = await prisma.membership.findUnique({
        where: {
            userId_eventId: {
                userId: user.id,
                eventId
            }
        },
        include: {
            event: {
                select: {
                    organizerId: true
                }
            }
        }
    });

    if (!membership) {
        throw new Error('You are not a member of this event');
    }

    // If user is the organizer, they can't leave
    if (membership.event.organizerId === user.id) {
        throw new Error('As the organizer, you cannot leave the event. Transfer ownership first or delete the event.');
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

/**
 * Cancel an event (for organizers only)
 */
export async function cancelEvent(eventId: string, reason?: string) {
    const user = await getCurrentUser();

    // Check if user is the organizer
    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: {
            organizerId: true,
            memberships: {
                where: {
                    userId: user.id,
                    role: { in: [RoleType.ORGANIZER, RoleType.ADMIN] }
                }
            }
        }
    });

    if (!event || (event.organizerId !== user.id && event.memberships.length === 0)) {
        throw new Error('You do not have permission to cancel this event');
    }

    // Update event status to CANCELED
    return prisma.event.update({
        where: { id: eventId },
        data: {
            status: EventStatus.CANCELED,
            // Optionally store cancellation reason
            customFields: { cancellationReason: reason }
        }
    });
}

/**
 * Update member status for an event
 */
export async function updateEventMemberStatus(
    membershipId: string,
    status: MembershipStatus
) {
    const user = await getCurrentUser();

    // Get the membership
    const membership = await prisma.membership.findUnique({
        where: { id: membershipId },
        include: {
            event: {
                select: {
                    memberships: {
                        where: {
                            userId: user.id,
                            role: { in: [RoleType.ORGANIZER, RoleType.ADMIN] }
                        }
                    }
                }
            }
        }
    });

    if (!membership) {
        throw new Error('Membership not found');
    }

    // Check if user has permission
    if (membership.event.memberships.length === 0) {
        throw new Error('You do not have permission to update this membership');
    }

    // Update membership status
    return prisma.membership.update({
        where: { id: membershipId },
        data: { status }
    });
}

/**
 * Check in a participant at an event
 */
export async function checkInParticipant(membershipId: string) {
    const user = await getCurrentUser();

    // Get the membership
    const membership = await prisma.membership.findUnique({
        where: { id: membershipId },
        include: {
            event: {
                select: {
                    memberships: {
                        where: {
                            userId: user.id,
                            role: { in: [RoleType.ORGANIZER, RoleType.ADMIN, RoleType.HOST] }
                        }
                    }
                }
            }
        }
    });

    if (!membership) {
        throw new Error('Membership not found');
    }

    // Check if user has permission
    if (membership.event.memberships.length === 0) {
        throw new Error('You do not have permission to check in participants');
    }

    // Update check-in status
    return prisma.membership.update({
        where: { id: membershipId },
        data: {
            checkInTime: new Date(),
            status: MembershipStatus.ACCEPTED // Ensure status is ACCEPTED
        }
    });
}

/**
 * Get events for user (both attending and organizing)
 */
export async function getUserEvents(
    status: MembershipStatus[] = ['ACCEPTED', 'PENDING']
) {
    const user = await getCurrentUser();

    return prisma.event.findMany({
        where: {
            memberships: {
                some: {
                    userId: user.id,
                    status: { in: status }
                }
            }
        },
        include: {
            location: true,
            group: {
                select: {
                    id: true,
                    name: true
                }
            },
            media: {
                where: { entityType: 'EVENT' },
                take: 1
            },
            _count: {
                select: {
                    memberships: {
                        where: { status: MembershipStatus.ACCEPTED }
                    }
                }
            }
        },
        orderBy: [
            { startDate: 'asc' }
        ]
    });
}
