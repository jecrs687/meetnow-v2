"use client"
import { APIProvider, AdvancedMarker, Map, Marker, Pin, } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { MarkerWithInfowindow } from './container/PinInfo';
import { MapCarousel } from './container/MapCarousel';
import styles from './index.module.scss'
import { set } from 'date-fns';
import { getUser } from '@backend/repository/user';
import { distanceCal } from '@utils/distanceCalc';
import LoaderSpinner from '@core/LoaderSpinner';
import { useGeoLocation } from '@store/useGeoLocation';
import { getPlaces } from '@actions/places';
import Loading from 'src/app/loading';
import { Loader } from '@core/Loader';


export default function Page() {
    const {
        location
    } = useGeoLocation()
    const [places, setPlaces] = useState<
        Awaited<ReturnType<typeof getPlaces>>
    >([])
    const [active, setActive] = useState<string>()
    const [position, setPosition] = useState({
        lat: 0,
        lng: 0
    })
    const [zoom, setZoom] = useState(20)
    const [user, setUser] = useState<
        Awaited<ReturnType<typeof getUser>>
    >(null)
    useEffect(() => {
        getPlaces().then(setPlaces)
        getUser().then(setUser).catch(console.error)
    }, [])

    const navigateLatLng = (
        {
            current,
            target,
            initial
        }
    ) => {
        const { lat: latInitial, lng: lngInitial } = initial
        const { lat: latTarget, lng: lngTarget } = target
        let { lat, lng } = current
        if (lat < latTarget)
            lat = lat + 0.005
        if (lng < lngTarget)
            lng = lng + 0.005

        // const difference = Math.abs(lat - latTarget) + Math.abs(lng - lngTarget)
        // const initialDifference = Math.abs(latInitial - latTarget) + Math.abs(lngInitial - lngTarget)
        // const isOutZoom = difference > initialDifference / 2
        // const distance = Math.abs(difference - (initialDifference / 2))
        // const zoomStep = Math.round(distance * 50)
        // const zoomApplied = isOutZoom ? zoom + zoomStep : zoom - zoomStep
        // const currentZoom = Math.min(15, Math.max(6, zoomApplied))
        // setZoom(currentZoom)

        setPosition({ lat, lng })

        if (lat < latTarget || lng < lngTarget) {
            setTimeout(() => {
                navigateLatLng({ current: { lat, lng }, target, initial })
            }, 100)
        } else {
            setPosition({ lat: latTarget, lng: lngTarget })
        }

    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!places.length) return
        const placeActive = places.find(place => place.id === active)?.address
            || places[0].address
        navigateLatLng({
            current: position,
            target: placeActive,
            initial: position
        }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active])
    useEffect(() => {
        if (!places.length) return
        setActive(places[0].id)
        setPosition(places[0].address)
    }, [places])
    if (!places.length || !user) return <Loader />
    const windowHeight = window.innerHeight
    return <div className={styles.container}>
        <APIProvider apiKey='AIzaSyAnaF6_gvSaYf9qCpHsViyM_-3LJPcB7Bc' libraries={['marker']}>
            <Map
                style={{ width: '100vw', height: '100vh' }}
                defaultZoom={17}
                disableDefaultUI
                zoom={zoom}
                gestureHandling={'greedy'}
                mapId='3fb975962afb9410'
                onZoomChanged={(e) => {
                    setZoom(e.map.getZoom())
                }}
                minZoom={6}
                {...(active) ? {
                    center: {
                        lat: position.lat - 0.000005 * windowHeight / zoom,
                        lng: position.lng
                    }
                } : {
                    center: location
                }}
            >
                {
                    places.map((place) => {
                        return <MarkerWithInfowindow
                            distance={distanceCal(user.address, place.address)}
                            place={place}
                            key={place.id}
                            setActive={setActive}
                            currentActive={active}
                        />
                    })
                }
            </Map>
            <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 100, width: '100dvw' }}>
                <MapCarousel
                    places={places}
                    selectActive={(id) => setActive(id)}
                    currentActive={active}
                    userAddress={user.address}
                />
            </div>
        </APIProvider>
    </div>
}