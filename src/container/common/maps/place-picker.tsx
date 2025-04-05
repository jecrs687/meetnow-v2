"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@core/button";
import { Input } from "@core/input";
import { MapPin, Search, X } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";

interface Place {
    id: string;
    name: string;
    address: string;
}

interface PlacePickerProps {
    onPlaceSelect: (place: Place) => void;
    selectedPlace?: Place;
    placeholder?: string;
}

export const PlacePicker = ({
    onPlaceSelect,
    selectedPlace,
    placeholder = "Search for a place...",
}: PlacePickerProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    const placesService = useRef<google.maps.places.PlacesService | null>(null);

    // Initialize Google Maps services
    useEffect(() => {
        // For demo purposes, we're using a placeholder; in a real app,
        // this would be a real API key or environment variable
        const apiKey = "GOOGLE_MAPS_API_KEY";

        const loader = new Loader({
            apiKey,
            version: "weekly",
            libraries: ["places"],
        });

        loader
            .load()
            .then(() => {
                autocompleteService.current = new google.maps.places.AutocompleteService();

                // PlacesService requires a DOM element, so we create a dummy element
                const dummyElement = document.createElement("div");
                placesService.current = new google.maps.places.PlacesService(dummyElement);
            })
            .catch((error) => {
                console.error("Error loading Google Maps:", error);
            });
    }, []);

    // Handle clicks outside of the suggestions dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Update search query when selectedPlace changes
    useEffect(() => {
        if (selectedPlace) {
            setSearchQuery(selectedPlace.name);
        }
    }, [selectedPlace]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        if (autocompleteService.current) {
            setIsLoading(true);

            autocompleteService.current.getPlacePredictions(
                {
                    input: query,
                    types: ["establishment", "geocode"],
                },
                (predictions, status) => {
                    setIsLoading(false);

                    if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
                        setSuggestions([]);
                        return;
                    }

                    const places = predictions.map((prediction) => ({
                        id: prediction.place_id,
                        name: prediction.structured_formatting.main_text,
                        address: prediction.structured_formatting.secondary_text || "",
                    }));

                    setSuggestions(places);
                    setShowSuggestions(true);
                }
            );
        }
    };

    const handleSelectPlace = (place: Place) => {
        setSearchQuery(place.name);
        setShowSuggestions(false);
        onPlaceSelect(place);

        // Get additional details from Places API
        if (placesService.current) {
            placesService.current.getDetails(
                {
                    placeId: place.id,
                    fields: ["formatted_address", "geometry"],
                },
                (result, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                        onPlaceSelect({
                            id: place.id,
                            name: place.name,
                            address: result.formatted_address || place.address,
                        });
                    }
                }
            );
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSuggestions([]);
        onPlaceSelect({ id: "", name: "", address: "" });
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="space-y-2" ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
                    className="pl-10 pr-10"
                />
                {searchQuery && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full w-10"
                        onClick={clearSearch}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}

                {/* Suggestions dropdown */}
                {showSuggestions && (
                    <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-md overflow-hidden">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                Loading...
                            </div>
                        ) : suggestions.length > 0 ? (
                            <ul>
                                {suggestions.map((place) => (
                                    <li
                                        key={place.id}
                                        className="hover:bg-muted cursor-pointer"
                                        onClick={() => handleSelectPlace(place)}
                                    >
                                        <div className="p-3">
                                            <div className="font-medium">{place.name}</div>
                                            <div className="text-sm text-muted-foreground flex items-center">
                                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                                <span className="truncate">{place.address}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No results found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedPlace && selectedPlace.id && (
                <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 overflow-hidden">
                            <div className="font-medium truncate">{selectedPlace.name}</div>
                            <div className="text-sm text-muted-foreground truncate">{selectedPlace.address}</div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0 ml-2"
                            onClick={clearSearch}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
