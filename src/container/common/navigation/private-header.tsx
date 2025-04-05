"use client";

import Link from "next/link";
import {
    Bell, Menu, MessageSquare, Search, X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@core/button";
import { ModeToggle } from "@core/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@core/avatar";
import { Input } from "@core/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@core/dropdown-menu";
import { useAuthStore } from "@store/auth-store";
import { Badge } from "@core/badge";

export function PrivateHeader() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    return (
        <header className="border-b border-border backdrop-blur-md bg-background/80 sticky top-0 z-40">
            <div className="container-content">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex lg:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center rounded-md p-2 text-foreground"
                        >
                            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    <div className="flex items-center">
                        <Link href="/dashboard" className="text-2xl font-bold text-primary lg:mr-8">
                            MeetNow
                        </Link>

                        <div className="hidden lg:flex lg:gap-8">
                            <Link
                                href="/dashboard"
                                className="text-foreground/80 hover:text-primary transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/events"
                                className="text-foreground/80 hover:text-primary transition-colors"
                            >
                                Events
                            </Link>
                            <Link
                                href="/groups"
                                className="text-foreground/80 hover:text-primary transition-colors"
                            >
                                Groups
                            </Link>
                            <Link
                                href="/places"
                                className="text-foreground/80 hover:text-primary transition-colors"
                            >
                                Places
                            </Link>
                            <Link
                                href="/matches"
                                className="text-foreground/80 hover:text-primary transition-colors"
                            >
                                Matches
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {showSearch ? (
                            <div className="animate-fade-in flex items-center bg-muted rounded-md overflow-hidden w-full lg:w-64">
                                <Input
                                    placeholder="Search..."
                                    className="border-0 focus-visible:ring-0"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowSearch(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowSearch(true)}
                                className="hidden sm:flex"
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        )}

                        <Link href="/messages">
                            <Button variant="ghost" size="icon" className="relative">
                                <MessageSquare className="h-5 w-5" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                                    3
                                </Badge>
                            </Button>
                        </Link>

                        <Link href="/notifications">
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                                    5
                                </Badge>
                            </Button>
                        </Link>

                        <ModeToggle />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="h-8 w-8 rounded-full overflow-hidden">
                                    <Avatar>
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback>
                                            {user?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {showMobileMenu && (
                <div className="lg:hidden border-t border-border animate-fade-in">
                    <div className="container py-4 space-y-2">
                        <Link
                            href="/dashboard"
                            className="block px-4 py-2 hover:bg-muted rounded-md"
                            onClick={() => setShowMobileMenu(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/events"
                            className="block px-4 py-2 hover:bg-muted rounded-md"
                            onClick={() => setShowMobileMenu(false)}
                        >
                            Events
                        </Link>
                        <Link
                            href="/groups"
                            className="block px-4 py-2 hover:bg-muted rounded-md"
                            onClick={() => setShowMobileMenu(false)}
                        >
                            Groups
                        </Link>
                        <Link
                            href="/places"
                            className="block px-4 py-2 hover:bg-muted rounded-md"
                            onClick={() => setShowMobileMenu(false)}
                        >
                            Places
                        </Link>
                        <Link
                            href="/matches"
                            className="block px-4 py-2 hover:bg-muted rounded-md"
                            onClick={() => setShowMobileMenu(false)}
                        >
                            Matches
                        </Link>
                        <div className="pt-2 px-4">
                            <Input placeholder="Search..." className="w-full" />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
