/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@core/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@core/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@core/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@core/avatar";
import { Badge } from "@core/badge";
import { Separator } from "@core/separator";
import {
    ArrowLeft,
    Calendar,
    CalendarPlus,
    Clock,
    Heart,
    Info,
    MapPin,
    MessageCircle,
    Plus,
    Settings,
    Share2,
    User,
    UserPlus,
    Users
} from "lucide-react";
import { Textarea } from "@core/textarea";

export default function GroupDetailPage() {
    const params = useParams();
    const groupId = params.groupId as string;
    const [isMember, setIsMember] = useState(true);

    // This would be replaced with a server action call to get group details
    const groupData = {
        id: groupId,
        name: "Coffee Enthusiasts",
        description: "A group for people who love discovering new coffee shops, brewing methods, and sharing their passion for all things coffee. We meet regularly to explore cafes, learn from baristas, and enjoy conversations over exceptional coffee.\n\nWhether you're a casual coffee drinker or a dedicated aficionado, our group welcomes everyone who appreciates a good cup of coffee. Join us to expand your knowledge and meet others who share your interest!",
        members: 56,
        events: 12,
        upcomingEvents: 3,
        category: "Food & Drink",
        location: "San Francisco, CA",
        foundedDate: "January 2023",
        isPrivate: false,
        isMember: true,
        isAdmin: false,
        coverImage: "/images/group-coffee.jpg",
        organizers: [
            { id: "user1", name: "Alex Smith", avatar: "/images/avatar-1.png", role: "Organizer" },
            { id: "user2", name: "Jamie Davis", avatar: "/images/avatar-2.png", role: "Co-organizer" }
        ],
        recentMembers: [
            { id: "user3", name: "Riley Jordan", avatar: "/images/avatar-3.png" },
            { id: "user4", name: "Taylor Morgan", avatar: "/images/avatar-4.png" },
            { id: "user5", name: "Jordan Casey", avatar: "/images/avatar-5.png" },
            // ... and more
        ],
        photos: [
            "/images/group-coffee-1.jpg",
            "/images/group-coffee-2.jpg",
            "/images/group-coffee-3.jpg",
            "/images/group-coffee-4.jpg"
        ]
    };

    // Mock upcoming events
    const upcomingEvents = [
        {
            id: "event1",
            title: "Coffee Tasting Workshop",
            date: "May 10, 2023",
            time: "6:00 PM",
            location: "Brew Lab Coffee, Downtown",
            attendees: 12,
            image: "/images/event-coffee.jpg"
        },
        {
            id: "event2",
            title: "Latte Art Masterclass",
            date: "May 24, 2023",
            time: "5:30 PM",
            location: "Artisan Coffee Co., Market District",
            attendees: 8,
            image: "/images/event-coffee-2.jpg"
        },
        {
            id: "event3",
            title: "Coffee Origins Discussion",
            date: "June 5, 2023",
            time: "7:00 PM",
            location: "Roasters Guild, North Beach",
            attendees: 15,
            image: "/images/event-coffee-3.jpg"
        }
    ];

    // Mock past events
    const pastEvents = [
        {
            id: "past1",
            title: "Ethiopian Coffee Tasting",
            date: "April 15, 2023",
            location: "Global Bean, Mission District",
            attendees: 18,
            image: "/images/past-event-1.jpg"
        },
        {
            id: "past2",
            title: "Home Brewing Methods",
            date: "March 28, 2023",
            location: "Community Center, Downtown",
            attendees: 22,
            image: "/images/past-event-2.jpg"
        }
    ];

    // Mock discussion posts
    const discussionPosts = [
        {
            id: "post1",
            author: {
                id: "user1",
                name: "Alex Smith",
                avatar: "/images/avatar-1.png"
            },
            content: "Hey everyone! I just discovered this amazing small-batch roaster in the Mission District. Their Ethiopian Yirgacheffe is incredible. Anyone interested in a spontaneous meetup this weekend to check it out?",
            date: "2 days ago",
            likes: 12,
            replies: 5
        },
        {
            id: "post2",
            author: {
                id: "user2",
                name: "Jamie Davis",
                avatar: "/images/avatar-2.png"
            },
            content: "I'm looking for recommendations for a good home espresso machine in the $500-700 range. Any suggestions from the group?",
            date: "1 week ago",
            likes: 8,
            replies: 15
        }
    ];

    const handleMembershipToggle = () => {
        // This would be replaced with a server action call to join/leave the group
        setIsMember(!isMember);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/groups">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {groupData.name}
                    </h1>
                    {groupData.isPrivate && (
                        <Badge variant="outline" className="ml-2">
                            Private Group
                        </Badge>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                    </Button>
                    {isMember ? (
                        <Button
                            onClick={handleMembershipToggle}
                            variant="outline"
                        >
                            Leave Group
                        </Button>
                    ) : (
                        <Button onClick={handleMembershipToggle}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Join Group
                        </Button>
                    )}
                    {groupData.isAdmin && (
                        <Button variant="outline" asChild>
                            <Link href={`/groups/${groupId}/manage`}>
                                <Settings className="mr-2 h-4 w-4" />
                                Manage
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Group Cover */}
                    <div className="relative h-[250px] w-full rounded-lg overflow-hidden">
                        <Image
                            src={groupData.coverImage}
                            alt={groupData.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Group Tabs */}
                    <Tabs defaultValue="about" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="about">
                                <Info className="h-4 w-4 mr-2" />
                                About
                            </TabsTrigger>
                            <TabsTrigger value="events">
                                <Calendar className="h-4 w-4 mr-2" />
                                Events
                            </TabsTrigger>
                            <TabsTrigger value="members">
                                <Users className="h-4 w-4 mr-2" />
                                Members
                            </TabsTrigger>
                            <TabsTrigger value="discussions">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Discussions
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="about" className="space-y-6 py-4">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">About This Group</h2>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {groupData.description}
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Photos</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {groupData.photos.map((photo, index) => (
                                        <div key={index} className="relative h-36 rounded-md overflow-hidden">
                                            <Image
                                                src={photo}
                                                alt={`Group photo ${index + 1}`}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center mt-4">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/groups/${groupId}/photos`}>
                                            <Image className="mr-2 h-4 w-4" src={""} alt={""} />
                                            View All Photos
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Organizers</h2>
                                <div className="space-y-3">
                                    {groupData.organizers.map((organizer) => (
                                        <div
                                            key={organizer.id}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <Avatar>
                                                <AvatarImage src={organizer.avatar} />
                                                <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{organizer.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {organizer.role}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="ml-auto">
                                                <MessageCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="events" className="space-y-6 py-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                                {isMember && (
                                    <Link href={`/events/create?groupId=${groupId}`}>
                                        <Button size="sm">
                                            <CalendarPlus className="mr-2 h-4 w-4" />
                                            Create Event
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            {upcomingEvents.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingEvents.map((event) => (
                                        <Card key={event.id} className="card-hover">
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="relative h-48 sm:h-auto sm:w-40 flex-shrink-0">
                                                    <Image
                                                        src={event.image}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="p-4 flex-grow">
                                                    <h3 className="font-semibold text-lg">{event.title}</h3>
                                                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                                                        <Calendar className="mr-1 h-4 w-4" />
                                                        <span>{event.date}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                        <Clock className="mr-1 h-4 w-4" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                        <MapPin className="mr-1 h-4 w-4" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                        <Users className="mr-1 h-4 w-4" />
                                                        <span>{event.attendees} attending</span>
                                                    </div>
                                                    <div className="mt-4 flex justify-end">
                                                        <Link href={`/events/${event.id}`}>
                                                            <Button size="sm">View Event</Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-muted/30 rounded-lg">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
                                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                        This group doesn't have any events scheduled. Check back later or create an event!
                                    </p>
                                    {isMember && (
                                        <Link href={`/events/create?groupId=${groupId}`}>
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create Event
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}

                            <Separator />

                            <h2 className="text-xl font-semibold">Past Events</h2>
                            <div className="space-y-4">
                                {pastEvents.map((event) => (
                                    <Card key={event.id}>
                                        <div className="flex items-center p-4">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={event.image}
                                                    alt={event.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="ml-4 flex-grow">
                                                <h3 className="font-semibold">{event.title}</h3>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    <span>{event.date}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <MapPin className="mr-1 h-4 w-4" />
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>
                                            <Link href={`/events/${event.id}`}>
                                                <Button size="sm" variant="outline">View</Button>
                                            </Link>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="members" className="space-y-6 py-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Members ({groupData.members})</h2>
                                {groupData.isAdmin && (
                                    <Button size="sm" variant="outline" asChild>
                                        <Link href={`/groups/${groupId}/manage/members`}>
                                            <Settings className="mr-2 h-4 w-4" />
                                            Manage Members
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium text-muted-foreground">Organizers</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {groupData.organizers.map((organizer) => (
                                        <div
                                            key={organizer.id}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <Avatar>
                                                <AvatarImage src={organizer.avatar} />
                                                <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{organizer.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {organizer.role}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="ml-auto">
                                                <MessageCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-medium text-muted-foreground">Members</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {groupData.recentMembers.map((member) => (
                                        <div
                                            key={member.id}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <Avatar>
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{member.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Member
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="ml-auto">
                                                <MessageCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="outline" className="w-full">
                                    View All Members
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="discussions" className="space-y-6 py-4">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Discussions</h2>

                                {isMember && (
                                    <div className="flex gap-3">
                                        <Avatar>
                                            <AvatarImage src="/images/user-avatar.png" />
                                            <AvatarFallback>YO</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <Textarea
                                                placeholder="Start a discussion or ask a question..."
                                                rows={3}
                                                className="mb-2"
                                            />
                                            <div className="flex justify-end">
                                                <Button>Post</Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6 mt-6">
                                    {discussionPosts.map((post) => (
                                        <Card key={post.id} className="p-4">
                                            <div className="flex gap-3">
                                                <Avatar>
                                                    <AvatarImage src={post.author.avatar} />
                                                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="font-medium">{post.author.name}</div>
                                                            <div className="text-xs text-muted-foreground">{post.date}</div>
                                                        </div>
                                                    </div>
                                                    <p className="mt-2 mb-3">{post.content}</p>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <button className="flex items-center mr-4 hover:text-foreground">
                                                            <Heart className="h-4 w-4 mr-1" />
                                                            <span>Like ({post.likes})</span>
                                                        </button>
                                                        <button className="flex items-center hover:text-foreground">
                                                            <MessageCircle className="h-4 w-4 mr-1" />
                                                            <span>Reply ({post.replies})</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    {/* Group Info Card */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="text-xl font-semibold mb-2">About</div>

                            <div className="flex gap-4 items-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium">Members</div>
                                    <div className="text-muted-foreground text-sm">{groupData.members} members</div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-4 items-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium">Location</div>
                                    <div className="text-muted-foreground text-sm">{groupData.location}</div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-4 items-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium">Founded</div>
                                    <div className="text-muted-foreground text-sm">{groupData.foundedDate}</div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-4 items-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <Info className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium">Category</div>
                                    <div className="text-muted-foreground text-sm">{groupData.category}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Upcoming Events</CardTitle>
                            <CardDescription>
                                {groupData.upcomingEvents} events scheduled
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                {upcomingEvents.slice(0, 2).map((event) => (
                                    <div key={event.id} className="flex gap-3">
                                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Link href={`/events/${event.id}`} className="font-medium hover:underline">
                                                {event.title}
                                            </Link>
                                            <div className="text-sm text-muted-foreground">{event.date} • {event.time}</div>
                                            <div className="text-sm text-muted-foreground">{event.attendees} attending</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Link href={`/groups/${groupId}?tab=events`} className="w-full">
                                <Button variant="outline" className="w-full">View All Events</Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Recent Members Card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Recent Members</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex flex-wrap gap-2">
                                {groupData.recentMembers.slice(0, 6).map((member) => (
                                    <Link key={member.id} href={`/profile/${member.id}`}>
                                        <Avatar className="h-10 w-10 border-2 border-background hover:border-primary transition-colors">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                ))}
                                {groupData.members > 6 && (
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                                        +{groupData.members - 6}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Link href={`/groups/${groupId}?tab=members`} className="w-full">
                                <Button variant="outline" className="w-full">View All Members</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
