"use server";

import { getServerSession } from "next-auth";
import prisma from "@backend/configs/database";
import { UserStatus } from "@prisma/client";

/**
 * Get the current authenticated user or throw an error if not logged in
 */
export async function getCurrentUser() {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
        throw new Error("Unauthenticated");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            address: true
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.status !== UserStatus.ACTIVE) {
        throw new Error("User account is inactive");
    }

    // Update last active timestamp
    await prisma.user.update({
        where: { id: user.id },
        data: { lastActive: new Date() }
    });

    return user;
}

/**
 * Check if the current user has admin role
 */
export async function isAdmin() {
    const user = await getCurrentUser();
    return user.role === 'ADMIN';
}
