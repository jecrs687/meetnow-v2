"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";
import { EntityType, MediaType } from "@prisma/client";

/**
 * Create a media entry in the database
 * Note: This doesn't handle the actual file upload - that's handled separately
 * This function is called after the file is uploaded and we have a URL
 */
export async function createMedia({
    url,
    type,
    entityType,
    description,
    fileSize
}: {
    url: string;
    type: MediaType;
    entityType: EntityType;
    description?: string;
    fileSize?: number;
}) {
    const user = await getCurrentUser();

    // Create media record linked to the user
    const media = await prisma.media.create({
        data: {
            url,
            type,
            entityType,
            description,
            fileSize,
            userId: user.id // Always assign to current user initially
        }
    });

    return media;
}

/**
 * Delete media by ID
 */
export async function deleteMedia(mediaId: string) {
    const user = await getCurrentUser();

    // Check if user has permission
    const media = await prisma.media.findUnique({
        where: { id: mediaId },
        include: {
            user: true, // User who uploaded it
            group: {
                select: {
                    memberships: {
                        where: {
                            userId: user.id,
                            role: { in: ['OWNER', 'ADMIN'] }
                        }
                    }
                }
            },
            event: {
                select: {
                    memberships: {
                        where: {
                            userId: user.id,
                            role: { in: ['ORGANIZER', 'ADMIN'] }
                        }
                    }
                }
            }
        }
    });

    if (!media) {
        throw new Error('Media not found');
    }

    // Check permissions based on entity type
    const hasPermission =
        // User's own media
        media.userId === user.id ||
        // Group media where user is admin
        (media.entityType === 'GROUP' && media.group?.memberships.length > 0) ||
        // Event media where user is organizer
        (media.entityType === 'EVENT' && media.event?.memberships.length > 0);

    if (!hasPermission) {
        throw new Error('You do not have permission to delete this media');
    }

    // Delete the media
    await prisma.media.delete({
        where: { id: mediaId }
    });

    // Note: This doesn't delete the actual file - 
    // You would need to implement separate logic for cleaning up the storage

    return { success: true };
}

/**
 * Update media metadata
 */
export async function updateMedia(
    mediaId: string,
    data: {
        description?: string;
        entityType?: EntityType;
    }
) {
    const user = await getCurrentUser();

    // Check if user has permission
    const media = await prisma.media.findUnique({
        where: { id: mediaId }
    });

    if (!media || media.userId !== user.id) {
        throw new Error('You do not have permission to update this media');
    }

    // Update the media
    return prisma.media.update({
        where: { id: mediaId },
        data
    });
}

/**
 * Get user's media with pagination
 */
export async function getUserMedia({
    page = 1,
    limit = 20,
    type
}: {
    page?: number;
    limit?: number;
    type?: MediaType;
} = {}) {
    const user = await getCurrentUser();

    const where = {
        userId: user.id,
        ...(type ? { type } : {})
    };

    const totalCount = await prisma.media.count({ where });

    const media = await prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
    });

    return {
        media,
        pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
        }
    };
}

/**
 * Create or update a gallery
 */
export async function createGallery({
    title,
    description,
    groupId,
    eventId
}: {
    title?: string;
    description?: string;
    groupId?: string;
    eventId?: string;
}) {
    const user = await getCurrentUser();

    if (!groupId && !eventId) {
        throw new Error('Either groupId or eventId is required');
    }

    // Check permissions
    if (groupId) {
        const membership = await prisma.membership.findUnique({
            where: {
                userId_groupId: {
                    userId: user.id,
                    groupId
                }
            }
        });

        if (!membership || !['OWNER', 'ADMIN'].includes(membership.role)) {
            throw new Error('You do not have permission to create galleries for this group');
        }
    }

    if (eventId) {
        const membership = await prisma.membership.findUnique({
            where: {
                userId_eventId: {
                    userId: user.id,
                    eventId
                }
            }
        });

        if (!membership || !['ORGANIZER', 'ADMIN'].includes(membership.role)) {
            throw new Error('You do not have permission to create galleries for this event');
        }
    }

    // Check if gallery already exists
    const existingGallery = await prisma.gallery.findFirst({
        where: {
            ...(groupId ? { groupId } : { eventId })
        }
    });

    if (existingGallery) {
        // Update existing gallery
        return prisma.gallery.update({
            where: { id: existingGallery.id },
            data: {
                title,
                description
            }
        });
    }

    // Create new gallery
    return prisma.gallery.create({
        data: {
            title,
            description,
            ...(groupId ? { groupId } : { eventId })
        }
    });
}

/**
 * Add media to a gallery
 */
export async function addMediaToGallery({
    galleryId,
    mediaIds
}: {
    galleryId: string;
    mediaIds: string[];
}) {
    const user = await getCurrentUser();

    // Get the gallery to check permissions
    const gallery = await prisma.gallery.findUnique({
        where: { id: galleryId },
        include: {
            group: {
                select: {
                    memberships: {
                        where: {
                            userId: user.id
                        }
                    }
                }
            },
            event: {
                select: {
                    memberships: {
                        where: {
                            userId: user.id
                        }
                    }
                }
            }
        }
    });

    if (!gallery) {
        throw new Error('Gallery not found');
    }

    // Check if user is a member of the group/event
    const isGroupMember = gallery.group?.memberships.length > 0;
    const isEventMember = gallery.event?.memberships.length > 0;

    if (!isGroupMember && !isEventMember) {
        throw new Error('You do not have access to this gallery');
    }

    // Update the media records
    await prisma.media.updateMany({
        where: {
            id: { in: mediaIds },
            // Ensure media belongs to the current user
            userId: user.id
        },
        data: {
            galleryId,
            entityType: 'GALLERY'
        }
    });

    return { success: true, count: mediaIds.length };
}

/**
 * Remove media from a gallery
 */
export async function removeMediaFromGallery({
    galleryId,
    mediaId
}: {
    galleryId: string;
    mediaId: string;
}) {
    const user = await getCurrentUser();

    // Get the gallery and media to check permissions
    const [gallery, media] = await Promise.all([
        prisma.gallery.findUnique({
            where: { id: galleryId },
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
                },
                event: {
                    select: {
                        memberships: {
                            where: {
                                userId: user.id,
                                role: { in: ['ORGANIZER', 'ADMIN'] }
                            }
                        }
                    }
                }
            }
        }),
        prisma.media.findUnique({
            where: { id: mediaId }
        })
    ]);

    if (!gallery || !media) {
        throw new Error('Gallery or media not found');
    }

    // Check if user is admin of the group/event or the media owner
    const isGroupAdmin = gallery.group?.memberships.length > 0;
    const isEventAdmin = gallery.event?.memberships.length > 0;
    const isMediaOwner = media.userId === user.id;

    if (!isGroupAdmin && !isEventAdmin && !isMediaOwner) {
        throw new Error('You do not have permission to remove media from this gallery');
    }

    // Remove the media from the gallery
    await prisma.media.update({
        where: { id: mediaId },
        data: {
            galleryId: null,
            // Reset entity type if it was a gallery media
            ...(media.entityType === 'GALLERY' ? { entityType: 'USER' } : {})
        }
    });

    return { success: true };
}
