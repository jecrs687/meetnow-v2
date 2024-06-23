"use client"
import { APIProvider, AdvancedMarker, Map, Marker, Pin, } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { getPlaces } from './actions';
import { MarkerWithInfowindow } from './container/PinInfo';
import { MapCarousel } from './container/MapCarousel';
import styles from './index.module.scss'


export default function Page() {
    const [places, setPlaces] = useState<
        Awaited<ReturnType<typeof getPlaces>>
    >([])
    const [active, setActive] = useState<string>()
    const [position, setPosition] = useState({
        lat: 0,
        lng: 0
    })
    useEffect(() => {
        getPlaces().then(setPlaces)
    }, [])
    const navigateLatLng = (
        lat,
        lng,
        latTarget,
        lngTarget
    ) => {
        if (lat < latTarget)
            lat = lat + 1
        if (lng < lngTarget)
            lng = lng + 1
        setPosition({ lat, lng })

        if (lat < latTarget || lng < lngTarget) {
            setTimeout(() => {
                navigateLatLng(lat, lng, latTarget, lngTarget)
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
        navigateLatLng(
            position.lat,
            position.lng,
            placeActive.lat,
            placeActive.lng
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active])
    if (!places.length) return (<div>Loading...</div>)

    return <div className={styles.container}>
        <APIProvider apiKey='AIzaSyAnaF6_gvSaYf9qCpHsViyM_-3LJPcB7Bc'>
            <Map
                style={{ width: '100vw', height: '100vh' }}
                defaultCenter={{
                    lat: places[0].address.lat,
                    lng: places[0].address.lng
                }}
                defaultZoom={15}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                minZoom={6}
                {...(active) ? { center: position } : {}}
            >
                {
                    places.map((place) => {
                        return <MarkerWithInfowindow {...place} key={place.id} />
                    })
                }
            </Map>
            <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 100, width: '100dvw' }}>
                <MapCarousel
                    places={places}
                    selectActive={(id) => setActive(id)}
                    currentActive={active}
                />
            </div>
        </APIProvider>
    </div>
}