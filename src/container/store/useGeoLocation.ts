import { storage } from '@utils/storage';
import { create } from 'zustand';

type GeoLocationProps = {
    location?: {
        lat: number,
        lng: number
    },

    setLocation: (lat: number, lng: number) => void
}

export const useGeoLocation = create<GeoLocationProps>((set) => ({
    location: storage().get('location'),
    setLocation: (lat: number, lng: number) => {
        set({
            location: {
                lat,
                lng
            }
        })
        storage().set('location', {
            lat,
            lng
        })
    }
}));