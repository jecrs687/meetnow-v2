"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@core/button";
import { Input } from "@core/input";
import { Textarea } from "@core/textarea";
import { Label } from "@core/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@core/select";
import { RadioGroup, RadioGroupItem } from "@core/radio-group";
import { DatePicker } from "@core/date-picker";
import { TimePicker } from "@core/time-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@core/card";
import { Switch } from "@core/switch";
import { Alert, AlertDescription, AlertTitle } from "@core/alert";
import { ArrowLeft, Calendar, CalendarClock, ImagePlus, Loader2, MapPin, Pencil, X } from "lucide-react";
import { Separator } from "@core/separator";
import { Checkbox } from "@core/checkbox";
import { UploadButton } from "@core/upload-button";
import { PlacePicker } from "@common/maps/place-picker";

export default function CreateEventPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        startDate: undefined as Date | undefined,
        startTime: "",
        endDate: undefined as Date | undefined,
        endTime: "",
        placeId: "",
        placeName: "",
        placeAddress: "",
        visibility: "public",
        price: "free",
        ticketPrice: "",
        maxAttendees: "50",
        isFeatured: false,
        requireApproval: false,
        categories: [] as string[],
        allowChat: true,
        images: [] as { id: string, url: string }[],
        groupId: "",
        allowGuests: true,
        maxGuestsPerMember: "2",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleCategoryChange = (category: string, checked: boolean) => {
        if (checked) {
            setFormData((prev) => ({
                ...prev,
                categories: [...prev.categories, category]
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                categories: prev.categories.filter(c => c !== category)
            }));
        }
    };

    const handlePlaceSelect = (place: { id: string, name: string, address: string }) => {
        setFormData((prev) => ({
            ...prev,
            placeId: place.id,
            placeName: place.name,
            placeAddress: place.address
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // This would be replaced with a server action call to create the event
            console.log("Event data to submit:", formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            router.push("/events");
        } catch (error) {
            console.error("Failed to create event:", error);
            setIsSubmitting(false);
        }
    };

    const goToStep = (step: number) => {
        setActiveStep(step);
        window.scrollTo(0, 0);
    };

    const goToNextStep = () => {
        setActiveStep(prev => Math.min(prev + 1, 3));
        window.scrollTo(0, 0);
    };

    const goToPreviousStep = () => {
        setActiveStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-8">
                <Button variant="ghost" size="icon" asChild className="mr-2">
                    <Link href="/events">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Create a New Event
                </h1>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex justify-between">
                    <div className={`text-sm font-medium ${activeStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                        Basic Information
                    </div>
                    <div className={`text-sm font-medium ${activeStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                        Location & Time
                    </div>
                    <div className={`text-sm font-medium ${activeStep >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                        Settings & Publish
                    </div>
                </div>
                <div className="relative mt-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-between">
                        <div>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                1
                            </div>
                        </div>
                        <div>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                2
                            </div>
                        </div>
                        <div>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${activeStep >= 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                3
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Information */}
                {activeStep === 1 && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                                <CardDescription>
                                    Provide basic information about your event.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Event Title *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Give your event a clear, catchy title"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe what your event is about, what people can expect, etc."
                                        rows={5}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Categories *</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {["Dining", "Coffee", "Networking", "Tech", "Social", "Arts", "Outdoors", "Fitness", "Music"].map((category) => (
                                            <div key={category} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`category-${category}`}
                                                    checked={formData.categories.includes(category)}
                                                    onCheckedChange={(checked) =>
                                                        handleCategoryChange(category, checked as boolean)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`category-${category}`}
                                                    className="text-sm font-normal"
                                                >
                                                    {category}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Event Visibility</Label>
                                    <RadioGroup
                                        value={formData.visibility}
                                        onValueChange={(value) => handleSelectChange("visibility", value)}
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="public" id="visibility-public" />
                                            <Label htmlFor="visibility-public" className="font-normal">
                                                Public - Anyone can find and join
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="private" id="visibility-private" />
                                            <Label htmlFor="visibility-private" className="font-normal">
                                                Private - Only visible to invited people
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="group" id="visibility-group" />
                                            <Label htmlFor="visibility-group" className="font-normal">
                                                Group - Visible to group members only
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {formData.visibility === "group" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="groupId">Select Group</Label>
                                        <Select
                                            value={formData.groupId}
                                            onValueChange={(value) => handleSelectChange("groupId", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="group1">Coffee Enthusiasts</SelectItem>
                                                <SelectItem value="group2">Downtown Foodies</SelectItem>
                                                <SelectItem value="group3">Tech Meetup</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Event Images</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                            <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Upload your event cover image
                                            </p>
                                            <UploadButton />
                                        </div>
                                        {formData.images.length > 0 && (
                                            <div className="border rounded-lg p-2">
                                                <div className="relative h-40 w-full">
                                                    <img
                                                        src={formData.images[0].url}
                                                        alt="Event cover"
                                                        className="object-cover w-full h-full rounded-md"
                                                    />
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        className="absolute top-2 right-2 h-8 w-8"
                                                        type="button"
                                                        onClick={() => setFormData((prev) => ({ ...prev, images: [] }))}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button type="button" onClick={goToNextStep}>
                                Next Step
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Location & Time */}
                {activeStep === 2 && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Location & Time</CardTitle>
                                <CardDescription>
                                    Set the date, time and location for your event.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Date *</Label>
                                        <DatePicker
                                            selectedDate={formData.startDate}
                                            onSelect={(date) => setFormData((prev) => ({ ...prev, startDate: date }))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Start Time *</Label>
                                        <TimePicker
                                            value={formData.startTime}
                                            onChange={(time) => setFormData((prev) => ({ ...prev, startTime: time }))}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <DatePicker
                                            selectedDate={formData.endDate}
                                            onSelect={(date) => setFormData((prev) => ({ ...prev, endDate: date }))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Time</Label>
                                        <TimePicker
                                            value={formData.endTime}
                                            onChange={(time) => setFormData((prev) => ({ ...prev, endTime: time }))}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <RadioGroup
                                        value={formData.placeId ? "specific" : "online"}
                                        onValueChange={(value) => {
                                            if (value === "online") {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    placeId: "",
                                                    placeName: "Online Event",
                                                    placeAddress: "",
                                                }));
                                            }
                                        }}
                                        className="flex flex-col space-y-1"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="specific" id="location-specific" />
                                            <Label htmlFor="location-specific" className="font-normal">
                                                Specific Location
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="online" id="location-online" />
                                            <Label htmlFor="location-online" className="font-normal">
                                                Online Event
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {(!formData.placeId || formData.placeId === "specific") && (
                                    <div className="space-y-4">
                                        <PlacePicker
                                            onPlaceSelect={handlePlaceSelect}
                                            selectedPlace={
                                                formData.placeId
                                                    ? {
                                                        id: formData.placeId,
                                                        name: formData.placeName,
                                                        address: formData.placeAddress,
                                                    }
                                                    : undefined
                                            }
                                        />

                                        <div className="mt-4 space-y-2">
                                            <Label htmlFor="placeName">Venue Name</Label>
                                            <Input
                                                id="placeName"
                                                name="placeName"
                                                value={formData.placeName}
                                                onChange={handleInputChange}
                                                placeholder="e.g. City Park, Restaurant Name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="placeAddress">Address</Label>
                                            <Input
                                                id="placeAddress"
                                                name="placeAddress"
                                                value={formData.placeAddress}
                                                onChange={handleInputChange}
                                                placeholder="Full address"
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={goToPreviousStep}>
                                Previous Step
                            </Button>
                            <Button type="button" onClick={goToNextStep}>
                                Next Step
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Settings & Publish */}
                {activeStep === 3 && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Settings</CardTitle>
                                <CardDescription>
                                    Configure additional settings for your event.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="requireApproval" className="block mb-1">
                                                Require Approval
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Review and approve attendees before they can join
                                            </p>
                                        </div>
                                        <Switch
                                            id="requireApproval"
                                            checked={formData.requireApproval}
                                            onCheckedChange={(checked) =>
                                                handleSwitchChange("requireApproval", checked)
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="allowChat" className="block mb-1">
                                                Enable Discussion
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Allow attendees to chat and discuss the event
                                            </p>
                                        </div>
                                        <Switch
                                            id="allowChat"
                                            checked={formData.allowChat}
                                            onCheckedChange={(checked) =>
                                                handleSwitchChange("allowChat", checked)
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="allowGuests" className="block mb-1">
                                                Allow Guests
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Attendees can bring guests to the event
                                            </p>
                                        </div>
                                        <Switch
                                            id="allowGuests"
                                            checked={formData.allowGuests}
                                            onCheckedChange={(checked) =>
                                                handleSwitchChange("allowGuests", checked)
                                            }
                                        />
                                    </div>

                                    {formData.allowGuests && (
                                        <div className="space-y-2 ml-6 mt-2">
                                            <Label htmlFor="maxGuestsPerMember">Maximum Guests Per Attendee</Label>
                                            <Select
                                                value={formData.maxGuestsPerMember}
                                                onValueChange={(value) =>
                                                    handleSelectChange("maxGuestsPerMember", value)
                                                }
                                            >
                                                <SelectTrigger className="w-full md:w-40">
                                                    <SelectValue placeholder="Select max" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">1 guest</SelectItem>
                                                    <SelectItem value="2">2 guests</SelectItem>
                                                    <SelectItem value="3">3 guests</SelectItem>
                                                    <SelectItem value="5">5 guests</SelectItem>
                                                    <SelectItem value="10">10 guests</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label htmlFor="price">Event Price</Label>
                                        <RadioGroup
                                            value={formData.price}
                                            onValueChange={(value) => handleSelectChange("price", value)}
                                            className="flex flex-col space-y-1"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="free" id="price-free" />
                                                <Label htmlFor="price-free" className="font-normal">
                                                    Free Event
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="paid" id="price-paid" />
                                                <Label htmlFor="price-paid" className="font-normal">
                                                    Paid Event
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {formData.price === "paid" && (
                                        <div className="space-y-2 ml-6">
                                            <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                                            <Input
                                                id="ticketPrice"
                                                name="ticketPrice"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.ticketPrice}
                                                onChange={handleInputChange}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                                        <Input
                                            id="maxAttendees"
                                            name="maxAttendees"
                                            type="number"
                                            min="1"
                                            value={formData.maxAttendees}
                                            onChange={handleInputChange}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Leave empty for unlimited attendees
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Alert>
                            <CalendarClock className="h-4 w-4" />
                            <AlertTitle>Ready to create your event?</AlertTitle>
                            <AlertDescription>
                                Your event will be reviewed before being published. Make sure all information is correct.
                            </AlertDescription>
                        </Alert>

                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={goToPreviousStep}>
                                Previous Step
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Event
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
