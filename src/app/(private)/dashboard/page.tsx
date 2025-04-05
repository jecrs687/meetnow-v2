/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import Image from "next/image";
import { Button } from "@core/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@core/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@core/tabs";
import {
    Bell,
    Calendar,
    Clock,
    Coffee,
    Heart,
    Map,
    MapPin,
    MessageSquare,
    PlusCircle,
    UserPlus,
    Users,
    X
} from "lucide-react";
import { Badge } from "@core/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@core/avatar";

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's what's happening around you.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Link href="/events/create">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Event
                        </Button>
                    </Link>
                    <Link href="/explore">
                        <Button variant="outline">
                            <Map className="mr-2 h-4 w-4" />
                            Explore Nearby
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                            <h3 className="text-2xl font-bold mt-1">5</h3>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Calendar className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">New Messages</p>
                            <h3 className="text-2xl font-bold mt-1">12</h3>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Your Groups</p>
                            <h3 className="text-2xl font-bold mt-1">8</h3>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <Users className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">New Matches</p>
                            <h3 className="text-2xl font-bold mt-1">3</h3>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <Heart className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="upcoming" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="upcoming">
                        <Calendar className="h-4 w-4 mr-2" />
                        Upcoming Events
                    </TabsTrigger>
                    <TabsTrigger value="suggested">
                        <Coffee className="h-4 w-4 mr-2" />
                        Suggested Places
                    </TabsTrigger>
                    <TabsTrigger value="matches">
                        <Heart className="h-4 w-4 mr-2" />
                        Matches
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Event Card 1 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge className="mb-2">Tomorrow</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg">Coffee Tasting Workshop</CardTitle>
                                <CardDescription>Hosted by Coffee Enthusiasts</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/event-coffee.jpg"
                                        alt="Coffee Tasting Event"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>Tue, May 10 • 6:00 PM</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>Brew Lab Coffee, Downtown</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                                <div className="flex -space-x-2">
                                    <Avatar className="border-2 border-background h-7 w-7">
                                        <AvatarImage src="/images/avatar-1.png" />
                                        <AvatarFallback>U1</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="border-2 border-background h-7 w-7">
                                        <AvatarImage src="/images/avatar-2.png" />
                                        <AvatarFallback>U2</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="border-2 border-background h-7 w-7">
                                        <AvatarImage src="/images/avatar-3.png" />
                                        <AvatarFallback>U3</AvatarFallback>
                                    </Avatar>
                                    <div className="bg-primary text-primary-foreground flex items-center justify-center border-2 border-background h-7 w-7 rounded-full text-xs">
                                        +12
                                    </div>
                                </div>
                                <Button size="sm">Join</Button>
                            </CardFooter>
                        </Card>

                        {/* Event Card 2 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="mb-2">Next Week</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg">Downtown Dinner Meetup</CardTitle>
                                <CardDescription>Hosted by Downtown Foodies</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/event-dinner.jpg"
                                        alt="Dinner Meetup Event"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>Fri, May 20 • 7:30 PM</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>Italian Bistro, City Center</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                                <div className="flex -space-x-2">
                                    <Avatar className="border-2 border-background h-7 w-7">
                                        <AvatarImage src="/images/avatar-2.png" />
                                        <AvatarFallback>U2</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="border-2 border-background h-7 w-7">
                                        <AvatarImage src="/images/avatar-4.png" />
                                        <AvatarFallback>U4</AvatarFallback>
                                    </Avatar>
                                    <div className="bg-primary text-primary-foreground flex items-center justify-center border-2 border-background h-7 w-7 rounded-full text-xs">
                                        +8
                                    </div>
                                </div>
                                <Button size="sm">Join</Button>
                            </CardFooter>
                        </Card>

                        {/* Event Card 3 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge className="mb-2 bg-green-500 hover:bg-green-600">Today</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg">Tech Networking Event</CardTitle>
                                <CardDescription>Hosted by Tech Meetup Group</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/event-tech.jpg"
                                        alt="Tech Networking Event"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>Today • 6:30 PM</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>Innovation Hub, Tech District</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                                <div className="flex -space-x-2">
                                    <Avatar className="border-2 border-background h-7 w-7">
                                        <AvatarImage src="/images/avatar-1.png" />
                                        <AvatarFallback>U1</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="border-2 border-background h-7 w-7">
                                        <AvatarImage src="/images/avatar-3.png" />
                                        <AvatarFallback>U3</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="border-2 border-background h-7 w-7">
                                        <AvatarImage src="/images/avatar-5.png" />
                                        <AvatarFallback>U5</AvatarFallback>
                                    </Avatar>
                                    <div className="bg-primary text-primary-foreground flex items-center justify-center border-2 border-background h-7 w-7 rounded-full text-xs">
                                        +15
                                    </div>
                                </div>
                                <Button size="sm" variant="secondary">Attending</Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="text-center">
                        <Link href="/events">
                            <Button variant="outline">
                                View All Events
                                <Calendar className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </TabsContent>

                <TabsContent value="suggested" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Place Card 1 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="mb-2">Recommended</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg">Artisan Coffee Co.</CardTitle>
                                <CardDescription>Café • $$</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/place-coffee.jpg"
                                        alt="Artisan Coffee Co."
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>Downtown, 3.2 miles away</span>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center">
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="ml-2 text-sm font-medium">5.0</span>
                                        <span className="ml-1 text-sm text-muted-foreground">(128)</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                                <div className="text-sm text-muted-foreground">
                                    <span>Coffee, Pastries, Breakfast</span>
                                </div>
                                <Link href="/places/artisan-coffee">
                                    <Button size="sm" variant="outline">Details</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Place Card 2 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="mb-2">Popular</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg">Urban Bistro</CardTitle>
                                <CardDescription>Italian • $$$</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/place-bistro.jpg"
                                        alt="Urban Bistro"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>City Center, 1.5 miles away</span>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center">
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-gray-300 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="ml-2 text-sm font-medium">4.7</span>
                                        <span className="ml-1 text-sm text-muted-foreground">(89)</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                                <div className="text-sm text-muted-foreground">
                                    <span>Italian, Wine, Fine Dining</span>
                                </div>
                                <Link href="/places/urban-bistro">
                                    <Button size="sm" variant="outline">Details</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Place Card 3 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="mb-2">New</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg">Fusion Kitchen</CardTitle>
                                <CardDescription>Asian Fusion • $$</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/place-fusion.jpg"
                                        alt="Fusion Kitchen"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>Market District, 2.8 miles away</span>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center">
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="ml-2 text-sm font-medium">4.9</span>
                                        <span className="ml-1 text-sm text-muted-foreground">(42)</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                                <div className="text-sm text-muted-foreground">
                                    <span>Asian, Fusion, Sushi</span>
                                </div>
                                <Link href="/places/fusion-kitchen">
                                    <Button size="sm" variant="outline">Details</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="text-center">
                        <Link href="/places">
                            <Button variant="outline">
                                View All Places
                                <MapPin className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </TabsContent>

                <TabsContent value="matches" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Match Card 1 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="mb-2">90% Match</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="/images/avatar-1.png" />
                                        <AvatarFallback>AS</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">Alex Smith</CardTitle>
                                        <CardDescription>Coffee Enthusiast</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="relative h-48 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/profile-1.jpg"
                                        alt="Alex Smith Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Avid coffee taster and tech professional. Looking to connect with fellow coffee enthusiasts.
                                </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                                <div className="flex flex-wrap gap-1">
                                    <Badge variant="outline" className="text-xs">Coffee</Badge>
                                    <Badge variant="outline" className="text-xs">Tech</Badge>
                                    <Badge variant="outline" className="text-xs">Hiking</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                        <X className="h-4 w-4 mr-1" />
                                        Pass
                                    </Button>
                                    <Button size="sm">
                                        <Heart className="h-4 w-4 mr-1" />
                                        Connect
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>

                        {/* Match Card 2 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="mb-2">85% Match</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="/images/avatar-2.png" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">Jamie Davis</CardTitle>
                                        <CardDescription>Food Explorer</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="relative h-48 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/profile-2.jpg"
                                        alt="Jamie Davis Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Foodie and traveler always looking for new cuisines and experiences. Passionate about photography.
                                </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                                <div className="flex flex-wrap gap-1">
                                    <Badge variant="outline" className="text-xs">Dining</Badge>
                                    <Badge variant="outline" className="text-xs">Travel</Badge>
                                    <Badge variant="outline" className="text-xs">Photography</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                        <X className="h-4 w-4 mr-1" />
                                        Pass
                                    </Button>
                                    <Button size="sm">
                                        <Heart className="h-4 w-4 mr-1" />
                                        Connect
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>

                        {/* Match Card 3 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge className="mb-2">95% Match</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MessageSquare className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src="/images/avatar-3.png" />
                                        <AvatarFallback>RJ</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">Riley Jordan</CardTitle>
                                        <CardDescription>Fine Dining Lover</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="relative h-48 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/profile-3.jpg"
                                        alt="Riley Jordan Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Fine dining enthusiast and wine connoisseur. Looking to form a dinner club with like-minded people.
                                </p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                                <div className="flex flex-wrap gap-1">
                                    <Badge variant="outline" className="text-xs">Fine Dining</Badge>
                                    <Badge variant="outline" className="text-xs">Wine</Badge>
                                    <Badge variant="outline" className="text-xs">Social</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                        <X className="h-4 w-4 mr-1" />
                                        Pass
                                    </Button>
                                    <Button size="sm">
                                        <Heart className="h-4 w-4 mr-1" />
                                        Connect
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="text-center">
                        <Link href="/matches">
                            <Button variant="outline">
                                View All Matches
                                <Heart className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Activity Feed */}
            <section className="mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Recent Activity</h2>
                    <Button variant="outline" size="sm">View All</Button>
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <Avatar>
                                    <AvatarImage src="/images/avatar-1.png" />
                                    <AvatarFallback>AS</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm">
                                    <span className="font-medium">Alex Smith</span>
                                    <span className="text-muted-foreground"> joined the </span>
                                    <span className="font-medium">Coffee Enthusiasts</span>
                                    <span className="text-muted-foreground"> group</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                            </div>
                            <div className="flex-shrink-0">
                                <Button variant="outline" size="sm">View</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <Avatar>
                                    <AvatarImage src="/images/avatar-2.png" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm">
                                    <span className="font-medium">Jamie Davis</span>
                                    <span className="text-muted-foreground"> created a new event </span>
                                    <span className="font-medium">Downtown Dinner Meetup</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                            </div>
                            <div className="flex-shrink-0">
                                <Button variant="outline" size="sm">View</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <Avatar>
                                    <AvatarImage src="/images/avatar-3.png" />
                                    <AvatarFallback>RJ</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex-grow">
                                <p className="text-sm">
                                    <span className="font-medium">Riley Jordan</span>
                                    <span className="text-muted-foreground"> reviewed </span>
                                    <span className="font-medium">Fusion Kitchen</span>
                                    <span className="text-muted-foreground"> and gave it 5 stars</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                            </div>
                            <div className="flex-shrink-0">
                                <Button variant="outline" size="sm">View</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
