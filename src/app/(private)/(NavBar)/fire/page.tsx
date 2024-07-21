"use client";

import { getPlaces } from "@backend/actions/places";
import { Loader } from "@core/Loader";
import { storeRequest } from "@utils/storeRequest";
import { useEffect, useState } from "react";
import styles from './page.module.scss'
import TinderCard from "react-tinder-card";
import { setgroups } from "process";
import { declineParticipateAction, requestParticipateAction } from "@backend/actions/group";
import { GroupCard } from "@common/GroupCard";
export default function Page() {
    const [groups, setGroups] = useState<
        Awaited<ReturnType<typeof getPlaces>>[0]['groups']
    >()


    useEffect(() => {
        storeRequest(getPlaces, (places) => {
            setGroups(places.flatMap(place => place.groups))
        }, 'getPlaces')
    }, [])
    if (!groups) return <Loader />
    const handleSwipe = (id: string) => (direction: 'left' | 'right') => {
        setGroups(
            groups => groups.filter(group => group.id !== id)
        )
        if (direction === 'right') {
            declineParticipateAction({ id })
        } else {
            requestParticipateAction({ id })
        }
    }
    return <div className={styles.container}>
        <div className={styles.groups}>
            {
                groups
                    .slice(0, 20)
                    .map(
                        (group, i) => (
                            <div
                                key={group.id}
                                className={styles.swipe}
                                style={{ zIndex: i }}
                            >
                                <TinderCard
                                    onSwipe={handleSwipe(group.id)}
                                >
                                    <GroupCard group={group} key={group.id} />
                                </TinderCard>
                            </div>
                        )
                    )
            }
        </div>
    </div>
}