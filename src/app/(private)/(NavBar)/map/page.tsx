"use client"
import { APIProvider, Map, Marker, } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { getPlaces } from './actions';



export default function Page() {
    const [places, setPlaces] = useState<
        Awaited<ReturnType<typeof getPlaces>>
    >([])
    useEffect(() => {
        getPlaces().then(setPlaces)
    }, [])
    return <APIProvider apiKey='AIzaSyAnaF6_gvSaYf9qCpHsViyM_-3LJPcB7Bc'>
        <Map
            style={{ width: '100vw', height: '100vh' }}
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
        >
            {
                places.map((place) => {
                    return <Marker
                        key={place.id}
                        title={place.name}
                        visible={true}
                        position={{
                            lat: place.address.lat,
                            lng: place.address.lng
                        }}
                    />
                })
            }
        </Map>
    </APIProvider>
}