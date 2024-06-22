"use client"
import { APIProvider, AdvancedMarker, Map, Marker, Pin, } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { getPlaces } from './actions';
import { MarkerWithInfowindow } from './container/PinInfo';
import { MapCarousel } from './container/MapCarousel';



export default function Page() {
    const [places, setPlaces] = useState<
        Awaited<ReturnType<typeof getPlaces>>
    >([])
    const [active, setActive] = useState<string>()
    useEffect(() => {
        getPlaces().then(setPlaces)
    }, [])
    if (!places.length) return (<div>Loading...</div>)
    const placeActive = places.find(place => place.id === active)?.address
        || places[0].address
    return <APIProvider apiKey='AIzaSyAnaF6_gvSaYf9qCpHsViyM_-3LJPcB7Bc'>
        <Map
            style={{ width: '100vw', height: '100vh' }}
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            minZoom={3}
            center={{
                lat: placeActive.lat,
                lng: placeActive.lng
            }}
        >
            {
                places.map((place) => {
                    return <MarkerWithInfowindow {...place} key={place.id} />
                })
            }
        </Map>
        <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 100 }}>
            <MapCarousel
                places={places}
                selectActive={(id) => setActive(id)}
                currentActive={active}
            />

        </div>
    </APIProvider>
}