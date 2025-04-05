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
    Clock,
    Filter,
    Heart,
    MapPin,
    Pencil,
    Plus,
    Search,
    SlidersHorizontal
} from "lucide-react";
import { Badge } from "@core/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@core/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@core/select";
import { Checkbox } from "@core/checkbox";
import { Label } from "@core/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@core/sheet";
import { DatePicker } from "@core/date-picker";

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Events</h1>
                    <p className="text-muted-foreground">
                        Discover and join events around you.
                    </p>
                </div>
                <Link href="/events/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                    </Button>
                </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search events..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <DatePicker
                        selectedDate={selectedDate}
                        onSelect={setSelectedDate}
                        className="h-10"
                    />

                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="dining">Dining</SelectItem>
                            <SelectItem value="coffee">Coffee</SelectItem>
                            <SelectItem value="networking">Networking</SelectItem>
                            <SelectItem value="social">Social</SelectItem>
                            <SelectItem value="outdoor">Outdoor</SelectItem>
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
                                    Refine your event search results.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="grid gap-6 py-6">
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Event Type</h3>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="type-public" />
                                        <Label htmlFor="type-public">Public Events</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="type-private" />
                                        <Label htmlFor="type-private">Private Events</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="type-group" />
                                        <Label htmlFor="type-group">Group Events</Label>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Distance</h3>
                                    <Select defaultValue="5">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Distance" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Within 1 mile</SelectItem>
                                            <SelectItem value="5">Within 5 miles</SelectItem>
                                            <SelectItem value="10">Within 10 miles</SelectItem>
                                            <SelectItem value="25">Within 25 miles</SelectItem>
                                            <SelectItem value="50">Within 50 miles</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Date Range</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label htmlFor="from-date">From</Label>
                                            <Input type="date" id="from-date" />
                                        </div>
                                        <div>
                                            <Label htmlFor="to-date">To</Label>
                                            <Input type="date" id="to-date" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Attendees</h3>
                                    <Select defaultValue="any">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Attendees" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">Any size</SelectItem>
                                            <SelectItem value="small">Small (1-10)</SelectItem>
                                            <SelectItem value="medium">Medium (11-30)</SelectItem>
                                            <SelectItem value="large">Large (31+)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Features</h3>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="feature-food" />
                                        <Label htmlFor="feature-food">Food Provided</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="feature-accessible" />
                                        <Label htmlFor="feature-accessible">Wheelchair Accessible</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="feature-kid" />
                                        <Label htmlFor="feature-kid">Kid Friendly</Label>
                                    </div>
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
                    <TabsTrigger value="all">All Events</TabsTrigger>
                    <TabsTrigger value="attending">Attending</TabsTrigger>
                    <TabsTrigger value="hosting">Hosting</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Event Card 1 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge className="mb-2">Today</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-4 w-4" />
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
                                <Link href="/events/tech-networking">
                                    <Button size="sm">Join</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Event Card 2 */}
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
                                <Link href="/events/coffee-workshop">
                                    <Button size="sm">Join</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Event Card 3 */}
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
                                    <span>Fri, May 19 • 7:30 PM</span>
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
                                <Link href="/events/dinner-downtown">
                                    <Button size="sm">Join</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Event Card 4 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="mb-2">This Weekend</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg">Wine Tasting Experience</CardTitle>
                                <CardDescription>Hosted by Wine Enthusiasts</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/event-wine.jpg"
                                        alt="Wine Tasting Event"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>Sat, May 13 • 5:00 PM</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>Vintage Vineyards, West Side</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                                <div className="flex -space-x-2">
                                    <Avatar className="border-2 border-background h-7 w-7">
                                        <AvatarImage src="/images/avatar-3.png" />
                                        <AvatarFallback>U3</AvatarFallback>
                                    </Avatar>
                                    <Avatar className="border-2 border-background h-7 w-7">
                                        <AvatarImage src="/images/avatar-5.png" />
                                        <AvatarFallback>U5</AvatarFallback>
                                    </Avatar>
                                    <div className="bg-primary text-primary-foreground flex items-center justify-center border-2 border-background h-7 w-7 rounded-full text-xs">
                                        +10
                                    </div>
                                </div>
                                <Link href="/events/wine-tasting">
                                    <Button size="sm">Join</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Event Card 5 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="mb-2">Limited Spots</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg">Cooking Class: Italian Pasta</CardTitle>
                                <CardDescription>Hosted by Culinary School</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/event-cooking.jpg"
                                        alt="Cooking Class Event"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>Thu, May 18 • 6:00 PM</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>Gourmet Kitchen, East District</span>
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
                                        +6
                                    </div>
                                </div>
                                <Link href="/events/italian-cooking">
                                    <Button size="sm">Join</Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Event Card 6 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge className="mb-2 bg-indigo-500 hover:bg-indigo-600">Trending</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg">Photography Walk: City Lights</CardTitle>
                                <CardDescription>Hosted by Photography Club</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/event-photography.jpg"
                                        alt="Photography Event"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>Sat, May 20 • 7:00 PM</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>City Park, Downtown</span>
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
                                        +20
                                    </div>
                                </div>
                                <Link href="/events/photography-walk">
                                    <Button size="sm">Join</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="flex justify-center">
                        <Button variant="outline" className="mx-auto">
                            Load More
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="attending" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Attending Event Card 1 */}
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
                                <Link href="/events/tech-networking">
                                    <Button size="sm" variant="secondary">Attending</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="hosting" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Hosting Event Card 1 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="mb-2">Next Week</Badge>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardTitle className="text-lg">Downtown Dinner Meetup</CardTitle>
                                <CardDescription>Hosted by You</CardDescription>
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
                                    <span>Fri, May 19 • 7:30 PM</span>
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
                                <div className="flex gap-2">
                                    <Link href="/events/dinner-downtown/manage">
                                        <Button size="sm" variant="outline">Manage</Button>
                                    </Link>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="saved" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Saved Event Card 1 */}
                        <Card className="card-hover">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge className="mb-2 bg-indigo-500 hover:bg-indigo-600">Trending</Badge>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
                                    </Button>
                                </div>
                                <CardTitle className="text-lg">Photography Walk: City Lights</CardTitle>
                                <CardDescription>Hosted by Photography Club</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                                    <Image
                                        src="/images/event-photography.jpg"
                                        alt="Photography Event"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>Sat, May 20 • 7:00 PM</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>City Park, Downtown</span>
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
                                        +20
                                    </div>
                                </div>
                                <Link href="/events/photography-walk">
                                    <Button size="sm">Join</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
