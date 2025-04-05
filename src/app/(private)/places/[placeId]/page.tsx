"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@core/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@core/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@core/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@core/avatar";
import { Badge } from "@core/badge";
import { Separator } from "@core/separator";
import { Textarea } from "@core/textarea";
import {
    ArrowLeft,
    Calendar,
    CalendarPlus,
    Clock,
    Coffee,
    DollarSign,
    ExternalLink,
    Globe,
    Heart,
    Info,
    Loader2,
    MapPin,
    MessageSquare,
    Phone,
    Share2,
    Star,
    User,
    Users,
    Utensils,
    Wifi
} from "lucide-react";
import Map from "@common/maps/map";

export default function PlaceDetailPage() {
    const params = useParams();
    const placeId = params.placeId as string;
    const [isLiked, setIsLiked] = useState(true);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    // This would be replaced with a server action call to get place details
    const placeData = {
        id: placeId,
        name: "Artisan Coffee Co.",
        description: "Trendy café with specialty coffee, pastries, and comfortable workspaces. Our baristas are trained to create the perfect cup of coffee tailored to your taste. We source our beans ethically and directly from farmers, ensuring the highest quality brews while supporting sustainable farming practices. Our cozy atmosphere includes free Wi-Fi, plenty of outlets, and comfortable seating for individuals and small groups.",
        category: "Café",
        price: "$$",
        rating: 4.8,
        reviewCount: 128,
        openHours: "Monday - Friday: 7:00 AM - 8:00 PM\nSaturday - Sunday: 8:00 AM - 6:00 PM",
        location: {
            address: "123 Main Street, Downtown",
            city: "San Francisco",
            state: "CA",
            coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        contact: {
            phone: "(415) 555-1234",
            website: "https://artisancoffee.example.com",
            social: {
                instagram: "artisancoffeeco",
                twitter: "artisancoffeeco"
            }
        },
        features: [
            "Free Wi-Fi",
            "Power Outlets",
            "Outdoor Seating",
            "Wheelchair Accessible",
            "Vegan Options",
            "Gluten-Free Options"
        ],
        photos: [
            "/images/place-coffee.jpg",
            "/images/place-coffee-2.jpg",
            "/images/place-coffee-3.jpg",
            "/images/place-coffee-4.jpg"
        ],
        popularTimes: {
            monday: [10, 20, 40, 70, 85, 60, 30, 15],
            tuesday: [15, 25, 45, 75, 80, 55, 35, 10],
            wednesday: [20, 30, 50, 80, 75, 50, 30, 5],
            thursday: [25, 35, 55, 85, 70, 45, 25, 5],
            friday: [30, 40, 60, 90, 65, 40, 50, 60],
            saturday: [40, 60, 80, 90, 85, 70, 60, 40],
            sunday: [35, 55, 75, 80, 70, 60, 40, 20]
        }
    };

    // Mock reviews
    const reviews = [
        {
            id: "review1",
            user: {
                id: "user1",
                name: "Alex Smith",
                avatar: "/images/avatar-1.png"
            },
            rating: 5,
            comment: "Best coffee in town! The atmosphere is perfect for both working and socializing. The staff is knowledgeable and friendly.",
            date: "2 weeks ago",
            likes: 12
        },
        {
            id: "review2",
            user: {
                id: "user2",
                name: "Jamie Davis",
                avatar: "/images/avatar-2.png"
            },
            rating: 4,
            comment: "Great place to work remotely. Plenty of outlets and the Wi-Fi is reliable. The pastries are delicious too!",
            date: "1 month ago",
            likes: 8
        },
        {
            id: "review3",
            user: {
                id: "user3",
                name: "Riley Jordan",
                avatar: "/images/avatar-3.png"
            },
            rating: 5,
            comment: "Amazing specialty drinks! The lavender latte is to die for. A bit pricey but worth it for the quality.",
            date: "2 months ago",
            likes: 15
        }
    ];

    // Mock upcoming events at this place
    const upcomingEvents = [
        {
            id: "event1",
            title: "Coffee Tasting Workshop",
            date: "May 10, 2023",
            time: "6:00 PM",
            attendees: 12,
            image: "/images/event-coffee.jpg"
        },
        {
            id: "event2",
            title: "Digital Nomad Meetup",
            date: "May 17, 2023",
            time: "5:30 PM",
            attendees: 8,
            image: "/images/event-nomad.jpg"
        }
    ];

    const handleLikeToggle = () => {
        // This would be replaced with a server action call to like/unlike the place
        setIsLiked(!isLiked);
    };

    const handleSubmitReview = async () => {
        if (reviewRating === 0) {
            alert("Please select a rating");
            return;
        }

        if (!reviewText.trim()) {
            alert("Please write a review");
            return;
        }

        setIsSubmittingReview(true);

        try {
            // This would be replaced with a server action call to submit the review
            console.log("Review data:", { placeId, rating: reviewRating, text: reviewText });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Reset form
            setReviewText("");
            setReviewRating(0);

            // Show success message or add review to the list
            alert("Review submitted successfully!");
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Failed to submit review. Please try again.");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/places">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {placeData.name}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={isLiked ? "default" : "outline"}
                        onClick={handleLikeToggle}
                    >
                        <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                        {isLiked ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeData.name + ' ' + placeData.location.address)}`} target="_blank">
                            <MapPin className="mr-2 h-4 w-4" />
                            Directions
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Place Images */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative h-80 rounded-tl-lg rounded-bl-lg overflow-hidden">
                            <Image
                                src={placeData.photos[0]}
                                alt={placeData.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {placeData.photos.slice(1, 5).map((photo, index) => (
                                <div
                                    key={index}
                                    className={`relative h-[155px] overflow-hidden ${index === 0 ? "rounded-tr-lg" :
                                        index === 3 ? "rounded-br-lg" : ""
                                        }`}
                                >
                                    <Image
                                        src={photo}
                                        alt={`${placeData.name} ${index + 2}`}
                                        fill
                                        className="object-cover"
                                    />
                                    {index === 3 && placeData.photos.length > 5 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Button variant="secondary">
                                                +{placeData.photos.length - 5} more
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rating & Category */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center">
                            <div className="flex mr-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-5 w-5 ${star <= Math.round(placeData.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                                    />
                                ))}
                            </div>
                            <span className="font-medium">{placeData.rating}</span>
                            <span className="text-muted-foreground ml-1">({placeData.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="flex items-center">
                                <Coffee className="mr-1 h-3 w-3" />
                                {placeData.category}
                            </Badge>
                            <Badge variant="outline">{placeData.price}</Badge>
                        </div>
                    </div>

                    {/* Place Info Tabs */}
                    <Tabs defaultValue="about" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="about">About</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            <TabsTrigger value="events">Events</TabsTrigger>
                        </TabsList>

                        <TabsContent value="about" className="space-y-6 py-4">
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">About</h2>
                                <p className="text-muted-foreground">
                                    {placeData.description}
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Features</h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {placeData.features.map((feature) => (
                                        <div key={feature} className="flex items-center">
                                            <div className="rounded-full bg-primary/10 p-1 mr-2">
                                                {feature.includes("Wi-Fi") ? (
                                                    <Wifi className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <Coffee className="h-4 w-4 text-primary" />
                                                )}
                                            </div>
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Hours</h2>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {placeData.openHours}
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Popular Times</h2>
                                <div className="h-40 bg-muted/30 rounded-md p-4">
                                    <div className="flex h-full items-end justify-between gap-1">
                                        {placeData.popularTimes.monday.map((value, index) => (
                                            <div
                                                key={index}
                                                className="bg-primary/70 w-full"
                                                style={{ height: `${value}%` }}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                        <span>8AM</span>
                                        <span>10AM</span>
                                        <span>12PM</span>
                                        <span>2PM</span>
                                        <span>4PM</span>
                                        <span>6PM</span>
                                        <span>8PM</span>
                                        <span>10PM</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground text-center">
                                    Popular times for Monday
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Contact</h2>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{placeData.location.address}, {placeData.location.city}, {placeData.location.state}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{placeData.contact.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <a
                                            href={placeData.contact.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            {placeData.contact.website.replace("https://", "")}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews" className="space-y-6 py-4">
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                    <h2 className="text-xl font-semibold">Reviews</h2>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-2xl font-bold">{placeData.rating}</span>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-5 w-5 ${star <= Math.round(placeData.rating)
                                                        ? "text-amber-400 fill-amber-400"
                                                        : "text-muted"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-muted-foreground ml-1">({placeData.reviewCount})</span>
                                    </div>
                                </div>

                                {/* Write a review */}
                                <Card className="border-dashed">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-center">
                                                <div className="flex space-x-1">
                                                    {[1, 2, 3, 4, 5].map((rating) => (
                                                        <button
                                                            key={rating}
                                                            type="button"
                                                            className="focus:outline-none"
                                                            onClick={() => setReviewRating(rating)}
                                                            onMouseEnter={() => setHoveredRating(rating)}
                                                            onMouseLeave={() => setHoveredRating(0)}
                                                        >
                                                            <Star
                                                                className={`h-8 w-8 transition-colors ${rating <= (hoveredRating || reviewRating)
                                                                    ? "text-amber-400 fill-amber-400"
                                                                    : "text-muted"
                                                                    }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <Textarea
                                                placeholder="Share your experience at this place..."
                                                rows={4}
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                className="w-full"
                                            />
                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={handleSubmitReview}
                                                    disabled={isSubmittingReview}
                                                >
                                                    {isSubmittingReview && (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    )}
                                                    Submit Review
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Reviews list */}
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <Card key={review.id}>
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage src={review.user.avatar} />
                                                            <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{review.user.name}</div>
                                                            <div className="text-xs text-muted-foreground">{review.date}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-4 w-4 ${star <= review.rating
                                                                    ? "text-amber-400 fill-amber-400"
                                                                    : "text-gray-300"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="mt-4">{review.comment}</p>
                                                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                                                    <button className="flex items-center hover:text-foreground">
                                                        <Heart className="h-4 w-4 mr-1" />
                                                        <span>Helpful ({review.likes})</span>
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <div className="flex justify-center">
                                    <Button variant="outline">
                                        View All {placeData.reviewCount} Reviews
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="events" className="space-y-6 py-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                                <Link href={`/events/create?placeId=${placeId}`}>
                                    <Button size="sm">
                                        <CalendarPlus className="mr-2 h-4 w-4" />
                                        Create Event Here
                                    </Button>
                                </Link>
                            </div>

                            {upcomingEvents.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingEvents.map((event) => (
                                        <Card key={event.id} className="card-hover">
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="relative h-40 sm:h-auto sm:w-40 flex-shrink-0">
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
                                                        <User className="mr-1 h-4 w-4" />
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
                                <div className="text-center py-12 bg-muted/30 rounded-lg">
                                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
                                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                        There are no events scheduled at this place. Why not be the first to organize one?
                                    </p>
                                    <Link href={`/events/create?placeId=${placeId}`}>
                                        <Button>
                                            <CalendarPlus className="mr-2 h-4 w-4" />
                                            Create Event
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    {/* Map Card */}
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-lg">Location</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-hidden rounded-b-lg">
                            <div className="h-[250px] w-full relative">
                                <Map
                                    center={placeData.location.coordinates}
                                    zoom={14}
                                    markers={[
                                        {
                                            position: placeData.location.coordinates,
                                            title: placeData.name
                                        }
                                    ]}
                                />
                            </div>
                            <div className="p-4">
                                <p className="text-sm">
                                    {placeData.location.address}, {placeData.location.city}, {placeData.location.state}
                                </p>
                                <div className="flex gap-2 mt-3">
                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeData.name + ' ' + placeData.location.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <MapPin className="mr-2 h-4 w-4" />
                                            Directions
                                        </a>
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1" asChild>
                                        <a
                                            href={`tel:${placeData.contact.phone.replace(/[^0-9]/g, "")}`}
                                        >
                                            <Phone className="mr-2 h-4 w-4" />
                                            Call
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Create Event Card */}
                    <Card>
                        <CardHeader className="p-4">
                            <CardTitle className="text-lg">Planning a meetup?</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm text-muted-foreground mb-4">
                                This is a popular spot for meetups. Create an event and invite others to join you.
                            </p>
                            <Button className="w-full" asChild>
                                <Link href={`/events/create?placeId=${placeId}`}>
                                    <CalendarPlus className="mr-2 h-4 w-4" />
                                    Create Event Here
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events Card */}
                    {upcomingEvents.length > 0 && (
                        <Card>
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-lg">Upcoming Events</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    {upcomingEvents.map((event) => (
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
                            <CardFooter className="p-4 pt-0">
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={`/places/${placeId}?tab=events`}>
                                        View All Events
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Similar Places Card */}
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-lg">Similar Places</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src="/images/place-coffee-2.jpg"
                                            alt="Brew Lab Coffee"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Link href="/places/brew-lab-coffee" className="font-medium hover:underline">
                                            Brew Lab Coffee
                                        </Link>
                                        <div className="flex items-center mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-3 w-3 ${star <= 4 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                                                />
                                            ))}
                                            <span className="text-xs text-muted-foreground ml-1">(86)</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Café • $$ • 1.8 miles away
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                        <Image
                                            src="/images/place-coffee-3.jpg"
                                            alt="Roasters Guild"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Link href="/places/roasters-guild" className="font-medium hover:underline">
                                            Roasters Guild
                                        </Link>
                                        <div className="flex items-center mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-3 w-3 ${star <= 5 ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                                                />
                                            ))}
                                            <span className="text-xs text-muted-foreground ml-1">(54)</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Café • $$$ • 2.4 miles away
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/places?category=cafe">
                                    Find More Cafés
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
