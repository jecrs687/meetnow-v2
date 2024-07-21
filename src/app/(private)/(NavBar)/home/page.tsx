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
import { distanceCal } from "@utils/distanceCalc";
import { storeRequest } from "@utils/storeRequest";
import SearchInput from "@common/SearchInput/SearchInput";
import { ShowIf } from "@common/ShowIf";
export default function Page() {
    const [user, setUser] = useState<Awaited<ReturnType<typeof getUser>>>()
    const [places, setPlaces] = useState<Awaited<ReturnType<typeof getPlaces>>>()
    const [search, setSearch] = useState('')
    useEffect(() => {
        storeRequest(getUser, setUser, 'getUser')
        storeRequest(getPlaces, setPlaces, 'getPlaces')
    }, [])
    const route = useRouter()
    if (!user || !places) return <Loader />
    const filteredPlaces = places.filter(place => place.name.toLowerCase().includes(search.toLowerCase()))
    const groupByCategory = filteredPlaces.reduce((acc, place) => {
        place.categories.map(x => {
            if (!acc[x]) acc[x] = []
            acc[x].push(place)
        })
        return acc;
    }, {})
    const popularPlaces = places.sort(
        (a, b) => b._count.groups - a._count.groups
    ).slice(0, 10).filter(place => place.name.toLowerCase().includes(search.toLowerCase()))
    return <div className={styles.container}>
        {/* <Header
            location="temp"
            locationDetails="temp2"
            title="temp" /> */}
        <div className={styles.search}>
            <SearchInput
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                placeholder="Pesquisar locais"
            />
        </div>

        <Tabs
            tabs={
                Object.keys(groupByCategory).map(category => {
                    return {
                        label: category,
                        content: <>
                            <div className={styles.carousel}>
                                {groupByCategory[category]
                                    .map(place => {
                                        return <PlaceCard
                                            onClick={() => route.push(ROUTES.PLACE(place.id))}
                                            image={place.photos[0].url}
                                            rating={4}
                                            showFavorite={false}
                                            title={place.name}
                                            key={place.id}
                                            groups={place._count.groups}
                                            distance={distanceCal(user.address, place.address).toFixed(0)}
                                        />
                                    })}</div>

                        </>
                    }
                })
            }
        />
        <ShowIf condition={!!popularPlaces.length}>
            <div className={styles.hots}>
                <h2 className={styles.title}>
                    Populares
                </h2>
                <div className={styles.carousel}>
                    {popularPlaces.map(place => {
                        return <PlaceCard
                            onClick={() => route.push(ROUTES.PLACE(place.id))}
                            image={place.photos[0].url}
                            rating={4}
                            showFavorite={false}
                            title={place.name}
                            key={place.id}
                            groups={place._count.groups}
                            distance={distanceCal(user.address, place.address).toFixed(0)}
                        />
                    })}
                </div>
            </div>
        </ShowIf>
        {/* <TablesCards
            age={dayjs().diff(dayjs(user.birthday), 'year')}
            avatar={user.photos[0].url}
            description="temp"
            name="temp"
            participants={2}
        /> */}

    </div>
}