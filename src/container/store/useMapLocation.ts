import { getUser } from '@backend/repository/user';
import { storage } from '@utils/storage';
import { create } from 'zustand';

type MapLocationProps = {
    position?: {
        lat: number,
        lng: number
    },
    setPosition: (lat: number, lng: number) => void,
    setPositionSmoothly: (lat: number, lng: number) => void
}

export const useMapLocation = create<MapLocationProps>((set, get) => ({
    position: storage().get('location'),
    setPositionToUser: async () => {
        const user = await getUser();
        set({
            position: {
                lat: user.address.lat,
                lng: user.address.lng
            }
        })
    },
    setPosition: (lat: number, lng: number) => {
        if (get().position.lat === lat && get().position.lng === lng) return
        set({
            position: {
                lat,
                lng
            }
        })
    },
    setPositionSmoothly: (latTarget: number, lngTarget: number) => {
        let { lat, lng } = get().position || { lat: 0, lng: 0 }
        const diference = Math.abs(lat - latTarget) + Math.abs(lng - lngTarget)
        console.log({ diference })
        if (Math.abs(lat - latTarget) > 0.0004)
            lat = lat + (latTarget - lat) / 3
        if (Math.abs(lng - lngTarget) > 0.0004)
            lng = lng + (lngTarget - lng) / 3
        if (diference > 0.001) {
            set({
                position: {
                    lat,
                    lng
                }
            })
            setTimeout(() => {
                get().setPositionSmoothly(latTarget, lngTarget)
            }, 100)
        } else {
            get().setPosition(latTarget, lngTarget)
        }
    }

}));