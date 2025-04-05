"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@store/auth-store";

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuthentication = async () => {
            // Skip auth check for public routes
            if (
                pathname === "/" ||
                pathname === "/login" ||
                pathname === "/signup" ||
                pathname.startsWith("/api/")
            ) {
                return;
            }

            const isAuthed = await checkAuth();

            // For protected routes, redirect to login if not authenticated
            if (!isAuthed && pathname.startsWith("/(private)")) {
                router.push("/login?callbackUrl=" + encodeURIComponent(pathname));
            }

            // For auth routes, redirect to dashboard if already authenticated
            if (isAuthed && (pathname === "/login" || pathname === "/signup")) {
                router.push("/dashboard");
            }
        };

        checkAuthentication();
    }, [pathname, checkAuth, router, isAuthenticated]);

    // Don't render anything while we're checking authentication status
    if (isLoading && pathname !== "/" && !pathname.startsWith("/(public)")) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
