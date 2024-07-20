"use client";
import { getUser } from "@backend/repository/user";
import Header from "./_container/Header/Header";
import Tabs from "./_container/Tabs/Tabs";
import PlaceCard from "./_container/PlaceCard/PlaceCard";
import TablesCards from "./_container/TableCard/TablesCards";
import dayjs from "dayjs";
import styles from './page.module.scss';
import { useEffect, useState } from "react";
import { getPlaces } from "@actions/places";
import { Loader } from "@core/Loader";
import { useRouter } from "next/navigation";
import { ROUTES } from "@constants/ROUTES";
export default function Page() {
    const [user, setUser] = useState<Awaited<ReturnType<typeof getUser>>>()
    const [places, setPlaces] = useState<Awaited<ReturnType<typeof getPlaces>>>()
    useEffect(() => {
        getUser().then(setUser)
        getPlaces().then(setPlaces)
    }, [])
    const route = useRouter()
    if (!user || !places) return <Loader />
    const groupByCategory = places.reduce((acc, place) => {
        place.categories.map(x => {
            if (!acc[x]) acc[x] = []
            acc[x].push(place)
        })
        return acc;
    }, {})
    return <div className={styles.container}>
        <Header
            location="temp"
            locationDetails="temp2"
            title="temp" />
        <Tabs
            tabs={
                Object.keys(groupByCategory).map(category => {
                    return {
                        label: category,
                        content: <div className={styles.carousel}>
                            {groupByCategory[category]
                                .map(place => {
                                    return <PlaceCard
                                        onClick={() => route.push(ROUTES.PLACE(place.id))}
                                        image={place.photos[0].url}
                                        rating={4}
                                        showFavorite={false}
                                        title={place.name}
                                        key={place.id}
                                    />
                                })}</div>
                    }
                })
            }
        />
        <TablesCards
            age={dayjs().diff(dayjs(user.birthday), 'year')}
            avatar={user.photos[0].url}
            description="temp"
            name="temp"
            participants={2}
        />

    </div>
}