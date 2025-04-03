"use server"

import prisma from "@backend/configs/database"
import { getCurrentUser } from "@backend/utils/auth"
import { Place, PriceRange, Category } from "@prisma/client"

type GetPlacesParams = {
    lat?: number
    lng?: number
    zoom?: number
    query?: string
    categories?: Category[]
    priceRange?: PriceRange
    page?: number
    limit?: number
}

export const getPlaces = async ({
    lat,
    lng,
    zoom = 15,
    query,
    categories,
    priceRange,
    page = 1,
    limit = 20
}: GetPlacesParams = {}) => {
    const user = await getCurrentUser()
    const userLocation = user.address

    // Use user's location if lat/lng not provided
    const searchLat = lat ?? userLocation?.lat
    const searchLng = lng ?? userLocation?.lng

    if (!searchLat || !searchLng) {
        throw new Error('Location data is required')
    }

    // Calculate bounding box
    const latRange = 45 / zoom
    const lngRange = 45 / zoom

    // Build where clause
    const where = {
        AND: [
            {
                address: {
                    lat: {
                        gte: searchLat - latRange,
                        lte: searchLat + latRange
                    },
                    lng: {
                        gte: searchLng - lngRange,
                        lte: searchLng + lngRange
                    }
                }
            },
            // Optional filters
            ...(query ? [{
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            }] : []),
            ...(categories?.length ? [{ categories: { hasSome: categories } }] : []),
            ...(priceRange ? [{ priceRange }] : [])
        ]
    }

    // Get total count for pagination
    const totalCount = await prisma.place.count({ where })

    // Get places with pagination
    const places = await prisma.place.findMany({
        where,
        include: {
            address: true,
            media: {
                where: { entityType: 'PLACE' },
                take: 5
            },
            groups: {
                where: {
                    status: 'ACTIVE',
                    visibility: 'PUBLIC',
                    startTime: { gte: new Date() }
                },
                include: {
                    memberships: {
                        where: { status: 'ACCEPTED' },
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
                    }
                },
                take: 3
            },
            _count: {
                select: {
                    groups: { where: { status: 'ACTIVE' } },
                    reviews: true
                }
            }
        },
        orderBy: [
            { isFeatured: 'desc' },
            { averageRating: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
    })

    return {
        places,
        pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
        }
    }
}

export const getPlaceDetails = async (id: string) => {
    const place = await prisma.place.findUnique({
        where: { id },
        include: {
            address: true,
            media: { where: { entityType: 'PLACE' } },
            operatingHours: true,
            groups: {
                where: { status: 'ACTIVE' },
                include: {
                    memberships: {
                        where: { status: 'ACCEPTED' },
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
                    media: { where: { entityType: 'GROUP' }, take: 1 }
                },
                orderBy: { startTime: 'asc' },
                take: 10
            },
            reviews: {
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
                orderBy: { createdAt: 'desc' },
                take: 5
            }
        }
    })

    if (!place) {
        throw new Error(`Place with ID ${id} not found`)
    }

    return place
}

export const savePlace = async (placeId: string, notes?: string) => {
    const user = await getCurrentUser()

    return prisma.savedPlace.upsert({
        where: {
            userId_placeId: {
                userId: user.id,
                placeId
            }
        },
        update: { notes },
        create: {
            userId: user.id,
            placeId,
            notes
        }
    })
}

export const unsavePlace = async (placeId: string) => {
    const user = await getCurrentUser()

    return prisma.savedPlace.delete({
        where: {
            userId_placeId: {
                userId: user.id,
                placeId
            }
        }
    })
}

export const getSavedPlaces = async () => {
    const user = await getCurrentUser()

    return prisma.savedPlace.findMany({
        where: { userId: user.id },
        include: {
            place: {
                include: {
                    address: true,
                    media: {
                        where: { entityType: 'PLACE' },
                        take: 1
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
}

