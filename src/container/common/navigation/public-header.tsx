"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@core/button";
import { ModeToggle } from "@core/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@core/sheet";
import { Menu, X } from "lucide-react";

export function PublicHeader() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if the link is the current page
    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold">MeetNow</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 ml-6">
                        <Link
                            href="/"
                            className={`text-sm transition-colors hover:text-foreground/80 ${isActive("/") ? "text-foreground font-medium" : "text-foreground/60"
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            className={`text-sm transition-colors hover:text-foreground/80 ${isActive("/about") ? "text-foreground font-medium" : "text-foreground/60"
                                }`}
                        >
                            About
                        </Link>
                        <Link
                            href="/features"
                            className={`text-sm transition-colors hover:text-foreground/80 ${isActive("/features") ? "text-foreground font-medium" : "text-foreground/60"
                                }`}
                        >
                            Features
                        </Link>
                        <Link
                            href="/pricing"
                            className={`text-sm transition-colors hover:text-foreground/80 ${isActive("/pricing") ? "text-foreground font-medium" : "text-foreground/60"
                                }`}
                        >
                            Pricing
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <ModeToggle />

                    <div className="hidden md:flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost">Log in</Button>
                        </Link>
                        <Link href="/signup">
                            <Button>Sign up</Button>
                        </Link>
                    </div>

                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="flex flex-col">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">Menu</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <nav className="flex flex-col gap-4 mt-8">
                                <Link
                                    href="/"
                                    className={`text-lg ${isActive("/") ? "text-foreground font-medium" : "text-foreground/60"}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/about"
                                    className={`text-lg ${isActive("/about") ? "text-foreground font-medium" : "text-foreground/60"}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    About
                                </Link>
                                <Link
                                    href="/features"
                                    className={`text-lg ${isActive("/features") ? "text-foreground font-medium" : "text-foreground/60"}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Features
                                </Link>
                                <Link
                                    href="/pricing"
                                    className={`text-lg ${isActive("/pricing") ? "text-foreground font-medium" : "text-foreground/60"}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Pricing
                                </Link>
                                <div className="flex flex-col gap-2 mt-4">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="outline" className="w-full">Log in</Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full">Sign up</Button>
                                    </Link>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
