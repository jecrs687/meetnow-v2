"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";

type SearchResult = {
    places: any[];
    groups: any[];
    events: any[];
    users: any[];
};

/**
 * Global search across multiple entities
 */
export async function globalSearch(
    query: string,
    includeUsers: boolean = false
): Promise<SearchResult> {
    if (!query || query.length < 2) {
        return {
            places: [],
            groups: [],
            events: [],
            users: []
        };
    }

    const user = await getCurrentUser();

    // Run searches in parallel
    const [places, groups, events, users] = await Promise.all([
        // Search places
        prisma.place.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query } }
                ]
            },
            include: {
                address: true,
                media: {
                    where: { entityType: 'PLACE' },
                    take: 1
                }
            },
            take: 5
        }),

        // Search groups
        prisma.group.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query } }
                ],
                visibility: 'PUBLIC', // Only include public groups
                status: 'ACTIVE'
            },
            include: {
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
            },
            take: 5
        }),

        // Search events
        prisma.event.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ],
                visibility: 'PUBLIC', // Only include public events
                status: { in: ['SCHEDULED', 'ACTIVE'] }
            },
            include: {
                location: true,
                media: {
                    where: { entityType: 'EVENT' },
                    take: 1
                }
            },
            take: 5
        }),

        // Search users (if enabled)
        includeUsers ? prisma.user.findMany({
            where: {
                name: { contains: query, mode: 'insensitive' },
                status: 'ACTIVE',
                // Only include users who allow being discovered
                privacySettings: {
                    allowMatching: true
                }
            },
            select: {
                id: true,
                name: true,
                bio: true,
                media: {
                    where: { entityType: 'USER' },
                    take: 1
                }
            },
            take: 5
        }) : []
    ]);

    return {
        places,
        groups,
        events,
        users
    };
}

/**
 * Search places with more options
 */
export async function searchPlaces({
    query,
    categories,
    priceRange,
    lat,
    lng,
    radius = 10, // km
    page = 1,
    limit = 20
}: {
    query?: string;
    categories?: string[];
    priceRange?: string[];
    lat?: number;
    lng?: number;
    radius?: number;
    page?: number;
    limit?: number;
}) {
    const user = await getCurrentUser();

    // Build where conditions
    const where: any = {};

    // Text search
    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } }
        ];
    }

    // Category filter
    if (categories?.length) {
        where.categories = { hasSome: categories };
    }

    // Price range filter
    if (priceRange?.length) {
        where.priceRange = { in: priceRange };
    }

    // Location filter (if coordinates provided)
    if (lat && lng) {
        // Convert radius from km to degrees (approximate)
        const latDegrees = radius / 111; // 1 degree ~ 111km
        const lngDegrees = radius / (111 * Math.cos(lat * Math.PI / 180));

        where.address = {
            lat: { gte: lat - latDegrees, lte: lat + latDegrees },
            lng: { gte: lng - lngDegrees, lte: lng + lngDegrees }
        };
    }

    // Get total count
    const totalCount = await prisma.place.count({ where });

    // Get places
    const places = await prisma.place.findMany({
        where,
        include: {
            address: true,
            media: {
                where: { entityType: 'PLACE' },
                take: 3
            },
            _count: {
                select: {
                    reviews: true,
                    groups: { where: { status: 'ACTIVE' } }
                }
            }
        },
        orderBy: [
            { averageRating: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
    });

    return {
        places,
        pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
        }
    };
}

/**
 * Search groups with more options
 */
export async function searchGroups({
    query,
    placeCategories,
    status = ['ACTIVE'],
    startAfter,
    page = 1,
    limit = 20
}: {
    query?: string;
    placeCategories?: string[];
    status?: string[];
    startAfter?: Date;
    page?: number;
    limit?: number;
}) {
    const user = await getCurrentUser();

    // Build where conditions
    const where: any = {
        visibility: 'PUBLIC',
        status: { in: status }
    };

    // Text search
    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } }
        ];
    }

    // Place category filter
    if (placeCategories?.length) {
        where.place = {
            categories: { hasSome: placeCategories }
        };
    }

    // Start time filter
    if (startAfter) {
        where.startTime = { gte: startAfter };
    }

    // Get total count
    const totalCount = await prisma.group.count({ where });

    // Get groups
    const groups = await prisma.group.findMany({
        where,
        include: {
            place: {
                select: {
                    id: true,
                    name: true,
                    address: true
                }
            },
            media: {
                where: { entityType: 'GROUP' },
                take: 3
            },
            _count: {
                select: {
                    memberships: { where: { status: 'ACCEPTED' } }
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

    return {
        groups,
        pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
        }
    };
}

/**
 * Search events with more options
 */
export async function searchEvents({
    query,
    categories,
    status = ['SCHEDULED', 'ACTIVE'],
    startAfter,
    page = 1,
    limit = 20
}: {
    query?: string;
    categories?: string[];
    status?: string[];
    startAfter?: Date;
    page?: number;
    limit?: number;
}) {
    const user = await getCurrentUser();

    // Build where conditions
    const where: any = {
        visibility: 'PUBLIC',
        status: { in: status }
    };

    // Text search
    if (query) {
        where.OR = [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
        ];
    }

    // Category filter
    if (categories?.length) {
        where.categories = { hasSome: categories };
    }

    // Start date filter
    if (startAfter) {
        where.startDate = { gte: startAfter };
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
                    memberships: { where: { status: 'ACCEPTED' } }
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
 * Autocomplete search for a specific entity type
 */
export async function autocomplete(
    query: string,
    type: 'places' | 'groups' | 'events' | 'interests',
    limit: number = 5
) {
    if (!query || query.length < 2) {
        return [];
    }

    switch (type) {
        case 'places':
            return prisma.place.findMany({
                where: {
                    name: { contains: query, mode: 'insensitive' }
                },
                select: {
                    id: true,
                    name: true
                },
                take: limit
            });

        case 'groups':
            return prisma.group.findMany({
                where: {
                    name: { contains: query, mode: 'insensitive' },
                    visibility: 'PUBLIC'
                },
                select: {
                    id: true,
                    name: true
                },
                take: limit
            });

        case 'events':
            return prisma.event.findMany({
                where: {
                    title: { contains: query, mode: 'insensitive' },
                    visibility: 'PUBLIC'
                },
                select: {
                    id: true,
                    title: true
                },
                take: limit
            });

        case 'interests':
            return prisma.interest.findMany({
                where: {
                    name: { contains: query, mode: 'insensitive' }
                },
                select: {
                    id: true,
                    name: true,
                    category: true
                },
                take: limit
            });

        default:
            return [];
    }
}
