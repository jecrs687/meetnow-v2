"use client"
import { APIProvider, AdvancedMarker, Map, Marker, Pin, } from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useState } from 'react';
import { MarkerWithInfoWindow } from './container/PinInfo';
import { MapCarousel } from './container/MapCarousel';
import styles from './index.module.scss'
import { set } from 'date-fns';
import { getUser } from '@backend/repository/user';
import { distanceCal } from '@utils/distanceCalc';
import LoaderSpinner from '@core/LoaderSpinner';
import { useGeoLocation } from '@store/useGeoLocation';
import { getPlaces } from '@backend/actions/places.action';
import Loading from 'src/app/loading';
import { Loader } from '@core/Loader';
import { useMapLocation } from '@store/useMapLocation';


export default function Page() {
    const {
        location
    } = useGeoLocation()
    const {
        setPositionSmoothly,
        position,
        setPosition
    } = useMapLocation()
    const [places, setPlaces] = useState<
        Awaited<ReturnType<typeof getPlaces>>
    >([])
    const [active, setActive] = useState<string>()

    const [zoom, setZoom] = useState(15)
    const [user, setUser] = useState<
        Awaited<ReturnType<typeof getUser>>
    >(null)
    const [isLoading, setIsLoading] = useState(true)
    const loadData = useCallback(async () => {
        const [places, user] = await Promise.all([
            getPlaces({ ...position, zoom }),
            getUser()
        ])
        setPlaces(places)
        setUser(user)
        setIsLoading(false)
    }, [position, zoom])
    useEffect(() => {
        const interval = setTimeout(loadData, 600)
        return () => clearTimeout(interval)
    }, [loadData])
    useEffect(() => {
        if (!places.length) return
        const placeActive = places.find(place => place.id === active)?.address
            || places[0].address
        setPositionSmoothly(placeActive.lat, placeActive.lng)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active])
    useEffect(() => {
        if (!places.length) return
        setActive(places[0].id)
        setPosition(places[0].address.lat, places[0].address.lng)
    }, [places])
    // const Markers = useCallback(() => {}, [active, places, user?.address])
    const Carousel = useCallback(() => {
        return <MapCarousel
            places={places}
            selectActive={(id) => setActive(id)}
            currentActive={active}
            userAddress={user.address}
        />
    }, [places, active, user?.address])
    if (isLoading || !user) return <Loader />
    const windowHeight = window.innerHeight
    return <div className={styles.container}>
        <APIProvider apiKey='AIzaSyAnaF6_gvSaYf9qCpHsViyM_-3LJPcB7Bc' libraries={['marker']}>
            <Map
                style={{ width: '100vw', height: '100vh' }}
                defaultZoom={14}
                disableDefaultUI
                zoom={zoom}
                gestureHandling={'greedy'}
                mapId='3fb975962afb9410'
                minZoom={3}
                onZoomChanged={(e) => {
                    setZoom(e.map.getZoom())
                }}
                onCenterChanged={(e) => {
                    const { lat, lng } = e.map.getCenter().toJSON()
                    setPosition(lat, lng)
                }}
                onCameraChanged={(e) => {
                    const { lat, lng } = e.map.getCenter().toJSON()
                    setPosition(lat, lng)
                }}
                {...(active) ? {
                    center: {
                        lat: position.lat - 0.000005 * windowHeight / zoom,
                        lng: position.lng
                    }
                } : {
                    center: position?.lat ? position : location
                }}
            >
                {places.map((place) => {
                    return <MarkerWithInfoWindow
                        distance={distanceCal(user.address, place.address)}
                        place={place}
                        key={place.id}
                        setActive={setActive}
                        currentActive={active}
                    />
                })}
            </Map>
            <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 100, width: '100dvw' }}>
                <Carousel />
            </div>
        </APIProvider>
    </div >
}