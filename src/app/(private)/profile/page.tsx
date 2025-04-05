"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@core/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@core/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@core/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@core/avatar";
import { Badge } from "@core/badge";
import {
    CalendarDays,
    Edit,
    Heart,
    Instagram,
    Linkedin,
    MapPin,
    MessageSquare,
    Settings,
    Share2,
    Twitter,
    UserCheck2,
    UserPlus,
    Users
} from "lucide-react";
import { Separator } from "@core/separator";
import { useAuthStore } from "@store/auth-store";

export default function ProfilePage() {
    const { user } = useAuthStore();
    const [isFollowing, setIsFollowing] = useState(false);

    // For demo purposes, we're using mock data
    // In a real app, this would come from API calls
    const profileData = {
        name: user?.name || "John Doe",
        username: "@johndoe",
        location: "San Francisco, CA",
        bio: "Coffee enthusiast, tech professional, and foodie. Love discovering new restaurants and meeting interesting people. Always up for a good conversation over coffee or dinner.",
        interests: ["Coffee", "Dining", "Technology", "Photography", "Travel"],
        joinedDate: "May 2023",
        followers: 128,
        following: 95,
        isOwnProfile: true,
        social: {
            twitter: "johndoe",
            instagram: "johndoe",
            linkedin: "johndoe"
        },
        stats: {
            eventsAttended: 15,
            eventsHosted: 3,
            groups: 5
        },
        avatar: user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    };

    // In a real app, these would be loaded from APIs
    const userEvents = [
        {
            id: "event1",
            title: "Tech Networking Event",
            date: "May 8, 2023",
            time: "6:30 PM",
            location: "Innovation Hub",
            attendees: 20,
            image: "/images/event-tech.jpg",
            isHosting: true
        },
        {
            id: "event2",
            title: "Coffee Tasting Workshop",
            date: "May 10, 2023",
            time: "6:00 PM",
            location: "Brew Lab Coffee",
            attendees: 12,
            image: "/images/event-coffee.jpg",
            isHosting: false
        },
        {
            id: "event3",
            title: "Downtown Dinner Meetup",
            date: "May 19, 2023",
            time: "7:30 PM",
            location: "Italian Bistro",
            attendees: 8,
            image: "/images/event-dinner.jpg",
            isHosting: true
        }
    ];

    const userGroups = [
        {
            id: "group1",
            name: "Coffee Enthusiasts",
            members: 56,
            image: "/images/group-coffee.jpg",
            isAdmin: false
        },
        {
            id: "group2",
            name: "Downtown Foodies",
            members: 128,
            image: "/images/group-food.jpg",
            isAdmin: true
        },
        {
            id: "group3",
            name: "Tech Meetup",
            members: 212,
            image: "/images/group-tech.jpg",
            isAdmin: false
        }
    ];

    const reviewsData = [
        {
            id: "review1",
            location: "Artisan Coffee Co.",
            rating: 5,
            comment: "Best coffee in town! The atmosphere is perfect for both working and socializing.",
            date: "April 25, 2023",
            image: "/images/place-coffee.jpg"
        },
        {
            id: "review2",
            location: "Urban Bistro",
            rating: 4,
            comment: "Great Italian food. The pasta dishes are especially delicious. Service was a bit slow, but worth the wait.",
            date: "April 10, 2023",
            image: "/images/place-bistro.jpg"
        },
        {
            id: "review3",
            location: "Fusion Kitchen",
            rating: 5,
            comment: "Amazing Asian fusion dishes. The sushi rolls are creative and delicious!",
            date: "March 30, 2023",
            image: "/images/place-fusion.jpg"
        }
    ];

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="p-0">
                    {/* Cover Photo */}
                    <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-primary/20 to-secondary/20">
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent" />
                        {/* Profile actions - positioned top-right on cover */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            {profileData.isOwnProfile ? (
                                <>
                                    <Button variant="secondary" size="sm" asChild>
                                        <Link href="/settings/profile">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit Profile
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="icon" className="bg-card/80">
                                        <Settings className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="secondary" size="sm" onClick={handleFollowToggle}>
                                        {isFollowing ? (
                                            <>
                                                <UserCheck2 className="h-4 w-4 mr-2" />
                                                Following
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4 mr-2" />
                                                Follow
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" size="icon" className="bg-card/80">
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="bg-card/80">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="px-4 sm:px-6 pb-6 relative">
                        {/* Avatar - positioned to overlap cover and info sections */}
                        <div className="absolute -top-16 left-6">
                            <Avatar className="h-24 w-24 ring-4 ring-card">
                                <AvatarImage src={profileData.avatar} />
                                <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="mt-12">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold">{profileData.name}</h1>
                                    <p className="text-muted-foreground">{profileData.username}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="font-semibold">{profileData.followers}</p>
                                        <p className="text-xs text-muted-foreground">Followers</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold">{profileData.following}</p>
                                        <p className="text-xs text-muted-foreground">Following</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold">{profileData.stats.eventsAttended}</p>
                                        <p className="text-xs text-muted-foreground">Events</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{profileData.location}</span>
                                <div className="w-1 h-1 rounded-full bg-muted-foreground mx-1" />
                                <CalendarDays className="h-4 w-4" />
                                <span>Joined {profileData.joinedDate}</span>
                            </div>

                            <p className="mt-4">{profileData.bio}</p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {profileData.interests.map((interest) => (
                                    <Badge key={interest} variant="secondary">
                                        {interest}
                                    </Badge>
                                ))}
                            </div>

                            <div className="mt-6 flex gap-3">
                                {profileData.social.twitter && (
                                    <a
                                        href={`https://twitter.com/${profileData.social.twitter}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                )}
                                {profileData.social.instagram && (
                                    <a
                                        href={`https://instagram.com/${profileData.social.instagram}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                )}
                                {profileData.social.linkedin && (
                                    <a
                                        href={`https://linkedin.com/in/${profileData.social.linkedin}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Tabs */}
            <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="events">Events</TabsTrigger>
                    <TabsTrigger value="groups">Groups</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="likes">Likes</TabsTrigger>
                </TabsList>

                <TabsContent value="events" className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userEvents.map((event) => (
                            <Card key={event.id} className="card-hover overflow-hidden">
                                <div className="relative h-40 w-full">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                    {event.isHosting && (
                                        <div className="absolute top-2 left-2">
                                            <Badge variant="secondary">Hosting</Badge>
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-lg">{event.title}</CardTitle>
                                    <CardDescription>
                                        {event.date} • {event.time}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="mr-1 h-4 w-4" />
                                        <span>{event.location}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                    <div className="flex items-center text-sm">
                                        <Users className="mr-1 h-4 w-4" />
                                        <span>{event.attendees} attendees</span>
                                    </div>
                                    <Link href={`/events/${event.id}`}>
                                        <Button size="sm" variant="outline">View</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Link href="/events">
                            <Button variant="outline">See All Events</Button>
                        </Link>
                    </div>
                </TabsContent>

                <TabsContent value="groups" className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userGroups.map((group) => (
                            <Card key={group.id} className="card-hover overflow-hidden">
                                <div className="relative h-40 w-full">
                                    <Image
                                        src={group.image}
                                        alt={group.name}
                                        fill
                                        className="object-cover"
                                    />
                                    {group.isAdmin && (
                                        <div className="absolute top-2 left-2">
                                            <Badge variant="secondary">Admin</Badge>
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-lg">{group.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Users className="mr-1 h-4 w-4" />
                                        <span>{group.members} members</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex justify-end">
                                    <Link href={`/groups/${group.id}`}>
                                        <Button size="sm" variant="outline">View Group</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Link href="/groups">
                            <Button variant="outline">See All Groups</Button>
                        </Link>
                    </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviewsData.map((review) => (
                            <Card key={review.id} className="card-hover">
                                <div className="flex">
                                    <div className="relative h-24 w-24 flex-shrink-0">
                                        <Image
                                            src={review.image}
                                            alt={review.location}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 p-4">
                                        <h3 className="font-semibold">{review.location}</h3>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating
                                                        ? "text-amber-400"
                                                        : "text-gray-300"
                                                        }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <span className="ml-1 text-sm text-muted-foreground">
                                                {review.date}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Button variant="outline">See All Reviews</Button>
                    </div>
                </TabsContent>

                <TabsContent value="likes" className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="card-hover overflow-hidden">
                            <div className="relative h-40 w-full">
                                <Image
                                    src="/images/place-coffee.jpg"
                                    alt="Artisan Coffee Co."
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 bg-card/80"
                                >
                                    <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
                                </Button>
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-lg">Artisan Coffee Co.</CardTitle>
                                <CardDescription>Café • $$</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>Downtown, 3.2 miles away</span>
                                </div>
                                <div className="flex items-center mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="text-amber-400 h-4 w-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        (128 reviews)
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-end">
                                <Link href="/places/artisan-coffee">
                                    <Button size="sm" variant="outline">View</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        <Card className="card-hover overflow-hidden">
                            <div className="relative h-40 w-full">
                                <Image
                                    src="/images/event-dinner.jpg"
                                    alt="Downtown Dinner Meetup"
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 bg-card/80"
                                >
                                    <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
                                </Button>
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-lg">Downtown Dinner Meetup</CardTitle>
                                <CardDescription>Fri, May 19 • 7:30 PM</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>Italian Bistro, City Center</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-end">
                                <Link href="/events/dinner-downtown">
                                    <Button size="sm" variant="outline">View</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        <Card className="card-hover overflow-hidden">
                            <div className="relative h-40 w-full">
                                <Image
                                    src="/images/group-food.jpg"
                                    alt="Downtown Foodies"
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 bg-card/80"
                                >
                                    <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
                                </Button>
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-lg">Downtown Foodies</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Users className="mr-1 h-4 w-4" />
                                    <span>128 members</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-end">
                                <Link href="/groups/downtown-foodies">
                                    <Button size="sm" variant="outline">View</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="flex justify-center">
                        <Button variant="outline">See All Likes</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
