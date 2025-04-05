/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@core/button";
import { Card, CardContent } from "@core/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@core/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@core/avatar";
import { Badge } from "@core/badge";
import { Separator } from "@core/separator";
import {
    ArrowLeft,
    Calendar,
    Clock,
    DollarSign,
    ExternalLink,
    Heart,
    Info,
    MapPin,
    MessageSquare,
    Share2,
    Users
} from "lucide-react";
import Map from "@common/maps/map";

export default function EventDetailPage() {
    const params = useParams();
    const eventId = params.eventId as string;
    const [isJoined, setIsJoined] = useState(false);

    // This would be replaced with a server action call to get event details
    const eventData = {
        id: eventId,
        title: "Tech Networking Event",
        description: "Join us for an evening of networking with tech professionals from across the city. This is a great opportunity to meet like-minded individuals, share ideas, and potentially find collaborators for your next project. We'll have refreshments and light snacks provided.\n\nThe event will begin with a brief introduction followed by structured networking activities to help break the ice. There will also be a panel discussion with local tech leaders on the future of the industry.",
        date: "May 8, 2023",
        time: "6:30 PM - 9:00 PM",
        location: {
            name: "Innovation Hub",
            address: "123 Tech Street, Tech District",
            city: "San Francisco",
            state: "CA",
            coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        host: {
            id: "host123",
            name: "Tech Meetup Group",
            avatar: "/images/avatar-group.png"
        },
        attendees: [
            { id: "user1", name: "Alex Smith", avatar: "/images/avatar-1.png" },
            { id: "user2", name: "Jamie Davis", avatar: "/images/avatar-2.png" },
            { id: "user3", name: "Riley Jordan", avatar: "/images/avatar-3.png" },
            { id: "user4", name: "Taylor Morgan", avatar: "/images/avatar-4.png" },
            { id: "user5", name: "Jordan Casey", avatar: "/images/avatar-5.png" },
            // ... and 15 more
        ],
        totalAttendees: 20,
        maxAttendees: 50,
        price: "Free",
        category: "Networking",
        tags: ["Tech", "Professional", "Networking", "Career"],
        images: [
            "/images/event-tech.jpg",
            "/images/event-tech-2.jpg",
            "/images/event-tech-3.jpg"
        ]
    };

    const handleJoinEvent = () => {
        // This would be replaced with a server action call to join the event
        setIsJoined(!isJoined);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/events">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {eventData.title}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={handleJoinEvent}
                        variant={isJoined ? "secondary" : "default"}
                    >
                        {isJoined ? "Leave Event" : "Join Event"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Event Images */}
                    <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
                        <Image
                            src={eventData.images[0]}
                            alt={eventData.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <Button size="sm" variant="secondary">
                                View All Photos
                            </Button>
                        </div>
                    </div>

                    {/* Event Info Tabs */}
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="attendees">Attendees</TabsTrigger>
                            <TabsTrigger value="discussion">Discussion</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6 py-4">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">About This Event</h2>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {eventData.description}
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Event Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {eventData.tags.map((tag) => (
                                        <Badge key={tag} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="attendees" className="py-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Attendees</h2>
                                    <div className="text-sm text-muted-foreground">
                                        {eventData.totalAttendees}/{eventData.maxAttendees} spots filled
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {eventData.attendees.map((attendee) => (
                                        <div
                                            key={attendee.id}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        >
                                            <Avatar>
                                                <AvatarImage src={attendee.avatar} />
                                                <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{attendee.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Member
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="ml-auto">
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {eventData.totalAttendees > eventData.attendees.length && (
                                    <Button variant="outline" className="w-full mt-4">
                                        View All {eventData.totalAttendees} Attendees
                                    </Button>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="discussion" className="py-4">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Event Discussion</h2>

                                <div className="flex gap-3">
                                    <Avatar>
                                        <AvatarImage src="/images/user-avatar.png" />
                                        <AvatarFallback>YO</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <textarea
                                            className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Ask a question or share information with attendees..."
                                        />
                                        <div className="flex justify-end mt-2">
                                            <Button>Post</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mt-6">
                                    <div className="flex gap-3">
                                        <Avatar>
                                            <AvatarImage src="/images/avatar-1.png" />
                                            <AvatarFallback>AS</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="bg-muted p-3 rounded-lg">
                                                <div className="font-medium">Alex Smith</div>
                                                <div className="text-sm text-muted-foreground mb-2">2 days ago</div>
                                                <p>Is there a dress code for this event? I'm assuming business casual but wanted to check.</p>
                                            </div>
                                            <div className="flex mt-2 text-sm">
                                                <button className="text-muted-foreground hover:text-foreground mr-4">
                                                    Like
                                                </button>
                                                <button className="text-muted-foreground hover:text-foreground">
                                                    Reply
                                                </button>
                                            </div>

                                            <div className="ml-6 mt-3 flex gap-3">
                                                <Avatar className="h-7 w-7">
                                                    <AvatarImage src="/images/avatar-group.png" />
                                                    <AvatarFallback>H</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="bg-muted p-3 rounded-lg">
                                                        <div className="font-medium">Tech Meetup Group <Badge variant="outline" className="ml-2 text-xs">Host</Badge></div>
                                                        <div className="text-sm text-muted-foreground mb-2">1 day ago</div>
                                                        <p>Yes, business casual is perfect! Looking forward to seeing you there.</p>
                                                    </div>
                                                    <div className="flex mt-2 text-sm">
                                                        <button className="text-muted-foreground hover:text-foreground mr-4">
                                                            Like
                                                        </button>
                                                        <button className="text-muted-foreground hover:text-foreground">
                                                            Reply
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    {/* Event Details Card */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex gap-4 items-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <Calendar className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium">Date & Time</div>
                                    <div className="text-muted-foreground text-sm">{eventData.date}</div>
                                    <div className="text-muted-foreground text-sm">{eventData.time}</div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-4 items-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium">Location</div>
                                    <div className="text-muted-foreground text-sm">{eventData.location.name}</div>
                                    <div className="text-muted-foreground text-sm">{eventData.location.address}</div>
                                    <div className="text-muted-foreground text-sm">
                                        {eventData.location.city}, {eventData.location.state}
                                    </div>
                                    <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                                        Get Directions
                                        <ExternalLink className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-4 items-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <DollarSign className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium">Price</div>
                                    <div className="text-muted-foreground text-sm">{eventData.price}</div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-4 items-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium">Attendees</div>
                                    <div className="text-muted-foreground text-sm">
                                        {eventData.totalAttendees} going · {eventData.maxAttendees - eventData.totalAttendees} spots left
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex gap-4 items-center">
                                <div className="bg-primary/10 rounded-full p-3">
                                    <Info className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <div className="font-medium">Organized by</div>
                                    <div className="flex items-center mt-1">
                                        <Avatar className="h-6 w-6 mr-2">
                                            <AvatarImage src={eventData.host.avatar} />
                                            <AvatarFallback>H</AvatarFallback>
                                        </Avatar>
                                        <Link href={`/groups/${eventData.host.id}`} className="text-sm hover:underline">
                                            {eventData.host.name}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Map Card */}
                    <Card>
                        <CardContent className="p-0 overflow-hidden rounded-b-lg">
                            <div className="h-[250px] w-full relative">
                                {/* This would be replaced with a proper map component */}
                                <Map
                                    center={eventData.location.coordinates}
                                    zoom={14}
                                    markers={[
                                        {
                                            position: eventData.location.coordinates,
                                            title: eventData.location.name
                                        }
                                    ]}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommendations Card */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4">Similar Events</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src="/images/event-coffee.jpg"
                                            alt="Coffee Tasting Workshop"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Link href="/events/coffee-workshop" className="font-medium hover:underline">
                                            Coffee Tasting Workshop
                                        </Link>
                                        <div className="text-sm text-muted-foreground">Tomorrow • 6:00 PM</div>
                                        <div className="text-sm text-muted-foreground">Brew Lab Coffee</div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src="/images/event-dinner.jpg"
                                            alt="Downtown Dinner Meetup"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Link href="/events/dinner-downtown" className="font-medium hover:underline">
                                            Downtown Dinner Meetup
                                        </Link>
                                        <div className="text-sm text-muted-foreground">Fri, May 19 • 7:30 PM</div>
                                        <div className="text-sm text-muted-foreground">Italian Bistro</div>
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/events">View More Events</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
