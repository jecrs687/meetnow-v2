import Link from "next/link";
import Image from "next/image";
import { Button } from "@core/button";
import {
    CalendarCheck,
    MessageSquare,
    MapPin,
    Heart,
    Shield,
    Users
} from "lucide-react";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
                    <Image
                        src="/images/hero-pattern.svg"
                        alt="Background pattern"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="container-content relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold tracking-tight md:text-6xl mb-6 animate-fade-in">
                            Meet People. Create Memories.
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 animate-fade-in animation-delay-200">
                            MeetNow connects like-minded individuals for memorable dining and social experiences. Find your tribe, discover new places, and make lasting connections.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-300">
                            <Link href="/signup">
                                <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
                            </Link>
                            <Link href="/about">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">Learn More</Button>
                            </Link>
                        </div>

                        <div className="mt-16">
                            <Image
                                src="/images/app-preview.png"
                                alt="MeetNow App Preview"
                                width={800}
                                height={450}
                                className="rounded-xl shadow-xl animate-fade-in animation-delay-400"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-card">
                <div className="container-content">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
                            Everything You Need to Connect
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            MeetNow brings together all the tools you need to discover events, connect with people, and create memorable experiences.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
                            <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                <CalendarCheck className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Event Discovery</h3>
                            <p className="text-muted-foreground">
                                Find events that match your interests and schedule, from casual coffee meetups to fine dining experiences.
                            </p>
                        </div>

                        <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
                            <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                <Users className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Group Coordination</h3>
                            <p className="text-muted-foreground">
                                Create and join groups based on shared interests, making it easy to organize recurring meetups.
                            </p>
                        </div>

                        <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
                            <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Place Discovery</h3>
                            <p className="text-muted-foreground">
                                Find the perfect venues for your gatherings with curated recommendations and user reviews.
                            </p>
                        </div>

                        <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
                            <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-cyan-400/10 text-cyan-500">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Direct Messaging</h3>
                            <p className="text-muted-foreground">
                                Connect one-on-one with people who share your interests and build meaningful relationships.
                            </p>
                        </div>

                        <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
                            <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                                <Heart className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
                            <p className="text-muted-foreground">
                                Our algorithm connects you with like-minded individuals based on shared interests and preferences.
                            </p>
                        </div>

                        <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
                            <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-amber-400/10 text-amber-500">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Safety First</h3>
                            <p className="text-muted-foreground">
                                Verified profiles, privacy controls, and built-in safety features to give you peace of mind.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="container-content">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
                            Ready to Start Meeting New People?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-10">
                            Join thousands of people who are already connecting, discovering events, and creating memories together.
                        </p>
                        <Link href="/signup">
                            <Button size="lg">Create Your Account</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
