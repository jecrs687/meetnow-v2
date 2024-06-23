"use client";
import { useCallback, useEffect, useState } from "react"
import { useGeoLocation } from "../store/useGeoLocation"
import { set } from "date-fns"
import { setUserPosition } from "@backend/repository/user";



export const LocationService = () => {

    const { setLocation } = useGeoLocation()
    const [error, setError] = useState<string | null>(null)

    const onChange = useCallback(({ coords }) => {
        setLocation(coords.latitude, coords.longitude)
        setUserPosition(coords.latitude, coords.longitude)
        console.log(JSON.stringify(coords, null, 5))
    }, [setLocation])

    const onError = (error: GeolocationPositionError) => {
        setError(error.message)
    }

    useEffect(() => {
        const geo = navigator.geolocation
        if (!geo) {
            setError('Geolocation is not supported')
            return
        }
        const watcher = geo.watchPosition(onChange, onError)
        return () => geo.clearWatch(watcher)
    }, [onChange])

    return null;
}