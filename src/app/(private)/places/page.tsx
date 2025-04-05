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
    Coffee,
    Heart,
    MapPin,
    Plus,
    Search,
    SlidersHorizontal,
    Users
} from "lucide-react";
import { Badge } from "@core/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@core/select";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@core/sheet";
import { Slider } from "@core/slider";
import { Checkbox } from "@core/checkbox";
import { Label } from "@core/label";

export default function PlacesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState([1, 4]);

    // Mock data for places
    const allPlaces = [
        {
            id: "artisan-coffee",
            name: "Artisan Coffee Co.",
            description: "Trendy café with specialty coffee, pastries, and comfortable workspaces.",
            category: "Café",
            price: "$$",
            rating: 5.0,
            reviewCount: 128,
            location: "Downtown, 3.2 miles away",
            tags: ["Coffee", "Pastries", "Breakfast", "Workspace"],
            image: "/images/place-coffee.jpg",
            isLiked: true
        },
        {
            id: "urban-bistro",
            name: "Urban Bistro",
            description: "Cozy Italian restaurant with authentic pasta, wine, and a romantic atmosphere.",
            category: "Italian",
            price: "$$$",
            rating: 4.7,
            reviewCount: 89,
            location: "City Center, 1.5 miles away",
            tags: ["Italian", "Wine", "Fine Dining", "Pasta"],
            image: "/images/place-bistro.jpg",
            isLiked: false
        },
        {
            id: "fusion-kitchen",
            name: "Fusion Kitchen",
            description: "Modern Asian fusion restaurant with creative dishes and craft cocktails.",
            category: "Asian Fusion",
            price: "$$",
            rating: 4.9,
            reviewCount: 42,
            location: "Market District, 2.8 miles away",
            tags: ["Asian", "Fusion", "Sushi", "Cocktails"],
            image: "/images/place-fusion.jpg",
            isLiked: true
        },
        {
            id: "brew-lab",
            name: "Brew Lab",
            description: "Craft beer bar with over 30 rotating taps and beer-friendly food options.",
            category: "Bar",
            price: "$$",
            rating: 4.6,
            reviewCount: 76,
            location: "North Beach, 4.1 miles away",
            tags: ["Beer", "Bar Food", "Casual"],
            image: "/images/place-bar.jpg",
            isLiked: false
        },
        {
            id: "coastal-seafood",
            name: "Coastal Seafood",
            description: "Fresh seafood restaurant with waterfront views and sustainable sourcing.",
            category: "Seafood",
            price: "$$$",
            rating: 4.8,
            reviewCount: 103,
            location: "Waterfront, 5.3 miles away",
            tags: ["Seafood", "Sustainable", "Views"],
            image: "/images/place-seafood.jpg",
            isLiked: false
        },
        {
            id: "sweet-bakery",
            name: "Sweet Bakery",
            description: "Artisanal bakery with fresh bread, pastries, and cakes for every occasion.",
            category: "Bakery",
            price: "$$",
            rating: 4.5,
            reviewCount: 64,
            location: "Mission District, 2.2 miles away",
            tags: ["Bakery", "Desserts", "Breakfast"],
            image: "/images/place-bakery.jpg",
            isLiked: false
        }
    ];

    const popularPlaces = allPlaces.slice(0, 3);
    const savedPlaces = allPlaces.filter(place => place.isLiked);

    const handlePriceRangeChange = (value: number[]) => {
        setPriceRange(value);
    };

    const formatPriceFilter = (value: number) => {
        return "$".repeat(value);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Places</h1>
                    <p className="text-muted-foreground">
                        Discover and review places for your next meetup.
                    </p>
                </div>
                <Link href="/places/suggest">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Suggest Place
                    </Button>
                </Link>
            </div>

            {/* Popular Places Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Popular Places</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {popularPlaces.map((place) => (
                        <Card key={place.id} className="card-hover overflow-hidden">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={place.image}
                                    alt={place.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/50 backdrop-blur-sm">
                                        <Heart className={`h-4 w-4 ${place.isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
                                    </Button>
                                </div>
                            </div>
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{place.name}</CardTitle>
                                        <CardDescription>{place.category} • {place.price}</CardDescription>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="ml-1 font-medium text-sm">{place.rating}</span>
                                        <span className="ml-1 text-xs text-muted-foreground">({place.reviewCount})</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {place.description}
                                </p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    <span>{place.location}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                <div className="flex flex-wrap gap-1">
                                    {place.tags.slice(0, 2).map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {place.tags.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                            +{place.tags.length - 2} more
                                        </Badge>
                                    )}
                                </div>
                                <Link href={`/places/${place.id}`}>
                                    <Button size="sm" variant="outline">Details</Button>
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
                        placeholder="Search places..."
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
                            <SelectItem value="cafe">Café</SelectItem>
                            <SelectItem value="restaurant">Restaurant</SelectItem>
                            <SelectItem value="bar">Bar & Nightlife</SelectItem>
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
                                    Refine your search for places.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="grid gap-6 py-6">
                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Price Range</h3>
                                    <div className="px-1">
                                        <Slider
                                            defaultValue={[1, 4]}
                                            max={4}
                                            min={1}
                                            step={1}
                                            value={priceRange}
                                            onValueChange={handlePriceRangeChange}
                                        />
                                        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                                            <span>{formatPriceFilter(priceRange[0])}</span>
                                            <span>to</span>
                                            <span>{formatPriceFilter(priceRange[1])}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-medium">Distance</h3>
                                    <Select defaultValue="10">
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
                                    <h3 className="text-sm font-medium">Features</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature-wifi" />
                                            <Label htmlFor="feature-wifi">Free Wi-Fi</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature-reservations" />
                                            <Label htmlFor="feature-reservations">Takes Reservations</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature-outdoor" />
                                            <Label htmlFor="feature-outdoor">Outdoor Seating</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature-parking" />
                                            <Label htmlFor="feature-parking">Parking Available</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature-delivery" />
                                            <Label htmlFor="feature-delivery">Delivery</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="feature-takeout" />
                                            <Label htmlFor="feature-takeout">Takeout</Label>
                                        </div>
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
                    <TabsTrigger value="all">All Places</TabsTrigger>
                    <TabsTrigger value="saved">Saved</TabsTrigger>
                    <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allPlaces.map((place) => (
                            <Card key={place.id} className="card-hover overflow-hidden">
                                <div className="relative h-40 w-full">
                                    <Image
                                        src={place.image}
                                        alt={place.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/50 backdrop-blur-sm">
                                            <Heart className={`h-4 w-4 ${place.isLiked ? 'text-rose-500 fill-rose-500' : ''}`} />
                                        </Button>
                                    </div>
                                </div>
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{place.name}</CardTitle>
                                            <CardDescription>{place.category} • {place.price}</CardDescription>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="ml-1 font-medium text-sm">{place.rating}</span>
                                            <span className="ml-1 text-xs text-muted-foreground">({place.reviewCount})</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                        {place.description}
                                    </p>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="mr-1 h-4 w-4" />
                                        <span>{place.location}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                    <div className="flex flex-wrap gap-1">
                                        {place.tags.slice(0, 2).map((tag, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                        {place.tags.length > 2 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{place.tags.length - 2} more
                                            </Badge>
                                        )}
                                    </div>
                                    <Link href={`/places/${place.id}`}>
                                        <Button size="sm" variant="outline">Details</Button>
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

                <TabsContent value="saved" className="space-y-6">
                    {savedPlaces.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedPlaces.map((place) => (
                                <Card key={place.id} className="card-hover overflow-hidden">
                                    <div className="relative h-40 w-full">
                                        <Image
                                            src={place.image}
                                            alt={place.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/50 backdrop-blur-sm">
                                                <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{place.name}</CardTitle>
                                                <CardDescription>{place.category} • {place.price}</CardDescription>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="text-amber-400 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="ml-1 font-medium text-sm">{place.rating}</span>
                                                <span className="ml-1 text-xs text-muted-foreground">({place.reviewCount})</span>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {place.description}
                                        </p>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <MapPin className="mr-1 h-4 w-4" />
                                            <span>{place.location}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                        <div className="flex flex-wrap gap-1">
                                            {place.tags.slice(0, 2).map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Link href={`/places/${place.id}`}>
                                            <Button size="sm" variant="outline">Details</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Saved Places Yet</h3>
                            <p className="text-muted-foreground mb-6">
                                You haven't saved any places yet. Click the heart icon on places you like to save them for later.
                            </p>
                            <Button asChild>
                                <Link href="/places?tab=all">
                                    Explore Places
                                </Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="reviewed" className="space-y-6">
                    <div className="text-center py-12">
                        <Coffee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Reviews Yet</h3>
                        <p className="text-muted-foreground mb-6">
                            You haven't reviewed any places yet. Visit a place and share your experience to help others.
                        </p>
                        <Button asChild>
                            <Link href="/places?tab=all">
                                Find Places to Review
                            </Link>
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
