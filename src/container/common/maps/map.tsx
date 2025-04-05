"use client";

import { useState, useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type Coordinates = {
    lat: number;
    lng: number;
};

type Marker = {
    position: Coordinates;
    title: string;
};

interface MapProps {
    center: Coordinates;
    zoom?: number;
    markers?: Marker[];
    height?: string;
    width?: string;
    onMarkerClick?: (marker: Marker) => void;
    className?: string;
}

const Map = ({
    center,
    zoom = 12,
    markers = [],
    height = "100%",
    width = "100%",
    onMarkerClick,
    className = "",
}: MapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const [googleMarkers, setGoogleMarkers] = useState<google.maps.Marker[]>([]);

    useEffect(() => {
        // For demo purposes, we're using a placeholder; in a real app,
        // this would be a real API key or environment variable
        const apiKey = "GOOGLE_MAPS_API_KEY";

        const loader = new Loader({
            apiKey,
            version: "weekly",
            libraries: ["places"],
        });

        let map: google.maps.Map;

        loader
            .load()
            .then(() => {
                if (mapRef.current) {
                    map = new google.maps.Map(mapRef.current, {
                        center,
                        zoom,
                        disableDefaultUI: true,
                        zoomControl: true,
                        scrollwheel: false,
                        mapTypeControl: false,
                        streetViewControl: false,
                        styles: [
                            {
                                featureType: "poi",
                                elementType: "labels",
                                stylers: [{ visibility: "off" }],
                            },
                        ],
                    });

                    setMapInstance(map);
                }
            })
            .catch((error) => {
                console.error("Error loading Google Maps:", error);
            });

        return () => {
            // Clean up markers when component unmounts
            googleMarkers.forEach((marker) => {
                marker.setMap(null);
            });
        };
    }, []);

    useEffect(() => {
        // Update map center when center prop changes
        if (mapInstance) {
            mapInstance.setCenter(center);
        }
    }, [center, mapInstance]);

    useEffect(() => {
        // Update map zoom when zoom prop changes
        if (mapInstance) {
            mapInstance.setZoom(zoom);
        }
    }, [zoom, mapInstance]);

    useEffect(() => {
        // Add markers to the map
        if (mapInstance && markers.length > 0) {
            // Clear existing markers
            googleMarkers.forEach((marker) => {
                marker.setMap(null);
            });

            const newMarkers = markers.map((markerData) => {
                const marker = new google.maps.Marker({
                    position: markerData.position,
                    map: mapInstance,
                    title: markerData.title,
                    animation: google.maps.Animation.DROP,
                });

                if (onMarkerClick) {
                    marker.addListener("click", () => {
                        onMarkerClick(markerData);
                    });
                }

                return marker;
            });

            setGoogleMarkers(newMarkers);
        }
    }, [markers, mapInstance, onMarkerClick]);

    return (
        <div
            ref={mapRef}
            style={{ height, width }}
            className={`map-container ${className}`}
        />
    );
};

export default Map;
