/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@core/button";
import { Input } from "@core/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@core/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@core/tabs";
import {
    Calendar,
    Filter,
    Heart,
    MapPin,
    Plus,
    Search,
    SlidersHorizontal,
    Users
} from "lucide-react";
import { Badge } from "@core/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@core/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@core/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@core/sheet";

export default function GroupsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data for groups
    const allGroups = [
        {
            id: "coffee-enthusiasts",
            name: "Coffee Enthusiasts",
            description: "For people who love discovering new coffee shops and brewing methods.",
            members: 56,
            events: 12,
            category: "Food & Drink",
            location: "San Francisco, CA",
            image: "/images/group-coffee.jpg",
            isMember: true,
            isAdmin: false
        },
        {
            id: "downtown-foodies",
            name: "Downtown Foodies",
            description: "Exploring urban restaurants and food experiences together.",
            members: 128,
            events: 8,
            category: "Food & Drink",
            location: "San Francisco, CA",
            image: "/images/group-food.jpg",
            isMember: true,
            isAdmin: true
        },
        {
            id: "tech-meetup",
            name: "Tech Meetup",
            description: "Networking and discussions for technology professionals.",
            members: 212,
            events: 15,
            category: "Technology",
            location: "San Francisco, CA",
            image: "/images/group-tech.jpg",
            isMember: true,
            isAdmin: false
        },
        {
            id: "photo-walkers",
            name: "Photo Walkers",
            description: "Urban photography adventures and skill sharing.",
            members: 45,
            events: 6,
            category: "Arts",
            location: "San Francisco, CA",
            image: "/images/group-photography.jpg",
            isMember: false,
            isAdmin: false
        },
        {
            id: "wine-tasters",
            name: "Wine Tasters",
            description: "Wine tasting events and vineyard tours for enthusiasts.",
            members: 89,
            events: 10,
            category: "Food & Drink",
            location: "Napa Valley, CA",
            image: "/images/group-wine.jpg",
            isMember: false,
            isAdmin: false
        },
        {
            id: "hiking-club",
            name: "Hiking Club",
            description: "Weekend adventures exploring trails and nature.",
            members: 134,
            events: 18,
            category: "Outdoors",
            location: "Bay Area, CA",
            image: "/images/group-hiking.jpg",
            isMember: false,
            isAdmin: false
        }
    ];

    const featuredGroups = allGroups.slice(0, 3);
    const myGroups = allGroups.filter(group => group.isMember);
    const recommended = allGroups.filter(group => !group.isMember).slice(0, 3);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
                    <p className="text-muted-foreground">
                        Join groups based on shared interests and meet like-minded people.
                    </p>
                </div>
                <Link href="/groups/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Group
                    </Button>
                </Link>
            </div>

            {/* Featured Groups Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Featured Groups</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredGroups.map((group) => (
                        <Card key={group.id} className="card-hover overflow-hidden">
                            <div className="relative h-40 w-full">
                                <Image
                                    src={group.image}
                                    alt={group.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/50 backdrop-blur-sm">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                                {group.isMember && (
                                    <div className="absolute top-2 left-2">
                                        <Badge variant="secondary">Member</Badge>
                                    </div>
                                )}
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-lg">{group.name}</CardTitle>
                                <CardDescription>{group.category}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {group.description}
                                </p>
                                <div className="flex justify-between text-sm">
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        <span>{group.members} members</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span>{group.events} events</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-end">
                                <Link href={`/groups/${group.id}`}>
                                    <Button size="sm">
                                        {group.isMember ? "View Group" : "Join Group"}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search groups..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="food">Food & Drink</SelectItem>
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="arts">Arts</SelectItem>
                            <SelectItem value="outdoors">Outdoors</SelectItem>
                        </SelectContent>
                    </Select>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                                <SheetDescription>
                                    Refine your group search results.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="grid gap-6 py-6">
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Location</h3>
                                    <Input placeholder="City, state, or zip code" />
                                    <Select defaultValue="25">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Distance" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">Within 5 miles</SelectItem>
                                            <SelectItem value="10">Within 10 miles</SelectItem>
                                            <SelectItem value="25">Within 25 miles</SelectItem>
                                            <SelectItem value="50">Within 50 miles</SelectItem>
                                            <SelectItem value="100">Within 100 miles</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Group Size</h3>
                                    <Select defaultValue="any">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Group size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">Any size</SelectItem>
                                            <SelectItem value="small">Small (1-50)</SelectItem>
                                            <SelectItem value="medium">Medium (51-200)</SelectItem>
                                            <SelectItem value="large">Large (201+)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Activity Level</h3>
                                    <Select defaultValue="any">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Activity level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">Any activity level</SelectItem>
                                            <SelectItem value="very-active">Very active (weekly events)</SelectItem>
                                            <SelectItem value="active">Active (bi-weekly events)</SelectItem>
                                            <SelectItem value="casual">Casual (monthly events)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline">Reset</Button>
                                <Button>Apply Filters</Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All Groups</TabsTrigger>
                    <TabsTrigger value="my-groups">My Groups</TabsTrigger>
                    <TabsTrigger value="recommended">Recommended</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allGroups.map((group) => (
                            <Card key={group.id} className="card-hover overflow-hidden">
                                <div className="relative h-40 w-full">
                                    <Image
                                        src={group.image}
                                        alt={group.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/50 backdrop-blur-sm">
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {group.isMember && (
                                        <div className="absolute top-2 left-2">
                                            <Badge variant="secondary">
                                                {group.isAdmin ? "Admin" : "Member"}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-lg">{group.name}</CardTitle>
                                    <CardDescription>{group.category}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {group.description}
                                    </p>
                                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>{group.location}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-1" />
                                                <span>{group.members} members</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>{group.events} events</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex justify-end">
                                    <Link href={`/groups/${group.id}`}>
                                        <Button size="sm">
                                            {group.isMember ? "View Group" : "Join Group"}
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Button variant="outline" className="mx-auto">
                            Load More
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="my-groups" className="space-y-6">
                    {myGroups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myGroups.map((group) => (
                                <Card key={group.id} className="card-hover overflow-hidden">
                                    <div className="relative h-40 w-full">
                                        <Image
                                            src={group.image}
                                            alt={group.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/50 backdrop-blur-sm">
                                                <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
                                            </Button>
                                        </div>
                                        <div className="absolute top-2 left-2">
                                            <Badge variant="secondary">
                                                {group.isAdmin ? "Admin" : "Member"}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-lg">{group.name}</CardTitle>
                                        <CardDescription>{group.category}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {group.description}
                                        </p>
                                        <div className="flex justify-between text-sm">
                                            <div className="flex items-center">
                                                <Users className="h-4 w-4 mr-1" />
                                                <span>{group.members} members</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>{group.events} events</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex justify-end">
                                        <Link href={`/groups/${group.id}`}>
                                            <Button size="sm">View Group</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Groups Yet</h3>
                            <p className="text-muted-foreground mb-6">
                                You haven't joined any groups yet. Explore and join groups to connect with people who share your interests.
                            </p>
                            <Button asChild>
                                <Link href="/groups?tab=recommended">
                                    Discover Groups
                                </Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="recommended" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommended.map((group) => (
                            <Card key={group.id} className="card-hover overflow-hidden">
                                <div className="relative h-40 w-full">
                                    <Image
                                        src={group.image}
                                        alt={group.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/50 backdrop-blur-sm">
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-lg">{group.name}</CardTitle>
                                    <CardDescription>{group.category}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {group.description}
                                    </p>
                                    <div className="flex justify-between text-sm">
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-1" />
                                            <span>{group.members} members</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>{group.events} events</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex justify-end">
                                    <Link href={`/groups/${group.id}`}>
                                        <Button size="sm">Join Group</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
