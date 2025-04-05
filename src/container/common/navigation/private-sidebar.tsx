"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Calendar,
    Coffee,
    Compass,
    Heart,
    Home,
    Map,
    MessageSquare,
    Settings,
    Users
} from "lucide-react";
import { cn } from "@utils/cn";
import { ScrollArea } from "@core/scroll-area";

const sidebarItems = [
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: Home
    },
    {
        href: "/events",
        label: "Events",
        icon: Calendar
    },
    {
        href: "/groups",
        label: "Groups",
        icon: Users
    },
    {
        href: "/places",
        label: "Places",
        icon: Coffee
    },
    {
        href: "/explore",
        label: "Explore",
        icon: Compass
    },
    {
        href: "/map",
        label: "Map",
        icon: Map
    },
    {
        href: "/matches",
        label: "Matches",
        icon: Heart
    },
    {
        href: "/messages",
        label: "Messages",
        icon: MessageSquare
    },
    {
        href: "/settings",
        label: "Settings",
        icon: Settings
    },
];

export function PrivateSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:block w-64 border-r border-border">
            <ScrollArea className="h-[calc(100vh-4rem)]">
                <div className="py-6 px-3">
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    pathname === item.href
                                        ? "bg-primary text-primary-foreground"
                                        : "text-foreground/70 hover:text-foreground hover:bg-muted"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10">
                        <h3 className="px-3 text-sm font-medium text-muted-foreground mb-2">
                            My Groups
                        </h3>
                        <div className="space-y-1">
                            <Link
                                href="/groups/coffee-enthusiasts"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                            >
                                Coffee Enthusiasts
                            </Link>
                            <Link
                                href="/groups/downtown-foodies"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                            >
                                Downtown Foodies
                            </Link>
                            <Link
                                href="/groups/tech-meetup"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                            >
                                Tech Meetup
                            </Link>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h3 className="px-3 text-sm font-medium text-muted-foreground mb-2">
                            Upcoming Events
                        </h3>
                        <div className="space-y-1">
                            <Link
                                href="/events/coffee-tasting"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                            >
                                Coffee Tasting
                            </Link>
                            <Link
                                href="/events/dinner-downtown"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                            >
                                Dinner Downtown
                            </Link>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
