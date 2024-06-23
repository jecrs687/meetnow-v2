import { create } from 'zustand';

type GeoLocationProps = {
    location?: {
        lat: number,
        lng: number
    },

    setLocation: (lat: number, lng: number) => void
}

export const useGeoLocation = create<GeoLocationProps>((set) => ({
    location: localStorage.getItem('location') ? JSON.parse(localStorage.getItem('location')) : null
    ,
    setLocation: (lat: number, lng: number) => {
        set({
            location: {
                lat,
                lng
            }
        })
        localStorage.setItem('location', JSON.stringify({
            lat,
            lng
        }))
    }
}));