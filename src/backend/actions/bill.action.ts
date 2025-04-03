"use server";

import prisma from "@backend/configs/database";
import { getCurrentUser } from "@backend/utils/auth";
import { BillStatus, MembershipStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

/**
 * Create a new bill split
 */
export async function createBillSplit({
    groupId,
    totalAmount,
    currency = "USD",
    description,
    items = [],
    shares = []
}: {
    groupId: string;
    totalAmount: number;
    currency?: string;
    description?: string;
    items?: Array<{
        name: string;
        amount: number;
        quantity?: number;
        consumedByUserIds?: string[];
    }>;
    shares?: Array<{
        userId: string;
        amount: number;
    }>;
}) {
    const user = await getCurrentUser();

    // Check if user is in the group
    const membership = await prisma.membership.findUnique({
        where: {
            userId_groupId: {
                userId: user.id,
                groupId
            },
            status: MembershipStatus.ACCEPTED
        }
    });

    if (!membership) {
        throw new Error('You must be a member of the group to create a bill split');
    }

    // Create the bill split in a transaction
    return prisma.$transaction(async (tx) => {
        // Create the bill
        const billSplit = await tx.billSplit.create({
            data: {
                groupId,
                totalAmount: new Decimal(totalAmount),
                currency,
                description,
                createdById: user.id
            }
        });

        // Create items if provided
        if (items.length > 0) {
            for (const item of items) {
                const billItem = await tx.billItem.create({
                    data: {
                        billSplitId: billSplit.id,
                        name: item.name,
                        amount: new Decimal(item.amount),
                        quantity: item.quantity || 1
                    }
                });

                // Add consumers if provided
                if (item.consumedByUserIds?.length) {
                    await Promise.all(
                        item.consumedByUserIds.map(userId =>
                            tx.billItemConsumer.create({
                                data: {
                                    billItemId: billItem.id,
                                    userId
                                }
                            })
                        )
                    );
                }
            }
        }

        // Create shares if provided
        if (shares.length > 0) {
            await Promise.all(
                shares.map(share =>
                    tx.billShare.create({
                        data: {
                            billSplitId: billSplit.id,
                            userId: share.userId,
                            amount: new Decimal(share.amount)
                        }
                    })
                )
            );
        }

        // Return the created bill with all details
        return tx.billSplit.findUnique({
            where: { id: billSplit.id },
            include: {
                items: {
                    include: {
                        consumedBy: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                shares: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    });
}

/**
 * Get bills for a group
 */
export async function getGroupBills(
    groupId: string,
    status?: BillStatus
) {
    const user = await getCurrentUser();

    // Check if user is in the group
    const membership = await prisma.membership.findUnique({
        where: {
            userId_groupId: {
                userId: user.id,
                groupId
            },
            status: MembershipStatus.ACCEPTED
        }
    });

    if (!membership) {
        throw new Error('You must be a member of the group to view bills');
    }

    // Get the bills
    return prisma.billSplit.findMany({
        where: {
            groupId,
            ...(status ? { status } : {})
        },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true
                }
            },
            _count: {
                select: {
                    items: true,
                    shares: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

/**
 * Get a bill's details
 */
export async function getBillDetails(billId: string) {
    const user = await getCurrentUser();

    // Get the bill with details
    const bill = await prisma.billSplit.findUnique({
        where: { id: billId },
        include: {
            group: {
                select: {
                    id: true,
                    name: true,
                    memberships: {
                        where: {
                            userId: user.id,
                            status: MembershipStatus.ACCEPTED
                        }
                    }
                }
            },
            items: {
                include: {
                    consumedBy: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            },
            shares: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            createdBy: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    if (!bill) {
        throw new Error('Bill not found');
    }

    // Check if user has access
    if (bill.group.memberships.length === 0) {
        throw new Error('You do not have access to this bill');
    }

    return bill;
}

/**
 * Mark a share as paid
 */
export async function markShareAsPaid(shareId: string) {
    const user = await getCurrentUser();

    // Get the share
    const share = await prisma.billShare.findUnique({
        where: { id: shareId },
        include: {
            billSplit: {
                select: {
                    createdById: true
                }
            }
        }
    });

    if (!share) {
        throw new Error('Share not found');
    }

    // Check if user is the bill creator (only they can mark as paid)
    if (share.billSplit.createdById !== user.id) {
        throw new Error('Only the bill creator can mark shares as paid');
    }

    // Update the share
    return prisma.billShare.update({
        where: { id: shareId },
        data: {
            isPaid: true,
            paidAt: new Date()
        }
    });
}

/**
 * Update bill status
 */
export async function updateBillStatus(
    billId: string,
    status: BillStatus
) {
    const user = await getCurrentUser();

    // Get the bill
    const bill = await prisma.billSplit.findUnique({
        where: { id: billId }
    });

    if (!bill) {
        throw new Error('Bill not found');
    }

    // Check if user is the bill creator
    if (bill.createdById !== user.id) {
        throw new Error('Only the bill creator can update the status');
    }

    // Update the bill
    return prisma.billSplit.update({
        where: { id: billId },
        data: { status }
    });
}

/**
 * Delete a bill
 */
export async function deleteBill(billId: string) {
    const user = await getCurrentUser();

    // Get the bill
    const bill = await prisma.billSplit.findUnique({
        where: { id: billId }
    });

    if (!bill) {
        throw new Error('Bill not found');
    }

    // Check if user is the bill creator
    if (bill.createdById !== user.id) {
        throw new Error('Only the bill creator can delete the bill');
    }

    // Delete the bill and all related records
    return prisma.billSplit.delete({
        where: { id: billId }
    });
}
